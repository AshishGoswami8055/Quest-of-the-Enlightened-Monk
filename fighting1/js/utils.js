// Function to check for a rectangular collision between two objects.
// It determines if the attack box of the first rectangle intersects with the second rectangle.
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x && // Check if the right side of attackBox is past the left side of rectangle2
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width && // Check if the left side of attackBox is before the right side of rectangle2
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y && // Check if the bottom side of attackBox is past the top side of rectangle2
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height // Check if the top side of attackBox is before the bottom side of rectangle2
  );
}

let timer = 60; // Initialize timer with a value of 60 seconds.
let timerId;    // Variable to hold the ID of the timer.

// Function to decrease the timer every second.
function decreaseTimer() {
  if (timer > 0) { // Check if the timer is greater than 0.
    timerId = setTimeout(decreaseTimer, 1000); // Set a timeout to call this function again in 1 second.
    timer--; // Decrement the timer by 1 second.
    document.querySelector('#timer').innerHTML = timer; // Update the timer display in the HTML.
  }

  // If the timer reaches 0, determine the winner based on player health.
  if (timer === 0) {
    determineWinner({ player, enemy, timerId }); // Call determineWinner to handle end-of-game logic.
  }
}

// Function to determine the winner based on player and enemy health.
// It also handles the display of results and transitions to other screens.
function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId); // Stop the timer as the game has ended.
  document.querySelector('#displayText').style.display = 'flex'; // Show the display text element.

  // Check for tie condition where both players have the same health.
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'; // Display 'Tie' message.
  } else if (player.health > enemy.health) { // Player wins if their health is greater.
    document.querySelector('#displayText').innerHTML = 'You Won...'; // Display win message.
    setInterval(() => {
      // Optionally, you could navigate to the next level instead of closing.
      // window.open("../level_3.html"); 
      window.close("index.html"); // Close the current game window after 3 seconds.
    }, 3000); // Wait for 3 seconds before executing.
  } else if (player.health < enemy.health) { // Enemy wins if their health is greater.
    document.querySelector('#displayText').innerHTML = 'You Loose!!! 2 Attempts Left'; // Display loss message.
    setInterval(() => {
      window.open("fighting2/index.html"); // Navigate to a different game level.
      window.close("index.html"); // Close the current game window after 3 seconds.
    }, 3000); // Wait for 3 seconds before executing.
  }
}
