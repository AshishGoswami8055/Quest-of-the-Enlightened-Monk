const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
const popup = document.getElementById('puzzle-popup');
const closePopup = document.getElementById('close-popup');
const pieces = [];
const correctOrder = [];
let currentOrder = [];

// Show the popup when triggered from the parent game
function openPuzzlePopup() {
    popup.style.display = 'block';
}

// Close the popup when the close button is clicked
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});

// Function to create puzzle pieces
function createPuzzle() {
    const imagePaths = [
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        'image_grid/9.jpg',
    ];

    imagePaths.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const context = canvas.getContext('2d');

            // Draw image on the canvas
            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.setAttribute('data-index', index); // Add index for tracking
            canvas.setAttribute('draggable', true); // Enable dragging

            pieces[index] = canvas; // Store the piece
            correctOrder[index] = index; // Keep track of the correct order
            currentOrder[index] = index; // Current order starts as correct
            puzzleContainer.appendChild(canvas);

            // Add drag and drop event listeners
            canvas.addEventListener('dragstart', handleDragStart);
            canvas.addEventListener('dragover', handleDragOver);
            canvas.addEventListener('drop', handleDrop);
        };
    });
}

// Drag and Drop Handlers
let draggedPieceIndex = null;
let draggedPiece = null;

function handleDragStart(e) {
    draggedPieceIndex = parseInt(e.target.getAttribute('data-index'));
    draggedPiece = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5'; // Visual feedback when dragging
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();

    const targetPieceIndex = parseInt(e.target.getAttribute('data-index'));

    // Swap only the dragged piece with the drop target
    if (draggedPieceIndex !== targetPieceIndex) {
        // Swap positions in currentOrder
        [currentOrder[draggedPieceIndex], currentOrder[targetPieceIndex]] = [currentOrder[targetPieceIndex], currentOrder[draggedPieceIndex]];

        // Render the puzzle in the new order
        renderPuzzle();

        // Check if the puzzle is solved
        checkIfSolved();
    }

    draggedPiece.style.opacity = '1'; // Reset opacity after drop
    draggedPiece = null;
}

// Function to render the puzzle based on current order
function renderPuzzle() {
    puzzleContainer.innerHTML = ''; // Clear the container

    currentOrder.forEach(order => {
        puzzleContainer.appendChild(pieces[order]);
    });
}

// Function to check if the puzzle is solved
function checkIfSolved() {
    if (currentOrder.every((val, index) => val === correctOrder[index])) {
        messageBox.textContent = 'Congratulations! You solved the puzzle!';
    } else {
        messageBox.textContent = ''; // Clear the message if not solved
    }
}

// Timer Variables
let timeRemaining = 300; // 5 minutes in seconds
const timerDisplay = document.getElementById('timer');

// Start the timer
const timerInterval = setInterval(() => {
    if (timeRemaining <= 0) {
        clearInterval(timerInterval);
        alert("Time's up! The page will close now.");
        window.close(); // Attempt to close the page
    } else {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `Time Remaining: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}, 1000);

// Existing puzzle creation and other code here...


// Initialize the puzzle
createPuzzle();
