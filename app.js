// --- Constants & Data ---
const API_URL = 'https://script.google.com/macros/s/AKfycbw0C3pwPgUVb48LNsmL6-5JA4qjevccrDoqHQZ-NEI9v0V__AZHQMMFWrBmQtALzWpL/exec';

const EXERCISES_POOL = [
    { name: "Jumping Jacks", cals: 0.3, baseReps: 40, unit: "Reps" },
    { name: "Mountain Climbers", cals: 0.4, baseReps: 30, unit: "Reps" },
    { name: "Burpees", cals: 1.1, baseReps: 10, unit: "Reps" },
    { name: "High Knees", cals: 0.2, baseReps: 50, unit: "Reps" },
    { name: "Squat Jumps", cals: 0.8, baseReps: 15, unit: "Reps" },
    { name: "Push Ups", cals: 0.5, baseReps: 15, unit: "Reps" },
    { name: "Plank Jacks", cals: 0.4, baseReps: 25, unit: "Reps" },
    { name: "Skater Hops", cals: 0.5, baseReps: 30, unit: "Reps" }
];

const HEALTH_MESSAGES = {
    DEFICIT: "You are in weight-loss deficit today ✅",
    SURPLUS: "Try to stay within your calorie limit ⚠️",
    STREAK: "Great job staying consistent! 🔥",
    BURN: "Goal nearly reached. One more exercise? ⚡",
    WELCOME: "Consistency is the key to fat loss 🧠"
};

// --- Storage Service ---
const Storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load(key, defaultValue) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    },
    getTodayKey() {
        return new Date().toISOString().split('T')[0];
    }
};

// --- Application State ---
let state = {
    user: Storage.load('fls_user', {
        weight: 77.0,
        targetWeight: 74.0,
        height: 171,
        age: 27,
        calorieLimit: 1600,
        burnGoal: 300
    }),
    daily: Storage.load(`fls_logs_${Storage.getTodayKey()}`, {
        meals: [],
        weight: null,
        workout: {
            exercises: [],
            rounds: 1,
            completed: [] // indices of completed exercises
        }
    }),
    history: Storage.load('fls_history', []), // Array of {date, weight}
    streak: Storage.load('fls_streak', { count: 0, lastDate: null }),
    activeTab: 'dashboard'
};

let weightChart = null;

// --- App Logic ---
function init() {
    setupNavigation();
    setupEventListeners();
    updateDateDisplay();
    
    // Seed today's workout if empty
    if (state.daily.workout.exercises.length === 0) {
        generateWorkout();
    }
    
    checkStreak();
    render();
    
    // Cloud Refresh (Async)
    loadAllCloudData();
}

function generateWorkout() {
    const seed = new Date().getDate(); // Random but same for the day
    const shuffled = [...EXERCISES_POOL].sort(() => 0.5 - Math.random());
    state.daily.workout.exercises = shuffled.slice(0, 6).map(ex => ({
        ...ex,
        reps: Math.round(ex.baseReps * (1 + (state.user.weight - 70) / 100)) // Scale reps slightly by weight
    }));
    state.daily.workout.rounds = Math.random() > 0.5 ? 2 : 1;
    saveDaily();
}

function checkStreak() {
    const today = Storage.getTodayKey();
    const last = state.streak.lastDate;

    if (last === today) return; // Already checked today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split('T')[0];

    if (last === yesterdayKey) {
        // Streak continues (actual increment happens on workout completion if we want strict, 
        // but here we mark 'app usage' as requested)
    } else if (last !== null) {
        // Streak broken
        state.streak.count = 0;
    }
    
    state.streak.lastDate = today;
    Storage.save('fls_streak', state.streak);
}

function setupNavigation() {
    const tabs = ['dashboard', 'intake', 'progress'];
    tabs.forEach(tab => {
        document.getElementById(`nav-${tab}`).addEventListener('click', () => {
            tabs.forEach(t => {
                document.getElementById(`view-${t}`).classList.add('hidden');
                document.getElementById(`nav-${t}`).classList.remove('active');
            });
            document.getElementById(`view-${tab}`).classList.remove('hidden');
            document.getElementById(`nav-${tab}`).classList.add('active');
            state.activeTab = tab;
            if (tab === 'progress') renderChart();
        });
    });
}

function setupEventListeners() {
    document.getElementById('add-meal-btn').addEventListener('click', addMeal);
    document.getElementById('save-weight-btn').addEventListener('click', logWeight);
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
}

function addMeal() {
    const name = document.getElementById('food-name').value;
    const cals = parseInt(document.getElementById('food-cals').value);
    
    if (name && cals) {
        const id = Date.now().toString(); // Consistent ID for sync/delete
        state.daily.meals.push({ name, cals, id: id });
        document.getElementById('food-name').value = '';
        document.getElementById('food-cals').value = '';
        saveDaily();
        render();
        // Cloud Sync
        syncToCloud('food', { food: name, calories: cals, id: id });
    }
}

function deleteMeal(id) {
    const idStr = id.toString();
    state.daily.meals = state.daily.meals.filter(m => m.id.toString() !== idStr);
    saveDaily();
    render();
    syncDeleteToCloud('food', idStr);
}

function editMeal(id) {
    const idStr = id.toString();
    const meal = state.daily.meals.find(m => m.id.toString() === idStr);
    if (meal) {
        document.getElementById('food-name').value = meal.name;
        document.getElementById('food-cals').value = meal.cals;
        deleteMeal(idStr); // Remove old entry
    }
}

function toggleExercise(index) {
    const i = state.daily.workout.completed.indexOf(index);
    if (i > -1) {
        state.daily.workout.completed.splice(i, 1);
    } else {
        state.daily.workout.completed.push(index);
        // On first completion of the day, ensure streak is active
        if (state.daily.workout.completed.length === 1 && state.streak.count === 0) {
            state.streak.count = 1;
        } else if (state.daily.workout.completed.length === state.daily.workout.exercises.length) {
            // Completed full workout
            const lastData = Storage.load('fls_streak', {});
            if (lastData.lastDate !== Storage.getTodayKey()) {
                state.streak.count++;
            }
        }
        Storage.save('fls_streak', state.streak);
    }
    saveDaily();
    render();

    // Cloud Sync if marking complete
    const ex = state.daily.workout.exercises[index];
    if (state.daily.workout.completed.includes(index)) {
        syncToCloud('workout', { 
            exercise: ex.name, 
            calories: Math.round(ex.cals * ex.reps * state.daily.workout.rounds),
            completed: 'TRUE' 
        });
    }
}

function logWeight() {
    const val = parseFloat(document.getElementById('weight-input').value);
    if (val) {
        state.daily.weight = val;
        state.user.weight = val; // Update current weight in profile too
        
        const today = Storage.getTodayKey();
        const existingIdx = state.history.findIndex(h => h.date === today);
        if (existingIdx > -1) {
            state.history[existingIdx].weight = val;
        } else {
            state.history.push({ date: today, weight: val });
        }
        
        Storage.save('fls_user', state.user);
        Storage.save('fls_history', state.history);
        saveDaily();
        render();
        renderChart();
        // Cloud Sync
        syncToCloud('weight', { weight: val });
    }
}

function saveSettings() {
    state.user.weight = parseFloat(document.getElementById('set-target-weight').value); // Using target weight input
    state.user.calorieLimit = parseInt(document.getElementById('set-calorie-limit').value);
    state.user.height = parseInt(document.getElementById('set-height').value);
    state.user.age = parseInt(document.getElementById('set-age').value);
    Storage.save('fls_user', state.user);
    render();
    alert('Profile Updated');
}

function saveDaily() {
    Storage.save(`fls_logs_${Storage.getTodayKey()}`, state.daily);
}

// --- Cloud Sync Service ---
async function syncToCloud(type, data) {
    try {
        const payload = {
            type: type,
            date: Storage.getTodayKey(),
            ...data
        };

        const statusEl = document.getElementById('cloud-status');
        if (statusEl) statusEl.classList.add('syncing');

        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        console.log(`Cloud Sync: ${type} data updated.`);
        
        if (statusEl) {
            setTimeout(() => statusEl.classList.remove('syncing'), 1000);
        }
    } catch (e) {
        console.error('Cloud Sync Failed:', e);
    }
}

async function syncDeleteToCloud(subType, id) {
    try {
        const statusEl = document.getElementById('cloud-status');
        if (statusEl) statusEl.classList.add('syncing');

        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'delete', subType, id })
        });

        if (statusEl) {
            setTimeout(() => statusEl.classList.remove('syncing'), 1000);
        }
    } catch (e) {
        console.error('Cloud Delete Failed:', e);
    }
}

async function fetchFromCloud(type) {
    try {
        const statusEl = document.getElementById('cloud-status');
        if (statusEl) statusEl.classList.add('syncing');

        const response = await fetch(`${API_URL}?type=${type}`);
        const result = await response.json();
        
        if (statusEl) statusEl.classList.remove('syncing');
        
        if (result.status === 'success') {
            return result.data;
        }
        return [];
    } catch (e) {
        console.error(`Fetch error (${type}):`, e);
        return [];
    }
}

async function loadAllCloudData() {
    const today = Storage.getTodayKey();
    
    // Fetch in parallel
    const [workouts, food, weights] = await Promise.all([
        fetchFromCloud('workout'),
        fetchFromCloud('food'),
        fetchFromCloud('weight')
    ]);

    let changed = false;

    // 1. Sync Food for today
    const cloudTodayMeals = food.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate === today;
    }).map(m => ({
        name: m.food,
        cals: m.calories,
        id: m.id ? m.id.toString() : (Date.now() + Math.random()).toString()
    }));
    
    if (cloudTodayMeals.length > 0) {
        state.daily.meals = cloudTodayMeals;
        changed = true;
    }

    // 2. Sync Weight History
    if (weights.length > 0) {
        state.history = weights.map(w => ({
            date: new Date(w.date).toISOString().split('T')[0],
            weight: parseFloat(w.weight)
        }));
        // Update current weight profile if latest cloud weight exists
        state.user.weight = state.history[state.history.length - 1].weight;
        changed = true;
    }

    // 3. Sync Workout Completion for today
    const cloudTodayWorkouts = workouts.filter(item => {
        const itemDate = new Date(item.date).toISOString().split('T')[0];
        return itemDate === today && item.completed === 'TRUE';
    });

    if (cloudTodayWorkouts.length > 0) {
        cloudTodayWorkouts.forEach(cw => {
            const idx = state.daily.workout.exercises.findIndex(ex => ex.name === cw.exercise);
            if (idx > -1 && !state.daily.workout.completed.includes(idx)) {
                state.daily.workout.completed.push(idx);
                changed = true;
            }
        });
    }

    if (changed) {
        saveDaily();
        Storage.save('fls_user', state.user);
        Storage.save('fls_history', state.history);
        render();
        if (state.activeTab === 'progress') renderChart();
        console.log("Cloud Synchronization Complete: Application State Updated.");
    }
}

// --- Rendering ---
function render() {
    const todayBurn = calculateBurn();
    const todayIntake = state.daily.meals.reduce((sum, m) => sum + m.cals, 0);

    // Dashboard
    document.getElementById('burned-calories').textContent = Math.round(todayBurn);
    document.getElementById('target-burn').textContent = state.user.burnGoal;
    const burnPct = Math.min(100, (todayBurn / state.user.burnGoal) * 100);
    document.getElementById('burn-progress').style.width = `${burnPct}%`;
    document.getElementById('burn-remaining').textContent = todayBurn >= state.user.burnGoal ? "Goal Reached! 🔥" : `${Math.round(state.user.burnGoal - todayBurn)} kcal remaining`;
    
    // Insight Logic
    let insight = HEALTH_MESSAGES.WELCOME;
    if (todayIntake > state.user.calorieLimit) insight = HEALTH_MESSAGES.SURPLUS;
    else if (todayIntake < state.user.calorieLimit && todayIntake > 0) insight = HEALTH_MESSAGES.DEFICIT;
    else if (state.streak.count > 2) insight = HEALTH_MESSAGES.STREAK;
    document.getElementById('daily-insight').textContent = insight;

    // Workout List
    const workoutList = document.getElementById('workout-list');
    workoutList.innerHTML = '';
    state.daily.workout.exercises.forEach((ex, idx) => {
        const isDone = state.daily.workout.completed.includes(idx);
        const row = document.createElement('div');
        row.className = 'item-row';
        row.innerHTML = `
            <div class="item-info">
                <span class="item-name">${ex.name}</span>
                <span class="item-meta">${ex.reps} ${ex.unit} • ${Math.round(ex.cals * ex.reps * state.daily.workout.rounds)} kcal</span>
            </div>
            <div class="check-circle ${isDone ? 'checked' : ''}" onclick="toggleExercise(${idx})"></div>
        `;
        workoutList.appendChild(row);
    });
    document.getElementById('workout-rounds').textContent = `${state.daily.workout.rounds} ROUND${state.daily.workout.rounds > 1 ? 'S' : ''} ONLY`;

    // Intake View
    document.getElementById('intake-status').textContent = `${todayIntake} / ${state.user.calorieLimit} kcal`;
    const intakePct = (todayIntake / state.user.calorieLimit) * 100;
    const iFill = document.getElementById('intake-progress');
    iFill.style.width = `${Math.min(100, intakePct)}%`;
    iFill.className = 'progress-fill';
    if (intakePct > 100) iFill.classList.add('danger');
    else if (intakePct > 80) iFill.classList.add('warning');
    else iFill.classList.add('success');

    const mealList = document.getElementById('intake-list');
    mealList.innerHTML = '';
    state.daily.meals.forEach(meal => {
        const mRow = document.createElement('div');
        mRow.className = 'item-row';
        mRow.innerHTML = `
            <div class="item-info">
                <span class="item-name">${meal.name}</span>
                <span class="item-meta">${meal.cals} kcal</span>
            </div>
            <div style="display: flex; gap: 15px;">
                <span class="action-icon edit-icon" data-id="${meal.id}">✏️</span>
                <span class="action-icon delete-icon" data-id="${meal.id}">🗑️</span>
            </div>
        `;
        mealList.appendChild(mRow);
    });

    // Attach listeners to icons
    document.querySelectorAll('.edit-icon').forEach(el => {
        el.onclick = () => editMeal(el.dataset.id);
    });
    document.querySelectorAll('.delete-icon').forEach(el => {
        el.onclick = () => deleteMeal(el.dataset.id);
    });

    // Progress View
    const last7 = state.history.slice(-7);
    if (last7.length > 1) {
        const diff = (last7[last7.length - 1].weight - last7[0].weight).toFixed(1);
        const status = diff <= 0 ? 'lost' : 'gained';
        document.getElementById('weight-trend-text').innerHTML = `You ${status} <b>${Math.abs(diff)} kg</b> this week.`;
    }

    // Streak
    document.getElementById('streak-count').textContent = state.streak.count;
}

function calculateBurn() {
    return state.daily.workout.completed.reduce((acc, idx) => {
        const ex = state.daily.workout.exercises[idx];
        return acc + (ex.cals * ex.reps * state.daily.workout.rounds);
    }, 0);
}

function updateDateDisplay() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options).toUpperCase();
}

function renderChart() {
    const canvas = document.getElementById('weightChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const last7 = state.history.slice(-7);
    
    if (weightChart) weightChart.destroy();
    
    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7.map(h => h.date.split('-').slice(1).join('/')),
            datasets: [{
                label: 'Weight',
                data: last7.map(h => h.weight),
                borderColor: '#0A84FF',
                backgroundColor: 'rgba(10, 132, 255, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#0A84FF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { display: false }, ticks: { color: '#8E8E93', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#8E8E93', font: { size: 10 } } }
            }
        }
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', init);
