const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
const pieces = [];
const correctOrder = [];
let currentOrder = [];

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

function handleDragStart(e) {
    // Set the dragged index in the dataTransfer object
    draggedPieceIndex = parseInt(e.target.getAttribute('data-index'));
    e.dataTransfer.setData('text/plain', draggedPieceIndex);
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5'; // Visual feedback when dragging
}

function handleDragOver(e) {
    // Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();

    // Get the dragged piece index
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const targetPieceIndex = e.target.getAttribute('data-index');

    // Swap the dragged piece with the target piece
    if (draggedIndex !== targetPieceIndex) {
        [currentOrder[draggedIndex], currentOrder[targetPieceIndex]] = [currentOrder[targetPieceIndex], currentOrder[draggedIndex]];

        // Re-render the puzzle
        renderPuzzle();

        // Check if the puzzle is solved
        checkIfSolved();
    }

    e.target.style.opacity = '1'; // Reset opacity after drop
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
