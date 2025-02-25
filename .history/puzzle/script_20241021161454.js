const puzzleContainer = document.querySelector('.puzzle-container');
const messageBox = document.getElementById('message');
let puzzleSize = 3; // 3x3 grid
let emptyTileIndex = puzzleSize * puzzleSize - 1; // The empty tile's index
let currentOrder = [];
let correctOrder = [];

// Function to create the sliding puzzle
function createSlidingPuzzle() {
    const imagePaths = [
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        '' // Empty tile
    ];

    // Generate initial random order and correct order
    currentOrder = shuffle([...Array(puzzleSize * puzzleSize).keys()]);
    correctOrder = [...Array(puzzleSize * puzzleSize).keys()];

    // Clear the puzzle container before adding new pieces
    puzzleContainer.innerHTML = '';

    currentOrder.forEach((orderIndex, index) => {
        if (orderIndex === emptyTileIndex) {
            // Leave the empty tile as an empty div
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-tile');
            puzzleContainer.appendChild(emptyDiv);
        } else {
            const img = new Image();
            img.src = imagePaths[orderIndex];
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const context = canvas.getContext('2d');
                
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.setAttribute('data-index', index); // Add index for tracking
                puzzleContainer.appendChild(canvas);

                // Add click event to slide the piece
                canvas.addEventListener('click', () => handleTileClick(index));
            };
        }
    });
}

// Function to handle sliding the tile
function handleTileClick(tileIndex) {
    const emptyIndex = currentOrder.indexOf(emptyTileIndex);

    if (canTileMove(tileIndex, emptyIndex)) {
        // Swap the clicked tile with the empty tile
        [currentOrder[tileIndex], currentOrder[emptyIndex]] = [currentOrder[emptyIndex], currentOrder[tileIndex]];

        // Re-render the puzzle with the updated order
        renderSlidingPuzzle();

        // Check if the puzzle is solved
        checkIfSolved();
    }
}

// Function to check if a tile can move (only adjacent to the empty tile)
function canTileMove(tileIndex, emptyIndex) {
    const rowSize = puzzleSize;

    const tileRow = Math.floor(tileIndex / rowSize);
    const tileCol = tileIndex % rowSize;
    const emptyRow = Math.floor(emptyIndex / rowSize);
    const emptyCol = emptyIndex % rowSize;

    // Tiles can only move if they're adjacent (up, down, left, right)
    return (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) || 
           (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);
}

// Function to render the sliding puzzle
function renderSlidingPuzzle() {
    puzzleContainer.innerHTML = '';

    currentOrder.forEach((orderIndex, index) => {
        if (orderIndex === emptyTileIndex) {
            // Leave the empty tile as an empty div
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('empty-tile');
            puzzleContainer.appendChild(emptyDiv);
        } else {
            const img = new Image();
            img.src = `image_grid/${orderIndex + 1}.jpg`;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 100;
                canvas.height = 100;
                const context = canvas.getContext('2d');
                
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.setAttribute('data-index', index); // Add index for tracking
                puzzleContainer.appendChild(canvas);

                // Add click event to slide the piece
                canvas.addEventListener('click', () => handleTileClick(index));
            };
        }
    });
}

// Function to check if the puzzle is solved
function checkIfSolved() {
    let solved = true;

    currentOrder.forEach((val, index) => {
        if (val !== correctOrder[index]) {
            solved = false;
        }
    });

    if (solved) {
        messageBox.textContent = 'Congratulations! You solved the sliding puzzle!';
    } else {
        messageBox.textContent = ''; // Clear the message if not solved
    }
}

// Shuffle the array to create a randomized puzzle order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the sliding puzzle
createSlidingPuzzle();
