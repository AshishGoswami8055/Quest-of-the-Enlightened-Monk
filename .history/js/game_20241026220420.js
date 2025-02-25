// Selectors for HTML elements
var pauseGame = document.querySelector(".pause_game"); // Element to display when the game is paused
const form_obj = document.querySelector(".game_form"); // Form object for game-related inputs
var game_is_paused = true; // Variable to track if the game is paused

// Variables for game objects and states
const objects = document.querySelector(".objects"); // Container for game objects
const tree_Objs = document.querySelector(".trees"); // Container for tree objects
const scoreElement = document.querySelector(".score"); // Element to display the score
const goldenElement = document.querySelector(".goldenEnergies span"); // Element to display golden energies collected
const healthElement = document.querySelector(".Health"); // Element to display player health
const player = document.querySelector("#player img"); // Select the player image
const sandStorm = document.querySelector(".sand_storm img"); // Image for the sandstorm effect
const ghost = document.querySelector(".ghost img"); // Image for the ghost effect
const shieldImg = document.querySelector(".shield img"); // Image for the shield
const indicator = document.querySelector(".indicator"); // Indicator for game status
const notification = document.querySelector(".notification"); // Element for displaying notifications

// Audio assets
var jumpSound = new Audio("audio/jumpSound.mp3"); // Sound for jumping
var ghostAudio = new Audio("audio/scare.mp3"); // Sound for ghost scare effects

// Game state variables
let score = 0; // Player's score
let golden_Energy = 0; // Amount of golden energy collected
let health = 100; // Player's health
let translateX = 0; // X-axis translation for player movement
let fighting_Game = true; // Flag for fighting game state
let isJumping = false; // Flag for jump state
let invincibility = false; // Flag for invincibility state
const jumpDuration = 1000; // Duration of the jump in milliseconds
const keyState = {}; // Object to track key states (pressed keys)

// Music state management
let music_state = true; // Flag to track music play state

// Function to toggle background music on and off
function toggle_music() {
  if (music_state) {
    audio.pause(); // Pause music if it's currently playing
  } else {
    audio.play(); // Play music if it's currently paused
  }
  music_state = !music_state; // Toggle music state
}

// Function to pause the game
function pause_game() {
  stopTimer(); // Stop the timer when the game is paused
  pauseGame.style.display = "block"; // Show the pause menu
  game_is_paused = true; // Set game state to paused
  isPlayable = false; // Disable gameplay actions
  document.querySelector(".pause_health").textContent = "Health :- " + health; // Display health in pause menu
}

// Function to resume the game
function play_game() {
  startTimer(); // Start the timer when the game resumes
  pauseGame.style.display = "none"; // Hide the pause menu
  game_is_paused = false; // Set game state to unpaused
  isPlayable = true; // Enable gameplay actions
}

// Character type setting
let characterType = "Zen Monk"; // Default character type

// Timer management
const timer = document.getElementById("stopwatch"); // Stopwatch element
var hr = 0; // Hours for the timer
var min = 0; // Minutes for the timer
var sec = 0; // Seconds for the timer
var stoptime = true; // Flag to track timer state

// Function to start the timer
function startTimer() {
  if (stoptime == true) { // Check if the timer is currently stopped
    stoptime = false; // Set timer to running state
    timerCycle(); // Start the timer cycle
  }
}

// Function to stop the timer
function stopTimer() {
  if (stoptime == false) { // Check if the timer is currently running
    stoptime = true; // Set timer to stopped state
  }
}

// Function to manage timer cycling
function timerCycle() {
  if (stoptime == false) { // Only run if the timer is not stopped
    sec = parseInt(sec); // Ensure seconds are an integer
    min = parseInt(min); // Ensure minutes are an integer
    hr = parseInt(hr); // Ensure hours are an integer

    sec++; // Increment seconds

    // Check if seconds exceed 60
    if (sec == 60) {
      min++; // Increment minutes
      sec = 0; // Reset seconds
    }
    // Check if minutes exceed 60
    if (min == 60) {
      hr++; // Increment hours
      min = 0; // Reset minutes
      sec = 0; // Reset seconds
    }

    // Format time for display
    if (sec < 10) {
      sec = "0" + sec; // Add leading zero to seconds if needed
    }
    if (min < 10) {
      min = "0" + min; // Add leading zero to minutes if needed
    }
    if (hr < 10) {
      hr = "0" + hr; // Add leading zero to hours if needed
    }

    timer.innerHTML = hr + " : " + min + " : " + sec; // Update the timer display

    setTimeout("timerCycle()", 1000); // Call timerCycle every second
  }
}

// Function to reset the timer
function resetTimer() {
  timer.innerHTML = "00:00:00"; // Reset timer display
  stoptime = true; // Set timer to stopped state
  hr = 0; // Reset hours
  sec = 0; // Reset seconds
  min = 0; // Reset minutes
}

// Weather sound effects
var rainSound = new Audio("audio/rain.mp3"); // Sound for rain effect
var thunderSound = new Audio("audio/Thunder.mp3"); // Sound for thunder effect

// Function to manage weather effects
function Weather() {
  startThunderstormEffect(); // Start thunderstorm effect
  setTimeout(() => {
    stopWeatherEffects(); // Stop weather effects after a delay
    startRainEffect(); // Start rain effect
  }, 8000); // 8 seconds before rain starts
  setTimeout(() => {
    stopWeatherEffects(); // Stop weather effects after a set time
  }, 25000); // 25 seconds for total weather duration
}

// Function to start rain effect
function startRainEffect() {
  document.body.classList.add("rain"); // Add rain class to body for styling
  rainSound.play(); // Play rain sound
}

// Function to start thunderstorm effect
function startThunderstormEffect() {
  document.body.classList.add("thunderstorm"); // Add thunderstorm class to body for styling
  thunderSound.play(); // Play thunder sound
}

// Function to stop all weather effects
function stopWeatherEffects() {
  rainSound.pause(); // Pause rain sound
  thunderSound.pause(); // Pause thunder sound
  document.body.classList.remove("rain", "thunderstorm"); // Remove weather classes from body
}

// Function to update player image based on action
function updatePlayerImage(action) {
  let characterPath; // Variable to hold the character path

  // Set character path based on character type
  if (characterType == "Zen Monk") {
    characterPath = "images/zen";
  } else if (characterType == "Ranger Monk") {
    characterPath = "images/ranger";
  } else if (characterType == "Warrior Monk") {
    characterPath = "images/male";
  } else {
    characterPath = "images/female"; // Default path for unknown types
  }

  const player = document.querySelector("#player img"); // Re-select player image
  // Switch statement to determine which image to display based on action
  switch (action) {
    case "Idle":
      player.src = `${characterPath}/Idle.gif`; // Set image for idle action
      break;
    case "Run":
      player.src = `${characterPath}/Run.gif`; // Set image for running action
      break;
    case "Jump":
      player.src = `${characterPath}/Jump.gif`; // Set image for jumping action
      break;
    case "Fall":
      player.src = `${characterPath}/Fall.gif`; // Set image for falling action
      break;
    case "Attack":
      player.src = `${characterPath}/attack.gif`; // Set image for attacking action
      break;
    case "Death":
      player.src = `${characterPath}/Death.gif`; // Set image for dying action
      break;
    case "Hit":
      player.src = `${characterPath}/Hit.gif`; // Set image for hit action
      break;
    default:
      console.warn("Unknown action:", action); // Log warning for unknown actions
      player.src = `${characterPath}/idle.gif`; // Default action if unknown
      break;
  }
}

// Updates the player's health display and handles game over conditions.
function updateHealth() {
  healthElement.textContent = `Health : ${health}`; // Update health display
  if (health <= 0) {
    player.src = `images/male/Death.gif`; // Set player's death animation
    document.querySelector(".game_over").style.visibility = "visible"; // Show game over screen
    console.log("Game Over");
    // Reload the game after 3 seconds
    setInterval(() => {
      window.location.reload();
    }, 3000);
  }
}


// ABILITIES OF MONK
function activateMonkAbilities(characterType) {
  switch (characterType) {
    case "Zen Monk":
      zenMonkAbilities();
      break;
    case "Warrior Monk":
      warriorMonkAbilities();
      break;
    case "Ranger Monk":
      rangerMonkAbilities();
      break;
    case "Mystic Monk":
      mysticMonkAbilities();
      break;
    default:
      console.warn("Unknown monk type:", characterType);
      break;
  }
}
let zenMonkHealthInterval = null;

/**
 * Function to activate Zen Monk's healing abilities.
 * Every 5 seconds, the health of the player increases by 10 until it reaches a maximum of 100.
 */
function zenMonkAbilities() {
  console.log("hii"); // Log message indicating the function has been called.
  setInterval(() => {
    if (health < 100) {
      health += 10; // Increase health by 10.
      updateHealth(); // Update the health display.
      if (health > 100) {
        health = 100; // Cap health at 100.
        updateHealth(); // Update the health display again.
      }
    }
  }, 5000); // Set the interval to 5000 milliseconds (5 seconds).
}

/**
* Function to activate Ranger Monk's abilities.
* Logs a message indicating that the Ranger Monk has been activated with enhanced abilities.
*/
function rangerMonkAbilities() {
  console.log("Ranger Monk activated: Increased speed, agility, better trap detection, and evasion.");
}

/**
* Function to activate Warrior Monk's abilities.
* Logs a message indicating that the Warrior Monk has been activated with enhanced attack power and combat moves.
*/
function warriorMonkAbilities() {
  console.log("Warrior Monk activated: Increased attack power, advanced combat moves, higher damage resistance.");
}

/**
* Function to activate Mystic Monk's abilities.
* This monk can manipulate energy and teleport.
*/
function mysticMonkAbilities() {
  console.log("Mystic Monk activated: Energy manipulation, teleportation.");

  // Add the teleportation ability
  document.addEventListener("keyup", (event) => {
    // Check if 'T' key is pressed, player is in playable state, and has enough golden energy
    if (event.key.toLowerCase() === "t" && isPlayable && golden_Energy >= 10) { // 'T' key for teleport
      teleport(); // Call the teleport function.
    }
  });

  /**
   * Function to handle the teleportation effect.
   * Teleports the player a defined distance and updates the player's visual representation.
   */
  function teleport() {
    // Define the distance to teleport
    const teleportDistance = 500;

    // Apply the teleportation effect by changing the transform properties
    translateX -= teleportDistance;
    objects.style.transform = `translateX(${translateX}px)`;
    tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Adjust the position of trees based on the player.

    player.src = `images/female/teleport.gif`; // Change the player's image to the teleportation animation.
    console.log("Teleported!"); // Log message indicating teleportation.
  }
}

/**
* Function to flip the animal images periodically between different states (GIF and still).
*/
function flipAnimal() {
  let wolves = document.querySelectorAll(".wolf img"); // Select all wolf images.
  let bears = document.querySelectorAll(".bear img"); // Select all bear images.

  let isWolfGif = true; // Start with wolf.gif
  let isBearGif = true; // Start with bear.gif

  setInterval(() => {
    let newWolfSrc = isWolfGif ? "images/wolfRight.gif" : "images/wolf.gif"; // Toggle wolf image source.
    let newBearSrc = isBearGif ? "images/bearRight.gif" : "images/bear.gif"; // Toggle bear image source.

    // Update the source for all wolf and bear images
    wolves.forEach((img) => {
      img.src = newWolfSrc;
    });

    bears.forEach((img) => {
      img.src = newBearSrc;
    });

    isWolfGif = !isWolfGif; // Flip the state for the next interval.
    isBearGif = !isBearGif; // Flip the state for the next interval.
  }, 2500); // Toggle every 2.5 seconds.
}

// Initialize functions when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  flipAnimal(); // Start flipping animal images.

  /**
   * Function to update the score displayed in the UI.
   */
  function updateScore() {
    scoreElement.textContent = `Score : ${score}`; // Update the score element with the current score.
  }

  /**
   * Function to update the amount of golden energy and display related notifications.
   */
  function updateGoldenEnergy() {
    if (golden_Energy >= 5) {
      notification.innerHTML = "Congrats! With 5 golden energies, press 'E' to activate the ENERGY Shield."; // Notify the player about shield usage.
      setInterval(() => {
        notification.innerHTML = ""; // Clear notification after 5 seconds.
      }, 5000);
    } else {
      notification.innerHTML = ""; // Clear notification if energy is below 5.
    }
    goldenElement.textContent = `${golden_Energy}`; // Update golden energy display.
  }

  let sandstormDamageInterval; // Variable to store interval for sandstorm damage.

  /**
  * Function to check the proximity of the player to the sandstorm and apply damage if close enough.
  */
  function checkSandStormProximity() {
    const playerBounds = player.getBoundingClientRect();
    const sandStormBounds = sandStorm.getBoundingClientRect();
    const ghostBounds = ghost.getBoundingClientRect();

    // Calculate the center positions of player and sandstorm
    const playerCenterX = playerBounds.left + playerBounds.width / 2;
    const playerCenterY = playerBounds.top + playerBounds.height / 2;
    const sandStormCenterX = sandStormBounds.left + sandStormBounds.width / 2;
    const sandStormCenterY = sandStormBounds.top + sandStormBounds.height / 2;
    const ghostCenterX = ghostBounds.left + ghostBounds.width / 2;
    const ghostCenterY = ghostBounds.top + ghostBounds.height / 2;

    // Calculate the distance between the centers
    const distance = Math.sqrt(
      Math.pow(playerCenterX - sandStormCenterX, 2) +
      Math.pow(playerCenterY - sandStormCenterY, 2)
    );

    const distance_ghost = Math.sqrt(
      Math.pow(playerCenterX - ghostCenterX, 2) +
      Math.pow(playerCenterY - ghostCenterY, 2)
    );

    if (distance <= 800) {
      // Adjust the range as needed

      // Apply damage when in range
      if (!sandstormDamageInterval) {
        sandstormDamageInterval = setInterval(() => {
          health -= 5;
          updatePlayerImage("Hit")
          updateHealth();
          if (health <= 0) {
            clearInterval(sandstormDamageInterval);
            // Handle game over scenario
          }
        }, 1000); // Apply damage every second
      }
    } else {
      clearInterval(sandstormDamageInterval);
      sandstormDamageInterval = null;
    }

    if (distance_ghost <= 300) {
      ghostAudio.play();
      ghost.classList.add("active");
      // console.log("Ghost attack");
    } else {
      ghost.classList.remove("active");
      // console.log("Ghost See it");
    }
  }

  /**
  * Function to handle key down events.
  * Updates the player's actions based on the key pressed.
  * @param {Event} event - The key down event.
  */
  function handleKeydown(event) {
    keyState[event.key.toLowerCase()] = true; // Set key state to true when key is pressed
    if (
      !isJumping &&
      (keyState["w"] || (keyState["W"] && isPlayable == true))
    ) {
      // jumpSound.play();

      console.log("Jump initiated"); // Debug message
      jumpSound.play();

      isJumping = true;
      updatePlayerImage("Jump");
      player.classList.add("jump");
      shieldImg.classList.add("jump");
      setTimeout(() => {
        updatePlayerImage("Fall");
      }, 300);

      setTimeout(() => {
        updatePlayerImage("Idle");
        player.classList.remove("jump");
        shieldImg.classList.remove("jump");
        isJumping = false;
      }, jumpDuration);
    }
    if (event.key.toLowerCase() === "v" && isPlayable == true) {
      updatePlayerImage("Attack1");
      setTimeout(() => {
        updatePlayerImage("Idle");
      }, 600);
      handleAnimalRemoval();
      handleSpikesRemoval();
      handleTreeRemoval();
    }
    if (event.key.toLowerCase() === "e" && isPlayable == true) {
      if (golden_Energy >= 5) {
        golden_Energy = golden_Energy - 5;
        updateGoldenEnergy();
        shieldImg.classList.add("show");
        invincibility = true;
        setTimeout(() => {
          shieldImg.classList.remove("show");
          invincibility = false;
        }, 7000);
      }

      handleAnimalRemoval();
      handleSpikesRemoval();
    }
  }

  function handleKeyup(event) {
    keyState[event.key.toLowerCase()] = false; // Set key state to false when key is released
  }
  let isHit = false;
  function update() {
    if (characterType === "Ranger Monk") {
      if (keyState["d"] && isPlayable == true) {
        if (!isJumping) updatePlayerImage("Run");
        translateX -= 15;
        objects.style.transform = `translateX(${translateX}px)`;
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      } else if (keyState["a"] && isPlayable == true) {
        if (!isJumping) updatePlayerImage("Run");
        translateX += 10;
        objects.style.transform = `translateX(${translateX}px)`;
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      } else if (!isJumping) {
      }
    }
    else {
      if (keyState["d"] && isPlayable) {
        if (!isJumping) updatePlayerImage("Run");
        translateX -= 10;
        objects.style.transform = `translateX(${translateX}px)`;
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      } else if (keyState["a"] && isPlayable) {
        if (!isJumping) updatePlayerImage("Run");
        translateX += 10;
        objects.style.transform = `translateX(${translateX}px)`;
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      } else if (!isJumping) {
        updatePlayerImage("Idle");
      }
    }
    handleCollision();
    handleIndicator();
    checkSandStormProximity();
    requestAnimationFrame(update);
  }

  let lastGhostDamageTime = 0; // Tracks the last time the ghost dealt damage
  const ghostDamageCooldown = 1000;

  function handleCollision() {
    const ghostObj = document.querySelector(".ghost img"); // Select ghost image element
    const currentTime = Date.now(); // Get the current timestamp

    // Check collision with the ghost
    if (
      checkCollision(player, ghostObj) && // Check if player collides with ghost
      invincibility == false && // Ensure player is not invincible
      currentTime - lastGhostDamageTime >= ghostDamageCooldown // Ensure cooldown period has passed
    ) {
      health -= (characterType === "Warrior Monk" ? 3 : 5); // Decrease health based on character type
      updatePlayerImage("Hit"); // Update player's image to "Hit"
      updateHealth(); // Update health display
      ghostAudio.play(); // Play ghost sound upon collision
      lastGhostDamageTime = currentTime; // Update the last damage time
      if (health <= 0) {
        console.log("Game Over"); // Log game over if health reaches zero
      }
    }

    const energies = document.querySelectorAll(".energy"); // Select all energy elements
    energies.forEach((energy) => {
      // Check collision with energy elements
      if (
        checkCollision(player, energy.querySelector("img")) && // Check if player collides with energy
        !energy.classList.contains("fade-out") // Ensure energy is not fading out
      ) {
        golden_Energy++; // Increment golden energy count
        updateGoldenEnergy(); // Update the golden energy display
        score += 10; // Increase score by 10
        updateScore(); // Update score display
        fadeOutAndRemove(energy); // Fade out and remove the energy element
      }
    });

    const harmfulObjects = document.querySelectorAll(".wolf, .bear, .spike, .chopped-tree"); // Select harmful objects
    harmfulObjects.forEach((obj) => {
      // Check collision with harmful objects
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") && // Ensure object is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        health -= (characterType === "Warrior Monk" ? 7 : 10); // Decrease health based on character type
        updatePlayerImage("Hit"); // Update player's image to "Hit"
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the harmful object
      }
    });

    const river = document.querySelectorAll(".river"); // Select river elements
    river.forEach((obj) => {
      // Check collision with river elements
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") && // Ensure river is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        health -= (characterType === "Warrior Monk" ? 10 : 15); // Decrease health based on character type
        updatePlayerImage("Hit"); // Update player's image to "Hit"
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the river element
      }
    });

    // Check for collision with sandstorm objects
    const sandStormObj = document.querySelectorAll(".sand_storm");
    sandStormObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") && // Ensure object is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
      }
    });

    // Check for collision with Golem objects
    const GolemObj = document.querySelectorAll(".golem");
    GolemObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") && // Ensure object is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        updatePlayerImage("Hit"); // Update player's image to "Hit"
        health -= (characterType === "Warrior Monk" ? 20 : 30); // Decrease health based on character type
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the Golem object
      }
    });

    // Check for collision with health objects
    const healthObj = document.querySelectorAll(".first-aid, .t-first-aid");
    healthObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") && // Ensure object is not fading out
        health < 100 // Ensure health is below maximum
      ) {
        health = 100; // Restore health to maximum
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the health object
      }
    });

    // Check for collision with hermit objects
    const hermitObj2 = document.querySelectorAll(".hermit");
    hermitObj2.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") // Ensure object is not fading out
      ) {
        // Uncomment and implement health restoration logic as needed
        // health = 100; 
        // updateHealth();
        // isPlayable = false; // Disable gameplay
        document.querySelector(".container").style.visibility = "visible"; // Show hermit popup
      }
    });

    const hermitObj1 = document.querySelectorAll(".hermit1");
    hermitObj1.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check if player collides
        !obj.classList.contains("fade-out") // Ensure object is not fading out
      ) {
        // Uncomment and implement health restoration logic as needed
        // health = 100; 
        // updateHealth();
        // isPlayable = false; // Disable gameplay
        document.querySelector(".container1").style.visibility = "visible"; // Show hermit1 popup
      }

      // Check for collision with snowman1 objects
      const snowMan1 = document.querySelectorAll('.snowman1');
      snowMan1.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
          setInterval(() => {
            document.querySelector(".snowman1_ans").style.visibility = "hidden"; // Hide snowman1 answer after 3 seconds
          }, 3000);
          document.querySelector(".snowman1_ans").style.visibility = "visible"; // Show snowman1 answer
          fadeOutAndRemove(obj); // Fade out and remove snowman1 object
        }
      });

      // Check for collision with snowman2 objects
      const snowMan2 = document.querySelectorAll('.snowman2');
      snowMan2.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
          setInterval(() => {
            document.querySelector(".snowman2_ans").style.visibility = "hidden"; // Hide snowman2 answer after 3 seconds
          }, 3000);
          document.querySelector(".snowman2_ans").style.visibility = "visible"; // Show snowman2 answer
          fadeOutAndRemove(obj); // Fade out and remove snowman2 object
        }
      });

        // Check for collision with snowman6 objects
        const snowMan6 = document.querySelectorAll('.snowman6');
        snowMan6.forEach(obj => {
          if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
            setInterval(() => {
              document.querySelector(".snowman6_ans").style.visibility = "hidden"; // Hide snowman2 answer after 3 seconds
            }, 3000);
            document.querySelector(".snowman6_ans").style.visibility = "visible"; // Show snowman2 answer
            fadeOutAndRemove(obj); // Fade out and remove snowman2 object
          }
        });

              // Check for collision with snowman6 objects
        const snowMan7 = document.querySelectorAll('.snowman7');
        snowMan7.forEach(obj => {
          if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
            setInterval(() => {
              document.querySelector(".snowman7_ans").style.visibility = "hidden"; // Hide snowman2 answer after 3 seconds
            }, 12000);
            document.querySelector(".snowman7_ans").style.visibility = "visible"; // Show snowman2 answer
            fadeOutAndRemove(obj); // Fade out and remove snowman2 object
          }
        });

      
              // Check for collision with snowman6 objects
              const snowMan8 = document.querySelectorAll('.snowman8');
              snowMan8.forEach(obj => {
                if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
                  setInterval(() => {
                    document.querySelector(".snowman8_ans").style.visibility = "hidden"; // Hide snowman2 answer after 3 seconds
                  }, 3000);
                  document.querySelector(".snowman8_ans").style.visibility = "visible"; // Show snowman2 answer
                  fadeOutAndRemove(obj); // Fade out and remove snowman2 object
                }
              });

      // Check for collision with black rock objects
      const blackRock = document.querySelectorAll('.black_rock');
      blackRock.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
          if (fighting_Game == true) {
            isPlayable = false; // Disable gameplay
            fadeOutAndRemove(obj); // Fade out and remove black rock object
            window.open("fighting/html/index.html"); // Open fighting game
            setTimeout(function () {
              isPlayable = true; // Re-enable gameplay after 3 seconds
            }, 3000);
          }
        }
      });

      // Check for collision with meditation objects
      const meditationObjects = document.querySelectorAll('.meditation');
      meditationObjects.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img'))) {
          // Open meditation image or handle it accordingly
          window.open("meditation.html");
          // Make the collided object (png) disappear
          obj.style.display = 'none';
          setTimeout(function () {
            isPlayable = true; // Re-enable gameplay after 3 seconds
          }, 6000);
        }
      });

      // Check for collision with puzzle objects 
      const puzzleObjects = document.querySelectorAll('.puzzle');
      puzzleObjects.forEach(obj => {
        if (checkCollision(player, obj)) { // Checking collision with the entire object
          // Open puzzle page in a new tab/window
          window.open("puzzle.html"); // Open the puzzle page in a new window

          // Make the collided object (png) disappear
          obj.style.display = 'none';

          // Optionally re-enable gameplay after 6 seconds
          setTimeout(function () {
            isPlayable = true; // Re-enable gameplay after 6 seconds
          }, 6000);
        }
      });
      // Check for collision with sunflower objects
    // Check for collision with sunflower objects
    const sunflowers = document.querySelectorAll(".sunflower");
    sunflowers.forEach((sunflower) => {
      // Only disable gameplay for Tic Tac Toe when the player is not moving
      if (checkCollision(player, sunflower) && isPlayable) {
        document.querySelector(".ticTacToe").style.visibility = "visible"; 
        console.log("Collision with sunflower detected");
        isPlayable = false; // Disable gameplay when Tic Tac Toe is active
        
      }
    });


      // Check for collision with snowman5 objects
      const snowMan5 = document.querySelectorAll('.snowman5');
      snowMan5.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
          document.querySelector(".snowman_final").style.visibility = "visible"; // Show final snowman popup
          isPlayable = false; // Disable gameplay
          initializeQuiz(); // Initialize quiz related to snowman5
          fadeOutAndRemove(obj); // Fade out and remove snowman5 object
        }
      });
    });

  }

  // Fade Out and Remove Function
  function fadeOutAndRemove(element) {
    // Add a CSS class to trigger a fade-out animation
    element.classList.add("fade-out");
    setTimeout(() => {
      element.remove(); // Remove the element from the DOM after fading out
    }, 500); // Duration before removing the element
  }

  // Main game loop
  function gameLoop() {
    // Check if the game is currently playable
    if (isPlayable) {
      handleMovement(); // Handle player movement logic
      handleCollision(); // Check for collisions with game elements
    }
    requestAnimationFrame(gameLoop); // Continue the game loop
  }

  // Handle player movement logic
  function handleMovement() {
    // Logic for moving the player character
    if (keys['ArrowRight']) {
      player.style.left = `${player.offsetLeft + 5}px`; // Move the player to the right
    }
    // Add other movement controls as needed
  }

  // Start the game loop
  gameLoop();

  // Handle animal indicators based on proximity to the player
  function handleIndicator() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select animal elements
    const animal_indicators = document.querySelector(".animal_indicator");
    let nearby = false; // Flag to track if any animals are nearby

    // Check for collisions with nearby animals
    animals.forEach((animal) => {
      if (checkCollision(player, animal.querySelector("img"), 50)) {
        nearby = true; // Set flag if a collision is detected
      }
    });

    // Show or hide the animal indicator based on proximity
    indicator.style.display = nearby ? "block" : "none";
    animal_indicators.style.display = nearby ? "block" : "none";
  }

  // Handle the removal of animals when collided with the player
  function handleAnimalRemoval() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select animal elements
    animals.forEach((animal) => {
      // Check for collisions with the player
      if (
        checkCollision(player, animal.querySelector("img"), 50) &&
        !animal.classList.contains("fade-out") // Ensure animal is not already fading out
      ) {
        fadeOutAndRemove(animal); // Trigger fade out and remove the animal
        score += 50; // Increase the score
        updateScore(); // Update the displayed score
      }
    });
  }

  // Handle the removal of spikes when collided with the player
  function handleSpikesRemoval() {
    const spikes = document.querySelectorAll(".spike"); // Select spike elements
    spikes.forEach((spike) => {
      // Check for collisions with the player
      if (
        checkCollision(player, spike.querySelector("img"), 50) &&
        !spike.classList.contains("fade-out") // Ensure spike is not already fading out
      ) {
        fadeOutAndRemove(spike); // Trigger fade out and remove the spike
      }
    });
  }

  // Handle the removal of chopped trees when collided with the player
  function handleTreeRemoval() {
    const chopped_tree = document.querySelectorAll(".chopped-tree"); // Select chopped tree elements
    chopped_tree.forEach((tree) => {
      // Check for collisions with the player
      if (
        checkCollision(player, tree.querySelector("img"), 50) &&
        !tree.classList.contains("fade-out") // Ensure tree is not already fading out
      ) {
        score += 10; // Increase the score
        updateScore(); // Update the displayed score
        fadeOutAndRemove(tree); // Trigger fade out and remove the tree
      }
    });
  }

  // Fade out an element and then remove it
  function fadeOutAndRemove(element) {
    element.classList.add("fade-out"); // Add a class to trigger CSS fade-out
    setTimeout(() => {
      element.style.opacity = "0"; // Set opacity to 0 for fading effect
    }, 500); // Match the timeout duration with the CSS transition duration
  }

  // Check for collision between two elements
  function checkCollision(rect1, rect2, range = 0) {
    // Get the bounding rectangles of both elements
    const rect1Bounds = rect1.getBoundingClientRect();
    const rect2Bounds = rect2.getBoundingClientRect();

    // Check if the rectangles overlap, considering the specified range
    return !(
      rect1Bounds.top > rect2Bounds.bottom + range ||
      rect1Bounds.bottom < rect2Bounds.top - range ||
      rect1Bounds.right < rect2Bounds.left - range ||
      rect1Bounds.left > rect2Bounds.right + range
    );
  }

  // Add event listeners for keydown and keyup events
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  // Initial score and health updates
  updateScore();
  updateHealth();
  update();

// QUIZ GAME 
const quizData = [
  {
    question: "Who are you truly beyond the body and mind?",
    options: [
      "I am the body",
      "I am the emotions",
      "I am the thoughts",
      "I am the soul"
    ],
    correct: "I am the soul"
  },
  {
    question: "What is the mind described as in relation to the soul?",
    options: [
      "The core of the self",
      "An instrument of the soul",
      "The source of all thoughts",
      "Separate from the self"
    ],
    correct: "An instrument of the soul"
  },
  {
    question: "What does 'I Am one with all' signify in spiritual practice?",
    options: [
      "Unity with all creation",
      "Isolation from the material world",
      "Independence from others",
      "The pursuit of personal success"
    ],
    correct: "Unity with all creation"
  },
  {
    question: "How is the soul's connection to the Divine Spark described?",
    options: [
      "The Divine Spark is separate from the soul",
      "The soul is one with the Divine Spark",
      "The Divine Spark is limited to the brain",
      "The soul is isolated from higher truths"
    ],
    correct: "The soul is one with the Divine Spark"
  },love
  {
    question: "How many bells were there in the meditation?",
    options: [
      "20-30",
      "40-50",
      "60-70",
      "80-90"
    ],
    correct: "40-50"
  },
  {
    question: "I am a practice of stillness, I calm the restless mind and guide it within. What am I?",
    options: [
      "Breathing",
      "Meditation",
      "Exercise",
      "Silence"
    ],
    correct: "Meditation"
  },
  {
    question: "I am the shadow of self, a mask that hides the true spirit. When inflated, I lead to suffering. What am I?",
    options: [
      "Pride",
      "Ambition",
      "Ego",
      "Desire"
    ],
    correct: "Ego"
  },
  {
    question: "I am the law of cause and effect, weaving through lives, connecting actions with consequences. What am I?",
    options: [
      "Karma",
      "Destiny",
      "Fortune",
      "Wisdom"
    ],
    correct: "Karma"
  }
];


  let currentQuestionIndex = 0; // Index of the current question
  let score1 = 0; // Player's score for the quiz
  let timerInterval; // Timer interval reference
  const userAnswers = []; // Array to store user answers

  // Select elements for displaying quiz data
  const questionNumberElement = document.getElementById("question-number");
  const questionTextElement = document.getElementById("question-text");
  const optionsContainer = document.querySelector(".options");
  const nextButton = document.getElementById("next-button");
  const timerElement = document.getElementById("timer");
  const scoreElement1 = document.getElementById("score");
  const progressBar = document.getElementById("progress-bar");
  const scoreboardContainer = document.getElementById("scoreboard-container");
  const scoreboardBody = document.querySelector("#scoreboard tbody");
  const restartButton = document.getElementById("restart-button");

  // Function to save progress to localStorage
  function saveProgress() {
    localStorage.setItem(
      "quizProgress",
      JSON.stringify({
        currentQuestionIndex, // Save the index of the current question
        score1, // Save the current score
        userAnswers // Save the user's answers
      })
    );
  }


  // Function to retrieve progress from localStorage
  function retrieveProgress() {
    // Retrieve saved progress data from localStorage
    const savedProgress = localStorage.getItem("quizProgress");

    if (savedProgress) {
      // Parse the saved progress JSON string to extract values
      const {
        currentQuestionIndex: savedIndex, // Index of the current question
        score1: savedScore,                // User's current score
        userAnswers: savedAnswers           // Array of user's answers
      } = JSON.parse(savedProgress);

      // Check if the saved index is less than the total number of questions
      if (savedIndex < quizData.length) {
        currentQuestionIndex = savedIndex; // Update current question index
        score1 = savedScore;               // Update the score
        userAnswers.push(...savedAnswers);  // Add saved answers to user answers array
        loadQuestion();                     // Load the current question
      } else {
        displayResults();                   // Display results if no more questions
      }
    } else {
      // If no saved progress is found, you could initialize the quiz
      // initializeQuiz();
    }
  }

  // Function to shuffle the elements of an array in place
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Generate a random index
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array; // Return the shuffled array
  }

  // Function to initialize the quiz by shuffling questions and loading the first one
  function initializeQuiz() {
    shuffleArray(quizData); // Shuffle the questions
    loadQuestion();          // Load the first question
  }

  // Function to load the current question and its options into the UI
  function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex]; // Get the current question
    questionNumberElement.textContent = `${currentQuestionIndex + 1}/${quizData.length}`; // Update question number display
    questionTextElement.textContent = currentQuestion.question; // Display the question text

    optionsContainer.innerHTML = ""; // Clear existing options
    // Shuffle options and create UI elements for each option
    const shuffledOptions = shuffleArray([...currentQuestion.options]);
    shuffledOptions.forEach((option) => {
      const label = document.createElement("label"); // Create label for the option
      const input = document.createElement("input"); // Create radio input for the option
      input.type = "radio";
      input.name = "answer"; // Name should be the same for grouped radio buttons
      input.value = option;  // Set the value to the option text

      const span = document.createElement("span"); // Create a span for option text
      span.textContent = option; // Set the span text to the option

      label.appendChild(input);  // Append input to label
      label.appendChild(span);    // Append span to label
      optionsContainer.appendChild(label); // Append label to options container
    });

    updateProgressBar(); // Update the progress bar
    resetTimer();        // Reset the timer for the new question
  }

  // Function to update the progress bar based on the current question index
  function updateProgressBar() {
    const progress = (currentQuestionIndex / quizData.length) * 100; // Calculate progress percentage
    progressBar.style.width = `${progress}%`; // Set the progress bar width
  }

  // Function to reset and start the quiz timer
  function resetTimer() {
    clearInterval(timerInterval); // Clear any existing timer intervals
    let timeLeft = 30;            // Set initial time to 30 seconds
    timerElement.textContent = timeLeft; // Display the initial time

    // Set up a timer interval to count down
    timerInterval = setInterval(() => {
      timeLeft--; // Decrement time left
      timerElement.textContent = timeLeft; // Update displayed time

      // Change timer color when time is low
      if (timeLeft <= 10) {
        timerElement.style.color = "#e74c3c"; // Change text color to red
      }

      // Additional visual cues can be added here (e.g., animations)

      // If time runs out, handle the next button click automatically
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Clear the timer interval
        handleNextButtonClick(); // Move to the next question or end the quiz
      }
    }, 1000); // Timer interval set to 1 second
  }

  // Function to handle the next button click, progressing through the quiz
  function handleNextButtonClick() {
    // Check if an answer is selected
    const selectedOption = document.querySelector('input[name="answer"]:checked');

    if (selectedOption) {
      // If an option is selected, push the user's answer details into the userAnswers array
      userAnswers.push({
        question: quizData[currentQuestionIndex].question, // Current question
        yourAnswer: selectedOption.value,                  // User's selected answer
        correctAnswer: quizData[currentQuestionIndex].correct // Correct answer
      });

      // Increment score if the selected answer is correct
      if (selectedOption.value === quizData[currentQuestionIndex].correct) {
        score1++;
        scoreElement1.textContent = `Score: ${score1}`; // Update displayed score
      }
    } else {
      // If no option is selected, log that no answer was selected
      userAnswers.push({
        question: quizData[currentQuestionIndex].question, // Current question
        yourAnswer: "No answer selected", // Log no answer selected
        correctAnswer: quizData[currentQuestionIndex].correct // Correct answer
      });
    }

    currentQuestionIndex++; // Move to the next question
    // Check if there are more questions to display
    if (currentQuestionIndex < quizData.length) {
      saveProgress(); // Save progress before loading the next question
      loadQuestion(); // Load the next question
    } else {
      saveProgress(); // Save progress before displaying results
      displayResults(); // Display results when all questions are answered
    }

    // Reset radio button selections for the next question
    document
      .querySelectorAll('input[name="answer"]')
      .forEach((input) => (input.checked = false)); // Uncheck all radio buttons
  }

  // Function to display the results after the quiz is completed
  function displayResults() {
    clearInterval(timerInterval); // Stops the timer for the quiz
    questionNumberElement.textContent = "Quiz Completed"; // Updates the UI to indicate the quiz is over
    // Displays the user's score compared to the total number of questions
    document.querySelector(".score_display").textContent = `Your score is ${score1}/${quizData.length}`;

    optionsContainer.innerHTML = ""; // Clears the options container
    nextButton.style.display = "none"; // Hides the next button
    scoreboardContainer.style.display = "block"; // Shows the scoreboard container
    renderScoreboard(); // Calls renderScoreboard to display the user's answers and correct ones
    localStorage.removeItem("quizProgress"); // Clears any saved quiz progress from local storage
  }

  // Function to render the scoreboard with the user's answers
  function renderScoreboard() {
    scoreboardBody.innerHTML = ""; // Clears any existing content in the scoreboard body
    userAnswers.forEach((answer, index) => {
      const row = document.createElement("tr"); // Creates a new row for each question
      const questionCell = document.createElement("td"); // Cell for the question text
      const yourAnswerCell = document.createElement("td"); // Cell for the user's answer
      const correctAnswerCell = document.createElement("td"); // Cell for the correct answer

      // Sets the content for each cell
      questionCell.textContent = `Q${index + 1}: ${answer.question}`;
      yourAnswerCell.textContent = answer.yourAnswer;
      correctAnswerCell.textContent = answer.correctAnswer;

      // Appends the cells to the row and the row to the scoreboard body
      row.appendChild(questionCell);
      row.appendChild(yourAnswerCell);
      row.appendChild(correctAnswerCell);
      scoreboardBody.appendChild(row);
    });
  }

  // Function to restart the quiz and save relevant data to local storage
  function restartQuiz() {
    // Saves the current health, score, energies, and timer values to local storage
    localStorage.setItem("Health_1", health);
    localStorage.setItem("Score_1", score);
    localStorage.setItem("Energies_1", golden_Energy);
    localStorage.setItem("Min_1", min);
    localStorage.setItem("Sec_1", sec);

    // Opens the next level and closes the current quiz page
    window.open('level2.html');
    window.close('index.html');
  }

  // Event listener for the next button to handle quiz progression
  nextButton.addEventListener("click", handleNextButtonClick);
  // Event listener for the restart button to reset the quiz
  restartButton.addEventListener("click", restartQuiz);

  // Retrieves any previously saved progress when the page loads
  retrieveProgress();

});


// memory game -------------------------------------------------------- 
// Immediately Invoked Function Expression (IIFE) to create a private scope for the memory game logic
(function (d, w) {
  // Array to hold the card identifiers used in the game
  let cards = [];
  // Counter for the total number of matched card pairs
  let matches = 0;
  // Array to keep track of the currently flipped cards for matching
  const flipped_cards = [];

  // Mapping of card names to their corresponding image files for display
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Function to build the game board and populate it with card elements
  const build_board = () => {
    const board = d.querySelector(".board1"); // Selects the game board element using a class selector
    cards = get_cards(); // Calls get_cards() to retrieve a shuffled array of cards
    // Maps each card in the cards array to a list item and assigns an ID for tracking
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`; // Create a list item for each card with a data attribute for its ID
      })
      .join(""); // Joins the array of list items into a single HTML string

    board.innerHTML = card_items; // Sets the inner HTML of the board to the generated card items
    board.addEventListener("click", flip_card); // Adds an event listener to the board to handle card flips
  };

  // Function to handle the flipping of a card when clicked
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Retrieves the card element that was clicked
    // Checks if the clicked card is valid and not already matched or flipped
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return; // Exits if the card is invalid or already revealed
    if (flipped_cards.length == 2) return; // Exits if two cards are already flipped

    // Sets the background image of the card based on its corresponding name from imageMapping
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`; // Updates the card's appearance to show the image
    card.classList.add("is-flipped"); // Adds the 'is-flipped' class to indicate the card is currently flipped

    // Pushes the flipped card and its name into the flipped_cards array for comparison
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // If two cards are flipped, calls the check_match function to determine if they match
    if (flipped_cards.length == 2) {
      check_match(); // Calls check_match() to evaluate the flipped cards
    }
  };

  // Function to check if the two flipped cards match
  const check_match = () => {
    // Compare the names of the two flipped cards
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // If they match, add the 'is-match' class to both cards
      // and remove the 'is-flipped' class
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      // Increment the matches count by 2 for the two matched cards
      matches += 2;

      // Clear the flipped_cards array
      flipped_cards.length = 0;

      // Check if the game is over (all matches found)
      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container1").addClass("hidden"); // Hide the current container
        document.querySelector(".container1").style.visibility = "hidden"; // Set visibility to hidden
        // build_board(); // Uncomment to reset the board for the next game
      }
    } else {
      // If the cards do not match, wait 800 milliseconds and flip them back
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove the flipped class
        });
        // Clear the flipped_cards array
        flipped_cards.length = 0;
      }, 800);
    }
  };

  // Function to shuffle the cards randomly
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to keep track of already used random numbers
    const total = stack.length; // Total number of cards in the stack
    let i = 0; // Index for looping through the stack

    // Shuffle cards until all cards are added to shuffled
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random number
      // Ensure the number hasn't been used before
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card at the random index to shuffled
        random_numbers.push(number); // Mark this number as used
        i++; // Increment index
      }
    }

    return shuffled; // Return the shuffled array of cards
  };

  // Function to check if the game is over (all matches found)
  const game_over = () => {
    // Check if the total number of matches equals the number of cards
    if (matches === cards.length) {
      matches = 0; // Reset matches for a new game
      return true; // Return true to indicate game over
    }
    return false; // Return false if the game is not over
  };

  // Function to get a shuffled array of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Define card types

    const full_stack = stack.concat(stack); // Duplicate the stack to have pairs

    return shuffle_cards(full_stack); // Return a shuffled array of the full stack
  };

  // Initialize the game board
  build_board();
})(document, window);


