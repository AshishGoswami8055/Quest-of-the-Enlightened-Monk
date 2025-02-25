var pauseGame = document.querySelector(".pause_game");
const form_obj = document.querySelector(".game_form");
var game_is_paused = true;

// variables 

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

var jumpSound = new Audio("audio/jumpSound.mp3");
var ghostAudio = new Audio("audio/scare.mp3");

let score = 0;
let golden_Energy = 0;
let health = 100;
let translateX = 0;
let fighting_Game = true;
let isJumping = false;
let invincibility = false;
const jumpDuration = 1000; // Duration of the jump in milliseconds
const keyState = {}; // Object to track key states

let music_state = true;

function toggle_music() {
  if (music_state) {
    audio.pause();
  } else {
    audio.play();
  }
  music_state = !music_state;
}

function pause_game() {
  stopTimer();
  pauseGame.style.display = "block";
  game_is_paused = true;
  isPlayable = false;
  document.querySelector(".pause_health").textContent = "Health :- " + health;
}
function play_game() {
  startTimer();
  pauseGame.style.display = "none";
  game_is_paused = false;
  isPlayable = true;
}

let characterType = "Zen Monk"; // Default gender

// Timer

const timer = document.getElementById("stopwatch");
var hr = 0;
var min = 0;
var sec = 0;
var stoptime = true;

function startTimer() {
  if (stoptime == true) {
    stoptime = false;
    timerCycle();
  }
}
function stopTimer() {
  if (stoptime == false) {
    stoptime = true;
  }
}
function timerCycle() {
  if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
      min = min + 1;
      sec = 0;
    }
    if (min == 60) {
      hr = hr + 1;
      min = 0;
      sec = 0;
    }

    if (sec < 10) {
      sec = "0" + sec;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }

    timer.innerHTML = hr + " : " + min + " : " + sec;

    setTimeout("timerCycle()", 1000);
  }
}
function resetTimer() {
  timer.innerHTML = "00:00:00";
  stoptime = true;
  hr = 0;
  sec = 0;
  min = 0;
}

// Weather

var rainSound = new Audio("audio/rain.mp3");
var thunderSound = new Audio("audio/Thunder.mp3");

function Weather() {
  startThunderstormEffect();
  setTimeout(() => {
    stopWeatherEffects();
    startRainEffect();
  }, 8000);
  setTimeout(() => {
    stopWeatherEffects();
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
    case "Hit":
      player.src = `${characterPath}/Hit.gif`;
      break;
    default:
      console.warn("Unknown action:", action);
      // Optionally, you can set a default image or handle unknown actions here
      player.src = `${characterPath}/idle.gif`; // Default action
      break;
  }

}

function updateHealth() {
  healthElement.textContent = `Health : ${health}`;
  if (health <= 0) {
    player.src = `images/male/Death.gif`;
    document.querySelector(".game_over").style.visibility = "visible";
    console.log("Game Over");
    // Reload the game or redirect to a game over screen
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

function zenMonkAbilities() {
  console.log("hii");
  setInterval(() => {
    if (health < 100) {
      health += 10;
      updateHealth();
      if (health > 100) {
        health = 100;
        updateHealth();
      }
    }
  }, 5000);
}


function rangerMonkAbilities() {
  console.log("Ranger Monk activated: Increased speed, agility, better trap detection, and evasion.");
}

function warriorMonkAbilities() {
  console.log("Warrior Monk activated: Increased attack power, advanced combat moves, higher damage resistance.");
}

function mysticMonkAbilities() {
  console.log("Mystic Monk activated: Energy manipulation, teleportation.");

  // Add the teleportation ability
  document.addEventListener("keyup", (event) => {
    if (event.key.toLowerCase() === "t" && isPlayable && golden_Energy >= 5) { // 'T' key for teleport
      teleport();
    }
  });

  function teleport() {
    // Define the distance to teleport
    const teleportDistance = 500;

    // Apply the teleportation effect
    translateX -= teleportDistance;
    objects.style.transform = `translateX(${translateX}px)`;
    tree_Objs.style.transform = `translateX(${translateX / 5}px)`;

    player.src = `images/female/teleport.gif`;
    console.log("Teleported!");
  }
}

function flipAnimal() {
  let wolves = document.querySelectorAll(".wolf img");
  let bears = document.querySelectorAll(".bear img");

  let isWolfGif = true; // Start with wolf.gif
  let isBearGif = true; // Start with bear.gif

  setInterval(() => {
    let newWolfSrc = isWolfGif ? "images/wolfRight.gif" : "images/wolf.gif";
    let newBearSrc = isBearGif ? "images/bearRight.gif" : "images/bear.gif";

    wolves.forEach((img) => {
      img.src = newWolfSrc;
    });

    bears.forEach((img) => {
      img.src = newBearSrc;
    });

    isWolfGif = !isWolfGif;
    isBearGif = !isBearGif;
  }, 2500); // Toggle every 2.5 seconds
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
        // updatePlayerImage("Idle");
      }
    }
    else {
      // if (keyState["d"] && isPlayable == true) {
      //   if (!isJumping) updatePlayerImage("Run");
      //   translateX -= 10;
      //   objects.style.transform = `translateX(${translateX}px)`;
      //   tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      // } else if (keyState["a"] && isPlayable == true) {
      //   if (!isJumping) updatePlayerImage("Run");
      //   translateX += 10;
      //   objects.style.transform = `translateX(${translateX}px)`;
      //   tree_Objs.style.transform = `translateX(${translateX / 5}px)`;
      // } else if (!isJumping) {
      //   updatePlayerImage("Idle");
      // }

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
    const ghostObj = document.querySelector(".ghost img");
    const currentTime = Date.now();

    if (
      checkCollision(player, ghostObj) &&
      invincibility == false &&
      currentTime - lastGhostDamageTime >= ghostDamageCooldown
    ) {
      // health -= 5;
      health -= (characterType === "Warrior Monk" ? 3 : 5);
      updatePlayerImage("Hit");
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
// meditation
// Grabbing the necessary elements
const meditationContainer = document.querySelector('.meditation-container');
const meditationVideo = document.getElementById('meditation-video');
const pauseButton = document.getElementById('pause-video');
const playButton = document.getElementById('play-video');
const closeButton = document.getElementById('close-popup');

// Function to detect collision with meditation object
const meditationObj = document.querySelectorAll('.meditation');
meditationObj.forEach((obj) => {
  if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
    meditationContainer.style.visibility = 'visible';  // Show popup
    meditationVideo.play();  // Automatically play video when popup is shown
  }
});

// Close button functionality
closeButton.addEventListener('click', () => {
  console.log('Closing popup');
  meditationContainer.style.visibility = 'hidden';  // Hide popup
  meditationVideo.pause();  // Pause video when closing
  meditationVideo.currentTime = 0;  // Reset video to the beginning
});

// Pause button functionality
pauseButton.addEventListener('click', () => {
  console.log('Pausing video');
  meditationVideo.pause();  // Pause video when pause button is clicked
});

// Play button functionality
playButton.addEventListener('click', () => {
  console.log('Playing video');
  meditationVideo.play();  // Play video when play button is clicked
});

 //end of meditation
      
    const harmfulObjects = document.querySelectorAll(
      ".wolf, .bear, .spike, .chopped-tree"
    );
    harmfulObjects.forEach((obj) => {
      if (
        checkCollision(player, obj.querySelector("img")) &&
        !obj.classList.contains("fade-out") &&
        invincibility == false
      ) {
        health -= (characterType === "Warrior Monk" ? 7 : 10);
        updatePlayerImage("Hit");
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
        health -= (characterType === "Warrior Monk" ? 10 : 15);
        updatePlayerImage("Hit");
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
        updatePlayerImage("Hit");
        health -= (characterType === "Warrior Monk" ? 20 : 30);
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

    const hermitObj2 = document.querySelectorAll(".hermit");
    hermitObj2.forEach((obj) => {
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

      const blackRock = document.querySelectorAll('.black_rock');

      blackRock.forEach(obj => {
        if (checkCollision(player, obj.querySelector('img')) && !obj.classList.contains('fade-out')) {
          if (fighting_Game == true) {
            isPlayable = false;
            fadeOutAndRemove(obj);
            window.open("fighting/html/index.html");
            setTimeout(function () {
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
          isPlayable = false;
          initializeQuiz();
          fadeOutAndRemove(obj);
        }
      });
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

  function checkCollision(player, object) {
    const playerRect = player.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    return !(
      playerRect.top > objectRect.bottom ||
      playerRect.bottom < objectRect.top ||
      playerRect.left > objectRect.right ||
      playerRect.right < objectRect.left
    );
  }


  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);
  updateScore();
  updateHealth();
  update();

  //QUIZ GAME 
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
    questionNumberElement.textContent = `${currentQuestionIndex + 1}/${quizData.length
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
        timerElement.style.color = "#e74c3c";
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
    localStorage.setItem("Health_1", health);
    localStorage.setItem("Score_1", score);
    localStorage.setItem("Energies_1", golden_Energy);
    localStorage.setItem("Min_1", min);
    localStorage.setItem("Sec_1", sec);
    window.open('level2.html');
    window.close('index.html');
  }

  nextButton.addEventListener("click", handleNextButtonClick);
  restartButton.addEventListener("click", restartQuiz);

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

  const buildx_board = () => {
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

    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
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

    card.style.backgroundImage = `url(images/${imageMapping[cards[card.dataset.id]]
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
        $(".container").addClass("hidden");
        document.querySelector(".container").style.visibility = "hidden";
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

