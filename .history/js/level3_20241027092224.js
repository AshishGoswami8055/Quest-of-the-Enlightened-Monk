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
    const ghostObj = document.querySelector(".ghost img");
    const currentTime = Date.now();

    if (
      checkCollision(player, ghostObj) &&
      invincibility == false &&
      currentTime - lastGhostDamageTime >= ghostDamageCooldown
    ) {
      // health -= 5;
      health -= characterType === "warrior" ? 3 : 5;
      updateHealth();
      ghostAudio.play(); // Play ghost sound upon collision
      lastGhostDamageTime = currentTime; // Update the last damage time
      if (health <= 0) {
        console.log("Game Over");
      }
    }

    const energies = document.querySelectorAll(".energy");
    energies.forEach((energy) => {
      if (
        checkCollision(player, energy.querySelector("img")) &&
        !energy.classList.contains("fade-out")
      ) {
        golden_Energy++;
        updateGoldenEnergy();
        score += 10;
        updateScore();
        fadeOutAndRemove(energy);
      }
    });

    const harmfulObjects = document.querySelectorAll(
      ".wolf, .bear, .spike, .chopped-tree"
    );
    harmfulObjects.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        invincibility == false
      ) {
        health -= 10;
        updateHealth();
        fadeOutAndRemove(obj);
      }
    });

    const river = document.querySelectorAll(".river");
    river.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        invincibility == false
      ) {
        // health -= 15;
        health -= characterType === "warrior" ? 10 : 15;
        updateHealth();
        fadeOutAndRemove(obj);
      }
    });

    const sandStormObj = document.querySelectorAll(".sand_storm");
    sandStormObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        invincibility == false
      ) {
        // health -= 50;
        // updateHealth();
        // fadeOutAndRemove(obj);
      }
    });
    const GolemObj = document.querySelectorAll(".golem");
    GolemObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        invincibility == false
      ) {
        // health -= 50;
        health -= characterType === "warrior" ? 20 : 30;
        updateHealth();
        fadeOutAndRemove(obj);
      }
    });

    const healthObj = document.querySelectorAll(".first-aid, .t-first-aid");
    healthObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        health < 100
      ) {
        health = 100;
        updateHealth();
        fadeOutAndRemove(obj);
      }
    });

    const hermitObj = document.querySelectorAll(".hermit");
    hermitObj.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out")
      ) {
        // health = 100;
        // updateHealth();
        // isPlayable = false;
        document.querySelector(".container").style.visibility = "visible";
      }
    });
    const hermitObj1 = document.querySelectorAll(".hermit1");
    hermitObj1.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out")
      ) {
        // health = 100;
        // updateHealth();
        // isPlayable = false;
        document.querySelector(".container1").style.visibility = "visible";
      }
    });
    const hermitObj2 = document.querySelectorAll(".hermit2");
    hermitObj2.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out")
      ) {
        // health = 100;
        // updateHealth();
        // isPlayable = false;
        document.querySelector(".container2").style.visibility = "visible";
      }
    });
    const hermitObj3 = document.querySelectorAll(".hermit3");
    hermitObj3.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out")
      ) {
        // health = 100;
        // updateHealth();
        // isPlayable = false;
        document.querySelector(".container3").style.visibility = "visible";
      }
    });
    const snowMan1 = document.querySelectorAll('.snowman1');
        snowMan1.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
                setInterval(() => {
                  document.querySelector(".snowman1_ans").style.visibility = "hidden";
                }, 3000);
                document.querySelector(".snowman1_ans").style.visibility = "visible";
                fadeOutAndRemove(obj);
            }
        });
        const snowMan2 = document.querySelectorAll('.snowman2');
        snowMan2.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
                setInterval(() => {
                  document.querySelector(".snowman2_ans").style.visibility = "hidden";
                }, 3000);
                document.querySelector(".snowman2_ans").style.visibility = "visible";
                fadeOutAndRemove(obj);
            }
        });
        const snowMan3 = document.querySelectorAll('.snowman3');
        snowMan3.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
              setInterval(() => {
                document.querySelector(".snowman3_ans").style.visibility = "hidden";
              }, 3000);
              document.querySelector(".snowman3_ans").style.visibility = "visible";
              fadeOutAndRemove(obj);
            }
        });
        const snowMan4 = document.querySelectorAll('.snowman4');
        snowMan4.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
              setInterval(() => {
                document.querySelector(".snowman4_ans").style.visibility = "hidden";
              }, 3000);
              document.querySelector(".snowman4_ans").style.visibility = "visible";
              fadeOutAndRemove(obj);
            }
        });
        const blackRock = document.querySelectorAll('.black_rock');
        
        blackRock.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
              if (fighting_Game == true) {
                isPlayable = false;
                fadeOutAndRemove(obj);
                window.open("fighting/html/index.html");
                setTimeout(function() {
                    isPlayable = true;
                }, 3000);
                
            }
                // health = 100;
                // updateHealth();
                // document.querySelector(".container1").style.visibility = "visible";
                // window.open("fighting/index.html");
                // isPlayable = false;
            }
        });
        const snowMan5 = document.querySelectorAll('.snowman5');
        snowMan5.forEach(obj => {
            if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
                document.querySelector(".snowman_final").style.visibility = "visible";
                isPlayable =  false;
                initializeQuiz();
                fadeOutAndRemove(obj);
            }
        });
  }

  function handleIndicator() {
    const animals = document.querySelectorAll(".wolf, .bear");
    const animal_indicators = document.querySelector(".animal_indicator");
    let nearby = false;
    animals.forEach((animal) => {
      if (checkCollision(player, animal.querySelector("img"), 50)) {
        nearby = true;
      }
    });
    indicator.style.display = nearby ? "block" : "none";
    animal_indicators.style.display = nearby ? "block" : "none";
  }

  function handleAnimalRemoval() {
    const animals = document.querySelectorAll(".wolf, .bear");
    animals.forEach((animal) => {
      if (
        checkCollision(player, animal.querySelector("img"), 50) &&
        !animal.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(animal);
        score += 50;
        updateScore();
      }
    });
  }

  function handleSpikesRemoval() {
    const spikes = document.querySelectorAll(".spike");
    spikes.forEach((spike) => {
      if (
        checkCollision(player, spike.querySelector("img"), 50) &&
        !spike.classList.contains("fade-out")
      ) {
        fadeOutAndRemove(spike);
      }
    });
  }
  function handleTreeRemoval() {
    const chopped_tree = document.querySelectorAll(".chopped-tree");
    chopped_tree.forEach((tree) => {
      if (
        checkCollision(player, tree.querySelector("img"), 50) &&
        !tree.classList.contains("fade-out")
      ) {
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

  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  updateScore();
  updateHealth();
  update();

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
      questionNumberElement.textContent = `${currentQuestionIndex + 1}/${
        quizData.length
      }`;
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
  
        // Color change when timer is running low
        if (timeLeft <= 10) {
          timerElement.style.color = "#e74c3c"; // Change to red
        }
  
        // Add additional visual cues as needed (e.g., animations, background color changes)
  
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          handleNextButtonClick(); // Automatically move to next question or end quiz
        }
      }, 1000);
    }
  
    function handleNextButtonClick() {
      const selectedOption = document.querySelector(
        'input[name="answer"]:checked'
      );
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
  
    function displayResults() {
      clearInterval(timerInterval);
      questionNumberElement.textContent = "Quiz Completed";
      document.querySelector(".score_display").textContent = `Your score is ${score1}/${quizData.length}`;
  
      optionsContainer.innerHTML = "";
      nextButton.style.display = "none";
      scoreboardContainer.style.display = "block";
      renderScoreboard();
      localStorage.removeItem("quizProgress"); // Clear saved progress after displaying results
    }
  
    function renderScoreboard() {
      scoreboardBody.innerHTML = "";
      userAnswers.forEach((answer, index) => {
        const row = document.createElement("tr");
        const questionCell = document.createElement("td");
        const yourAnswerCell = document.createElement("td");
        const correctAnswerCell = document.createElement("td");
  
        questionCell.textContent = `Q${index + 1}: ${answer.question}`;
        yourAnswerCell.textContent = answer.yourAnswer;
        correctAnswerCell.textContent = answer.correctAnswer;
  
        row.appendChild(questionCell);
        row.appendChild(yourAnswerCell);
        row.appendChild(correctAnswerCell);
        scoreboardBody.appendChild(row);
      });
    }
  
    function restartQuiz() {
      localStorage.setItem("Health_3",health);
      localStorage.setItem("Score_3",score);
      localStorage.setItem("Energies_3",golden_Energy);
      localStorage.setItem("Min_3",min);
      localStorage.setItem("Sec_3",sec);
      window.open('ScoreBoard.html');
      window.close('level3.html');
    }
  
    nextButton.addEventListener("click", handleNextButtonClick);
    restartButton.addEventListener("click", restartQuiz);
  
    // Check localStorage for saved progress when DOM is loaded
    retrieveProgress();
  
});

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
    const board = d.querySelector(".board");
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
        isPlayable = false;
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container").addClass("hidden");
        document.querySelector(".container").style.visibility = "hidden";
        build_board();
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

//memory game --------------------------------------------------------
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
        console.log("You Won now move to next part!!!", isPlayable);
        $(".container1").addClass("hidden");
        document.querySelector(".container1").style.visibility = "hidden";
        build_board();
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

//memory game --------------------------------------------------------
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
        build_board();
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

//memory game --------------------------------------------------------
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
    const board = d.querySelector(".board3");
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
        $(".container3").addClass("hidden");
        document.querySelector(".container3").style.visibility = "hidden";
        build_board();
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


