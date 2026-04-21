// --- Data & Constants ---
const EXERCISES_POOL = [
    { name: "Jumping Jacks", cals: 0.3, reps: 40, difficulty: 'med', target: 'full' },
    { name: "Push Ups", cals: 0.5, reps: 15, difficulty: 'med', target: 'up' },
    { name: "Squats", cals: 0.4, reps: 20, difficulty: 'med', target: 'low' },
    { name: "Lunges", cals: 0.4, reps: 20, difficulty: 'med', target: 'low' },
    { name: "Burpees", cals: 1.0, reps: 10, difficulty: 'high', target: 'full' },
    { name: "Plank", cals: 0.1, reps: 45, isTimed: true, difficulty: 'med', target: 'core' },
    { name: "Mountain Climbers", cals: 0.3, reps: 30, difficulty: 'high', target: 'full' },
    { name: "High Knees", cals: 0.2, reps: 50, difficulty: 'high', target: 'full' },
    { name: "Crunches", cals: 0.2, reps: 25, difficulty: 'med', target: 'core' },
    { name: "Glute Bridges", cals: 0.3, reps: 20, difficulty: 'low', target: 'low' },
    { name: "Jump Squats", cals: 0.8, reps: 15, difficulty: 'high', target: 'low' },
    { name: "Plank Jacks", cals: 0.4, reps: 25, difficulty: 'high', target: 'core' },
    { name: "Bicycle Crunches", cals: 0.2, reps: 30, difficulty: 'med', target: 'core' },
    { name: "Russian Twists", cals: 0.2, reps: 40, difficulty: 'med', target: 'core' },
    { name: "Diamond Push-ups", cals: 0.7, reps: 10, difficulty: 'high', target: 'up' },
    { name: "Side Lunges", cals: 0.4, reps: 20, difficulty: 'med', target: 'low' },
    { name: "Skater Hops", cals: 0.5, reps: 30, difficulty: 'high', target: 'full' },
    { name: "Commando Planks", cals: 0.6, reps: 12, difficulty: 'high', target: 'core' },
    { name: "Star Jumps", cals: 0.8, reps: 15, difficulty: 'high', target: 'full' },
    { name: "Tuck Jumps", cals: 1.2, reps: 10, difficulty: 'high', target: 'full' },
    { name: "Shadow Boxing", cals: 0.2, reps: 50, difficulty: 'med', target: 'up' },
    { name: "Walking Lunges", cals: 0.4, reps: 20, difficulty: 'med', target: 'low' },
    { name: "Heel Touches", cals: 0.2, reps: 40, difficulty: 'low', target: 'core' },
    { name: "Superman", cals: 0.2, reps: 15, difficulty: 'low', target: 'core' },
    { name: "Burpee Tuck Jumps", cals: 1.5, reps: 5, difficulty: 'high', target: 'full' },
    // New Low-Impact/Recovery Exercises
    { name: "Neck Rolls", cals: 0.05, reps: 30, isTimed: true, difficulty: 'low', target: 'up' },
    { name: "Shoulder Shrugs", cals: 0.05, reps: 20, difficulty: 'low', target: 'up' },
    { name: "Arm Circles", cals: 0.05, reps: 30, isTimed: true, difficulty: 'low', target: 'up' },
    { name: "Walking in Place", cals: 0.1, reps: 60, isTimed: true, difficulty: 'low', target: 'full' },
    { name: "Wall Push-ups", cals: 0.2, reps: 15, difficulty: 'low', target: 'up' },
    { name: "Knee Push-ups", cals: 0.3, reps: 12, difficulty: 'low', target: 'up' },
    { name: "Cat-Cow Stretch", cals: 0.05, reps: 45, isTimed: true, difficulty: 'low', target: 'core' },
    { name: "Child's Pose", cals: 0.02, reps: 60, isTimed: true, difficulty: 'low', target: 'core' },
    { name: "Bird Dog", cals: 0.2, reps: 16, difficulty: 'low', target: 'core' },
    { name: "Seated Leg Extensions", cals: 0.1, reps: 20, difficulty: 'low', target: 'low' },
    { name: "Calf Raises", cals: 0.2, reps: 20, difficulty: 'low', target: 'low' },
    { name: "Side Stretches", cals: 0.05, reps: 40, isTimed: true, difficulty: 'low', target: 'core' },
    { name: "Wrist Rotations", cals: 0.02, reps: 30, isTimed: true, difficulty: 'low', target: 'up' },
    { name: "Ankle Circles", cals: 0.02, reps: 30, isTimed: true, difficulty: 'low', target: 'low' },
    { name: "Standing Quad Stretch", cals: 0.05, reps: 40, isTimed: true, difficulty: 'low', target: 'low' }
];

const WEEKLY_TARGETS = {
    0: { label: 'Recovery & Mobility', target: 'full' }, // Sunday
    1: { label: 'Full Body Cardio', target: 'full' },   // Monday
    2: { label: 'Upper Body Focus', target: 'up' },     // Tuesday
    3: { label: 'Lower Body Focus', target: 'low' },    // Wednesday
    4: { label: 'Core & Stability', target: 'core' },   // Thursday
    5: { label: 'Full Body Burn', target: 'full' },     // Friday
    6: { label: 'Strength Focus', target: 'full' }      // Saturday
};

const HEALTH_TIPS = [
    "Rest is just as important as the workout. It's when your muscles grow!",
    "Listen to your body. Sharp pain means stop; muscle burn means keep going.",
    "Stay hydrated! Water helps reduce muscle soreness after exercise.",
    "Gentle stretching can help increase blood flow and speed up recovery.",
    "Consistency beats intensity. It's better to do a little every day than too much once a week.",
    "Don't skip the warm-up, even for light recovery sessions."
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
    dailyTargetBurn: 0,
    totalRounds: 1,
    currentRound: 1,
    isWorkoutActive: false,
    currentExerciseIndex: 0,
    totalCaloriesBurned: 0,
    streak: 0,
    workoutInterval: null,
    voiceEnabled: localStorage.getItem('voiceEnabled') !== 'false',
    isResting: false
};

const REST_DURATION = 15;

// --- Core Logic ---
function init() {
    calculateTargetBurn();
    generateDailyWorkout();
    updateDateDisplay();
    calculateStreak();
    renderHome();
    setupEventListeners();
    
    // Set initial values for goal inputs
    const targetWeightInput = document.getElementById('target-weight-input');
    const targetDateInput = document.getElementById('target-date-input');
    if (targetWeightInput) targetWeightInput.value = state.goalWeight;
    if (targetDateInput) targetDateInput.value = new Date(state.goalDate).toISOString().split('T')[0];
    
    // Set initial intensity toggle state
    updateToggleButtons();
    updateVoiceUI();
}

function calculateTargetBurn() {
    if (state.intensityMode === 'fatburn_500') {
        state.dailyTargetBurn = 500;
        return;
    }

    const currentWeight = state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].weight : 77;
    const kgToGo = currentWeight - state.goalWeight;
    if (kgToGo <= 0) {
        state.dailyTargetBurn = 200; // Maintenance target
        return;
    }

    const daysLeft = Math.ceil((new Date(state.goalDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 0) {
        state.dailyTargetBurn = 500;
        return;
    }

    // 1kg fat ≈ 7700 kcal. Let's assume 40% of deficit comes from exercise.
    const totalCalorieDeficitNeeded = kgToGo * 7700;
    const exerciseDeficitNeeded = totalCalorieDeficitNeeded * 0.4;
    state.dailyTargetBurn = Math.max(150, Math.min(800, Math.round(exerciseDeficitNeeded / daysLeft)));
}

function updateToggleButtons() {
    const btnRecovery = document.getElementById('toggle-recovery');
    const btnStandard = document.getElementById('toggle-standard');
    const btnIntense = document.getElementById('toggle-intense');
    const btnFatBurn500 = document.getElementById('toggle-fatburn-500');

    if (btnRecovery) btnRecovery.classList.toggle('active', state.intensityMode === 'recovery');
    if (btnStandard) btnStandard.classList.toggle('active', state.intensityMode === 'standard');
    if (btnIntense) btnIntense.classList.toggle('active', state.intensityMode === 'intense');
    if (btnFatBurn500) btnFatBurn500.classList.toggle('active', state.intensityMode === 'fatburn_500');
}

function generateDailyWorkout() {
    const today = new Date();
    const dateKey = today.toDateString();
    const dayOfWeek = today.getDay();
    const schedule = WEEKLY_TARGETS[dayOfWeek];
    
    let seed = 0;
    for (let i = 0; i < dateKey.length; i++) seed += dateKey.charCodeAt(i);
    
    let modePool = [];
    if (state.intensityMode === 'recovery') {
        modePool = EXERCISES_POOL.filter(ex => ex.difficulty === 'low');
    } else if (state.intensityMode === 'standard') {
        modePool = EXERCISES_POOL.filter(ex => ex.difficulty === 'low' || ex.difficulty === 'med');
    } else if (state.intensityMode === 'intense') {
        modePool = EXERCISES_POOL.filter(ex => ex.difficulty === 'med' || ex.difficulty === 'high');
    } else if (state.intensityMode === 'fatburn_500') {
        modePool = EXERCISES_POOL.filter(ex => ex.difficulty === 'high');
    }

    // Handle 500kcal mode with fixed 8 exercises from screenshot
    let selected = [];
    if (state.intensityMode === 'fatburn_500') {
        const names = ["Burpees", "Jumping Jacks", "Mountain Climbers", "High Knees", "Jump Squats", "Push Ups", "Plank", "Lunges"];
        selected = names.map(name => EXERCISES_POOL.find(ex => ex.name === name)).filter(Boolean);
        state.totalRounds = 5; // Multi-round circuit sounds better
    } else {
        // Filter by target for the day
        let filteredPool = modePool.filter(ex => ex.target === schedule.target);
        
        // Fallback if target pool is too small
        if (filteredPool.length < 4) {
            filteredPool = [...modePool];
        }

        // Better Shuffling
        const shuffled = [...filteredPool].sort((a, b) => {
            const sumChars = (str) => str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const valA = (sumChars(a.name) * seed) % 137;
            const valB = (sumChars(b.name) * seed) % 137;
            return valA - valB;
        });

        const exerciseCount = 10;
        selected = shuffled.slice(0, exerciseCount);
    }
    
    // CIRCUIT TRAINING LOGIC
    // 1. Calculate burn of one round with "Standard" manageable reps
    let oneRoundBurn = selected.reduce((acc, ex) => acc + (ex.cals * ex.reps), 0);
    
    // 2. Determine how many rounds are needed to hit the daily target
    if (state.intensityMode === 'fatburn_500') {
        state.totalRounds = 1;
    } else {
        const maxRounds = 4;
        state.totalRounds = Math.min(maxRounds, Math.max(1, Math.ceil(state.dailyTargetBurn / oneRoundBurn)));
    }
    
    // 3. Optional: slightly scale reps if rounds are too few or too many
    // This keeps reps in a comfortable range
    let finalScale = (state.dailyTargetBurn / state.totalRounds) / oneRoundBurn;
    
    state.todayWorkout = selected.map(ex => {
        return {
            ...ex,
            reps: Math.max(10, Math.round(ex.reps * finalScale))
        };
    });
    
    const completedToday = state.workoutHistory.find(w => w.date === dateKey);
    state.completedExercises = completedToday ? completedToday.exercises : [];
    
    const focusEl = document.getElementById('daily-focus');
    if (focusEl) focusEl.textContent = schedule.label;

    updateCals();
    updateGoalUI();
}

function toggleSchedule() {
    const modal = document.getElementById('schedule-overlay');
    if (!modal) return;
    
    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';
    
    if (!isVisible) {
        renderSchedule();
    }
}

function renderSchedule() {
    const container = document.getElementById('schedule-list');
    if (!container) return;
    
    container.innerHTML = '';
    const today = new Date().getDay();
    
    for (let day = 0; day < 7; day++) {
        const item = document.createElement('div');
        item.className = `schedule-day-item ${day === today ? 'current-day' : ''}`;
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        item.innerHTML = `
            <div style="font-weight: 700; color: ${day === today ? 'var(--accent-green)' : 'var(--text-main)'}">${days[day]}</div>
            <div style="font-size: 14px; color: var(--text-secondary)">${WEEKLY_TARGETS[day].label}</div>
        `;
        container.appendChild(item);
    }
}

function updateGoalUI() {
    const currentWeight = state.weightLogs.length > 0 ? state.weightLogs[state.weightLogs.length - 1].weight : 77;
    const toGo = (currentWeight - state.goalWeight).toFixed(1);
    const goalEl = document.getElementById('weight-to-go');
    if (goalEl) goalEl.textContent = toGo > 0 ? `${toGo} kg to goal` : 'Goal reached! 🏆';

    const daysLeft = Math.ceil((new Date(state.goalDate) - new Date()) / (1000 * 60 * 60 * 24));
    const daysEl = document.getElementById('days-remaining');
    if (daysEl) daysEl.textContent = daysLeft > 0 ? `${daysLeft} days left` : 'Target date passed';

    // Update Daily Target UI
    const targetEl = document.getElementById('target-burn-value');
    if (targetEl) targetEl.textContent = state.dailyTargetBurn;

    const remainingEl = document.getElementById('target-remaining');
    if (remainingEl) {
        const remaining = Math.max(0, state.dailyTargetBurn - state.totalCaloriesBurned);
        remainingEl.textContent = `${Math.round(remaining)} kcal remaining today`;
    }
}

function updateCals() {
    state.totalCaloriesBurned = state.completedExercises.reduce((acc, idx) => {
        const ex = state.todayWorkout[idx];
        // Now cals are per round, so we multiply by rounds
        return acc + (ex ? (ex.cals * ex.reps * state.totalRounds) : 0);
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
                <div class="exercise-meta">${ex.reps} ${ex.isTimed ? 'Seconds' : 'Reps'} x ${state.totalRounds} Rounds • ~${Math.round(ex.cals * ex.reps * state.totalRounds)} kcal</div>
            </div>
            <button class="check-btn ${isDone ? 'completed' : ''}" onclick="toggleExercise(${index})">
                ${isDone ? '✓' : ''}
            </button>
        `;
        list.appendChild(item);
    });

    renderHealthTip();
    updateProgressUI();
}

function renderHealthTip() {
    const tipContainer = document.getElementById('health-tip-container');
    if (!tipContainer) return;

    if (state.intensityMode === 'recovery' || state.completedExercises.length === 0) {
        const randomTip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)];
        tipContainer.innerHTML = `
            <div class="card health-tip-card">
                <div class="subtitle">💡 RECOVERY ADVICE</div>
                <p style="font-size: 15px; color: var(--text-main); margin-top: 8px;">${randomTip}</p>
                ${state.intensityMode === 'recovery' ? '<small style="color: var(--accent-orange); display: block; margin-top: 10px; font-weight: 600;">You are in Recovery Mode. Focus on form, not speed.</small>' : ''}
            </div>
        `;
        tipContainer.classList.remove('hidden');
    } else {
        tipContainer.classList.add('hidden');
    }
}

function updateProgressUI() {
    const progress = (state.completedExercises.length / state.todayWorkout.length) * 100;
    document.getElementById('workout-progress').style.width = `${progress}%`;
    
    const roundsText = state.totalRounds > 1 ? `${state.totalRounds} Rounds of Circuit • ` : '';
    document.getElementById('workout-summary-text').textContent = `${roundsText}${state.completedExercises.length} of ${state.todayWorkout.length} exercises tracked`;
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
    state.currentRound = 1;
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

    const stepText = state.totalRounds > 1 ? `ROUND ${state.currentRound} OF ${state.totalRounds} • ` : '';
    document.getElementById('overlay-step').textContent = `${stepText}EXERCISE ${state.currentExerciseIndex + 1}`;
    document.getElementById('overlay-title').textContent = ex.name;
    
    const countPrefix = state.totalRounds > 1 ? `Round ${state.currentRound}: ` : '';
    document.getElementById('overlay-count').textContent = ex.isTimed ? `${countPrefix}Go!` : `${countPrefix}${ex.reps} Reps`;
    
    // Disable prev if first
    document.getElementById('prev-btn').disabled = state.currentExerciseIndex === 0;
    document.getElementById('workout-overlay').classList.remove('resting');
    document.getElementById('skip-rest-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'block';

    speak(`Next: ${ex.name}. ${ex.reps} ${ex.isTimed ? 'seconds' : 'reps'}.`);

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
        
        // Voice Milestones
        if (timeLeft === 10) speak("10 seconds left");
        if (timeLeft === Math.floor(seconds / 2) && seconds > 20) speak("Halfway there");
        if (timeLeft <= 5 && timeLeft > 0) speak(timeLeft.toString());

        if (timeLeft <= 0) {
            clearInterval(state.workoutInterval);
            speak("Time up!");
            if (state.isResting) {
                state.isResting = false;
                showExercise();
            }
        }
    }, 1000);
}

function nextExercise() {
    state.currentExerciseIndex++;
    
    if (state.currentExerciseIndex >= state.todayWorkout.length) {
        // Circuit finished
        for (let i = 0; i < state.todayWorkout.length; i++) {
            if (!state.completedExercises.includes(i)) {
                state.completedExercises.push(i);
            }
        }
        
        if (state.currentRound < state.totalRounds) {
            state.currentRound++;
            state.currentExerciseIndex = 0;
            speak(`Round ${state.currentRound} starts now!`);
            startRest(); // Rest between rounds
        } else {
            finishWorkout();
        }
    } else {
        startRest(); // Rest between exercises
    }
    
    updateCals();
    saveProgress();
}

function startRest() {
    state.isResting = true;
    const nextEx = state.todayWorkout[state.currentExerciseIndex];
    
    document.getElementById('workout-overlay').classList.add('resting');
    document.getElementById('overlay-title').textContent = "REST";
    document.getElementById('overlay-step').textContent = `UP NEXT: ${nextEx.name}`;
    document.getElementById('overlay-count').textContent = `Prepare for ${nextEx.reps} ${nextEx.isTimed ? 'Seconds' : 'Reps'}`;
    
    document.getElementById('skip-rest-btn').style.display = 'block';
    document.getElementById('next-btn').style.display = 'none';

    speak(`Rest for ${REST_DURATION} seconds. Next exercise is ${nextEx.name}.`);
    startTimer(REST_DURATION);
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
    if (!state.voiceEnabled || !window.speechSynthesis) return;
    
    // Add a slight delay if queueing to avoid stutter
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1.05;
    
    const btn = document.getElementById('voice-toggle');
    if (btn) btn.classList.add('speaking');
    
    msg.onend = () => {
        if (btn) btn.classList.remove('speaking');
    };

    window.speechSynthesis.speak(msg);
}

function toggleVoice() {
    state.voiceEnabled = !state.voiceEnabled;
    localStorage.setItem('voiceEnabled', state.voiceEnabled);
    updateVoiceUI();
    
    if (state.voiceEnabled) {
        speak("Voice enabled");
    } else {
        window.speechSynthesis.cancel();
    }
}

function updateVoiceUI() {
    const btn = document.getElementById('voice-toggle');
    if (!btn) return;
    
    btn.classList.toggle('muted', !state.voiceEnabled);
    btn.innerHTML = state.voiceEnabled ? '<span class="icon">🔊</span>' : '<span class="icon">🔇</span>';
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
    
    calculateTargetBurn();
    generateDailyWorkout();
    renderHome();
    alert("Goal updated!");
}

function toggleIntensity(mode) {
    state.intensityMode = mode;
    localStorage.setItem('intensityMode', mode);
    
    calculateTargetBurn(); // Ensure target is updated for the mode
    updateToggleButtons();
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

    document.getElementById('toggle-recovery').addEventListener('click', () => toggleIntensity('recovery'));
    document.getElementById('toggle-standard').addEventListener('click', () => toggleIntensity('standard'));
    document.getElementById('toggle-intense').addEventListener('click', () => toggleIntensity('intense'));
    
    const fatBurnToggle = document.getElementById('toggle-fatburn-500');
    if (fatBurnToggle) fatBurnToggle.addEventListener('click', () => toggleIntensity('fatburn_500'));

    const navHome = document.getElementById('nav-home');
    const navWeight = document.getElementById('nav-weight');

    if (navHome) {
        navHome.addEventListener('click', () => {
            document.getElementById('home-view').classList.remove('hidden');
            document.getElementById('weight-view').classList.add('hidden');
            navHome.classList.add('active');
            if (navWeight) navWeight.classList.remove('active');
        });
    }

    if (navWeight) {
        navWeight.addEventListener('click', () => {
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('weight-view').classList.remove('hidden');
            if (navHome) navHome.classList.remove('active');
            navWeight.classList.add('active');
            setTimeout(renderWeightChart, 100);
        });
    }

    const viewScheduleBtn = document.getElementById('view-schedule-btn');
    if (viewScheduleBtn) viewScheduleBtn.addEventListener('click', toggleSchedule);
    
    const closeScheduleBtn = document.getElementById('close-schedule-btn');
    if (closeScheduleBtn) closeScheduleBtn.addEventListener('click', toggleSchedule);

    const voiceToggleBtn = document.getElementById('voice-toggle');
    if (voiceToggleBtn) voiceToggleBtn.addEventListener('click', toggleVoice);

    const skipRestBtn = document.getElementById('skip-rest-btn');
    if (skipRestBtn) {
        skipRestBtn.addEventListener('click', () => {
            state.isResting = false;
            if (state.workoutInterval) clearInterval(state.workoutInterval);
            showExercise();
        });
    }

    const viewReferenceBtn = document.getElementById('view-reference-btn');
    if (viewReferenceBtn) {
        viewReferenceBtn.addEventListener('click', () => {
            document.getElementById('reference-overlay').style.display = 'flex';
        });
    }

    const closeReferenceBtn = document.getElementById('close-reference-btn');
    if (closeReferenceBtn) {
        closeReferenceBtn.addEventListener('click', () => {
            document.getElementById('reference-overlay').style.display = 'none';
        });
    }
}

// --- Init ---
document.addEventListener('DOMContentLoaded', init);
