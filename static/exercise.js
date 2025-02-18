const metaphors = [
    "A rollercoaster is like a heartbeat because...",
    "A piano is like a rainbow because...",
    "Cooking is like solving a puzzle because...",
    "Reading a book is like traveling because...",
    "A sunset is like a whisper because...",
    "Running is like a song because...",
    "The ocean is like a mirror because...",
    "A snowstorm is like a secret because...",
    "A bicycle ride is like a dream because...",
    "A coffee mug is like a hug because..."
];

let currentMetaphorIndex = 0; // Track which metaphor is being displayed
let sentencesCompleted = 0;  // Track how many sentences the player has completed
let isGameActive = false;
let timerInterval;
let audioChunks = [];
let mediaRecorder;
let sentencesSeen = []; // To track sentences the player has seen

// Timer and Circle
const timerText = document.getElementById('timer-text');
const circleTimer = document.querySelector('.circle-timer');

// Elements
const sentenceElement = document.getElementById('sentence');
const startButton = document.getElementById('startButton');
const completeButton = document.getElementById('completeButton');
const gameResults = document.getElementById('gameResults');
const recordedSentences = document.getElementById('recordedSentences');
const audioPlayback = document.getElementById('audioPlayback');

// Function to reset timer circle
function resetTimer() {
    circleTimer.style.transition = 'none';  // Disable transition while resetting
    circleTimer.style.strokeDashoffset = 283;  // Full circle
    setTimeout(() => {
        circleTimer.style.transition = 'stroke-dashoffset 1s linear';  // Enable transition again
    }, 100); // Wait for reset to finish
}

// Function to display the next metaphor
function displayNextMetaphor() {
    // Show the next metaphor from the list
    sentenceElement.textContent = metaphors[currentMetaphorIndex];
    
    // Track the sentences that have been shown
    sentencesSeen.push(metaphors[currentMetaphorIndex]);

    currentMetaphorIndex++;

    // If 3 sentences have been completed, end the game
    if (sentencesCompleted >= 3) {
        endGame();
    } else {
        startNewCycle();  // Start the timer for the next sentence
    }
}

// Start a new timer cycle
function startNewCycle() {
    resetTimer();
    let timeLeft = 5;
    timerText.textContent = timeLeft;

    // Start the countdown
    timerInterval = setInterval(() => {
        timeLeft--;
        timerText.textContent = timeLeft;
        circleTimer.style.strokeDashoffset = 283 - (283 * (timeLeft / 5)); // Update the circle

        if (timeLeft <= 0) {
            clearInterval(timerInterval); // Stop the timer
            sentencesCompleted++; // Increment the completed sentences count
            displayNextMetaphor(); // Display the next metaphor
        }
    }, 1000);
}

// Start the game
function startGame() {
    isGameActive = true;
    sentenceElement.textContent = 'Get ready for your first sentence...';
    startButton.style.display = 'none';
    completeButton.style.display = 'block';
    sentencesCompleted = 0; // Reset the completed sentences count
    currentMetaphorIndex = 0; // Start from the first metaphor
    sentencesSeen = []; // Reset the array tracking sentences seen
    displayNextMetaphor();  // Display the first metaphor
}

// End the game and show results
function endGame() {
    gameResults.style.display = 'block';
    completeButton.style.display = 'none';

    // Display only the sentences that were seen by the player
    sentencesSeen.forEach(sentence => {
        const sentencePara = document.createElement('p');
        sentencePara.textContent = sentence;
        recordedSentences.appendChild(sentencePara);
    });

    // Play recorded audio (if any)
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayback.src = audioUrl;
    audioPlayback.play();
}

// Start and complete game button handlers
startButton.addEventListener('click', () => {
    startGame();
});

// Complete game button handler
completeButton.addEventListener('click', () => {
    clearInterval(timerInterval); // Stop the timer when the game is completed
    endGame();
});

// Audio recording logic
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorder.start();
    } catch (err) {
        console.error('Error accessing the microphone: ', err);
    }
}

function stopRecording() {
    mediaRecorder.stop();
}

// Start recording when the game starts
startButton.addEventListener('click', startRecording);
completeButton.addEventListener('click', stopRecording);
