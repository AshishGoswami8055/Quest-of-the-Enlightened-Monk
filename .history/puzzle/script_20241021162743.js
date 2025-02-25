const rows = 3;
const columns = 3;
let currTile;
let otherTile; // Empty tile
let turns = 0;
let imgOrder = shuffleArray([
    'image_grid/1.jpg',
    'image_grid/2.jpg',
    'image_grid/3.jpg',
    'image_grid/4.jpg',
    'image_grid/5.jpg',
    'image_grid/6.jpg',
    'image_grid/7.jpg',
    'image_grid/8.jpg',
    'image_grid/9.jpg',
    '' // Empty tile
]);

window.onload = function() {
    createBoard();
};

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = ''; // Clear the board

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("img");
            tile.id = r.toString() + "-" + c.toString();
            tile.src = imgOrder.shift();

            // Drag functionality
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            board.append(tile);
        }
    }
}

function dragStart() {
    currTile = this;
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
    otherTile = this;
}

function dragEnd() {
    if (!otherTile.src.includes("8.jpg")) { // Assuming 8 is the empty tile
        return;
    }

    let currCoords = currTile.id.split("-");
    let r = parseInt(currCoords[0]);
    let c = parseInt(currCoords[1]);

    let otherCoords = otherTile.id.split("-");
    let r2 = parseInt(otherCoords[0]);
    let c2 = parseInt(otherCoords[1]);

    let moveLeft = r === r2 && c2 === c - 1;
    let moveRight = r === r2 && c2 === c + 1;
    let moveUp = c === c2 && r2 === r - 1;
    let moveDown = c === c2 && r2 === r + 1;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    if (isAdjacent) {
        let currImg = currTile.src;
        let otherImg = otherTile.src;

        currTile.src = otherImg;
        otherTile.src = currImg;

        turns += 1;
        document.getElementById("turns").innerText = `Turns: ${turns}`;

        // Check if the puzzle is solved
        checkIfSolved();
    }
}

function checkIfSolved() {
    // Check if the current order matches the original order
    const solvedOrder = [
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        'image_grid/8.jpg',
        ''
    ];

    const currentOrder = Array.from(document.querySelectorAll('#board img')).map(img => img.src);
    
    if (currentOrder.join('') === solvedOrder.join('')) {
        let message = `Congratulations! You solved the puzzle in ${turns} turns!`;
        if (turns <= 15) {
            message += ' You get the answer to the quiz: "karma".';
        } else {
            message += ' Try again to get the answer!';
        }
        document.getElementById("message").innerText = message;
        document.getElementById("replay-button").style.display = "block"; // Show replay button
    }
}

// Shuffle function to randomize the order of the images
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to replay the puzzle
function replayPuzzle() {
    turns = 0; // Reset turns
    document.getElementById("turns").innerText = `Turns: ${turns}`; // Reset display
    imgOrder = shuffleArray([
        'image_grid/1.jpg',
        'image_grid/2.jpg',
        'image_grid/3.jpg',
        'image_grid/4.jpg',
        'image_grid/5.jpg',
        'image_grid/6.jpg',
        'image_grid/7.jpg',
        'image_grid/8.jpg',
        'image_grid/9.jpg',
        ''
    ]);
    createBoard(); // Create a new board
    document.getElementById("message").innerText = ''; // Clear message
    document.getElementById("replay-button").style.display = "none"; // Hide replay button
}
