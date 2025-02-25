// Select elements from the DOM
var pauseGame = document.querySelector(".pause_game"); // Button to pause the game
const form_obj = document.querySelector(".game_form"); // Form element for game settings or input
var game_is_paused = true; // Flag to track if the game is currently paused

let playSound = 0; // Variable to control sound playback

// Select various game elements
const objects = document.querySelector(".objects"); // Container for game objects
const tree_Objs = document.querySelector(".trees"); // Container for tree objects
const scoreElement = document.querySelector(".score"); // Element to display the player's score
const goldenElement = document.querySelector(".goldenEnergies span"); // Element to display golden energies
const healthElement = document.querySelector(".Health"); // Element to display player's health
const player = document.querySelector("#player img"); // Select the player image
const sandStorm = document.querySelector(".sand_storm img"); // Image for sandstorm effect
const ghost = document.querySelector(".ghost img"); // Image for ghost enemy
const shieldImg = document.querySelector(".shield img"); // Image for player's shield
const indicator = document.querySelector(".indicator"); // Element to indicate game status or player state
const notification = document.querySelector(".notification"); // Element for displaying notifications to the player

// Load sound effects
var jumpSound = new Audio("audio/jumpSound.mp3"); // Sound effect for jumping
var ghostAudio = new Audio("audio/scare.mp3"); // Sound effect for ghost encounter

// Game state variables
let score = 0; // Player's score
let golden_Energy = 0; // Amount of golden energy collected
let health = 100; // Player's health
let translateX = 0; // Horizontal translation for player movement or animations
let fighting_Game = true; // Flag to indicate if the player is in a fighting state
let isJumping = false; // Flag to indicate if the player is currently jumping
let invincibility = false; // Flag to indicate if the player is invincible
const jumpDuration = 1000; // Duration of the jump in milliseconds
const keyState = {}; // Object to track the current state of keys (pressed or released)

let music_state = true; // Flag to track if the game music is currently playing

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
  stopTimer(); // Stop the timer when the game is paused
  pauseGame.style.display = "block"; // Show the pause menu
  game_is_paused = true; // Set the game paused state to true
  isPlayable = false; // Disable gameplay actions
  document.querySelector(".pause_health").textContent = "Health :- " + health; // Display current health in the pause menu
}

// Function to resume the game
function play_game() {
  activateMonkAbilities(characterType); // Activate character abilities
  document.body.classList.add("weather"); // Add weather class to body
  Weather(); // Trigger the weather effect
  startTimer(); // Start the game timer
  isPlayable = true; // Enable gameplay actions

  // Play background music if not already playing
  if (playSound == 0) {
    audio.play(); // Play the audio
    audio.addEventListener("ended", function () {
      audio.currentTime = 0; // Reset the audio to the start
      audio.play(); // Replay the audio
    });
    playSound++; // Increment playSound to indicate music is playing
  }

  pauseGame.style.display = "none"; // Hide the pause menu
  game_is_paused = false; // Set the game paused state to false
  isPlayable = true; // Enable gameplay actions
}

let characterType = localStorage.getItem("character_gender"); // Retrieve the default character gender from local storage

// Timer variables
const timer = document.getElementById("stopwatch"); // Select the timer element
var hr = 0; // Hours
var min = 0; // Minutes
var sec = 0; // Seconds
var stoptime = true; // Flag to control the timer state

// Function to start the timer
function startTimer() {
  if (stoptime == true) {
    stoptime = false; // Set stoptime to false to allow the timer to run
    timerCycle(); // Start the timer cycle
  }
}

// Function to stop the timer
function stopTimer() {
  if (stoptime == false) {
    stoptime = true; // Set stoptime to true to stop the timer
  }
}

// Function to handle the timer cycle
function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec); // Parse seconds
    min = parseInt(min); // Parse minutes
    hr = parseInt(hr); // Parse hours

    sec = sec + 1; // Increment seconds

    // Check if seconds reach 60 and update minutes and seconds accordingly
    if (sec == 60) {
      min = min + 1; // Increment minutes
      sec = 0; // Reset seconds
    }
    // Check if minutes reach 60 and update hours and minutes accordingly
    if (min == 60) {
      hr = hr + 1; // Increment hours
      min = 0; // Reset minutes
      sec = 0; // Reset seconds
    }

    // Format seconds, minutes, and hours to ensure two digits
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }

    // Trigger weather effect when 30 seconds have passed
    if (min == 0 && sec == 30) {
      Weather();
    }

    // Update the timer display
    timer.innerHTML = hr + " : " + min + " : " + sec;

    // Call the timerCycle function every second
    setTimeout("timerCycle()", 1000);
  }
}

// Function to reset the timer
function resetTimer() {
  timer.innerHTML = "00:00:00"; // Reset the display
  stoptime = true; // Stop the timer
  hr = 0; // Reset hours
  sec = 0; // Reset seconds
  min = 0; // Reset minutes
}

// Weather effects
var rainSound = new Audio("audio/rain.mp3"); // Sound effect for rain
var thunderSound = new Audio("audio/Thunder.mp3"); // Sound effect for thunder

// Function to manage weather effects
function Weather() {
  console.log("Rain"); // Log "Rain" to the console
  startThunderstormEffect(); // Start thunderstorm effect
  // After 8 seconds, stop thunderstorm effects and start rain
  setTimeout(() => {
    stopWeatherEffects(); // Stop any active weather effects
    startRainEffect(); // Start the rain effect
  }, 8000);
  // After 25 seconds, stop all weather effects
  setTimeout(() => {
    stopWeatherEffects(); // Stop all weather effects
  }, 25000);
}

// Function to start rain effect
function startRainEffect() {
  document.body.classList.add("rain");
  rainSound.play();
}
// Function to start thunderstorm effect
function startThunderstormEffect() {
  document.body.classList.add("thunderstorm");
  thunderSound.play();
}
// Function to stop all weather effects
function stopWeatherEffects() {
  rainSound.pause();
  thunderSound.pause();
  document.body.classList.remove("rain", "thunderstorm");
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

// Function to update the player's health display and check for game over
function updateHealth() {
  // Update the health display on the screen
  healthElement.textContent = `Health : ${health}`;

  // Check if health is less than or equal to 0
  if (health <= 0) {
    // Change the player sprite to the death animation
    player.src = `images/male/Death.gif`;

    // Make the game over screen visible
    document.querySelector(".game_over").style.visibility = "visible";

    // Log game over status to the console
    console.log("Game Over");

    // Reload the game after 3 seconds
    setInterval(() => {
      window.location.reload();
    }, 3000);
  }
}

// Function to activate abilities based on the monk type
function activateMonkAbilities(characterType) {
  // Switch statement to determine which abilities to activate
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
      // Warn if an unknown monk type is passed
      console.warn("Unknown monk type:", characterType);
      break;
  }
}

// Variable to hold the health regeneration interval for Zen Monk
let zenMonkHealthInterval = null;

// Function for Zen Monk abilities
function zenMonkAbilities() {
  console.log("hii"); // Log message for testing

  // Set an interval to regenerate health every 5 seconds
  setInterval(() => {
    // Check if health is less than the maximum limit
    if (health < 100) {
      health += 10; // Increase health by 10
      updateHealth(); // Update health display
      // If health exceeds 100, cap it at 100
      if (health > 100) {
        health = 100;
        updateHealth(); // Update health display again
      }
    }
  }, 5000); // Repeat every 5000 milliseconds (5 seconds)
}

// Function for Ranger Monk abilities
function rangerMonkAbilities() {
  // Log Ranger Monk abilities activation
  console.log("Ranger Monk activated: Increased speed, agility, better trap detection, and evasion.");
}

// Function for Warrior Monk abilities
function warriorMonkAbilities() {
  // Log Warrior Monk abilities activation
  console.log("Warrior Monk activated: Increased attack power, advanced combat moves, higher damage resistance.");
}

// Function for Mystic Monk abilities
function mysticMonkAbilities() {
  // Log Mystic Monk abilities activation
  console.log("Mystic Monk activated: Energy manipulation, teleportation.");

  // Add an event listener for keyup events to enable teleportation
  document.addEventListener("keyup", (event) => {
    // Check if the 'T' key is pressed and if conditions allow teleportation
    if (event.key.toLowerCase() === "t" && isPlayable && golden_Energy >= 5) {
      // Call the teleport function
      teleport();
    }
  });

  // Function to handle the teleportation effect
  function teleport() {
    // Define the distance to teleport
    const teleportDistance = 500; // Adjust this value as needed

    // Update the player's position
    translateX -= teleportDistance; // Move player left by teleportDistance
    objects.style.transform = `translateX(${translateX}px)`; // Update object position
    tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Update tree position (slower movement)

    // Optional: Add an animation or effect during teleportation
    player.src = `images/female/teleport.gif`; // Change player sprite to teleport animation
    console.log("Teleported!"); // Log teleportation action
  }
}

// Function to toggle animal sprites for wolves and bears
function flipAnimal() {
  // Select all wolf and bear images in the game
  let wolves = document.querySelectorAll(".wolf img");
  let bears = document.querySelectorAll(".bear img");

  let isWolfGif = true; // Flag to toggle wolf image
  let isBearGif = true; // Flag to toggle bear image

  // Set an interval to change the animal sprites every 2.5 seconds
  setInterval(() => {
    // Determine new source for wolf and bear images based on current state
    let newWolfSrc = isWolfGif ? "images/wolfRight.gif" : "images/wolf.gif";
    let newBearSrc = isBearGif ? "images/bearRight.gif" : "images/bear.gif";

    // Update all wolf images with the new source
    wolves.forEach((img) => {
      img.src = newWolfSrc;
    });

    // Update all bear images with the new source
    bears.forEach((img) => {
      img.src = newBearSrc;
    });

    // Toggle the state for the next iteration
    isWolfGif = !isWolfGif;
    isBearGif = !isBearGif;
  }, 2500); // Repeat every 2500 milliseconds (2.5 seconds)
}

document.addEventListener("DOMContentLoaded", () => {
  flipAnimal();
  function updateScore() {
    scoreElement.textContent = `Score : ${score}`;
  }

  function updateGoldenEnergy() {
    if (golden_Energy >= 5) {
      notification.innerHTML =
        "Now You can use the ENERGY Shield by pressing 'e'";
      setInterval(() => {
        notification.innerHTML = "";
      }, 5000);
    } else {
      notification.innerHTML = "";
    }
    goldenElement.textContent = `${golden_Energy}`;
  }

  let sandstormDamageInterval;

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

  // Function to handle keydown events
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
      updatePlayerImage("Jump"); // Change player image to jump
      player.classList.add("jump"); // Add jump class for animation
      shieldImg.classList.add("jump"); // Add jump class to shield image
      setTimeout(() => {
        updatePlayerImage("Fall"); // Change player image to fall after jump duration
      }, 300);

      // Reset jump state after landing
      setTimeout(() => {
        updatePlayerImage("Idle"); // Change player image to idle
        player.classList.remove("jump"); // Remove jump class
        shieldImg.classList.remove("jump"); // Remove jump class from shield image
        isJumping = false; // Reset jumping state
      }, jumpDuration);
    }

    // Check for attack key press
    if (event.key.toLowerCase() === "v" && isPlayable == true) {
      updatePlayerImage("Attack1"); // Change player image to attack
      setTimeout(() => {
        updatePlayerImage("Idle"); // Change player image to idle after attack
      }, 600);
      // Call functions to handle animal and obstacle removal
      handleAnimalRemoval();
      handleSpikesRemoval();
      handleTreeRemoval();
    }

    // Check for energy shield activation key press
    if (event.key.toLowerCase() === "e" && isPlayable == true) {
      if (golden_Energy >= 5) {
        golden_Energy = golden_Energy - 5; // Decrease golden energy
        updateGoldenEnergy(); // Update golden energy display
        shieldImg.classList.add("show"); // Show shield image
        invincibility = true; // Grant invincibility
        // Set timeout to hide shield and remove invincibility
        setTimeout(() => {
          shieldImg.classList.remove("show"); // Hide shield image
          invincibility = false; // Remove invincibility
        }, 7000);
      }

      // Call functions to handle animal and obstacle removal
      handleAnimalRemoval();
      handleSpikesRemoval();
    }
  }

  // Function to handle keyup events
  function handleKeyup(event) {
    keyState[event.key.toLowerCase()] = false; // Set key state to false when key is released
  }

  // Main update function called on each animation frame
  function update() {
    // Check character type for specific movement updates
    if (characterType === "Ranger Monk") {
      if (keyState["d"] && isPlayable == true) { // Move right
        if (!isJumping) updatePlayerImage("Run"); // Change to run image
        translateX -= 15; // Update position
        objects.style.transform = `translateX(${translateX}px)`; // Move objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees
      } else if (keyState["a"] && isPlayable == true) { // Move left
        if (!isJumping) updatePlayerImage("Run"); // Change to run image
        translateX += 10; // Update position
        objects.style.transform = `translateX(${translateX}px)`; // Move objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees
      } else if (!isJumping) {
        updatePlayerImage("Idle"); // Change to idle image when not moving
      }
    } else {
      // Movement logic for other monk types
      if (keyState["d"] && isPlayable == true) { // Move right
        if (!isJumping) updatePlayerImage("Run"); // Change to run image
        translateX -= 10; // Update position
        objects.style.transform = `translateX(${translateX}px)`; // Move objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees
      } else if (keyState["a"] && isPlayable == true) { // Move left
        if (!isJumping) updatePlayerImage("Run"); // Change to run image
        translateX += 10; // Update position
        objects.style.transform = `translateX(${translateX}px)`; // Move objects
        tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees
      } else if (!isJumping) {
        updatePlayerImage("Idle"); // Change to idle image when not moving
      }
    }

    // Call collision detection and handling functions
    handleCollision();
    handleIndicator();
    checkSandStormProximity(); // Check for sandstorm damage proximity
    requestAnimationFrame(update); // Request next animation frame
  }

  let lastGhostDamageTime = 0; // Tracks the last time the ghost dealt damage
  const ghostDamageCooldown = 1000;

  function handleCollision() {
    // Select the ghost image and get the current timestamp
    const ghostObj = document.querySelector(".ghost img");
    const currentTime = Date.now();

    // Check for collision with the ghost
    if (
      checkCollision(player, ghostObj) && // Check if player collides with ghost
      invincibility == false && // Ensure the player is not invincible
      currentTime - lastGhostDamageTime >= ghostDamageCooldown // Check if enough time has passed since last damage
    ) {
      // Deduct health based on character type
      health -= characterType === "warrior" ? 3 : 5; // Warriors take less damage
      updateHealth(); // Update health display
      ghostAudio.play(); // Play ghost sound upon collision
      lastGhostDamageTime = currentTime; // Update the last damage time
      if (health <= 0) {
        console.log("Game Over"); // Log game over if health is zero or below
      }
    }

    // Handle collision with energy items
    const energies = document.querySelectorAll(".energy");
    energies.forEach((energy) => {
      // Check for collision with energy item
      if (
        checkCollision(player, energy.querySelector("img")) && // Check collision with the energy
        !energy.classList.contains("fade-out") // Ensure the energy item is not fading out
      ) {
        golden_Energy++; // Increase the golden energy count
        updateGoldenEnergy(); // Update the display for golden energy
        score += 10; // Increase score
        updateScore(); // Update the score display
        fadeOutAndRemove(energy); // Fade out and remove the energy item
      }
    });

    // Handle collision with harmful objects (wolves, bears, spikes, chopped trees)
    const harmfulObjects = document.querySelectorAll(
      ".wolf, .bear, .spike, .chopped-tree"
    );
    harmfulObjects.forEach((obj) => {
      // Check for collision with harmful objects
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") && // Ensure the object is not fading out
        invincibility == false // Ensure the player is not invincible
      ) {
        health -= 10; // Deduct health
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the harmful object
      }
    });

    // Handle collision with river objects
    const river = document.querySelectorAll(".river");
    river.forEach((obj) => {
      // Check for collision with river
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") && // Ensure the river is not fading out
        invincibility == false // Ensure the player is not invincible
      ) {
        // Deduct health based on character type
        health -= characterType === "warrior" ? 10 : 15; // Warriors take less damage
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the river object
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

    // Handle collision with sand storm objects
    const sandStormObj = document.querySelectorAll(".sand_storm");
    sandStormObj.forEach((obj) => {
      // Check for collision with sand storm
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") && // Ensure the sand storm is not fading out
        invincibility == false // Ensure the player is not invincible
      ) {
        // Health deduction logic is currently commented out
        // health -= 50;
        // updateHealth();
        // fadeOutAndRemove(obj);
      }
    });

    // Handle collision with golem objects
    const GolemObj = document.querySelectorAll(".golem");
    GolemObj.forEach((obj) => {
      // Check for collision with golems
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") && // Ensure the golem is not fading out
        invincibility == false // Ensure the player is not invincible
      ) {
        // Deduct health based on character type
        health -= characterType === "warrior" ? 20 : 30; // Warriors take less damage
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the golem
      }
    });

    // Handle collision with health items (first-aid kits)
    const healthObj = document.querySelectorAll(".first-aid, .t-first-aid");
    healthObj.forEach((obj) => {
      // Check for collision with health items
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") && // Ensure the health item is not fading out
        health < 100 // Ensure health is less than the maximum
      ) {
        health = 100; // Restore health to maximum
        updateHealth(); // Update health display
        fadeOutAndRemove(obj); // Fade out and remove the health item
      }
    });

    // Handle collision with hermit objects
    const hermitObj = document.querySelectorAll(".hermit");
    hermitObj.forEach((obj) => {
      // Check for collision with hermits
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") // Ensure the hermit is not fading out
      ) {
        // Logic related to hermits is currently commented out
        // health = 100;
        // updateHealth();
        // isPlayable = false;
        document.querySelector(".container").style.visibility = "visible"; // Show hermit interaction container
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

    // Repeat similar checks for different hermit objects
    const hermitObj1 = document.querySelectorAll(".hermit1");
    hermitObj1.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") // Ensure the hermit1 is not fading out
      ) {
        document.querySelector(".container1").style.visibility = "visible"; // Show hermit1 interaction container
      }
    });

    const hermitObj2 = document.querySelectorAll(".hermit2");
    hermitObj2.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") // Ensure the hermit2 is not fading out
      ) {
        document.querySelector(".container2").style.visibility = "visible"; // Show hermit2 interaction container
      }
    });

    const hermitObj3 = document.querySelectorAll(".hermit3");
    hermitObj3.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) && // Check collision
        !obj.classList.contains("fade-out") // Ensure the hermit3 is not fading out
      ) {
        document.querySelector(".container3").style.visibility = "visible"; // Show hermit3 interaction container
      }
    });

    // Handle collision with snowman objects
    const snowMan1 = document.querySelectorAll('.snowman1');
    snowMan1.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        // Show snowman1 answer for 3 seconds
        setInterval(() => {
          document.querySelector(".snowman1_ans").style.visibility = "hidden"; // Hide the answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman1_ans").style.visibility = "visible"; // Show the snowman1 answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    // Repeat similar checks for other snowman objects
    const snowMan2 = document.querySelectorAll('.snowman2');
    snowMan2.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman2_ans").style.visibility = "hidden"; // Hide the answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman2_ans").style.visibility = "visible"; // Show the snowman2 answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    const snowMan3 = document.querySelectorAll('.snowman3');
    snowMan3.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman3_ans").style.visibility = "hidden"; // Hide the answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman3_ans").style.visibility = "visible"; // Show the snowman3 answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });

    const snowMan4 = document.querySelectorAll('.snowman4');
    snowMan4.forEach(obj => {
      if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
        setInterval(() => {
          document.querySelector(".snowman4_ans").style.visibility = "hidden"; // Hide the answer after 3 seconds
        }, 3000);
        document.querySelector(".snowman4_ans").style.visibility = "visible"; // Show the snowman4 answer
        fadeOutAndRemove(obj); // Fade out and remove the snowman
      }
    });
  }

       // Check for collision with snowman5 objects
       const snowMan15 = document.querySelectorAll('.snowman5');
       snowMan5.forEach(obj => {
         if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
           document.querySelector(".snowman_final").style.visibility = "visible"; // Show final snowman popup
           isPlayable = false; // Disable gameplay
           initializeQuiz(); // Initialize quiz related to snowman5
           fadeOutAndRemove(obj); // Fade out and remove snowman5 object
         }
       });
     });

  // Handles the visibility of animal indicators based on proximity to the player
  function handleIndicator() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select all wolves and bears
    const animal_indicators = document.querySelector(".animal_indicator"); // Get the animal indicator element
    let nearby = false; // Flag to track if any animal is nearby

    // Check collision for each animal with the player
    animals.forEach((animal) => {
      if (checkCollision(player, animal.querySelector("img"), 50)) {
        nearby = true; // Set flag if collision is detected
      }
    });

    // Show or hide the indicator based on proximity
    indicator.style.display = nearby ? "block" : "none";
    animal_indicators.style.display = nearby ? "block" : "none";
  }

  // Handles removal of animals when the player collides with them
  function handleAnimalRemoval() {
    const animals = document.querySelectorAll(".wolf, .bear"); // Select all wolves and bears
    animals.forEach((animal) => {
      // Check if the player collides with the animal and it is not already fading out
      if (
        checkCollision(player, animal.querySelector("img"), 50) &&
        !animal.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(animal); // Fade out and remove the animal
        score += 50; // Increase score by 50
        updateScore(); // Update the score display
      }
    });
  }

  // Handles removal of spikes when the player collides with them
  function handleSpikesRemoval() {
    const spikes = document.querySelectorAll(".spike"); // Select all spikes
    spikes.forEach((spike) => {
      // Check if the player collides with the spike and it is not already fading out
      if (
        checkCollision(player, spike.querySelector("img"), 50) &&
        !spike.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(spike); // Fade out and remove the spike
      }
    });
  }

  // Handles removal of chopped trees when the player collides with them
  function handleTreeRemoval() {
    const chopped_tree = document.querySelectorAll(".chopped-tree"); // Select all chopped trees
    chopped_tree.forEach((tree) => {
      // Check if the player collides with the tree and it is not already fading out
      if (
        checkCollision(player, tree.querySelector("img"), 50) &&
        !tree.classList.contains("fade-out")
      ) {
        score += 10; // Increase score by 10
        updateScore(); // Update the score display
        fadeOutAndRemove(tree); // Fade out and remove the tree
      }
    });
  }

  // Fades out an element and removes it from the game
  function fadeOutAndRemove(element) {
    element.classList.add("fade-out"); // Add fade-out class to trigger CSS animation
    setTimeout(() => {
      element.style.opacity = "0"; // Set opacity to 0 after a delay
    }, 500); // Match the timeout duration with the CSS transition duration
  }

  // Checks if two rectangles collide, with an optional range for additional space
  function checkCollision(rect1, rect2, range = 0) {
    const rect1Bounds = rect1.getBoundingClientRect(); // Get bounding rectangle of the first element
    const rect2Bounds = rect2.getBoundingClientRect(); // Get bounding rectangle of the second element

    // Return true if there is a collision, taking into account the range
    return !(
      rect1Bounds.top > rect2Bounds.bottom + range ||
      rect1Bounds.bottom < rect2Bounds.top - range ||
      rect1Bounds.right < rect2Bounds.left - range ||
      rect1Bounds.left > rect2Bounds.right + range
    );
  }

  // Event listeners for key down and key up actions
  document.addEventListener("keydown", handleKeydown); // Handle key down events
  document.addEventListener("keyup", handleKeyup); // Handle key up events

  // Initial updates for score and health
  updateScore(); // Update the score display
  updateHealth(); // Update the health display
  update(); // Start the game update loop

  //QUIZ GAME 
  // quiz game 
  const quizData = [
    {
      question: "What is the Cause Suffering Truth of Buddha?",
      options: ["The Truth of Suffering", "The Truth of Defeating", "The Truth of the Cause of Suffering", "The Truth of Not Suffocating"],
      correct: "The Truth of the Cause of Suffering"
    },
    {
      question: "Which is the one of the Noble Truths of Buddha?",
      options: ["The Truth of Suffering", "The Truth of Defeating", "The Truth of other Suffering", "The Truth of not Defeating"],
      correct: "The Truth of Suffering"
    },
    {
      question: "Which is the one of the Noble Truths of Buddha?",
      options: ["The Truth of Suffering", "The Truth of Defeating", "The Truth of other Suffering", "The Truth of not Defeating"],
      correct: "The Truth of Suffering"
    },
    // Add more questions as needed
  ];
  // Current index of the question being displayed
  let currentQuestionIndex = 0;

  // Player's score
  let score1 = 0;

  // Interval for the timer
  let timerInterval;

  // Array to store the user's answers
  const userAnswers = [];

  // Element to display the current question number
  const questionNumberElement = document.getElementById("question-number");

  // Element to display the question text
  const questionTextElement = document.getElementById("question-text");

  // Container for the answer options
  const optionsContainer = document.querySelector(".options");

  // Button to proceed to the next question
  const nextButton = document.getElementById("next-button");

  // Element to display the countdown timer
  const timerElement = document.getElementById("timer");

  // Element to display the player's score
  const scoreElement1 = document.getElementById("score");

  // Element for the progress bar indicating quiz progress
  const progressBar = document.getElementById("progress-bar");

  // Container for the scoreboard that displays results
  const scoreboardContainer = document.getElementById("scoreboard-container");

  // Body of the scoreboard table to display individual scores
  const scoreboardBody = document.querySelector("#scoreboard tbody");

  // Button to restart the quiz
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

  // Function to shuffle an array in place using Fisher-Yates algorithm
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      // Generate a random index
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements at indices i and j
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array; // Return the shuffled array
  }

  // Function to initialize the quiz by shuffling questions and loading the first question
  function initializeQuiz() {
    shuffleArray(quizData); // Shuffle the quiz data
    loadQuestion(); // Load the first question
  }

  // Function to load the current question and its options
  function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex]; // Get the current question
    questionNumberElement.textContent = `${currentQuestionIndex + 1}/${quizData.length
      }`; // Display the current question number

    questionTextElement.textContent = currentQuestion.question; // Set the question text

    optionsContainer.innerHTML = ""; // Clear previous options
    const shuffledOptions = shuffleArray([...currentQuestion.options]); // Shuffle options
    shuffledOptions.forEach((option) => {
      // Create radio buttons for each option
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio"; // Set input type to radio
      input.name = "answer"; // Set name for grouping options
      input.value = option; // Set the value of the input

      const span = document.createElement("span"); // Create a span for the option text
      span.textContent = option; // Set the option text

      label.appendChild(input); // Add input to label
      label.appendChild(span); // Add span to label
      optionsContainer.appendChild(label); // Add label to options container
    });

    updateProgressBar(); // Update the progress bar
    resetTimer(); // Reset the timer for the current question
  }

  // Function to update the progress bar based on the current question index
  function updateProgressBar() {
    const progress = (currentQuestionIndex / quizData.length) * 100; // Calculate progress percentage
    progressBar.style.width = `${progress}%`; // Set progress bar width
  }

  // Function to reset the timer for the current question
  function resetTimer() {
    clearInterval(timerInterval); // Clear any existing timer
    let timeLeft = 30; // Set time left to 30 seconds
    timerElement.textContent = timeLeft; // Display the initial time left

    // Start a new timer interval
    timerInterval = setInterval(() => {
      timeLeft--; // Decrement time left
      timerElement.textContent = timeLeft; // Update displayed time

      // Change timer color when time is running low
      if (timeLeft <= 10) {
        timerElement.style.color = "#e74c3c"; // Change to red
      }

      // Check if time has run out
      if (timeLeft <= 0) {
        clearInterval(timerInterval); // Clear the timer
        handleNextButtonClick(); // Automatically proceed to the next question
      }
    }, 1000); // Update timer every second
  }

  // Function to handle the next button click event
  function handleNextButtonClick() {
    const selectedOption = document.querySelector(
      'input[name="answer"]:checked' // Get the selected answer
    );

    if (selectedOption) {
      // If an answer was selected
      userAnswers.push({
        question: quizData[currentQuestionIndex].question, // Store the question
        yourAnswer: selectedOption.value, // Store the user's answer
        correctAnswer: quizData[currentQuestionIndex].correct // Store the correct answer
      });

      // Check if the answer is correct
      if (selectedOption.value === quizData[currentQuestionIndex].correct) {
        score1++; // Increment the score
        scoreElement1.textContent = `Score: ${score1}`; // Update the score display
      }
    } else {
      // If no answer was selected
      userAnswers.push({
        question: quizData[currentQuestionIndex].question, // Store the question
        yourAnswer: "No answer selected", // Indicate no answer was selected
        correctAnswer: quizData[currentQuestionIndex].correct // Store the correct answer
      });
    }

    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < quizData.length) {
      saveProgress(); // Save progress before loading the next question
      loadQuestion(); // Load the next question
    } else {
      saveProgress(); // Save progress before displaying results
      displayResults(); // Display the quiz results
    }

    // Reset the radio button selection for the next question
    document
      .querySelectorAll('input[name="answer"]')
      .forEach((input) => (input.checked = false));
  }

  // Function to display the results after the quiz is completed
  function displayResults() {
    clearInterval(timerInterval); // Clear the timer
    questionNumberElement.textContent = "Quiz Completed"; // Update question number display
    document.querySelector(".score_display").textContent = `Your score is ${score1}/${quizData.length}`; // Show the final score

    optionsContainer.innerHTML = ""; // Clear options container
    nextButton.style.display = "none"; // Hide the next button
    scoreboardContainer.style.display = "block"; // Show the scoreboard
    renderScoreboard(); // Render the scoreboard with results
    localStorage.removeItem("quizProgress"); // Clear saved progress after displaying results
  }


  function renderScoreboard() {
    // Clear any existing content in the scoreboard body
    scoreboardBody.innerHTML = "";

    // Iterate through each answer in the userAnswers array
    userAnswers.forEach((answer, index) => {
      // Create a new table row for each answer
      const row = document.createElement("tr");

      // Create table cells for question, user's answer, and correct answer
      const questionCell = document.createElement("td");
      const yourAnswerCell = document.createElement("td");
      const correctAnswerCell = document.createElement("td");

      // Set the text content for each cell
      questionCell.textContent = `Q${index + 1}: ${answer.question}`; // Display the question number and text
      yourAnswerCell.textContent = answer.yourAnswer; // Display the user's selected answer
      correctAnswerCell.textContent = answer.correctAnswer; // Display the correct answer

      // Append cells to the row
      row.appendChild(questionCell);
      row.appendChild(yourAnswerCell);
      row.appendChild(correctAnswerCell);

      // Append the row to the scoreboard body
      scoreboardBody.appendChild(row);
    });
  }

  function restartQuiz() {
    // Save current game state to localStorage before restarting
    localStorage.setItem("Health_3", health); // Save player's health
    localStorage.setItem("Score_3", score); // Save player's score
    localStorage.setItem("Energies_3", golden_Energy); // Save collected energies
    localStorage.setItem("Min_3", min); // Save remaining minutes
    localStorage.setItem("Sec_3", sec); // Save remaining seconds

    // Open the scoreboard page and close the current quiz page
    window.open('ScoreBoard.html');
    window.close('level3.html');
  }

  // Event listener for the next button to handle the next question
  nextButton.addEventListener("click", handleNextButtonClick);

  // Event listener for the restart button to restart the quiz
  restartButton.addEventListener("click", restartQuiz);

  // Check localStorage for saved progress when the DOM is loaded
  retrieveProgress();

});

// memory game --------------------------------------------------------

(function (d, w) {
  // Initialize variables to hold card data, match count, and flipped cards
  let cards = [];
  let matches = 0;
  const flipped_cards = [];

  // Mapping of card names to their corresponding image files
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
    const board = d.querySelector(".board"); // Select the board element
    cards = get_cards(); // Get shuffled cards for the game
    // Create card elements and assign them IDs
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join("");

    board.innerHTML = card_items; // Insert card elements into the board
    board.addEventListener("click", flip_card); // Add click event listener to the board
  };

  // Function to handle flipping of cards
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the clicked card
    // Check if the clicked element is a valid card and not already matched or flipped
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    if (flipped_cards.length == 2) return; // Limit to two flipped cards at a time

    // Set the background image of the card and mark it as flipped
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped");

    // Add the flipped card and its name to the flipped_cards array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the flipped cards are a match
  const check_match = () => {
    // If the names of the flipped cards match
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // Mark both cards as a match
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2; // Increment the match count
      flipped_cards.length = 0; // Reset flipped cards array

      // Check if the game is over
      if (game_over()) {
        isPlayable = false; // Set the game state to not playable
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container").addClass("hidden"); // Hide the game container
        document.querySelector(".container").style.visibility = "hidden"; // Set visibility to hidden
        build_board(); // Rebuild the board for a new game
      }
    } else {
      // If no match, flip the cards back after a delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Reset flipped cards array
      }, 800); // Delay for 800 milliseconds before flipping back
    }
  };

  // Function to shuffle the cards
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to keep track of random numbers generated
    const total = stack.length; // Total number of cards
    let i = 0;

    // Shuffle logic
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random number
      // Ensure the number hasn't been used before
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add card to shuffled array
        random_numbers.push(number); // Track the used number
        i++;
      }
    }

    return shuffled; // Return the shuffled array
  };

  // Function to check if the game is over
  const game_over = () => {
    if (matches === cards.length) { // If all matches are found
      matches = 0; // Reset match count for next game
      return true; // Game is over
    }
    return false; // Game is not over
  };

  // Function to get a shuffled array of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"];

    // Duplicate the stack to create pairs of cards
    const full_stack = stack.concat(stack);

    return shuffle_cards(full_stack); // Shuffle and return the full stack
  };

  // Build the initial game board
  build_board();
})(document, window);

//memory game --------------------------------------------------------
(function (d, w) {
  // Initialize an array to hold the cards and a variable to track matches
  let cards = [];
  let matches = 0; // Count of matched pairs
  const flipped_cards = []; // Store currently flipped cards

  // Map each technology name to its corresponding image
  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  // Build the game board
  const build_board = () => {
    // Select the board element from the document
    const board = d.querySelector(".board1");
    // Retrieve a shuffled set of cards
    cards = get_cards();
    // Generate HTML for each card
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`; // Create a card element with a unique data-id
      })
      .join("");

    // Insert the card elements into the board
    board.innerHTML = card_items;
    // Add click event listener to the board
    board.addEventListener("click", flip_card);
  };

  // Flip the card when clicked
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the card element that was clicked
    // Prevent action if the card is already matched or flipped, or if two cards are already flipped
    if (!card || card.matches(".is-match") || card.matches(".is-flipped")) return;
    if (flipped_cards.length == 2) return;

    // Set the background image of the card to show the technology
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]})`;
    card.classList.add("is-flipped"); // Add class to visually indicate the card is flipped

    // Add the flipped card to the array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id], // Store the name associated with the card
    });

    // If two cards are flipped, check for a match
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Check if the two flipped cards match
  const check_match = () => {
    // If names of both flipped cards are the same
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // Mark them as matched and remove the flipped class
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2; // Increment the matches count
      flipped_cards.length = 0; // Reset the flipped cards array

      // Check if the game is over
      if (game_over()) {
        console.log("You Won now move to next part!!!");
        // Hide the current game container
        $(".container1").addClass("hidden");
        document.querySelector(".container1").style.visibility = "hidden";
        build_board(); // Restart the game by building a new board
      }
    } else {
      // If they do not match, flip them back after a short delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Remove the image
          card.classList.remove("is-flipped"); // Reset the flipped class
        });
        flipped_cards.length = 0; // Reset the flipped cards array
      }, 800); // Delay before flipping back
    }
  };

  // Shuffle the cards randomly
  const shuffle_cards = (stack) => {
    const shuffled = [];
    const random_numbers = [];
    const total = stack.length;
    let i = 0;

    // Continue until all cards are shuffled
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the index hasn't been picked before
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card to shuffled array
        random_numbers.push(number); // Keep track of picked numbers
        i++; // Increment the count
      }
    }

    return shuffled; // Return the shuffled cards
  };

  // Check if the game is over (all matches found)
  const game_over = () => {
    if (matches === cards.length) {
      matches = 0; // Reset matches for a new game
      return true; // Return true indicating the game is over
    }
    return false; // Game is not over yet
  };

  // Retrieve and shuffle the card stack
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // List of technologies

    const full_stack = stack.concat(stack); // Duplicate the stack for pairs

    return shuffle_cards(full_stack); // Shuffle and return the cards
  };

  build_board(); // Initialize the game board
})(document, window); // Self-invoking function to encapsulate the code

//memory game --------------------------------------------------------
(function (d, w) {
  let cards = []; // Array to hold the card names
  let matches = 0; // Counter for matched pairs
  const flipped_cards = []; // Array to keep track of currently flipped cards

  // Mapping of card names to image file paths
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
    cards = get_cards(); // Get shuffled cards
    const card_items = cards
      .map((card, id) => {
        // Create card elements with data-id attribute
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join(""); // Join the array of card items into a string

    board.innerHTML = card_items; // Set the inner HTML of the board
    board.addEventListener("click", flip_card); // Add click event to flip cards
  };

  // Function to handle card flipping
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the clicked card
    // Exit if no card is clicked, or if it's already matched or flipped
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    // Prevent flipping more than two cards at once
    if (flipped_cards.length == 2) return;

    // Set the background image of the flipped card
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped"); // Add class to indicate card is flipped

    // Add the flipped card and its name to the flipped_cards array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the flipped cards match
  const check_match = () => {
    // If the names of the flipped cards match
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // Update the cards to indicate a match
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match"); // Add match class
        flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
      });

      matches += 2; // Increase matches counter
      flipped_cards.length = 0; // Clear flipped cards

      // Check if the game is over
      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container2").addClass("hidden"); // Hide the current container
        document.querySelector(".container2").style.visibility = "hidden"; // Set visibility to hidden
        build_board(); // Build the board again for the next part
      }
    } else {
      // If cards do not match, flip them back after a delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Clear flipped cards
      }, 800); // Delay of 800ms before flipping back
    }
  };

  // Function to shuffle cards randomly
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to track used random numbers
    const total = stack.length; // Total number of cards
    let i = 0;

    // Loop until all cards are shuffled
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the number has not been used already
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card to shuffled array
        random_numbers.push(number); // Track the used number
        i++; // Increment counter
      }
    }

    return shuffled; // Return the shuffled cards
  };

  // Function to check if the game is over
  const game_over = () => {
    // Check if all matches are found
    if (matches === cards.length) {
      matches = 0; // Reset matches for the next game
      return true; // Game is over
    }
    return false; // Game is not over
  };

  // Function to get a shuffled set of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Define card types

    const full_stack = stack.concat(stack); // Duplicate the stack for pairs

    return shuffle_cards(full_stack); // Shuffle and return the full stack
  };

  build_board(); // Initial call to build the game board
})(document, window);

//memory game --------------------------------------------------------
(function (d, w) {
  let cards = []; // Array to hold the card names
  let matches = 0; // Counter for matched pairs
  const flipped_cards = []; // Array to keep track of currently flipped cards

  // Mapping of card names to image file paths
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
    cards = get_cards(); // Get shuffled cards
    const card_items = cards
      .map((card, id) => {
        // Create card elements with data-id attribute
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join(""); // Join the array of card items into a string

    board.innerHTML = card_items; // Set the inner HTML of the board
    board.addEventListener("click", flip_card); // Add click event to flip cards
  };

  // Function to handle card flipping
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the clicked card
    // Exit if no card is clicked, or if it's already matched or flipped
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    // Prevent flipping more than two cards at once
    if (flipped_cards.length == 2) return;

    // Set the background image of the flipped card
    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
      })`;
    card.classList.add("is-flipped"); // Add class to indicate card is flipped

    // Add the flipped card and its name to the flipped_cards array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  // Function to check if the flipped cards match
  const check_match = () => {
    // If the names of the flipped cards match
    if (flipped_cards[0].name === flipped_cards[1].name) {
      // Update the cards to indicate a match
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match"); // Add match class
        flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
      });

      matches += 2; // Increase matches counter
      flipped_cards.length = 0; // Clear flipped cards

      // Check if the game is over
      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container2").addClass("hidden"); // Hide the current container
        document.querySelector(".container2").style.visibility = "hidden"; // Set visibility to hidden
        build_board(); // Build the board again for the next part
      }
    } else {
      // If cards do not match, flip them back after a delay
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = ""; // Clear the background image
          card.classList.remove("is-flipped"); // Remove flipped class
        });
        flipped_cards.length = 0; // Clear flipped cards
      }, 800); // Delay of 800ms before flipping back
    }
  };

  // Function to shuffle cards randomly
  const shuffle_cards = (stack) => {
    const shuffled = []; // Array to hold shuffled cards
    const random_numbers = []; // Array to track used random numbers
    const total = stack.length; // Total number of cards
    let i = 0;

    // Loop until all cards are shuffled
    while (i < total) {
      const number = Math.floor(Math.random() * total); // Generate a random index
      // Ensure the number has not been used already
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]); // Add the card to shuffled array
        random_numbers.push(number); // Track the used number
        i++; // Increment counter
      }
    }

    return shuffled; // Return the shuffled cards
  };

  // Function to check if the game is over
  const game_over = () => {
    // Check if all matches are found
    if (matches === cards.length) {
      matches = 0; // Reset matches for the next game
      return true; // Game is over
    }
    return false; // Game is not over
  };

  // Function to get a shuffled set of cards
  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Define card types

    const full_stack = stack.concat(stack); // Duplicate the stack for pairs

    return shuffle_cards(full_stack); // Shuffle and return the full stack
  };

  build_board(); // Initial call to build the game board
})(document, window);
