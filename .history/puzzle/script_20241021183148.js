var rows = 3;
var columns = 3;

var currTile;  // Tile being dragged
var otherTile; // Tile being dropped on

var turns = 0; // Counter for turns taken

// Define the image paths
const imagePaths = [
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

// Function to shuffle the image order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// This function runs when the window is loaded
window.onload = function () {
    console.log("Game started. Shuffling images...");

    // Create a copy of imagePaths for shuffling
    let shuffledPaths = [...imagePaths];
    shuffle(shuffledPaths); // Shuffle the image paths

    let board = document.getElementById("board");

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
    const correctOrder = [
        'image_grid/9.jpg',
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
    // Get current order of tiles with full paths
    let currentOrder = Array.from(tiles).map(tile => tile.src); // Get full path of each tile

    // Log the current order of tiles to the console
    console.log("Current tile order: ");
    console.log(`(${currentOrder.length}) [${currentOrder.map(tile => `"${tile.split('/').pop()}"`).join(', ')}]`); // Display filenames only for clarity
    currentOrder.forEach((tile, index) => {
        console.log(`${index}: "${tile.split('/').pop()}"`);
    });

    // Use the correctOrder array for comparison
    let completed = currentOrder.every((tileSrc, index) => {
        const isMatch = tileSrc === correctOrder[index];
        console.log(`Comparing ${tileSrc} with ${correctOrder[index]}: ${isMatch}`);
        return isMatch;
    });

    if (completed) {
        document.getElementById("message").innerText = "Congratulations! Your answer is Karma!";
        console.log("Game completed successfully!");
    } else {
        console.log("Game not completed yet.");
    }
}







