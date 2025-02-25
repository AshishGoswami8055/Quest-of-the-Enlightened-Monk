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
        document.getElementById("turns").innerText = "Turns: " + turns; // Update turn count

        console.log("Tiles swapped. Current turn:", turns);

        // Check if the player has taken more than 22 turns
        if (turns > 22) {
            // Call the restart game function if turns exceed 22
            restartGame();
            return; // Stop further actions as game restarts
        }

        // Check for completion after the swap
        checkCompletion();
    } else {
        console.log("Tiles are not adjacent, no swap performed.");
    }
}

// Function to restart the game from level 1
function restartGame() {
    alert("You took too many turns! Restarting the game from level 1...");

    turns = 0; // Reset turn count
    currentPuzzle = 1; // Reset to the first puzzle
    loadPuzzle(imagePaths1); // Reload the first puzzle

    document.getElementById("turns").innerText = "Turns: 0"; // Reset displayed turns
    document.getElementById("message").innerText = "Game restarted. Try again from level 1."; // Update message
}
