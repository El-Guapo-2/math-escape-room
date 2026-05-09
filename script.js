/* ============ Configuration ============ */
/* Add your questions and answers here!      */
/* You can add as many as you want by copying*/
/* the format below.                         */
/* ======================================= */
const escapeRoomData = [
    {
        question: "The answer is hi",
        answer: "hi" // Answers should be strings for exact matching
    },
    {
        question: "The answer is high",
        answer: "high"
    }
];

/* ============ Application Logic ============ */
/* Do not edit below unless changing functionality */
/* =========================================== */

let currentSlideIndex = 0;
let unlockedSlides = 0; // Tracks the highest slide the user has solved

let startTime;
let timerInterval;

// DOM Elements
const elements = {
    progress: document.getElementById('progress-indicator'),
    timerDisplay: document.getElementById('timer-display'),
    question: document.getElementById('question-text'),
    input: document.getElementById('answer-input'),
    checkBtn: document.getElementById('check-btn'),
    feedback: document.getElementById('feedback-message'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    startContainer: document.getElementById('start-container'),
    startBtn: document.getElementById('start-btn'),
    slideContainer: document.getElementById('slide-container'),
    completionContainer: document.getElementById('completion-container'),
    gameOverContainer: document.getElementById('game-over-container'),
    restartBtn: document.getElementById('restart-btn'),
    restartGoBtn: document.getElementById('restart-go-btn'),
    forfeitBtn: document.getElementById('forfeit-btn')
};

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
}

function updateTimer() {
    const now = Date.now();
    const elapsed = now - startTime;
    elements.timerDisplay.textContent = `Time: ${formatTime(elapsed)}`;
}

function startGame() {
    startTime = Date.now();
    elements.timerDisplay.textContent = "Time: 00:00.00";
    timerInterval = setInterval(updateTimer, 10);
    
    elements.startContainer.classList.add('hidden');
    elements.startContainer.classList.remove('active');
    elements.slideContainer.classList.remove('hidden');
    elements.slideContainer.classList.add('active');
    elements.forfeitBtn.disabled = false;
    
    renderSlide();
}

function init() {
    clearInterval(timerInterval);
    currentSlideIndex = 0;
    unlockedSlides = 0;
    elements.timerDisplay.textContent = "Time: 00:00.00";
    elements.progress.textContent = "Ready";
    
    elements.startContainer.classList.remove('hidden');
    elements.startContainer.classList.add('active');
    elements.slideContainer.classList.add('hidden');
    elements.slideContainer.classList.remove('active');
    elements.completionContainer.classList.add('hidden');
    elements.completionContainer.classList.remove('active');
    elements.gameOverContainer.classList.add('hidden');
    elements.gameOverContainer.classList.remove('active');
    
    // reset navigation buttons
    elements.prevBtn.disabled = true;
    elements.nextBtn.disabled = true;
    elements.forfeitBtn.disabled = true;
}

function renderSlide() {
    const totalRooms = escapeRoomData.length;
    
    // Update Progress
    elements.progress.textContent = `Challenge ${currentSlideIndex + 1} of ${totalRooms}`;
    
    // Update Question
    elements.question.textContent = escapeRoomData[currentSlideIndex].question;
    
    // Reset Input and Feedback
    elements.input.value = "";
    elements.feedback.textContent = "";
    elements.feedback.className = "feedback-message";
    
    // Check unlocked status
    const isSolved = currentSlideIndex < unlockedSlides;
    
    if (isSolved) {
        elements.input.value = escapeRoomData[currentSlideIndex].answer;
        elements.input.disabled = true;
        elements.checkBtn.style.display = 'none';
        elements.feedback.textContent = "Solved!";
        elements.feedback.classList.add('success');
        elements.nextBtn.disabled = false;
    } else {
        elements.input.disabled = false;
        elements.checkBtn.style.display = 'block';
        elements.nextBtn.disabled = true;
    }

    // Update Navigation Buttons
    elements.prevBtn.disabled = currentSlideIndex === 0;

    // Trigger simple animation
    elements.slideContainer.classList.remove('active');
    void elements.slideContainer.offsetWidth; // trigger reflow
    elements.slideContainer.classList.add('active');
    
    // Focus input if not disabled
    if (!elements.input.disabled) {
        elements.input.focus();
    }
}

function checkAnswer() {
    if (currentSlideIndex < unlockedSlides) return; // Already solved

    const userAnswer = elements.input.value.trim().toLowerCase();
    const correctAnswer = escapeRoomData[currentSlideIndex].answer.trim().toLowerCase();

    if (userAnswer === correctAnswer) {
        // Success
        elements.feedback.textContent = "Correct! The way forward opens.";
        elements.feedback.className = "feedback-message success";
        elements.nextBtn.disabled = false;
        elements.input.disabled = true;
        elements.checkBtn.style.display = 'none';
        
        // Advance the unlock tracker if this is the newest room
        if (currentSlideIndex === unlockedSlides) {
            unlockedSlides++;
        }
    } else {
        // Error
        elements.feedback.textContent = "Incorrect. Ye must try again!";
        elements.feedback.className = "feedback-message error";
        
        // Shake animation
        elements.slideContainer.classList.add('shake');
        setTimeout(() => elements.slideContainer.classList.remove('shake'), 400);
    }
}

function goNext() {
    if (currentSlideIndex < unlockedSlides) {
        if (currentSlideIndex === escapeRoomData.length - 1) {
            showCompletion();
        } else {
            currentSlideIndex++;
            renderSlide();
        }
    }
}

function goPrev() {
    if (currentSlideIndex > 0) {
        currentSlideIndex--;
        renderSlide();
    }
}

function showCompletion() {
    clearInterval(timerInterval);
    const totalTime = elements.timerDisplay.textContent.replace('Time: ', '');
    
    elements.slideContainer.classList.add('hidden');
    elements.slideContainer.classList.remove('active');
    
    elements.completionContainer.querySelector('.final-time').textContent = `Final Time: ${totalTime}`;
    elements.completionContainer.classList.remove('hidden');
    elements.completionContainer.classList.add('active');
    
    elements.progress.textContent = "Victory!";
    elements.prevBtn.disabled = true;
    elements.nextBtn.disabled = true;
    elements.forfeitBtn.disabled = true;
}

function forfeit() {
    clearInterval(timerInterval);
    elements.slideContainer.classList.add('hidden');
    elements.slideContainer.classList.remove('active');
    
    elements.gameOverContainer.classList.remove('hidden');
    elements.gameOverContainer.classList.add('active');
    
    elements.progress.textContent = "Defeated";
    elements.timerDisplay.textContent = "Time: --:--.--";
    elements.prevBtn.disabled = true;
    elements.nextBtn.disabled = true;
    elements.forfeitBtn.disabled = true;
}

// Event Listeners
elements.startBtn.addEventListener('click', startGame);
elements.checkBtn.addEventListener('click', checkAnswer);

// Global un-focused enter key
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        // If on the start screen
        if (!elements.startContainer.classList.contains('hidden')) {
            startGame();
        } 
        // If on the completion screen
        else if (!elements.completionContainer.classList.contains('hidden') || !elements.gameOverContainer.classList.contains('hidden')) {
            init();
        } 
        // If playing the game
        else {
            if (currentSlideIndex < unlockedSlides) {
                // If it's already solved, advance to next
                goNext();
            } else {
                // If not solved, perform check
                checkAnswer();
            }
        }
    }
});

elements.nextBtn.addEventListener('click', goNext);
elements.prevBtn.addEventListener('click', goPrev);
elements.forfeitBtn.addEventListener('click', forfeit);
elements.restartBtn.addEventListener('click', init);
elements.restartGoBtn.addEventListener('click', init);

// Start
init();