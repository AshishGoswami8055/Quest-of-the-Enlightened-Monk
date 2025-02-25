var rows = 3;
var columns = 3;

var currTile;  // Tile being dragged
var otherTile; // Tile being dropped on

var turns = 0; // Counter for turns taken

// Define the image paths for the first and second puzzle
const imagePaths1 = [
    'image_grid/1.jpg',
    'image_grid/2.jpg',
    'image_grid/3.jpg',
    'image_grid/4.jpg',
    'image_grid/5.jpg',
    'image_grid/6.jpg',
    'image_grid/7.jpg',
    'image_grid/8.jpg',
    'image_grid/9.jpg'
];

const imagePaths2 = [
    'image_grid2/1.jpg',
    'image_grid2/2.jpg',
    'image_grid2/3.jpg',
    'image_grid2/4.jpg',
    'image_grid2/5.jpg',
    'image_grid2/6.jpg',
    'image_grid2/7.jpg',
    'image_grid2/8.jpg',
    'image_grid2/9.jpg'
];

var currentPuzzle = 1; // Track current puzzle (1 or 2)

// Function to shuffle the image order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Function to load a new puzzle with a given set of image paths
function loadPuzzle(imagePaths) {
    let shuffledPaths = [...imagePaths];
    shuffle(shuffledPaths); // Shuffle the image paths
    let board = document.getElementById("board");
    board.innerHTML = ''; // Clear the board

    // Fill the board with shuffled images
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Create image element
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = shuffledPaths.shift(); // Get the next shuffled image
            tile.draggable = true; // Make the image draggable

            // Add drag event listeners
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            board.appendChild(tile);
        }
    }
}

// This function runs when the window is loaded
window.onload = function () {
    console.log("Game started. Loading first puzzle...");
    loadPuzzle(imagePaths1); // Load the first puzzle
}

// Function called when dragging starts
function dragStart() {
    currTile = this; // Image tile being dragged
    console.log("Dragging started for tile:", currTile.src);
}

// Function to allow dropping
function dragOver(e) {
    e.preventDefault(); // Prevent default behavior to allow drop
}

// Function to handle when dragging enters a drop zone
function dragEnter(e) {
    e.preventDefault();
}

// Function called when a tile is dropped
function dragDrop() {
    otherTile = this; // Image tile being dropped on
    console.log("Tile dropped on:", otherTile.src);
}

// Function called when dragging ends
function dragEnd() {
    if (!otherTile) return; // Prevent actions if no tile is selected

    let currCoords = currTile.id.split("-"); // ex) "0-0" -> ["0", "0"]
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    // Check if the two tiles are adjacent (can only swap with adjacent tiles)
    let moveLeft = r === r2 && c2 === c - 1;
    let moveRight = r === r2 && c2 === c + 1;
    let moveUp = c === c2 && r2 === r - 1;
    let moveDown = c === c2 && r2 === r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        // Swap images between the current tile and the other tile
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1; // Increment turn count
        document.getElementById("turns").innerText = turns; // Update turn count

        console.log("Tiles swapped. Current turn:", turns);

        // Check for completion after the swap
        checkCompletion();
    } else {
        console.log("Tiles are not adjacent, no swap performed.");
    }
}

// Function to check if the game is completed
function checkCompletion() {
    const correctOrder1 = [
        '9.jpg',
        '8.jpg',
        '7.jpg',
        '6.jpg',
        '5.jpg',
        '4.jpg',
        '3.jpg',
        '2.jpg',
        '1.jpg'
    ];

    const correctOrder2 = [
        '9.jpg',
        '8.jpg',
        '7.jpg',
        '6.jpg',
        '5.jpg',
        '4.jpg',
        '3.jpg',
        '2.jpg',
        '1.jpg'
    ];

    let tiles = document.querySelectorAll('#board img');
    let currentOrder = Array.from(tiles).map(tile => tile.src.split('/').pop()); // Get filenames

    let completed = currentOrder.every((tileSrc, index) => {
        const correctOrder = currentPuzzle === 1 ? correctOrder1 : correctOrder2;
        const isMatch = tileSrc === correctOrder[index];
        console.log(`Comparing ${tileSrc} with ${correctOrder[index]}: ${isMatch}`);
        return isMatch;
    });

    if (completed) {
        if (currentPuzzle === 1) {
            // If the first puzzle is completed, load the second puzzle
            console.log("Congratulations! Your answer is Karma!");
            document.getElementById("message").innerText = "Congratulations! Your answer is Karma!";
            currentPuzzle = 2; // Set the current puzzle to 2
            loadPuzzle(imagePaths2); // Load the second puzzle
        } else {
            // If the second puzzle is completed, display the final message
            console.log("Congratulations for completing level 2! Your answer is Meditation!");
            document.getElementById("message").innerText = "Congratulations for completing level 2! Your answer is Meditation!";
        }
    } else {
        console.log("Game not completed yet.");
    }
}
