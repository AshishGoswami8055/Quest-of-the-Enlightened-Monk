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
  if(playSound == 0){
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
    if(min == 0 && sec == 44){
      Weather();
    }
    if(min == 1 && sec == 36){
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

// Function to update player image based on the current action
function updatePlayerImage(action) {
  let characterPath;

  // Determine character path based on character type
  if (characterType == "Zen Monk") {
    characterPath = "images/zen";
  } else if (characterType == "Ranger Monk") {
    characterPath = "images/ranger";
  } else if (characterType == "Warrior Monk") {
    characterPath = "images/male";
  } else {
    characterPath = "images/female"; // Default path for female characters
  }

  // Select the player image element
  const player = document.querySelector("#player img");
  // Update the image source based on the action provided
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
      console.warn("Unknown action:", action); // Log unknown actions
      // Optionally, you can set a default image or handle unknown actions here
      player.src = `${characterPath}/idle.gif`; // Default action
      break;
  }
}

// Function to update player's health display and check for game over
function updateHealth() {
  healthElement.textContent = `Health : ${health}`; // Update health display
  if (health <= 0) {
    player.src = `images/male/Death.gif`; // Show death animation
    document.querySelector(".game_over").style.visibility = "visible"; // Show game over screen
    console.log("Game Over");
    // Reload the game or redirect to a game over screen after a delay
    setInterval(() => {
      window.location.reload();
    }, 3000);
  }
}

// Function to activate monk abilities based on character type
function activateMonkAbilities(characterType) {
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
      console.warn("Unknown monk type:", characterType); // Log unknown monk types
      break;
  }
}

let zenMonkHealthInterval = null; // Variable for Zen Monk health regeneration interval

// Function to define Zen Monk abilities
function zenMonkAbilities() {
  console.log("hii"); // Log activation
  setInterval(() => {
    if (health < 100) {
      health += 10; // Increase health by 10
      updateHealth(); // Update health display
      if (health > 100) {
        health = 100; // Cap health at 100
        updateHealth(); // Update health display
      }
    }
  }, 5000); // Health regeneration every 5 seconds
}

// Function to define Ranger Monk abilities
function rangerMonkAbilities() {
  console.log(
    "Ranger Monk activated: Increased speed, agility, better trap detection, and evasion."
  ); // Log activation
}

// Function to define Warrior Monk abilities
function warriorMonkAbilities() {
  console.log(
    "Warrior Monk activated: Increased attack power, advanced combat moves, higher damage resistance."
  ); // Log activation
}

// Function to define Mystic Monk abilities
function mysticMonkAbilities() {
  console.log("Mystic Monk activated: Energy manipulation, teleportation."); // Log activation

  // Add the teleportation ability
  document.addEventListener("keyup", (event) => {
    if (event.key.toLowerCase() === "t" && isPlayable && golden_Energy >= 5) {
      // 'T' key for teleport if playable and sufficient golden energy
      teleport();
    }
  });

  // Function to perform teleportation
  function teleport() {
    // Define the distance to teleport
    const teleportDistance = 500; // Change this value as needed

    // Apply the teleportation effect
    translateX -= teleportDistance; // Update translation position
    objects.style.transform = `translateX(${translateX}px)`; // Move game objects
    tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move tree objects proportionally

    // Optional: You can add an animation or effect during teleportation
    // updatePlayerImage("Teleport"); // Uncomment for teleport animation
    player.src = `images/female/teleport.gif`; // Show teleport animation
    console.log("Teleported!"); // Log teleport action
  }
}

// Function to flip the animal images between two states (normal and alternate) for wolves and bears
function flipAnimal() { 
  // Select all wolf and bear images
  let wolves = document.querySelectorAll(".wolf img");
  let bears = document.querySelectorAll(".bear img");
  
  let isWolfGif = true; // Start with wolf.gif for flipping
  let isBearGif = true; // Start with bear.gif for flipping
  
  // Set an interval to toggle the images every 2.5 seconds
  setInterval(() => {
    // Determine the new source for wolf and bear images
    let newWolfSrc = isWolfGif ? "images/wolfRight.gif" : "images/wolf.gif";
    let newBearSrc = isBearGif ? "images/bearRight.gif" : "images/bear.gif";
    
    // Update the source for each wolf image
    wolves.forEach((img) => {
      img.src = newWolfSrc;
    });
    
    // Update the source for each bear image
    bears.forEach((img) => {
      img.src = newBearSrc;
    });

    // Flip the state for the next interval
    isWolfGif = !isWolfGif;
    isBearGif = !isBearGif;
  }, 2500); // Toggle every 2.5 seconds
}

// Event listener for DOMContentLoaded to start game functionalities once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  flipAnimal(); // Call the function to start flipping animal images
  
  // Function to update the displayed score
  function updateScore() {
    scoreElement.textContent = `Score : ${score}`;
  }

  // Function to update the golden energy count and show notifications if applicable
  function updateGoldenEnergy() {
    if (golden_Energy >= 5) {
      notification.innerHTML =
        "Now You can use the ENERGY Shield by pressing 'e'"; // Notify user about the energy shield
      setInterval(() => {
        notification.innerHTML = ""; // Clear the notification after 5 seconds
      }, 5000);
    } else {
      notification.innerHTML = ""; // Clear notification if condition is not met
    }
    // Update golden energy display
    goldenElement.textContent = `${golden_Energy}`;
  }

  let sandstormDamageInterval; // Interval for sandstorm damage

  // Function to check the proximity of the player to the sandstorm and ghost
  function checkSandStormProximity() {
    // Get the bounding rectangles of player, sandstorm, and ghost
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

    // Calculate the distance between the centers of player and sandstorm
    const distance = Math.sqrt(
      Math.pow(playerCenterX - sandStormCenterX, 2) +
        Math.pow(playerCenterY - sandStormCenterY, 2)
    );

    // Calculate the distance between the player and the ghost
    const distance_ghost = Math.sqrt(
      Math.pow(playerCenterX - ghostCenterX, 2) +
        Math.pow(playerCenterY - ghostCenterY, 2)
    );

    if (distance <= 800) {
      // Adjust the range as needed for sandstorm damage

      // Apply damage when player is in range of the sandstorm
      if (!sandstormDamageInterval) {
        sandstormDamageInterval = setInterval(() => {
          health -= 5; // Reduce health by 5
          updateHealth(); // Update health display
          if (health <= 0) {
            clearInterval(sandstormDamageInterval); // Stop damage interval
            // Handle game over scenario
          }
        }, 1000); // Apply damage every second
      }
    } else {
      clearInterval(sandstormDamageInterval); // Clear interval if out of range
      sandstormDamageInterval = null;
    }

    if (distance_ghost <= 300) {
      ghostAudio.play(); // Play ghost sound
      ghost.classList.add("active"); // Activate ghost
      // console.log("Ghost attack"); // Debug message (commented out)
    } else {
      ghost.classList.remove("active"); // Deactivate ghost
      // console.log("Ghost See it"); // Debug message (commented out)
    }
  }

  // Function to handle keydown events
  function handleKeydown(event) {
    keyState[event.key.toLowerCase()] = true; // Set key state to true when key is pressed
    if (
      !isJumping &&
      (keyState["w"] || (keyState["W"] && isPlayable == true))
    ) {
      // jumpSound.play(); // Uncomment to play jump sound

      console.log("Jump initiated"); // Debug message
      jumpSound.play(); // Play jump sound

      isJumping = true; // Set jumping state to true
      updatePlayerImage("Jump"); // Update player image to Jump
      player.classList.add("jump"); // Add jump class to player
      shieldImg.classList.add("jump"); // Add jump class to shield image
      setTimeout(() => {
        updatePlayerImage("Fall"); // Change image to Fall after 300ms
      }, 300);

      setTimeout(() => {
        updatePlayerImage("Idle"); // Change image back to Idle after jump duration
        player.classList.remove("jump"); // Remove jump class from player
        shieldImg.classList.remove("jump"); // Remove jump class from shield image
        isJumping = false; // Set jumping state to false
      }, jumpDuration);
    }
    if (event.key.toLowerCase() === "v" && isPlayable == true) {
      updatePlayerImage("Attack1"); // Update player image to Attack1
      setTimeout(() => {
        updatePlayerImage("Idle"); // Change image back to Idle after 600ms
      }, 600);
      handleAnimalRemoval(); // Handle removal of animals
      handleSpikesRemoval(); // Handle removal of spikes
      handleTreeRemoval(); // Handle removal of trees
    }
    if (event.key.toLowerCase() === "e" && isPlayable == true) {
      if (golden_Energy >= 5) {
        golden_Energy = golden_Energy - 5; // Deduct golden energy
        updateGoldenEnergy(); // Update golden energy display
        shieldImg.classList.add("show"); // Show the energy shield
        invincibility = true; // Set invincibility state
        setTimeout(() => {
          shieldImg.classList.remove("show"); // Hide the shield after 7 seconds
          invincibility = false; // Reset invincibility state
        }, 7000);
      }

      handleAnimalRemoval(); // Handle removal of animals
      handleSpikesRemoval(); // Handle removal of spikes
    }
  }

  // Function to handle keyup events
  function handleKeyup(event) {
    keyState[event.key.toLowerCase()] = false; // Set key state to false when key is released
  }
});
////

function update() {
  // Update function to handle character movement and animations
  if (characterType === "Ranger Monk") {
      // Handle right movement
      if (keyState["d"] && isPlayable == true) {
          if (!isJumping) updatePlayerImage("Run"); // Change to Run image if not jumping
          translateX -= 15; // Move character to the right
          objects.style.transform = `translateX(${translateX}px)`; // Update object's position
          tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees for parallax effect
      } 
      // Handle left movement
      else if (keyState["a"] && isPlayable == true) {
          if (!isJumping) updatePlayerImage("Run"); // Change to Run image if not jumping
          translateX += 10; // Move character to the left
          objects.style.transform = `translateX(${translateX}px)`; // Update object's position
          tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees for parallax effect
      } 
      // Idle state when no movement
      else if (!isJumping) {
          updatePlayerImage("Idle"); // Change to Idle image
      }
  } else {
      // Handle movement for other character types
      if (keyState["d"] && isPlayable == true) {
          if (!isJumping) updatePlayerImage("Run"); // Change to Run image if not jumping
          translateX -= 10; // Move character to the right
          objects.style.transform = `translateX(${translateX}px)`; // Update object's position
          tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees for parallax effect
      } 
      // Handle left movement
      else if (keyState["a"] && isPlayable == true) {
          if (!isJumping) updatePlayerImage("Run"); // Change to Run image if not jumping
          translateX += 10; // Move character to the left
          objects.style.transform = `translateX(${translateX}px)`; // Update object's position
          tree_Objs.style.transform = `translateX(${translateX / 5}px)`; // Move trees for parallax effect
      } 
      // Idle state when no movement
      else if (!isJumping) {
          updatePlayerImage("Idle"); // Change to Idle image
      }
  }

  // Handle various game mechanics
  handleCollision(); // Check for collisions with other objects
  handleIndicator(); // Update UI indicators (like health, score)
  checkSandStormProximity(); // Check proximity to sandstorms

  // Request the next frame for the update function
  requestAnimationFrame(update);
}

// Variables to manage ghost damage timing
let lastGhostDamageTime = 0; // Tracks the last time the ghost dealt damage
const ghostDamageCooldown = 1000; // Time between damage from ghost

function handleCollision() {
  const ghostObj = document.querySelector(".ghost img"); // Select ghost object
  const currentTime = Date.now(); // Get current time

  // Check collision with ghost
  if (
      checkCollision(player, ghostObj) &&
      invincibility == false && // Ensure player is not invincible
      currentTime - lastGhostDamageTime >= ghostDamageCooldown // Check cooldown
  ) {
      // Damage calculation based on character type
      health -= characterType === "Warrior Monk" ? 3 : 5; 
      updateHealth(); // Update health UI
      ghostAudio.play(); // Play ghost sound upon collision
      lastGhostDamageTime = currentTime; // Update the last damage time
      if (health <= 0) {
          console.log("Game Over"); // Log game over if health drops to 0
      }
  }

  const energies = document.querySelectorAll(".energy"); // Select all energy objects
  energies.forEach((energy) => {
      // Check collision with energy collectables
      if (
          checkCollision(player, energy.querySelector("img")) &&
          !energy.classList.contains("fade-out") // Ensure energy isn't already fading out
      ) {
          golden_Energy++; // Increment golden energy count
          updateGoldenEnergy(); // Update golden energy UI
          score += 10; // Increment score
          updateScore(); // Update score UI
          fadeOutAndRemove(energy); // Fade out and remove the energy object
      }
  });

  const harmfulObjects = document.querySelectorAll(".wolf, .bear, .spike, .chopped-tree"); // Select harmful objects
  harmfulObjects.forEach((obj) => {
      // Check collision with harmful objects
      if (
          checkCollision(player, obj.querySelector("img")) &&
          !obj.classList.contains("fade-out") && // Ensure object isn't already fading out
          invincibility == false // Ensure player is not invincible
      ) {
          health -= 10; // Decrease health by 10
          updateHealth(); // Update health UI
          fadeOutAndRemove(obj); // Fade out and remove the harmful object
      }
  });

  const river = document.querySelectorAll(".river"); // Select river objects
  river.forEach((obj) => {
      // Check collision with river objects
      if (
          checkCollision(player, obj.querySelector("img")) &&
          !obj.classList.contains("fade-out") && // Ensure object isn't already fading out
          invincibility == false // Ensure player is not invincible
      ) {
          // Damage calculation based on character type
          health -= characterType === "Warrior Monk" ? 10 : 15; 
          updateHealth(); // Update health UI
          fadeOutAndRemove(obj); // Fade out and remove the river object
      }
  });

  // Handle collisions with sand storms
  const sandStormObj = document.querySelectorAll(".sand_storm");
  sandStormObj.forEach((obj) => {
      // Check collision with sand storm objects
      if (
          checkCollision(player, obj.querySelector("img")) &&
          !obj.classList.contains("fade-out") && // Ensure object isn't already fading out
          invincibility == false // Ensure player is not invincible
      ) {
          // Additional logic can be added for sand storm effects
      }
  });

  // Handle collisions with golems
  const GolemObj = document.querySelectorAll(".golem");
  GolemObj.forEach((obj) => {
      // Check collision with golem objects
      if (
          checkCollision(player, obj.querySelector("img")) &&
          !obj.classList.contains("fade-out") && // Ensure object isn't already fading out
          invincibility == false // Ensure player is not invincible
      ) {
          // Damage calculation based on character type
          health -= characterType === "Warrior Monk" ? 20 : 30; 
          updateHealth(); // Update health UI
          fadeOutAndRemove(obj); // Fade out and remove the golem object
      }
  });

  // Function to handle player updates such as movement and collisions
const healthObj = document.querySelectorAll(".first-aid, .t-first-aid"); // Selects all health-related objects
healthObj.forEach((obj) => {
  // Check for collision with health objects
  if (
    checkCollision(player, obj.querySelector("img")) && // If player collides with the object
    !obj.classList.contains("fade-out") && // Ensure the object is not fading out
    health < 100 // Check if health is below max
  ) {
    health = 100; // Restore health to max
    updateHealth(); // Update health display
    fadeOutAndRemove(obj); // Fade out and remove the health object from the scene
  }
});

// Select all hermit objects for interaction
const hermitObj2 = document.querySelectorAll(".hermit");
hermitObj2.forEach((obj) => {
  // Check for collision with hermits
  if (
    checkCollision(player, obj.querySelector("img")) && // If player collides with the object
    !obj.classList.contains("fade-out") // Ensure the object is not fading out
  ) {
    document.querySelector(".container").style.visibility = "visible"; // Show the interaction container
  }
});

// Handle interactions with different types of hermits
const hermitObj1 = document.querySelectorAll(".hermit1");
hermitObj1.forEach((obj) => {
  if (
    checkCollision(player, obj.querySelector("img")) &&
    !obj.classList.contains("fade-out")
  ) {
    document.querySelector(".container1").style.visibility = "visible"; // Show the first hermit container
  }
});

const hermitObj3 = document.querySelectorAll(".hermit2");
hermitObj3.forEach((obj) => {
  if (
    checkCollision(player, obj.querySelector("img")) &&
    !obj.classList.contains("fade-out")
  ) {
    document.querySelector(".container2").style.visibility = "visible"; // Show the second hermit container
  }
});

// Handle interactions with snowmen objects
const snowMan1 = document.querySelectorAll('.snowman1');
snowMan1.forEach(obj => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    setInterval(() => {
      document.querySelector(".snowman1_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
    }, 3000);
    document.querySelector(".snowman1_ans").style.visibility = "visible"; // Show answer
    fadeOutAndRemove(obj); // Fade out and remove the snowman object
  }
});

const snowMan2 = document.querySelectorAll('.snowman2');
snowMan2.forEach(obj => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    setInterval(() => {
      document.querySelector(".snowman2_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
    }, 3000);
    document.querySelector(".snowman2_ans").style.visibility = "visible"; // Show answer
    fadeOutAndRemove(obj); // Fade out and remove the snowman object
  }
});

const snowMan3 = document.querySelectorAll('.snowman3');
snowMan3.forEach(obj => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    setInterval(() => {
      document.querySelector(".snowman3_ans").style.visibility = "hidden"; // Hide answer after 3 seconds
    }, 3000);
    document.querySelector(".snowman3_ans").style.visibility = "visible"; // Show answer
    fadeOutAndRemove(obj); // Fade out and remove the snowman object
  }
});

// Handle interactions with black rocks
const blackRock = document.querySelectorAll('.black_rock');
blackRock.forEach(obj => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    if (fighting_Game == true) {
      isPlayable = false; // Disable player actions while fighting
      fadeOutAndRemove(obj); // Fade out and remove the rock object
      window.open("fighting/html/index.html"); // Open the fighting game
      setTimeout(function() {
        isPlayable = true; // Re-enable player actions after 3 seconds
      }, 3000);
    }
  }
});

// Handle interactions with the final snowman
const snowMan5 = document.querySelectorAll('.snowman5');
snowMan5.forEach(obj => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    document.querySelector(".snowman_final").style.visibility = "visible"; // Show the final snowman interaction
    isPlayable = false; // Disable player actions during quiz initialization
    initializeQuiz(); // Start the quiz
    fadeOutAndRemove(obj); // Fade out and remove the snowman object
  }
});

// Function to handle the visibility of animal indicators
function handleIndicator() {
  const animals = document.querySelectorAll(".wolf, .bear"); // Select all animal objects
  const animal_indicators = document.querySelector(".animal_indicator"); // Select the indicator element
  let nearby = false; // Track if an animal is nearby
  animals.forEach((animal) => {
    // Check for collision with any animals
    if (checkCollision(player, animal.querySelector("img"), 50)) {
      nearby = true; // Set nearby to true if a collision is detected
    }
  });
  // Show or hide the indicator based on nearby status
  indicator.style.display = nearby ? "block" : "none";
  animal_indicators.style.display = nearby ? "block" : "none";
}

// Function to handle the removal of animals upon collision
function handleAnimalRemoval() {
  const animals = document.querySelectorAll(".wolf, .bear"); // Select all animal objects
  animals.forEach((animal) => {
    if (
      checkCollision(player, animal.querySelector("img"), 50) && // Check for collision with the player
      !animal.classList.contains("fade-out") // Ensure the object is not fading out
    ) {
      fadeOutAndRemove(animal); // Fade out and remove the animal object
      score += 50; // Increase the score
      updateScore(); // Update the displayed score
    }
  });
}

// Function to handle the removal of spikes upon collision
function handleSpikesRemoval() {
  const spikes = document.querySelectorAll(".spike"); // Select all spike objects
  spikes.forEach((spike) => {
    if (
      checkCollision(player, spike.querySelector("img"), 50) && // Check for collision with the player
      !spike.classList.contains("fade-out") // Ensure the object is not fading out
    ) {
      fadeOutAndRemove(spike); // Fade out and remove the spike object
    }
  });
}

function handleTreeRemoval() {
  const choppedTrees = document.querySelectorAll(".chopped-tree");

  choppedTrees.forEach((tree) => {
      const treeImage = tree.querySelector("img");
      if (checkCollision(player, treeImage, 50) && !tree.classList.contains("fade-out")) {
          score += 10;
          updateScore();
          fadeOutAndRemove(tree);
      }
  });
}

function fadeOutAndRemove(element) {
  element.classList.add("fade-out");
  setTimeout(() => {
      element.style.opacity = "0";
  }, 500); // Match the timeout duration with the CSS transition duration
}

function checkCollision(rect1, rect2, range = 0) {
  const rect1Bounds = rect1.getBoundingClientRect();
  const rect2Bounds = rect2.getBoundingClientRect();

  return !(
      rect1Bounds.top > rect2Bounds.bottom + range ||
      rect1Bounds.bottom < rect2Bounds.top - range ||
      rect1Bounds.right < rect2Bounds.left - range ||
      rect1Bounds.left > rect2Bounds.right + range
  );
}

// Event listeners for keyboard actions
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

// Initial game updates
updateScore();
updateHealth();
update();
const quizData = [
  {
      question: "What leads to the End of suffering according to Noble Truth of Buddha?",
      options: [
          "The Truth of Suffering",
          "The Truth of the Path that leads to the End of Suffering",
          "The Truth of the End of Suffering",
          "The Truth of the Cause of Suffering"
      ],
      correct: "The Truth of the Path that leads to the End of Suffering"
  },
  {
      question: "What is the Cause Suffering Truth of Buddha?",
      options: [
          "The Truth of Suffering",
          "The Truth of Defeating",
          "The Truth of the Cause of Suffering",
          "The Truth of Not Suffocating"
      ],
      correct: "The Truth of the Cause of Suffering"
  },
  {
      question: "Which is one of the Noble Truths of Buddha?",
      options: [
          "The Truth of Suffering",
          "The Truth of Defeating",
          "The Truth of other Suffering",
          "The Truth of not Defeating"
      ],
      correct: "The Truth of Suffering"
  },
  // Add more questions as needed
];

let currentQuestionIndex = 0;
let score1 = 0;
let timerInterval;
const userAnswers = [];

// DOM Elements
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

// Save progress to localStorage
function saveProgress() {
  localStorage.setItem("quizProgress", JSON.stringify({
      currentQuestionIndex,
      score1,
      userAnswers
  }));
}

// Retrieve progress from localStorage
function retrieveProgress() {
  const savedProgress = localStorage.getItem("quizProgress");
  if (savedProgress) {
      const { currentQuestionIndex: savedIndex, score1: savedScore, userAnswers: savedAnswers } = JSON.parse(savedProgress);
      if (savedIndex < quizData.length) {
          currentQuestionIndex = savedIndex;
          score1 = savedScore;
          userAnswers.push(...savedAnswers);
          loadQuestion();
      } else {
          displayResults();
      }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function initializeQuiz() {
  shuffleArray(quizData);
  loadQuestion();
}

function loadQuestion() {
  const currentQuestion = quizData[currentQuestionIndex];
  questionNumberElement.textContent = `${currentQuestionIndex + 1}/${quizData.length}`;
  questionTextElement.textContent = currentQuestion.question;

  optionsContainer.innerHTML = "";
  const shuffledOptions = shuffleArray([...currentQuestion.options]);
  shuffledOptions.forEach((option) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;

      const span = document.createElement("span");
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      optionsContainer.appendChild(label);
  });

  updateProgressBar();
  resetTimer();
}

function updateProgressBar() {
  const progress = (currentQuestionIndex / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function resetTimer() {
  clearInterval(timerInterval);
  let timeLeft = 30;
  timerElement.textContent = timeLeft;

  timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = timeLeft;

      // Change color when timer is low
      if (timeLeft <= 10) {
          timerElement.style.color = "#e74c3c"; // Change to red
      }

      if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleNextButtonClick(); // Move to next question or end quiz automatically
      }
  }, 1000);
}

function handleNextButtonClick() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (selectedOption) {
      userAnswers.push({
          question: quizData[currentQuestionIndex].question,
          yourAnswer: selectedOption.value,
          correctAnswer: quizData[currentQuestionIndex].correct
      });

      if (selectedOption.value === quizData[currentQuestionIndex].correct) {
          score1++;
          scoreElement1.textContent = `Score: ${score1}`;
      }
  } else {
      userAnswers.push({
          question: quizData[currentQuestionIndex].question,
          yourAnswer: "No answer selected",
          correctAnswer: quizData[currentQuestionIndex].correct
      });
  }

  currentQuestionIndex++;
  saveProgress(); // Save progress before loading next question
  if (currentQuestionIndex < quizData.length) {
      loadQuestion();
  } else {
      displayResults(); // Show results when finished
  }

  // Reset selected options
  document.querySelectorAll('input[name="answer"]').forEach((input) => (input.checked = false));
}
function displayResults() {
  // Stop the timer when the quiz is completed
  clearInterval(timerInterval);
  
  // Update the display to indicate that the quiz is completed
  questionNumberElement.textContent = "Quiz Completed";
  
  // Show the user's score
  document.querySelector(".score_display").textContent = `Your score is ${score1}/${quizData.length}`;

  // Clear the options for the next question
  optionsContainer.innerHTML = "";
  
  // Hide the next button
  nextButton.style.display = "none";
  
  // Show the scoreboard container
  scoreboardContainer.style.display = "block";
  
  // Render the scoreboard with the results
  renderScoreboard();
  
  // Clear saved progress in localStorage after displaying results
  localStorage.removeItem("quizProgress");
}

function renderScoreboard() {
  // Clear the current scoreboard body
  scoreboardBody.innerHTML = "";
  
  // Loop through each user answer and create table rows for the scoreboard
  userAnswers.forEach((answer, index) => {
    const row = document.createElement("tr");
    const questionCell = document.createElement("td");
    const yourAnswerCell = document.createElement("td");
    const correctAnswerCell = document.createElement("td");

    // Set the question text
    questionCell.textContent = `Q${index + 1}: ${answer.question}`;
    
    // Set the user's answer
    yourAnswerCell.textContent = answer.yourAnswer;
    
    // Set the correct answer
    correctAnswerCell.textContent = answer.correctAnswer;

    // Append cells to the row
    row.appendChild(questionCell);
    row.appendChild(yourAnswerCell);
    row.appendChild(correctAnswerCell);
    
    // Append the row to the scoreboard body
    scoreboardBody.appendChild(row);
  });
}

function restartQuiz() {
  // Save the current state of the game before restarting
  localStorage.setItem("Health_2", health);
  localStorage.setItem("Score_2", score);
  localStorage.setItem("Energies_2", golden_Energy);
  localStorage.setItem("Min_2", min);
  localStorage.setItem("Sec_2", sec);
  
  // Navigate to the next level
  window.open('level3.html');
  
  // Close the current level
  window.close('level2.html');
}

// Event listeners for next button and restart button
nextButton.addEventListener("click", handleNextButtonClick);
restartButton.addEventListener("click", restartQuiz);

// Check localStorage for saved progress when the DOM is loaded
retrieveProgress();
  
// Memory game --------------------------------------------------------

// Self-invoking function to encapsulate memory game logic
(function (d, w) {
  let cards = []; // Array to hold the cards
  let matches = 0; // Counter for matches
  const flipped_cards = []; // Array to hold flipped cards

  // Mapping of card names to image filenames
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
    const board = d.querySelector(".board"); // Select the game board
    cards = get_cards(); // Get the cards
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`; // Create card elements
      })
      .join(""); // Join the card elements into a single string

    // Set the inner HTML of the board to the card items
    board.innerHTML = card_items;
    // Add click event listener to the board
    board.addEventListener("click", flip_card);
  };

  // Function to handle flipping a card
  const flip_card = (e) => {
    const card = e.target.closest(".card"); // Get the clicked card
    // Check if the clicked element is valid for flipping
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    // Prevent flipping if two cards are already flipped
    if (flipped_cards.length == 2) return;

    // Set the background image of the card
    card.style.backgroundImage = `url(images/${
      imageMapping[cards[card.dataset.id]]
    })`;
    card.classList.add("is-flipped"); // Add flipped class to card

    // Add the flipped card to the flipped cards array
    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    // Check for a match if two cards are flipped
    if (flipped_cards.length == 2) {
      check_match();
    }
  };
})();


const check_match = () => {
  // Check if the names of the two flipped cards match
  if (flipped_cards[0].name === flipped_cards[1].name) {
    // If they match, add "is-match" class and remove "is-flipped" class from each flipped card
    flipped_cards.forEach((flipped_card) => {
      flipped_card.card.classList.add("is-match"); // Add match class
      flipped_card.card.classList.remove("is-flipped"); // Remove flipped class
    });

    matches += 2; // Increment the match counter by 2 for the two matched cards
    flipped_cards.length = 0; // Clear the flipped cards array

    // Check if the game is over (all matches found)
    if (game_over()) {
      // isPlayable = false; // Uncomment to prevent further play
      console.log("You Won now move to next part!!!", isPlayable);
      $(".container").addClass("hidden"); // Hide the game container
      document.querySelector(".container").style.visibility = "hidden"; // Set container visibility to hidden
      // build_board(); // Uncomment to build a new board for the next part
    }
  } else {
    // If the cards do not match, reset them after a short delay
    w.setTimeout(() => {
      flipped_cards.forEach((flipped_card) => {
        const card = flipped_card.card;
        card.style.backgroundImage = ""; // Clear the background image of the card
        card.classList.remove("is-flipped"); // Remove the "is-flipped" class
      });
      flipped_cards.length = 0; // Clear the flipped cards array
    }, 800); // Delay for 800 milliseconds before resetting the cards
  }
};

const shuffle_cards = (stack) => {
  const shuffled = []; // Array to hold shuffled cards
  const random_numbers = []; // Array to track random numbers used for shuffling
  const total = stack.length; // Total number of cards in the stack
  let i = 0;

  // While we haven't added all cards to the shuffled array
  while (i < total) {
    const number = Math.floor(Math.random() * total); // Generate a random number
    // Check if the random number is already used
    if (!random_numbers.includes(number)) {
      shuffled.push(stack[number]); // Add the card at the random index to shuffled
      random_numbers.push(number); // Track this random number
      i++; // Increment the counter
    }
  }

  return shuffled; // Return the shuffled array
};

const game_over = () => {
  // Check if all matches have been found
  if (matches === cards.length) {
    matches = 0; // Reset matches counter
    return true; // Return true to indicate the game is over
  }
  return false; // Return false if the game is not over
};

const get_cards = () => {
  const stack = ["react", "vuejs", "angular", "css3", "html5", "js"]; // Initial stack of cards

  const full_stack = stack.concat(stack); // Duplicate the stack for pairs

  return shuffle_cards(full_stack); // Shuffle and return the full stack
};


  build_board();
})(document, window);

// memory game --------------------------------------------------------

(function (d, w) {
  let cards = [];
  let matches = 0;
  const flipped_cards = [];

  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  const build_board = () => {
    const board = d.querySelector(".board1");
    cards = get_cards();
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join("");

    board.innerHTML = card_items;
    board.addEventListener("click", flip_card);
  };

  const flip_card = (e) => {
    const card = e.target.closest(".card");
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    if (flipped_cards.length == 2) return;

    card.style.backgroundImage = `url(images/${
      imageMapping[cards[card.dataset.id]]
    })`;
    card.classList.add("is-flipped");

    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  const check_match = () => {
    if (flipped_cards[0].name === flipped_cards[1].name) {
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2;
      flipped_cards.length = 0;

      if (game_over()) {
        // isPlayable = false;
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container1").addClass("hidden");
        document.querySelector(".container1").style.visibility = "hidden";
        // build_board();
      }
    } else {
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = "";
          card.classList.remove("is-flipped");
        });
        flipped_cards.length = 0;
      }, 800);
    }
  };

  const shuffle_cards = (stack) => {
    const shuffled = [];
    const random_numbers = [];
    const total = stack.length;
    let i = 0;

    while (i < total) {
      const number = Math.floor(Math.random() * total);
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]);
        random_numbers.push(number);
        i++;
      }
    }

    return shuffled;
  };

  const game_over = () => {
    if (matches === cards.length) {
      matches = 0;
      return true;
    }
    return false;
  };

  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"];

    const full_stack = stack.concat(stack);

    return shuffle_cards(full_stack);
  };

  build_board();
})(document, window);

//memory game final
(function (d, w) {
  let cards = [];
  let matches = 0;
  const flipped_cards = [];

  const imageMapping = {
    react: "bear.png",
    vuejs: "blackrock.png",
    angular: "cloud.png",
    css3: "snowman.png",
    html5: "fire.png",
    js: "firstaid.png",
  };

  const build_board = () => {
    const board = d.querySelector(".board2");
    cards = get_cards();
    const card_items = cards
      .map((card, id) => {
        return `<li class="card" data-id="${id}"></li>`;
      })
      .join("");

    board.innerHTML = card_items;
    board.addEventListener("click", flip_card);
  };

  const flip_card = (e) => {
    const card = e.target.closest(".card");
    if (!card || card.matches(".is-match") || card.matches(".is-flipped"))
      return;
    if (flipped_cards.length == 2) return;

    card.style.backgroundImage = `url(images/${
      imageMapping[cards[card.dataset.id]]
    })`;
    card.classList.add("is-flipped");

    flipped_cards.push({
      card,
      name: cards[card.dataset.id],
    });

    if (flipped_cards.length == 2) {
      check_match();
    }
  };

  const check_match = () => {
    if (flipped_cards[0].name === flipped_cards[1].name) {
      flipped_cards.forEach((flipped_card) => {
        flipped_card.card.classList.add("is-match");
        flipped_card.card.classList.remove("is-flipped");
      });

      matches += 2;
      flipped_cards.length = 0;

      if (game_over()) {
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container2").addClass("hidden");
        document.querySelector(".container2").style.visibility = "hidden";
      }
    } else {
      w.setTimeout(() => {
        flipped_cards.forEach((flipped_card) => {
          const card = flipped_card.card;
          card.style.backgroundImage = "";
          card.classList.remove("is-flipped");
        });
        flipped_cards.length = 0;
      }, 800);
    }
  };

  const shuffle_cards = (stack) => {
    const shuffled = [];
    const random_numbers = [];
    const total = stack.length;
    let i = 0;

    while (i < total) {
      const number = Math.floor(Math.random() * total);
      if (!random_numbers.includes(number)) {
        shuffled.push(stack[number]);
        random_numbers.push(number);
        i++;
      }
    }

    return shuffled;
  };

  const game_over = () => {
    if (matches === cards.length) {
      matches = 0;
      return true;
    }
    return false;
  };

  const get_cards = () => {
    const stack = ["react", "vuejs", "angular", "css3", "html5", "js"];

    const full_stack = stack.concat(stack);

    return shuffle_cards(full_stack);
  };

  build_board();
})(document, window);


