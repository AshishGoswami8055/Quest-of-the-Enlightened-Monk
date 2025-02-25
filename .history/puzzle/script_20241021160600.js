const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
const pieces = [];
const correctOrder = [];
let currentOrder = [];
let lockedPieces = []; // Array to track locked pieces

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

    // Clear the puzzle container before adding new pieces
    puzzleContainer.innerHTML = '';

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
            lockedPieces[index] = false; // Initially, no piece is locked

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
    const index = parseInt(e.target.getAttribute('data-index'));
    
    // Only allow dragging if the piece is not locked
    if (!lockedPieces[index]) {
        draggedPieceIndex = index;
        e.dataTransfer.setData('text/plain', draggedPieceIndex);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.5'; // Visual feedback when dragging
    } else {
        e.preventDefault(); // Prevent drag if piece is locked
    }
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

    // Swap the dragged piece with the target piece if it's not locked
    if (draggedIndex !== targetPieceIndex && !lockedPieces[targetPieceIndex]) {
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

    currentOrder.forEach((order, index) => {
        const piece = pieces[order];

        // Add back the event listeners for unlocked pieces
        if (!lockedPieces[order]) {
            piece.setAttribute('draggable', true);
            piece.addEventListener('dragstart', handleDragStart);
            piece.addEventListener('dragover', handleDragOver);
            piece.addEventListener('drop', handleDrop);
        } else {
            piece.setAttribute('draggable', false); // Lock the piece if it's in the correct position
        }

        puzzleContainer.appendChild(piece);
    });
}

// Function to check if the puzzle is solved
function checkIfSolved() {
    let solved = true;

    currentOrder.forEach((val, index) => {
        // If the piece is in the correct position, lock it
        if (val === correctOrder[index]) {
            lockedPieces[val] = true; // Lock the piece
        } else {
            solved = false;
        }
    });

    // If all pieces are locked, show the success message
    if (solved) {
        messageBox.textContent = 'Congratulations! You solved the puzzle!';
    } else {
        messageBox.textContent = ''; // Clear the message if not solved
    }

    // Re-render to ensure locked pieces can't be moved
    renderPuzzle();
}

// Initialize the puzzle
createPuzzle();
