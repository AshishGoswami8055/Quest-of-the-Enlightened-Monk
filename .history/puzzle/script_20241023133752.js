// Puzzle settings
const rows = 3; // Number of rows
const columns = 3; // Number of columns
let turns = 0; // Number of turns taken
let imagePaths = []; // Array to hold image paths
let emptyTileId = null; // ID of the empty tile

// Initialize the puzzle
function initPuzzle() {
    // Populate imagePaths with your image URLs
    for (let i = 1; i <= rows * columns; i++) {
        imagePaths.push(`puzzle/image_grid/${i}.jpg`); // Change path according to your structure
    }
    loadPuzzle(imagePaths);
}

// Load the puzzle with shuffled images
function loadPuzzle(imagePaths) {
    let shuffledPaths = [...imagePaths];
    shuffle(shuffledPaths); // Shuffle the image paths
    let board = document.getElementById("board");
    board.innerHTML = ''; // Clear the board

    // Fill the board with shuffled images
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
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

    // Set the last tile as the empty tile
    emptyTileId = `${rows - 1}-${columns - 1}`;
    board.lastChild.src = ""; // Clear the last tile to make it empty
}

// Shuffle function to randomize the order of images
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Drag and drop functions
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}

function dragOver(event) {
    event.preventDefault(); // Prevent default to allow drop
}

function dragEnter(event) {
    event.preventDefault(); // Prevent default to allow drop
}

function dragDrop(event) {
    const draggedTileId = event.dataTransfer.getData("text/plain");
    const targetTileId = event.target.id;

    // Check if the drop is valid (i.e., it should be next to the empty tile)
    if (isValidMove(draggedTileId, targetTileId)) {
        swapTiles(draggedTileId, targetTileId);
        turns++;
        updateTurns();
    }
}

function dragEnd(event) {
    // Handle any necessary clean-up after dragging
}

// Function to check if the move is valid
function isValidMove(draggedTileId, targetTileId) {
    const [draggedRow, draggedCol] = draggedTileId.split("-").map(Number);
    const [targetRow, targetCol] = targetTileId.split("-").map(Number);
    const emptyTile = emptyTileId.split("-").map(Number);

    // Check if the target is adjacent to the empty tile
    return (
        (targetRow === emptyTile[0] && Math.abs(targetCol - emptyTile[1]) === 1) ||
        (targetCol === emptyTile[1] && Math.abs(targetRow - emptyTile[0]) === 1)
    );
}

// Function to swap tiles
function swapTiles(draggedTileId, targetTileId) {
    const draggedTile = document.getElementById(draggedTileId);
    const targetTile = document.getElementById(targetTileId);

    // Swap the images
    const tempSrc = targetTile.src;
    targetTile.src = draggedTile.src;
    draggedTile.src = tempSrc;

    // Update the empty tile ID
    emptyTileId = draggedTileId;
}

// Function to update turns display
function updateTurns() {
    const turnsElement = document.getElementById("turns");
    turnsElement.innerText = `Turns: ${turns}`;
}

// Initialize the puzzle when the window loads
window.onload = initPuzzle;
