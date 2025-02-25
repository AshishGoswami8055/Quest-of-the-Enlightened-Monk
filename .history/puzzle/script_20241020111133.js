const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
const pieces = [];
const correctOrder = [];
let currentOrder = [];

// Function to create puzzle pieces
function createPuzzle() {
    const imagePaths = [
        'images/image_grid/1.jpg',
        'images/image_grid/2.jpg',
        'images/image_grid/3.jpg',
        'images/image_grid/4.jpg',
        'images/image_grid/5.jpg',
        'images/image_grid/6.jpg',
        'images/image_grid/7.jpg',
        'images/image_grid/8.jpg',
        'images/image_grid/9.jpg',
    ];

    imagePaths.forEach((src, index) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            const context = canvas.getContext('2d');

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

function handleDragStart(e) {
    draggedPieceIndex = parseInt(e.target.getAttribute('data-index'));
}

function handleDragOver(e) {
    e.preventDefault(); // Necessary to allow dropping
}

function handleDrop(e) {
    const targetPieceIndex = parseInt(e.target.getAttribute('data-index'));

    // Swap pieces in currentOrder
    [currentOrder[draggedPieceIndex], currentOrder[targetPieceIndex]] = [currentOrder[targetPieceIndex], currentOrder[draggedPieceIndex]];

    // Update the DOM based on the new order
    renderPuzzle();

    // Check if the puzzle is solved
    checkIfSolved();
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

// Initialize the puzzle
createPuzzle();
