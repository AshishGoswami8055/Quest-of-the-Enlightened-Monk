var rows = 3;
var columns = 3;

var currTile;  // Tile being dragged
var otherTile; // Tile being dropped on (must be the blank tile)

var turns = 0;

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
    'image_grid/9.jpg', // Include the 9th image
    '' // Empty tile for the blank space
];

// Function to shuffle the image order
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

window.onload = function () {
    // Create a copy of imagePaths for shuffling
    let shuffledPaths = [...imagePaths];
    shuffle(shuffledPaths); // Shuffle the image paths

    let board = document.getElementById("board");
    board.innerHTML = ''; // Clear previous content

    // Fill the board with shuffled images
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Create image element
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = shuffledPaths.shift(); // Get the next shuffled image

            // Hide the empty tile (blank space)
            if (tile.src === "") {
                tile.style.visibility = "hidden"; // Hide the empty tile
            }

            // Add drag event listeners
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            board.appendChild(tile);
        }
    }
}

function dragStart() {
    currTile = this; // Image tile being dragged
}

function dragOver(e) {
    e.preventDefault(); // Prevent default behavior to allow drop
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() { }

function dragDrop() {
    otherTile = this; // Image tile being dropped on
}

function dragEnd() {
    // Allow swapping only with the empty tile
    if (otherTile.style.visibility === "hidden") { // Check if the other tile is the empty tile
        let currCoords = currTile.id.split("-"); // ex) "0-0" -> ["0", "0"]
        let r = parseInt(currCoords[0]);
        let c = parseInt(currCoords[1]);

        let otherCoords = otherTile.id.split("-");
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);

        // Check if the two tiles are adjacent (can only swap with adjacent tiles)
        let moveLeft = r == r2 && c2 == c - 1;
        let moveRight = r == r2 && c2 == c + 1;
        let moveUp = c == c2 && r2 == r - 1;
        let moveDown = c == c2 && r2 == r + 1;

        let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

        if (isAdjacent) {
            // Swap images between the current tile and the other tile
            let currImg = currTile.src;
            let otherImg = otherTile.src;

            currTile.src = otherImg;
            otherTile.src = currImg;

            // Update visibility for the empty tile
            if (currImg === "") {
                currTile.style.visibility = "hidden"; // Hide the new empty tile
            } else if (otherImg === "") {
                otherTile.style.visibility = "hidden"; // Hide the new empty tile
            }

            turns += 1;
            document.getElementById("turns").innerText = `Turns: ${turns}`; // Update turn count
            checkIfSolved(); // Check if the puzzle is solved
        }
    }
}

// Function to check if the puzzle is solved
function checkIfSolved() {
    const solvedOrder = [
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        'image_grid/9.jpg', // Include the 9th image
        ''
    ];

    const currentOrder = Array.from(document.querySelectorAll('#board img')).map(img => img.src);
    if (currentOrder.join('') === solvedOrder.join('')) {
        document.getElementById("message").innerText = "Congratulations! Your answer is Karma.";
        document.getElementById("replay-button").style.display = "block"; // Show replay button
    }
}

// Function to replay the puzzle
function replayPuzzle() {
    turns = 0; // Reset turns
    document.getElementById("turns").innerText = `Turns: ${turns}`; // Reset display
    imgOrder = shuffle([
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        'image_grid/9.jpg', // Include the 9th image
        ''
    ]);
    createBoard(); // Create a new board
    document.getElementById("message").innerText = ''; // Clear message
    document.getElementById("replay-button").style.display = "none"; // Hide replay button
}
