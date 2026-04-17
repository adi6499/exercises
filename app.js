// --- Data & Constants ---
const EXERCISES_POOL = [
    { name: "Jumping Jacks", cals: 0.5, reps: 30 },
    { name: "Push Ups", cals: 1.2, reps: 15 },
    { name: "Squats", cals: 0.8, reps: 20 },
    { name: "Lunges", cals: 0.7, reps: 20 },
    { name: "Burpees", cals: 2.0, reps: 10 },
    { name: "Plank", cals: 0.2, reps: 45, isTimed: true },
    { name: "Mountain Climbers", cals: 0.9, reps: 30 },
    { name: "High Knees", cals: 1.0, reps: 40 },
    { name: "Crunches", cals: 0.4, reps: 25 },
    { name: "Glute Bridges", cals: 0.6, reps: 20 },
    { name: "Jump Squats", cals: 1.5, reps: 15 },
    { name: "Plank Jacks", cals: 0.8, reps: 25 },
    { name: "Bicycle Crunches", cals: 0.5, reps: 30 },
    { name: "Russian Twists", cals: 0.4, reps: 40 },
    { name: "Diamond Push-ups", cals: 1.5, reps: 10 },
    { name: "Side Lunges", cals: 0.7, reps: 20 },
    { name: "Box Jumps", cals: 1.8, reps: 15 },
    { name: "Commando Planks", cals: 1.2, reps: 12 },
    { name: "Star Jumps", cals: 1.6, reps: 15 },
    { name: "Tuck Jumps", cals: 2.5, reps: 10 },
    { name: "Shadow Boxing", cals: 0.3, reps: 50 },
    { name: "Walking Lunges", cals: 0.8, reps: 20 },
    { name: "Heel Touches", cals: 0.3, reps: 40 },
    { name: "Superman", cals: 0.4, reps: 15 },
    { name: "Burpee Tuck Jumps", cals: 3.5, reps: 5 }
];

// --- State Management ---
let state = {
    todayWorkout: [],
    completedExercises: [],
    workoutHistory: JSON.parse(localStorage.getItem('workoutHistory') || '[]'),
    weightLogs: JSON.parse(localStorage.getItem('weightLogs') || '[]'),
    intensityMode: localStorage.getItem('intensityMode') || 'standard',
    goalWeight: parseFloat(localStorage.getItem('goalWeight')) || 72,
    goalDate: localStorage.getItem('goalDate') || new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    isWorkoutActive: false,
    currentExerciseIndex: 0,
    totalCaloriesBurned: 0,
    streak: 0,
    workoutInterval: null
};

// --- Core Logic ---
function init() {
    generateDailyWorkout();
    updateDateDisplay();
    calculateStreak();
    renderHome();
    setupEventListeners();
    
    // Set initial values for goal inputs
    document.getElementById('target-weight-input').value = state.goalWeight;
    document.getElementById('target-date-input').value = new Date(state.goalDate).toISOString().split('T')[0];
    
    // Set initial intensity toggle state
    document.getElementById('toggle-standard').classList.toggle('active', state.intensityMode === 'standard');
    document.getElementById('toggle-intense').classList.toggle('active', state.intensityMode === 'intense');
}

function generateDailyWorkout() {
    const dateKey = new Date().toDateString();
    let seed = 0;
    for (let i = 0; i < dateKey.length; i++) seed += dateKey.charCodeAt(i);
    
    // Sort pool consistently based on date seed
    const shuffled = [...EXERCISES_POOL].sort((a, b) => {
        // Use strings for more stable sorting with simple seed
        const valA = (a.name.length * seed) % 100;
        const valB = (b.name.length * seed) % 100;
        return valA - valB;
    });

    const exerciseCount = state.intensityMode === 'intense' ? 12 : 6;
    state.todayWorkout = shuffled.slice(0, exerciseCount);
    
    const completedToday = state.workoutHistory.find(w => w.date === dateKey);
    state.completedExercises = completedToday ? completedToday.exercises : [];
    updateCals();
    updateGoalUI();
}

function updateGoalUI() {
    const currentWeight = state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].weight : 77;
    const toGo = (currentWeight - state.goalWeight).toFixed(1);
    const goalEl = document.getElementById('weight-to-go');
    if (goalEl) goalEl.textContent = toGo > 0 ? `${toGo} kg to goal` : 'Goal reached! 🏆';

    const daysLeft = Math.ceil((new Date(state.goalDate) - new Date()) / (1000 * 60 * 60 * 24));
    const daysEl = document.getElementById('days-remaining');
    if (daysEl) daysEl.textContent = daysLeft > 0 ? `${daysLeft} days left` : 'Target date passed';
}

function updateCals() {
    state.totalCaloriesBurned = state.completedExercises.reduce((acc, idx) => {
        const ex = state.todayWorkout[idx];
        return acc + (ex ? (ex.cals * ex.reps) : 0);
    }, 0);
}

function calculateStreak() {
    const history = state.workoutHistory.map(w => w.date);
    let currentStreak = 0;
    let checkDate = new Date();
    
    while (true) {
        const dateStr = checkDate.toDateString();
        if (history.includes(dateStr)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            // If it's today and not yet completed, but yesterday was, keep streak
            if (dateStr === new Date().toDateString()) {
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            }
            break;
        }
    }
    state.streak = currentStreak;
    document.getElementById('streak-count').textContent = state.streak;
}

// --- UI Rendering ---
function updateDateDisplay() {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options).toUpperCase();
}

function renderHome() {
    const list = document.getElementById('exercise-list');
    list.innerHTML = '';
    
    state.todayWorkout.forEach((ex, index) => {
        const isDone = state.completedExercises.includes(index);
        const item = document.createElement('div');
        item.className = 'exercise-item';
        item.innerHTML = `
            <div class="exercise-info">
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-meta">${ex.reps} ${ex.isTimed ? 'Seconds' : 'Reps'} • ~${Math.round(ex.cals * ex.reps)} kcal</div>
            </div>
            <button class="check-btn ${isDone ? 'completed' : ''}" onclick="toggleExercise(${index})">
                ${isDone ? '✓' : ''}
            </button>
        `;
        list.appendChild(item);
    });

    updateProgressUI();
}

function updateProgressUI() {
    const progress = (state.completedExercises.length / state.todayWorkout.length) * 100;
    document.getElementById('workout-progress').style.width = `${progress}%`;
    document.getElementById('workout-summary-text').textContent = `${state.completedExercises.length} of ${state.todayWorkout.length} exercises completed`;
    document.getElementById('total-cals').textContent = Math.round(state.totalCaloriesBurned);
}

function toggleExercise(index) {
    if (state.completedExercises.includes(index)) {
        state.completedExercises = state.completedExercises.filter(i => i !== index);
    } else {
        state.completedExercises.push(index);
        speak(`${state.todayWorkout[index].name} completed.`);
    }
    updateCals();
    saveProgress();
    renderHome();
}

// --- Guided Workout Controls ---
function startWorkout() {
    if (state.completedExercises.length === state.todayWorkout.length) {
        alert("Workout already completed for today!");
        return;
    }
    state.isWorkoutActive = true;
    state.currentExerciseIndex = 0;
    // Skip already completed ones
    while (state.completedExercises.includes(state.currentExerciseIndex)) {
        state.currentExerciseIndex++;
    }
    showExercise();
    document.getElementById('workout-overlay').style.display = 'flex';
}

function showExercise() {
    const ex = state.todayWorkout[state.currentExerciseIndex];
    if (!ex) {
        finishWorkout();
        return;
    }

    document.getElementById('overlay-step').textContent = `EXERCISE ${state.currentExerciseIndex + 1} OF ${state.todayWorkout.length}`;
    document.getElementById('overlay-title').textContent = ex.name;
    document.getElementById('overlay-count').textContent = ex.isTimed ? `Stay focused!` : `Target: ${ex.reps} Reps`;
    
    // Disable prev if first
    document.getElementById('prev-btn').disabled = state.currentExerciseIndex === 0;

    speak(`Next: ${ex.name}. ${ex.reps} ${ex.isTimed ? 'seconds' : 'reps'}`);

    let timeLeft = ex.isTimed ? ex.reps : 15;
    startTimer(timeLeft);
}

function startTimer(seconds) {
    if (state.workoutInterval) clearInterval(state.workoutInterval);
    
    const timerEl = document.getElementById('overlay-timer');
    let timeLeft = seconds;
    timerEl.textContent = `00:${timeLeft.toString().padStart(2, '0')}`;

    state.workoutInterval = setInterval(() => {
        if (!state.isWorkoutActive) {
            clearInterval(state.workoutInterval);
            return;
        }
        timeLeft--;
        timerEl.textContent = `00:${Math.max(0, timeLeft).toString().padStart(2, '0')}`;
        
        if (timeLeft <= 3 && timeLeft > 0) speak(timeLeft.toString());

        if (timeLeft <= 0) {
            clearInterval(state.workoutInterval);
            speak("Time up!");
        }
    }, 1000);
}

function nextExercise() {
    if (!state.completedExercises.includes(state.currentExerciseIndex)) {
        state.completedExercises.push(state.currentExerciseIndex);
        updateCals();
        saveProgress();
    }

    state.currentExerciseIndex++;
    if (state.currentExerciseIndex >= state.todayWorkout.length) {
        finishWorkout();
    } else {
        showExercise();
    }
}

function prevExercise() {
    if (state.currentExerciseIndex > 0) {
        state.currentExerciseIndex--;
        showExercise();
    }
}

function saveProgress() {
    const dateKey = new Date().toDateString();
    const existingIdx = state.workoutHistory.findIndex(w => w.date === dateKey);
    if (existingIdx >= 0) {
        state.workoutHistory[existingIdx].exercises = [...state.completedExercises];
    } else {
        state.workoutHistory.push({ date: dateKey, exercises: [...state.completedExercises] });
    }
    localStorage.setItem('workoutHistory', JSON.stringify(state.workoutHistory));
    renderHome();
}

function finishWorkout() {
    state.isWorkoutActive = false;
    document.getElementById('workout-overlay').style.display = 'none';
    speak("Workout complete! Great job today.");
    calculateStreak();
    renderHome();
}

function speak(text) {
    if (window.speechSynthesis) {
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.1;
        window.speechSynthesis.speak(msg);
    }
}

// --- Weight Tracker Logic ---
let weightChart = null;
function renderWeightChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    const data = state.weightLogs.slice(-7);
    
    if (weightChart) weightChart.destroy();

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(l => new Date(l.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
            datasets: [{
                label: 'Weight (kg)',
                data: data.map(l => l.weight),
                borderColor: '#30D158',
                backgroundColor: 'rgba(48, 209, 88, 0.2)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 4,
                pointBackgroundColor: '#30D158'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8E8E93' } },
                x: { grid: { display: false }, ticks: { color: '#8E8E93' } }
            }
        }
    });

    renderWeightHistory();
}

function renderWeightHistory() {
    const list = document.getElementById('weight-history-list');
    list.innerHTML = state.weightLogs.slice().reverse().map(log => `
        <div class="exercise-item">
            <div class="exercise-info">
                <div class="exercise-name">${log.weight} kg</div>
                <div class="exercise-meta">${new Date(log.date).toLocaleDateString()}</div>
            </div>
        </div>
    `).join('');
}

function saveWeight() {
    const val = document.getElementById('weight-input').value;
    if (!val) return;
    
    const weight = parseFloat(val);
    state.weightLogs.push({ date: new Date().toISOString(), weight: weight });
    localStorage.setItem('weightLogs', JSON.stringify(state.weightLogs));
    document.getElementById('weight-input').value = '';
    
    updateGoalUI();
    renderWeightChart();
}

function saveGoal() {
    const weight = document.getElementById('target-weight-input').value;
    const date = document.getElementById('target-date-input').value;
    
    if (weight) {
        state.goalWeight = parseFloat(weight);
        localStorage.setItem('goalWeight', state.goalWeight);
    }
    if (date) {
        state.goalDate = new Date(date).toISOString();
        localStorage.setItem('goalDate', state.goalDate);
    }
    
    updateGoalUI();
    alert("Goal updated!");
}

function toggleIntensity(mode) {
    state.intensityMode = mode;
    localStorage.setItem('intensityMode', mode);
    
    document.getElementById('toggle-standard').classList.toggle('active', mode === 'standard');
    document.getElementById('toggle-intense').classList.toggle('active', mode === 'intense');
    
    generateDailyWorkout();
    renderHome();
}

// --- Event Listeners ---
function setupEventListeners() {
    document.getElementById('start-workout-btn').addEventListener('click', startWorkout);
    document.getElementById('stop-workout-btn').addEventListener('click', () => {
        state.isWorkoutActive = false;
        if (state.workoutInterval) clearInterval(state.workoutInterval);
        document.getElementById('workout-overlay').style.display = 'none';
    });

    document.getElementById('next-btn').addEventListener('click', nextExercise);
    document.getElementById('prev-btn').addEventListener('click', prevExercise);

    document.getElementById('save-weight-btn').addEventListener('click', saveWeight);
    document.getElementById('save-goal-btn').addEventListener('click', saveGoal);

    document.getElementById('toggle-standard').addEventListener('click', () => toggleIntensity('standard'));
    document.getElementById('toggle-intense').addEventListener('click', () => toggleIntensity('intense'));

    document.getElementById('nav-home').addEventListener('click', () => {
        document.getElementById('home-view').classList.remove('hidden');
        document.getElementById('weight-view').classList.add('hidden');
        document.getElementById('nav-home').classList.add('active');
        document.getElementById('nav-weight').classList.remove('active');
    });

    document.getElementById('nav-weight').addEventListener('click', () => {
        document.getElementById('home-view').classList.add('hidden');
        document.getElementById('weight-view').classList.remove('hidden');
        document.getElementById('nav-home').classList.remove('active');
        document.getElementById('nav-weight').classList.add('active');
        setTimeout(renderWeightChart, 100);
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', init);
