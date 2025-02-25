import { player, enemy } from './Fighter.js'; // Import player and enemy objects from Fighter module
import { background } from './Sprite.js'; // Import background from Sprite module
import { loadKeyDownEvents, loadkeyUpEvents } from './Keys.js'; // Import key event handling functions

const canvas = document.querySelector('canvas'); // Select the canvas element
const c = canvas.getContext('2d'); // Get the 2D drawing context
let timer = 30; // Game timer set to 30 seconds
let timerID; // Variable to hold the timer ID for clearing the timeout
let gameEnded = false; // Flag to determine if the game has ended

// TODO: Implement a reset button to restart the game

// Load key down and up events for player and enemy
loadKeyDownEvents(player, enemy); // Load KeyDown events
loadkeyUpEvents(player, enemy); // Load KeyUp events

const onePlayer = document.getElementById('1player'); // Get the single-player button
onePlayer.addEventListener("click", () => { // Add click event listener for single-player mode
    intervalBot(); // Start the bot's movement and attack intervals
    startGame(); // Start the game
});
// Uncomment the following lines if a two-player mode is implemented
// twoPlayers.addEventListener("click", () => {
//     startGame();
// });

// Main function to start the game after the menu is dismissed
function startGame() {
    document.getElementById('menu').style.display = "none"; // Hide the menu
    c.fillRect(0, 0, canvas.width, canvas.height); // Simulate loading with a black screen
    setTimeout(() => {
        animate(); // Start the animation loop
        decreaseTimer(); // Start the countdown timer
        document.getElementById('hud').style.display = "flex"; // Show the HUD (Heads-Up Display)
    }, 1000); // Wait 1 second before starting the game
}

// Function to decrease the timer; announce the winner when it reaches 0
function decreaseTimer() {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000); // Call this function again in 1 second
        timer--; // Decrement the timer
        document.querySelector('#timer').innerHTML = timer; // Update the timer display
    } else { // Timer runs out, determine the winner
        determineWinner({ player, enemy, timerID });
    }
}

// Animate the sprites every frame
function animate() {
    window.requestAnimationFrame(animate); // Recursively call animate for the next frame
    background.update(); // Update the background
    // shop.update(); // Uncomment if a shop feature is implemented
    update(player); // Update the player
    update(enemy); // Update the enemy
    player.velocity.x = 0; // Reset the player's x velocity to prevent sliding
    enemy.velocity.x = 0; // Reset the enemy's x velocity

    // If the player is not moving, set their sprite to idle
    if (!player.movement() && !player.isAttacking && !player.isTakingHit) {
        player.switchSprite('idle');
    }

    // If the enemy is not moving, set their sprite to idle
    if (!enemy.movement() && !enemy.isAttacking && !enemy.isTakingHit) {
        enemy.switchSprite('idle'); // TODO: Disable enemy movement for arrow keys when playing against AI
    }

    // Check if a fighter is attacking
    player.attack(enemy); // Player attacks the enemy
    enemy.attack(player); // Enemy attacks the player

    // Check if the game has ended based on health
    if (!gameEnded) {
        if (enemy.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy, timerID }); // Determine the winner if health reaches 0
        }
    }
}

// Manages the behavior of the bot; movement is completely random for now
function intervalBot() {
    setInterval(botMoves, 1000); // Evaluate bot movement every 1 second
    setInterval(botAttack, 1000); // Evaluate bot attack every 1 second
}

// Bot moves randomly: 45% chance of moving forward, 45% chance of moving backward, 10% chance of not moving
function botMoves() {
    let randomFloat = Math.random(); // Generate a random float between 0 and 1
    if (randomFloat < 0.45) { // Move forwards
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowLeft' })); // Simulate left arrow key press
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowLeft' })); // Simulate left arrow key release
        }, randomFloat * 3000); // Release key after a random time
    } else if (randomFloat < 0.85) { // Move backwards
        window.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'ArrowRight' })); // Simulate right arrow key press
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent('keyup', { 'key': 'ArrowRight' })); // Simulate right arrow key release
        }, randomFloat * 3000); // Release key after a random time
    }
}

// Bot attacks the player if in range and the cooldown is available
function botAttack() {
    if (enemy.attackCooldown && enemy.isHitting(player)) { // Check if the enemy can attack
        enemy.isAttacking = true; // Set enemy attacking flag
        enemy.attack(player); // Enemy attacks the player
        setTimeout(() => { enemy.isAttacking = false; }, 1000); // Reset attacking flag after 1 second
    }
}

// Update function for the fighters
function update(fighter) {
    if (fighter.health > 0) { // Allow movement and attacks only if fighter is alive
        fighter.update(); // Update fighter properties
    } else { // If the fighter is not alive, only draw the fighter on the screen
        fighter.animateFrames(); // Animate death frames
        fighter.draw(); // Draw the fighter
    }
}

// Determine the winner based on health and display the result
function determineWinner({ player, enemy, timerID }) {
    clearTimeout(timerID); // Stop the timer; the game has ended
    gameEnded = true; // Set the gameEnded flag to true
    document.querySelector('#result').style.display = 'flex'; // Show the result overlay
    if (player.health === enemy.health) {
        document.querySelector('#result').innerHTML = 'Tie!'; // If both healths are the same, it's a tie
    } else if (player.health > enemy.health) {
        document.querySelector('#result').innerHTML = 'You Won...'; // Player wins
        setInterval(() => {
            window.close("html/index.html"); // Close the game window after 3 seconds
        }, 3000);
        enemy.health = 0; // Set enemy health to 0
        enemy.switchSprite('death'); // Switch enemy sprite to death
    } else {
        document.querySelector('#result').innerHTML = 'Player 2 won!'; // Enemy wins
        player.health = 0; // Set player health to 0
        player.switchSprite('death'); // Switch player sprite to death
    }
}
