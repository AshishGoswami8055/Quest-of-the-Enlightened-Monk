// Select elements for game controls and UI
var pauseGame = document.querySelector(".pause_game");
const form_obj = document.querySelector(".game_form");
var game_is_paused = true; // Variable to track if the game is paused

let playSound = 0; // Variable to track sound playing state

// Select game objects and UI elements
const objects = document.querySelector(".objects");
const tree_Objs = document.querySelector(".trees");
const scoreElement = document.querySelector(".score");
const goldenElement = document.querySelector(".goldenEnergies span");
const healthElement = document.querySelector(".Health");
const player = document.querySelector("#player img"); // Select the player image
const sandStorm = document.querySelector(".sand_storm img");
const ghost = document.querySelector(".ghost img");
const shieldImg = document.querySelector(".shield img");
const indicator = document.querySelector(".indicator");
const notification = document.querySelector(".notification");

// Audio files for sound effects
var jumpSound = new Audio("audio/jumpSound.mp3");
var ghostAudio = new Audio("audio/scare.mp3");

// Game state variables
let score = 0; // Player's score
let golden_Energy = 0; // Amount of golden energy collected
let health = 100; // Player's health
let translateX = 0; // Horizontal translation value (for animations, movements)
let fighting_Game = true; // Flag to check if in a fighting game state
let isJumping = false; // Flag to check if the player is currently jumping
let invincibility = false; // Flag to track if the player is invincible
const jumpDuration = 1000; // Duration of the jump in milliseconds
const keyState = {}; // Object to track key states

let music_state = true; // Variable to track the state of background music

// Function to toggle background music on and off
function toggle_music() {
  if (music_state) {
    audio.pause(); // Pause the music if it's currently playing
  } else {
    audio.play(); // Play the music if it's currently paused
  }
  music_state = !music_state; // Toggle the music state
}

// Function to pause the game
function pause_game() {
  stopTimer(); // Stop the game timer
  pauseGame.style.display = "block"; // Show the pause menu
  game_is_paused = true; // Set the game state to paused
  isPlayable = false; // Disable gameplay actions
  document.querySelector(".pause_health").textContent = "Health :- " + health; // Display current health in the pause menu
}

// Function to resume playing the game
function play_game() {
  activateMonkAbilities(characterType); // Activate character-specific abilities
  document.body.classList.add("weather"); // Add weather class to body for effects
  startTimer(); // Start the game timer
  isPlayable = true; // Enable gameplay actions

  // Check if background music should be played
  if (playSound == 0) {
    audio.play(); // Play background audio
    audio.addEventListener("ended", function () {
      audio.currentTime = 0; // Reset the audio to the start
      audio.play(); // Replay the audio
    });
    playSound++; // Increment playSound to prevent replaying
  }

  // Hide the pause menu and update game state
  pauseGame.style.display = "none";
  game_is_paused = false; // Set the game state to active
}

// Retrieve the player's character type from local storage
let characterType = localStorage.getItem("character_gender"); // Default gender

// Timer variables
const timer = document.getElementById("stopwatch"); // Select the timer element
var hr = 0; // Hours
var min = 0; // Minutes
var sec = 0; // Seconds
var stoptime = true; // Variable to control timer state

// Function to start the timer
function startTimer() {
  if (stoptime == true) { // Check if timer is stopped
    stoptime = false; // Set to running
    timerCycle(); // Begin the timer cycle
  }
}

// Function to stop the timer
function stopTimer() {
  if (stoptime == false) { // If timer is running
    stoptime = true; // Set to stopped
  }
}

// Function to handle the timer cycle
function timerCycle() {
  if (stoptime == false) { // If timer is running
    sec = parseInt(sec); // Convert seconds to integer
    min = parseInt(min); // Convert minutes to integer
    hr = parseInt(hr); // Convert hours to integer

    sec = sec + 1; // Increment seconds

    // Handle minute overflow
    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }

    // Handle hour overflow
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    // Add leading zeros for display
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }

    // Trigger weather effects based on timer
    if (min == 0 && sec == 44) {
      Weather();
    }
    if (min == 1 && sec == 36) {
      Weather();
    }

    // Update timer display
    timer.innerHTML = hr + " : " + min + " : " + sec;

    // Call timerCycle every second
    setTimeout(timerCycle, 1000);
  }
}

// Function to reset the timer
function resetTimer() {
  timer.innerHTML = "00:00:00"; // Reset timer display
  stoptime = true; // Set timer to stopped
  hr = 0; // Reset hours
  sec = 0; // Reset seconds
  min = 0; // Reset minutes
}

// Weather management
var rainSound = new Audio("audio/rain.mp3"); // Audio for rain sound
var thunderSound = new Audio("audio/Thunder.mp3"); // Audio for thunder sound

// Function to manage weather effects
function Weather() {
  startThunderstormEffect(); // Start thunderstorm effect
  setTimeout(() => {
    stopWeatherEffects(); // Stop thunderstorm after 8 seconds
    startRainEffect(); // Start rain effect
  }, 8000);
  setTimeout(() => {
    stopWeatherEffects(); // Stop all weather effects after 25 seconds
  }, 25000);
}

// Function to start rain effect
function startRainEffect() {
  document.body.classList.add("rain"); // Add rain class to body
  rainSound.play(); // Play rain sound
}

// Function to start thunderstorm effect
function startThunderstormEffect() {
  document.body.classList.add("thunderstorm"); // Add thunderstorm class to body
  thunderSound.play(); // Play thunder sound
}

// Function to stop all weather effects
function stopWeatherEffects() {
  rainSound.pause(); // Pause rain sound
  thunderSound.pause(); // Pause thunder sound
  document.body.classList.remove("rain", "thunderstorm"); // Remove weather classes from body
}

// Function to update player image
function updatePlayerImage(action) {
  let characterPath;

  if (characterType == "Zen Monk") {
    characterPath = "images/zen";
  } else if (characterType == "Ranger Monk") {
    characterPath = "images/ranger";
  } else if (characterType == "Warrior Monk") {
    characterPath = "images/male";
  } else {
    characterPath = "images/female";
  }

  const player = document.querySelector("#player img");
  switch (action) {
    case "Idle":
      player.src = `${characterPath}/Idle.gif`;
      break;
    case "Run":
      player.src = `${characterPath}/Run.gif`;
      break;
    case "Jump":
      player.src = `${characterPath}/Jump.gif`;
      break;
    case "Fall":
      player.src = `${characterPath}/Fall.gif`;
      break;
    case "Attack":
      player.src = `${characterPath}/attack.gif`;
      break;
    case "Death":
      player.src = `${characterPath}/Death.gif`;
      break;
    default:
      console.warn("Unknown action:", action);
      // Optionally, you can set a default image or handle unknown actions here
      player.src = `${characterPath}/idle.gif`; // Default action
      break;
  }
}

function updateHealth() {
  // Update the health display element with the current health value
  healthElement.textContent = `Health : ${health}`;
  if (health <= 0) {
    // If health reaches zero, set the player's death animation and show the game over screen
    player.src = `images/male/Death.gif`;
    document.querySelector(".game_over").style.visibility = "visible";
    console.log("Game Over");
    // Reload the game or redirect to a game over screen after 3 seconds
    setInterval(() => {
      window.location.reload();
    }, 3000);
  }
}

// ABILITIES OF MONK
function activateMonkAbilities(characterType) {
  // Activate abilities based on the type of monk selected
  switch (characterType) {
    case "Zen Monk":
      zenMonkAbilities(); // Activate Zen Monk abilities
      break;
    case "Warrior Monk":
      warriorMonkAbilities(); // Activate Warrior Monk abilities
      break;
    case "Ranger Monk":
      rangerMonkAbilities(); // Activate Ranger Monk abilities
      break;
    case "Mystic Monk":
      mysticMonkAbilities(); // Activate Mystic Monk abilities
      break;
    default:
      // Warn if an unknown monk type is encountered
      console.warn("Unknown monk type:", characterType);
      break;
  }
}
let zenMonkHealthInterval = null;

function zenMonkAbilities() {
  // Log to console when Zen Monk abilities are activated
  console.log("hii");
  setInterval(() => {
    // Gradually increase health every 5 seconds until it reaches the maximum of 100
    if (health < 100) {
      health += 10; // Increase health by 10
      updateHealth(); // Update the health display
      if (health > 100) {
        health = 100; // Cap health at 100
        updateHealth(); // Update the health display again
      }
    }
  }, 5000); // Repeat this every 5 seconds
}

// Function for Ranger Monk abilities (currently only logs to console)
function rangerMonkAbilities() {
  console.log(
    "Ranger Monk activated: Increased speed, agility, better trap detection, and evasion."
  );
}

// Function for Warrior Monk abilities (currently only logs to console)
function warriorMonkAbilities() {
  console.log(
    "Warrior Monk activated: Increased attack power, advanced combat moves, higher damage resistance."
  );
}

// Function for Mystic Monk abilities
function mysticMonkAbilities() {
  console.log("Mystic Monk activated: Energy manipulation, teleportation.");

  // Add the teleportation ability
  document.addEventListener("keyup", (event) => {
    // Check for 'T' key and sufficient golden energy to teleport
    if (event.key.toLowerCase() === "t" && isPlayable && golden_Energy >= 5) {
      teleport(); // Call teleport function
    }
  });

  function teleport() {
    // Define the distance to teleport
    const teleportDistance = 500; // Change this value as needed

    // Apply the teleportation effect
    translateX -= teleportDistance; // Move the player by teleport distance
    objects.style.transform = `translateX(${translateX}px)`; // Move objects accordingly
    tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Adjust tree objects' position

    // Optional: You can add an animation or effect during teleportation
    player.src = `images/female/teleport.gif`; // Set teleportation animation
    console.log("Teleported!"); // Log teleportation to console
  }
}

// Function to flip animal images for wolves and bears
function flipAnimal() {
  let wolves = document.querySelectorAll(".wolf img"); // Select all wolf images
  let bears = document.querySelectorAll(".bear img"); // Select all bear images

  let isWolfGif = true; // Start with wolf.gif
  let isBearGif = true; // Start with bear.gif

  setInterval(() => {
    // Toggle wolf and bear images every 2.5 seconds
    let newWolfSrc = isWolfGif ? "images/wolfRight.gif" : "images/wolf.gif"; // Toggle wolf image source
    let newBearSrc = isBearGif ? "images/bearRight.gif" : "images/bear.gif"; // Toggle bear image source

    // Update all wolf images
    wolves.forEach((img) => {
      img.src = newWolfSrc;
    });

    // Update all bear images
    bears.forEach((img) => {
      img.src = newBearSrc;
    });

    isWolfGif = !isWolfGif; // Switch the state for wolves
    isBearGif = !isBearGif; // Switch the state for bears
  }, 2500); // Toggle every 2.5 seconds
}


document.addEventListener("DOMContentLoaded", () => {
  flipAnimal(); // Start the animal flip animation

  function updateScore() {
    scoreElement.textContent = `Score : ${score}`; // Update the displayed score
  }

  function updateGoldenEnergy() {
    if (golden_Energy >= 5) {
      // Notify player about energy shield availability
      notification.innerHTML =
        "Now You can use the ENERGY Shield by pressing 'e'";
      setInterval(() => {
        notification.innerHTML = ""; // Clear notification after 5 seconds
      }, 5000);
    } else {
      notification.innerHTML = ""; // Clear notification if not enough energy
    }
    goldenElement.textContent = `${golden_Energy}`; // Update the displayed golden energy
  }

  let sandstormDamageInterval; // Variable to track the sandstorm damage interval

  function checkSandStormProximity() {
    const playerBounds = player.getBoundingClientRect(); // Get player bounds
    const sandStormBounds = sandStorm.getBoundingClientRect(); // Get sandstorm bounds
    const ghostBounds = ghost.getBoundingClientRect(); // Get ghost bounds

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

    if (distance <= 800) { // Check if the player is within the sandstorm range
      // Apply damage when in range
      if (!sandstormDamageInterval) {
        sandstormDamageInterval = setInterval(() => {
          health -= 5; // Reduce health by 5
          updateHealth(); // Update health display
          if (health <= 0) {
            clearInterval(sandstormDamageInterval); // Stop damage interval on health <= 0
            // Handle game over scenario
          }
        }, 1000); // Apply damage every second
      }
    } else {
      clearInterval(sandstormDamageInterval); // Clear interval if out of range
      sandstormDamageInterval = null; // Reset interval variable
    }

    if (distance_ghost <= 300) { // Check if the ghost is near the player
      ghostAudio.play(); // Play ghost audio
      ghost.classList.add("active"); // Set ghost as active
      // console.log("Ghost attack");
    } else {
      ghost.classList.remove("active"); // Deactivate ghost if out of range
      // console.log("Ghost See it");
    }
  }

  function handleKeydown(event) {
    keyState[event.key.toLowerCase()] = true; // Set key state to true when key is pressed
    if (
      !isJumping &&
      (keyState["w"] || (keyState["W"] && isPlayable == true))
    ) {
      // jumpSound.play();

      console.log("Jump initiated"); // Debug message
      jumpSound.play(); // Play jump sound

      isJumping = true; // Set jumping state
      updatePlayerImage("Jump"); // Update player image to jump
      player.classList.add("jump"); // Add jump class to player
      shieldImg.classList.add("jump"); // Add jump class to shield image
      setTimeout(() => {
        updatePlayerImage("Fall"); // Change image to fall after a delay
      }, 300);

      setTimeout(() => {
        updatePlayerImage("Idle"); // Change image to idle after jump duration
        player.classList.remove("jump"); // Remove jump class from player
        shieldImg.classList.remove("jump"); // Remove jump class from shield image
        isJumping = false; // Reset jumping state
      }, jumpDuration);
    }
    if (event.key.toLowerCase() === "v" && isPlayable == true) {
      updatePlayerImage("Attack1"); // Update player image to attack
      setTimeout(() => {
        updatePlayerImage("Idle"); // Change image back to idle after attack
      }, 600);
      handleAnimalRemoval(); // Handle removal of animals after attack
      handleSpikesRemoval(); // Handle removal of spikes after attack
      handleTreeRemoval(); // Handle removal of trees after attack
    }
    if (event.key.toLowerCase() === "e" && isPlayable == true) {
      if (golden_Energy >= 5) { // Check if enough golden energy is available
        golden_Energy = golden_Energy - 5; // Decrease golden energy by 5
        updateGoldenEnergy(); // Update golden energy display
        shieldImg.classList.add("show"); // Show shield image
        invincibility = true; // Set invincibility state to true
        setTimeout(() => {
          shieldImg.classList.remove("show"); // Hide shield image after 7 seconds
          invincibility = false; // Reset invincibility state
        }, 7000);
      }

      handleAnimalRemoval(); // Handle removal of animals while using shield
      handleSpikesRemoval(); // Handle removal of spikes while using shield
    }
  }

  function handleKeyup(event) {
    keyState[event.key.toLowerCase()] = false; // Set key state to false when key is released
  }

  function update() {
    if (characterType === "Ranger Monk") { // Check if the character is a Ranger Monk
      if (keyState["d"] && isPlayable == true) { // Check if the 'd' key is pressed for right movement
        if (!isJumping) updatePlayerImage("Run"); // Update player image to "Run" if not jumping
        translateX -= 15; // Move character right
        objects.style.transform = `translateX(${translateX}px)`; // Update the position of game objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Update the position of trees
      } else if (keyState["a"] && isPlayable == true) { // Check if the 'a' key is pressed for left movement
        if (!isJumping) updatePlayerImage("Run"); // Update player image to "Run" if not jumping
        translateX += 10; // Move character left
        objects.style.transform = `translateX(${translateX}px)`; // Update the position of game objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Update the position of trees
      } else if (!isJumping) {
        updatePlayerImage("Idle"); // Update player image to "Idle" if not moving and not jumping
      }
    } else { // If character type is not Ranger Monk
      if (keyState["d"] && isPlayable == true) { // Check if the 'd' key is pressed for right movement
        if (!isJumping) updatePlayerImage("Run"); // Update player image to "Run" if not jumping
        translateX -= 10; // Move character right
        objects.style.transform = `translateX(${translateX}px)`; // Update the position of game objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Update the position of trees
      } else if (keyState["a"] && isPlayable == true) { // Check if the 'a' key is pressed for left movement
        if (!isJumping) updatePlayerImage("Run"); // Update player image to "Run" if not jumping
        translateX += 10; // Move character left
        objects.style.transform = `translateX(${translateX}px)`; // Update the position of game objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Update the position of trees
      } else if (!isJumping) {
        updatePlayerImage("Idle"); // Update player image to "Idle" if not moving and not jumping
      }
    }
    handleCollision(); // Check for collisions with other objects
    handleIndicator(); // Update any indicators on the screen
    checkSandStormProximity(); // Check if the player is near a sandstorm
    requestAnimationFrame(update); // Request the next animation frame to keep updating
  }

  let lastGhostDamageTime = 0; // Tracks the last time the ghost dealt damage
  const ghostDamageCooldown = 1000; // Cooldown time for ghost damage

  function handleCollision() {
    const ghostObj = document.querySelector(".ghost img"); // Select the ghost image element
    const currentTime = Date.now(); // Get the current timestamp

    // Check for collision with the ghost and apply damage if conditions are met
    if (
      checkCollision(player, ghostObj) && // Check collision between player and ghost
      invincibility == false && // Ensure player is not invincible
      currentTime - lastGhostDamageTime >= ghostDamageCooldown // Check cooldown period for ghost damage
    ) {
      // Deduct health based on character type
      health -= characterType === "Warrior Monk" ? 3 : 5;
      updateHealth(); // Update the displayed health
      ghostAudio.play(); // Play ghost sound upon collision
      lastGhostDamageTime = currentTime; // Update the last time damage was taken
      if (health <= 0) {
        console.log("Game Over"); // Log game over if health is depleted
      }
    }

    // Handle collision with energy collectables
    const energies = document.querySelectorAll(".energy");
    energies.forEach((energy) => {
      if (
        checkCollision(player, energy.querySelector("img")) && // Check collision with energy item
        !energy.classList.contains("fade-out") // Ensure the energy is not already fading out
      ) {
        golden_Energy++; // Increment the collected energy count
        updateGoldenEnergy(); // Update the displayed energy count
        score += 10; // Increase score by 10 points
        updateScore(); // Update the displayed score
        fadeOutAndRemove(energy); // Fade out and remove the energy item from the game
      }
    });

    // Handle collisions with harmful objects (wolves, bears, spikes, chopped trees)
    const harmfulObjects = document.querySelectorAll(
      ".wolf, .bear, .spike, .chopped-tree"
    );
    harmfulObjects.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with harmful object
        !obj.classList.contains("fade-out") && // Ensure the object is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        health -= 10; // Deduct health
        updateHealth(); // Update displayed health
        fadeOutAndRemove(obj); // Fade out and remove the harmful object
      }
    });

    // Handle collision with rivers
    const river = document.querySelectorAll(".river");
    river.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with river
        !obj.classList.contains("fade-out") && // Ensure the river is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        // Deduct health based on character type
        health -= characterType === "Warrior Monk" ? 10 : 15;
        updateHealth(); // Update displayed health
        fadeOutAndRemove(obj); // Fade out and remove the river object
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

    // Handle collision with sandstorm objects
    const sandStormObj = document.querySelectorAll(".sand_storm");
    sandStormObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with sandstorm
        !obj.classList.contains("fade-out") && // Ensure sandstorm is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        // Placeholder for potential health deduction logic
        // health -= 50;
        // updateHealth();
        // fadeOutAndRemove(obj);
      }
    });

    // Handle collision with golem objects
    const GolemObj = document.querySelectorAll(".golem");
    GolemObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with golem
        !obj.classList.contains("fade-out") && // Ensure golem is not fading out
        invincibility == false // Ensure player is not invincible
      ) {
        // Deduct health based on character type
        health -= characterType === "Warrior Monk" ? 20 : 30;
        updateHealth(); // Update displayed health
        fadeOutAndRemove(obj); // Fade out and remove the golem object
      }
    });

    // Handle collision with health items (first-aid kits)
    const healthObj = document.querySelectorAll(".first-aid, .t-first-aid");
    healthObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with health item
        !obj.classList.contains("fade-out") && // Ensure health item is not fading out
        health < 100 // Ensure health is below the maximum limit
      ) {
        health = 100; // Restore health to maximum
        updateHealth(); // Update displayed health
        fadeOutAndRemove(obj); // Fade out and remove the health item
      }
    });

    // Handle collision with hermits and visibility of their containers
    const hermitObj2 = document.querySelectorAll(".hermit");
    hermitObj2.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with hermit
        !obj.classList.contains("fade-out") // Ensure hermit is not fading out
      ) {
        document.querySelector(".container").style.visibility = "visible"; // Make hermit container visible
      }
    });

    const hermitObj1 = document.querySelectorAll(".hermit1");
    hermitObj1.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with first hermit
        !obj.classList.contains("fade-out") // Ensure hermit is not fading out
      ) {
        document.querySelector(".container1").style.visibility = "visible"; // Make first hermit container visible
      }
    });

    const hermitObj3 = document.querySelectorAll(".hermit2");
    hermitObj3.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision with second hermit
        !obj.classList.contains("fade-out") // Ensure hermit is not fading out
      ) {
        document.querySelector(".container2").style.visibility = "visible"; // Make second hermit container visible
      }
    });

    // Handle collisions with snowman objects and show answers
    const snowMan1 = document.querySelectorAll('.snowman1');
    snowMan1.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman1_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman1_ans").style.visibility = "visible"; // Show answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    // Similar handling for other snowman objects (snowMan2 and snowMan3)
    const snowMan2 = document.querySelectorAll('.snowman2');
    snowMan2.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman2_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman2_ans").style.visibility = "visible"; // Show answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    const snowMan3 = document.querySelectorAll('.snowman3');
    snowMan3.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman3_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman3_ans").style.visibility = "visible"; // Show answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    // Uncommented section for snowman4 can be handled similarly as above

    // Handle collision with black rock and trigger fighting game if applicable
    const blackRock = document.querySelectorAll('.black_rock');
    blackRock.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        if (fighting_Game == true) { // Check if a fighting game is active
          isPlayable = false; // Disable player controls
          fadeOutAndRemove(obj); // Fade out and remove black rock
          window.open("fighting/html/index.html"); // Open fighting game page
          setTimeout(function () {
            isPlayable = true; // Re-enable player controls after 3 seconds
          }, 3000);
        }
      }
    });

    // Handle collision with final snowman for quiz initiation
    const snowMan5 = document.querySelectorAll('.snowman5');
    snowMan5.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        document.querySelector(".quiz").style.visibility = "visible"; // Show quiz container
        fadeOutAndRemove(obj); // Fade out and remove the final snowman
      }
    });
  }

  // Handles the visibility of the indicator based on the proximity of animals
  function handleIndicator() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select all wolf and bear elements
    const animal_indicators = document.querySelector(".animal_indicator"); // Select the animal indicator element
    let nearby = false; // Initialize a flag to track if any animals are nearby

    // Loop through each animal to check if it's close to the player
    animals.forEach((animal) => {
      // If the player is within a 50px range of the animal, set nearby to true
      if (checkCollision(player, animal.querySelector("img"), 50)) {
        nearby = true;
      }
    });

    // Display the indicator if any animals are nearby, hide it otherwise
    indicator.style.display = nearby ? "block" : "none";
    animal_indicators.style.display = nearby ? "block" : "none";
  }

  // Handles the removal of animals (wolves, bears) when collided with the player
  function handleAnimalRemoval() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select all wolf and bear elements

    animals.forEach((animal) => {
      // Check for collision with the player within 50px and if the animal is not already fading out
      if (
        checkCollision(player, animal.querySelector("img"), 50) &&
        !animal.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(animal); // Fade out and remove the animal
        score += 50; // Increase the score by 50 points
        updateScore(); // Update the displayed score
      }
    });
  }

  // Handles the removal of spikes when collided with the player
  function handleSpikesRemoval() {
    const spikes = document.querySelectorAll(".spike"); // Select all spike elements

    spikes.forEach((spike) => {
      // Check for collision with the player within 50px and if the spike is not already fading out
      if (
        checkCollision(player, spike.querySelector("img"), 50) &&
        !spike.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(spike); // Fade out and remove the spike
      }
    });
  }

  // Handles the removal of chopped trees when collided with the player
  function handleTreeRemoval() {
    const chopped_tree = document.querySelectorAll(".chopped-tree"); // Select all chopped-tree elements

    chopped_tree.forEach((tree) => {
      // Check for collision with the player within 50px and if the tree is not already fading out
      if (
        checkCollision(player, tree.querySelector("img"), 50) &&
        !tree.classList.contains("fade-out")
      ) {
        score += 10; // Increase the score by 10 points
        updateScore(); // Update the displayed score
        fadeOutAndRemove(tree); // Fade out and remove the chopped tree
      }
    });
  }

  // Adds a fade-out effect to the specified element and removes it after the transition
  function fadeOutAndRemove(element) {
    element.classList.add("fade-out"); // Add the fade-out CSS class to trigger the transition effect

    // After 500ms (matching the CSS transition duration), set the element's opacity to 0
    setTimeout(() => {
      element.style.opacity = "0";
    }, 500); // Matches the timeout duration with the CSS transition duration
  }

  // Checks if two rectangular elements are colliding within a specified range
  function checkCollision(rect1, rect2, range = 0) {
    const rect1Bounds = rect1.getBoundingClientRect(); // Get the bounding rectangle for the first element
    const rect2Bounds = rect2.getBoundingClientRect(); // Get the bounding rectangle for the second element

    // Determine if there is no collision by checking if any of the sides are outside of the range
    return !(
      rect1Bounds.top > rect2Bounds.bottom + range || // rect1 is above rect2
      rect1Bounds.bottom < rect2Bounds.top - range || // rect1 is below rect2
      rect1Bounds.right < rect2Bounds.left - range || // rect1 is to the left of rect2
      rect1Bounds.left > rect2Bounds.right + range    // rect1 is to the right of rect2
    );
  }

  // Attach event listeners for key presses to trigger movement or actions
  document.addEventListener("keydown", handleKeydown); // Call handleKeydown on key press
  document.addEventListener("keyup", handleKeyup);     // Call handleKeyup on key release

  // Initialize the score display
  updateScore(); // Call updateScore to initialize or update the score on the screen

  // Initialize the health display
  updateHealth(); // Call updateHealth to initialize or update the health status on the screen

  // Start the game update loop
  update(); // Initiates a loop or main update function to handle game events continuously

  //QUIZ GAME 
  // quiz game 
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
    },
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
  let currentQuestionIndex = 0;
  let score1 = 0;
  let timerInterval;
  const userAnswers = [];

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
        currentQuestionIndex,
        score1,
        userAnswers
      })
    );
  }

  // Function to retrieve progress from localStorage
  function retrieveProgress() {
    const savedProgress = localStorage.getItem("quizProgress");
    if (savedProgress) {
      const {
        currentQuestionIndex: savedIndex,
        score1: savedScore,
        userAnswers: savedAnswers
      } = JSON.parse(savedProgress);
      if (savedIndex < quizData.length) {
        currentQuestionIndex = savedIndex;
        score1 = savedScore;
        userAnswers.push(...savedAnswers);
        loadQuestion();
      } else {
        displayResults();
      }
    } else {
      // initializeQuiz();
    }
  }

  // Function to shuffle the elements in an array randomly
  function shuffleArray(array) {
    // Loop through the array from the last element to the second
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index within the range of 0 to i
      const j = Math.floor(Math.random() * (i + 1));
      // Swap the current element with the element at the random index
      [array[i], array[j]] = [array[j], array[i]];
    }
    // Return the shuffled array
    return array;
  }

  // Function to initialize the quiz by shuffling the quiz data and loading the first question
  function initializeQuiz() {
    shuffleArray(quizData); // Shuffle the quiz questions to randomize their order
    loadQuestion();         // Load the first question to start the quiz
  }


  // Function to load the current question and update the UI accordingly
  function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex]; // Get the current question from the quiz data

    // Update the question number display (e.g., "1/10")
    questionNumberElement.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;

    // Set the question text in the UI
    questionTextElement.textContent = currentQuestion.question;

    // Clear previous options
    optionsContainer.innerHTML = "";

    // Shuffle options to randomize their order each time a question is loaded
    const shuffledOptions = shuffleArray([...currentQuestion.options]);
    shuffledOptions.forEach((option) => {
      const label = document.createElement("label"); // Create a label for each option

      const input = document.createElement("input"); // Create a radio button input for each option
      input.type = "radio";
      input.name = "answer"; // Set the name attribute for grouping the radio buttons
      input.value = option;  // Set the value attribute to the option text

      const span = document.createElement("span"); // Create a span for displaying the option text
      span.textContent = option;

      label.appendChild(input); // Append the radio button to the label
      label.appendChild(span);  // Append the option text to the label
      optionsContainer.appendChild(label); // Add the label (with radio and text) to the options container
    });

    updateProgressBar(); // Update the progress bar based on the current question index
    resetTimer();        // Reset and start the timer for the current question
  }

  // Function to update the progress bar based on the current question
  function updateProgressBar() {
    const progress = (currentQuestionIndex / quizData.length) * 100; // Calculate progress percentage
    progressBar.style.width = `${progress}%`; // Set the width of the progress bar
  }

  // Function to reset and start the countdown timer for each question
  function resetTimer() {
    clearInterval(timerInterval); // Clear any previous timer interval
    let timeLeft = 111;            // Set the timer starting value
    timerElement.textContent = timeLeft; // Display the initial timer value

    // Start the timer countdown
    timerInterval = setInterval(() => {
      timeLeft--; // Decrease the time left by 1 second
      timerElement.textContent = timeLeft; // Update the timer display

      // Change the timer color to red when time is running low
      if (timeLeft <= 10) {
        timerElement.style.color = "#e74c3c"; // Set color to red
      }

      // If time runs out, move to the next question automatically
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Stop the timer
        handleNextButtonClick();      // Trigger the function to move to the next question
      }
    }, 1000); // Set interval to update every 1 second
  }

  // Function to handle the logic when the "Next" button is clicked
  function handleNextButtonClick() {
    // Select the currently checked option (the user's answer)
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked'
    );

    // If the user has selected an option
    if (selectedOption) {
      // Store the question, user's answer, and correct answer in userAnswers array
      userAnswers.push({
        question: quizData[currentQuestionIndex].question, // Current question text
        yourAnswer: selectedOption.value, // The user's selected answer
        correctAnswer: quizData[currentQuestionIndex].correct // The correct answer
      });

      // Check if the selected answer is correct
      if (selectedOption.value === quizData[currentQuestionIndex].correct) {
        score1++; // Increment the score for correct answers
        scoreElement1.textContent = `Score: ${score1}`; // Update score display
      }
    } else {
      // If no answer was selected, log that no answer was given
      userAnswers.push({
        question: quizData[currentQuestionIndex].question,
        yourAnswer: "No answer selected", // Indicate no answer was chosen
        correctAnswer: quizData[currentQuestionIndex].correct // Store the correct answer
      });
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      saveProgress(); // Save progress before loading next question
      loadQuestion();
    } else {
      saveProgress(); // Save progress before displaying results
      displayResults();
    }

    document
      .querySelectorAll('input[name="answer"]')
      .forEach((input) => (input.checked = false));
  }

  // Function to display the results after the quiz is completed
  function displayResults() {
    clearInterval(timerInterval); // Stop the timer when quiz is over
    questionNumberElement.textContent = "Quiz Completed"; // Indicate completion in UI
    document.querySelector(".score_display").textContent = `Your score is ${score1}/${quizData.length}`; // Show user's score

    optionsContainer.innerHTML = ""; // Clear options container for the results display
    nextButton.style.display = "none"; // Hide the next button as the quiz is done
    scoreboardContainer.style.display = "block"; // Show the scoreboard with results
    renderScoreboard(); // Render the scoreboard with detailed results
    localStorage.removeItem("quizProgress"); // Clear saved progress from localStorage after displaying results
  }

  // Function to render the scoreboard displaying each question, user's answer, and correct answer
  function renderScoreboard() {
    scoreboardBody.innerHTML = ""; // Clear any previous scoreboard entries
    userAnswers.forEach((answer, index) => {
      const row = document.createElement("tr"); // Create a new row for each question
      const questionCell = document.createElement("td"); // Cell for the question text
      const yourAnswerCell = document.createElement("td"); // Cell for user's answer
      const correctAnswerCell = document.createElement("td"); // Cell for the correct answer

      // Set the text content for each cell
      questionCell.textContent = `Q${index + 1}: ${answer.question}`; // Display the question number and text
      yourAnswerCell.textContent = answer.yourAnswer; // Display the user's selected answer
      correctAnswerCell.textContent = answer.correctAnswer; // Display the correct answer

      // Append cells to the row
      row.appendChild(questionCell);
      row.appendChild(yourAnswerCell);
      row.appendChild(correctAnswerCell);
      scoreboardBody.appendChild(row); // Add the row to the scoreboard body
    });
  }

  // Function to restart the quiz and navigate to the next level
  function restartQuiz() {
    // Save various game states to localStorage for use in the next level
    localStorage.setItem("Health_2", health);
    localStorage.setItem("Score_2", score);
    localStorage.setItem("Energies_2", golden_Energy);
    localStorage.setItem("Min_2", min);
    localStorage.setItem("Sec_2", sec);

    window.open('level3.html'); // Open the next level page
    window.close('level2.html'); // Close the current level page
  }

  // Add event listeners for button clicks
  nextButton.addEventListener("click", handleNextButtonClick); // Listen for the next button click
  restartButton.addEventListener("click", restartQuiz); // Listen for the restart button click


  // Check localStorage for saved progress when DOM is loaded
  retrieveProgress();

});

// memory game --------------------------------------------------------

//memory game final
(function (d, w) {
  let cards = []; // Array to hold the card values
  let matches = 0; // Counter for the number of matches found
  const flipped_cards = []; // Array to keep track of currently flipped cards

  // Mapping of card names to image files
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Function to build the game board
  const build_board = () => {
    const board = d.querySelector(".board2"); // Select the game board element
    cards = get_cards(); // Get shuffled card values
    const card_items = cards
      .map((card, id) => {
        // Create HTML for each card
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join(""); // Join card HTML strings into one

    board.innerHTML = card_items; // Set the inner HTML of the board
    board.addEventListener("click", flip_card); // Add click event listener to flip cards
  };

  // Function to handle card flipping
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Find the card that was clicked
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return; // Ignore clicks on matched or already flipped cards
    if (flipped_cards.length == 2) return; // Ignore if two cards are already flipped

    // Set the background image of the card based on the card's name
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped"); // Add class to mark card as flipped

    // Push the flipped card and its name into the flipped_cards array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match(); // Call the function to check if the two flipped cards match
    }
  };

  // Function to check if the flipped cards match
  const check_match = () => {
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // If names match, they are a pair
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match"); // Mark the cards as matched
        flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
      });

      matches += 2; // Increment match counter
      flipped_cards.length = 0; // Clear the flipped cards array

      // Check if the game is over (all matches found)
      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container2").addClass("hidden"); // Hide the game container
        document.querySelector(".container2").style.visibility = "hidden"; // Set visibility to hidden
      }
    } else {
      // If no match, reset the flipped cards after a delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card; // Get the flipped card
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Clear the flipped cards array
      }, 800); // Delay of 800ms before resetting
    }
  };

  // Function to shuffle the card stack
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to keep track of used indices
    const total = stack.length; // Total number of cards
    let i = 0; // Index counter

    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      if (!random_numbers.includes(number)) {
        // Ensure index has not been used
        shuffled.push(stack[number]); // Add the card at this index to shuffled array
        random_numbers.push(number); // Add index to used indices
        i++; // Increment index counter
      }
    }

    return shuffled; // Return the shuffled array of cards
  };

  // Function to check if the game is over
  const game_over = () => {
    if (matches === cards.length) {
      // If matches equal total cards, the game is over
      matches = 0; // Reset matches counter
      return true; // Return true indicating game over
    }
    return false; // Return false if game is not over
  };

  // Function to get a shuffled deck of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Base card names

    const full_stack = stack.concat(stack); // Duplicate the stack to create pairs

    return shuffle_cards(full_stack); // Shuffle and return the full stack of cards
  };

  build_board(); // Initialize the game board
})(document, window);


// memory game --------------------------------------------------------

(function (d, w) {
  // Array to hold the card identifiers
  let cards = [];
  // Counter for the number of matched pairs
  let matches = 0;
  // Array to hold currently flipped cards
  const flipped_cards = [];

  // Mapping of card identifiers to image file names
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Function to build the game board
  const build_board = () => {
    // Select the board element from the document
    const board = d.querySelector(".board1");
    // Get shuffled card identifiers
    cards = get_cards();
    // Create card elements for the board
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join("");

    // Insert the card elements into the board
    board.innerHTML = card_items;
    // Add event listener to handle card flip on click
    board.addEventListener("click", flip_card);
  };

  // Function to flip a card when clicked
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the card that was clicked
    // Check if the card is valid for flipping
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return; // Ignore if already matched or flipped
    if (flipped_cards.length == 2) return; // Limit to two flipped cards

    // Set the background image for the flipped card
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped"); // Mark the card as flipped

    // Add the flipped card to the array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the two flipped cards match
  const check_match = () => {
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // If there's a match, mark the cards
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2; // Increment match counter
      flipped_cards.length = 0; // Reset the flipped cards array

      // Check if the game is over
      if (game_over()) {
        // Optionally, handle game completion (e.g., show next part)
        // isPlayable = false;
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container1").addClass("hidden"); // Hide the current container
        document.querySelector(".container1").style.visibility = "hidden"; // Further hide the container
        // build_board(); // Optionally restart the board
      }
    } else {
      // If no match, flip the cards back after a short delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove the flipped class
        });
        flipped_cards.length = 0; // Reset the flipped cards array
      }, 800);
    }
  };

  // Function to shuffle cards randomly
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to track used random numbers
    const total = stack.length; // Total number of cards
    let i = 0;

    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the number is not already used
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add card to shuffled array
        random_numbers.push(number); // Mark this number as used
        i++;
      }
    }

    return shuffled; // Return the shuffled array of cards
  };

  // Function to check if the game is over
  const game_over = () => {
    if (matches === cards.length) {
      matches = 0; // Reset matches for next game
      return true; // Return true indicating the game is over
    }
    return false; // Return false if game is not over
  };

  // Function to get a shuffled deck of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"];

    // Create a full deck by duplicating the stack
    const full_stack = stack.concat(stack);

    // Shuffle and return the full stack
    return shuffle_cards(full_stack);
  };

  // Initialize the game board
  build_board();
})(document, window);

// Memory game final
(function (d, w) {
  let cards = []; // Array to hold card values
  let matches = 0; // Counter for matched pairs
  const flipped_cards = []; // Array to hold currently flipped cards

  // Mapping of card names to their respective image files
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Function to build the game board
  const build_board = () => {
    const board = d.querySelector(".board2"); // Select the board element
    cards = get_cards(); // Retrieve shuffled cards
    const card_items = cards
      .map((card, id) => {
        // Create card elements
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join(""); // Join card items into a single string

    board.innerHTML = card_items; // Set inner HTML of the board to the created card items
    board.addEventListener("click", flip_card); // Add click event listener to flip cards
  };

  // Function to flip a card when clicked
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the clicked card
    // Check if the card is valid to flip
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return; // Do nothing if card is already matched or flipped
    if (flipped_cards.length == 2) return; // Limit to two flipped cards

    // Set the card's background image
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped"); // Add flipped class to card

    // Store flipped card details
    flipped_cards.push({
      card,
      name: cards[card.dataset.id], // Store the card's name
    });

    // Check for matches if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the two flipped cards match
  const check_match = () => {
    // If the names of the flipped cards match
    if (flipped_cards[0].name === flipped_cards[1].name) {
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match"); // Mark as matched
        flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
      });

      matches += 2; // Increment matches by 2
      flipped_cards.length = 0; // Clear flipped cards

      // Check if the game is over
      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container2").addClass("hidden"); // Hide the current container
        document.querySelector(".container2").style.visibility = "hidden"; // Set visibility to hidden
      }
    } else {
      // If cards don't match, flip them back after a short delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Clear flipped cards
      }, 800);
    }
  };

  // Function to shuffle the cards
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to track random numbers used for shuffling
    const total = stack.length; // Total number of cards
    let i = 0; // Index for shuffled cards

    // Shuffle until all cards are placed
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the number hasn't been used before
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card to shuffled array
        random_numbers.push(number); // Keep track of used numbers
        i++; // Increment index
      }
    }

    return shuffled; // Return the shuffled cards
  };

  // Function to check if the game is over
  const game_over = () => {
    // Check if all matches are found
    if (matches === cards.length) {
      matches = 0; // Reset matches
      return true; // Game is over
    }
    return false; // Game is not over
  };

  // Function to get and shuffle cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Initial card names

    const full_stack = stack.concat(stack); // Duplicate stack for pairs

    return shuffle_cards(full_stack); // Shuffle and return the full stack
  };

  build_board(); // Initialize the game board
})(document, window);
