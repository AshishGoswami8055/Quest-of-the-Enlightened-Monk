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
    'image_grid/9.jpg'
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

    // Fill the board with shuffled images
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Create image element
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = shuffledPaths.shift(); // Get the next shuffled image

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

function dragStart() {
    currTile = this; // Image tile being dragged
}

function dragOver(e) {
    e.preventDefault(); // Prevent default behavior to allow drop
}

function dragEnter(e) {
    e.preventDefault();
}

function dragDrop() {
    otherTile = this; // Image tile being dropped on
}

function dragEnd() {
    // Check if otherTile is blank
    if (otherTile.src.includes("9.jpg")) { // Update the condition for blank tile logic
        return;
    }

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

        turns += 1;
        document.getElementById("turns").innerText = turns; // Update turn count

        // Check for completion after the swap
        checkCompletion();
    }
}

// Function to check if the game is completed
function checkCompletion() {
    const correctOrder = [
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

    let tiles = document.querySelectorAll('#board img');
    let completed = Array.from(tiles).every((tile, index) => {
        return tile.src === correctOrder[index]; // Check if each tile matches the correct order
    });

    if (completed) {
        document.getElementById("message").innerText = "Congratulations! Your answer is Karma!";
    }
}

