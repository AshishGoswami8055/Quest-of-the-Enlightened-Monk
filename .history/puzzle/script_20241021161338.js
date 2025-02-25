var rows = 3;
var columns = 3;

var currTile;  // Tile being dragged
var otherTile; // Tile being dropped on (must be the blank tile)

var turns = 0;

var imgOrder = ["4", "2", "8", "5", "1", "6", "7", "9", "3"]; // Ensure the blank tile is last

window.onload = function () {
    let shuffledOrder = imgOrder.slice(); // Copy the array to prevent mutation
    let board = document.getElementById("board");

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // Create image element
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = shuffledOrder.shift() + ".jpg";

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
    // Only allow swapping if the other tile is the blank tile ("3.jpg")
    if (!otherTile.src.includes("3.jpg")) {
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
    }
}
