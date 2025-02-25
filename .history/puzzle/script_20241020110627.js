const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
const pieces = [];
const correctOrder = [];
let shuffledOrder = [];

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

            context.drawImage(img, 0, 0, canvas.width, canvas.height);
            canvas.setAttribute('data-index', index); // Add index for tracking
            pieces[index] = canvas; // Store the piece in an array
            correctOrder[index] = index; // Keep track of the correct order
            puzzleContainer.appendChild(canvas);

            // Add click event to handle swapping pieces
            canvas.addEventListener('click', () => handlePieceClick(index));
        };
    });
}

function handlePieceClick(clickedIndex) {
    if (shuffledOrder.length === 0) return; // Don't allow clicks before shuffling

    // Find the first empty spot to swap
    const emptyIndex = shuffledOrder.indexOf(-1);

    // Only swap adjacent tiles (left, right, up, or down)
    const adjacentIndexes = [
        emptyIndex - 3, // Above
        emptyIndex + 3, // Below
        emptyIndex - 1, // Left
        emptyIndex + 1  // Right
    ];

    if (adjacentIndexes.includes(clickedIndex)) {
        // Swap clicked piece with empty space
        shuffledOrder[emptyIndex] = shuffledOrder[clickedIndex];
        shuffledOrder[clickedIndex] = -1;
        renderPuzzle();
        checkIfSolved();
    }
}

// Function to shuffle puzzle pieces
function shufflePuzzle() {
    shuffledOrder = correctOrder.slice();
    shuffledOrder.sort(() => Math.random() - 0.5);
    shuffledOrder[8] = -1; // The last piece will be treated as the empty space
    renderPuzzle();
    messageBox.textContent = ''; // Clear any previous messages
}

// Function to render the shuffled puzzle
function renderPuzzle() {
    puzzleContainer.innerHTML = ''; // Clear the container

    shuffledOrder.forEach((order, index) => {
        if (order === -1) {
            // Render an empty spot where -1 is
            const emptyDiv = document.createElement('div');
            emptyDiv.style.width = '100px';
            emptyDiv.style.height = '100px';
            puzzleContainer.appendChild(emptyDiv);
        } else {
            // Re-render the piece
            puzzleContainer.appendChild(pieces[order]);
        }
    });
}

// Function to check if the puzzle is solved
function checkIfSolved() {
    if (shuffledOrder.every((val, index) => val === correctOrder[index])) {
        messageBox.textContent = 'Congratulations! You solved the puzzle!';
    }
}

// Initialize the puzzle
createPuzzle();

// Add event listener for shuffle button
document.getElementById('shuffle-puzzle').addEventListener('click', shufflePuzzle);
