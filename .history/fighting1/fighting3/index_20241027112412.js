// Select the canvas element and get its 2D drawing context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set the width and height of the canvas
canvas.width = 1500;
canvas.height = 576;

// Fill the canvas with a black rectangle
c.fillRect(0, 0, canvas.width, canvas.height);

// Define gravity for the game
const gravity = 0.7;

// Create a background sprite with its position and image source
const background = new Sprite({
  position: {
    x: 0,
    y: -390 // Adjust the y position for background scrolling effect
  },
  imageSrc: './images/bg.png' // Path to the background image
});

// Create the player character with its properties and sprites
const player = new Fighter({
  position: {
    x: 0, // Initial x position of the player
    y: 0  // Initial y position of the player
  },
  velocity: {
    x: 0, // Initial x velocity
    y: 0  // Initial y velocity
  },
  offset: {
    x: 0, // Offset for the player's position
    y: 0
  },
  imageSrc: './images/samuraiMack/Idle.png', // Path to the idle image
  framesMax: 8, // Number of frames in the idle animation
  scale: 2.5, // Scale factor for the player size
  offset: {
    x: 215, // Horizontal offset for sprite positioning
    y: 157  // Vertical offset for sprite positioning
  },
  sprites: {
    // Define the different states and animations for the player
    idle: {
      imageSrc: './images/samuraiMack/Idle.png',
      framesMax: 8 // Number of frames in the idle animation
    },
    run: {
      imageSrc: './images/samuraiMack/Run.png',
      framesMax: 8 // Number of frames in the run animation
    },
    jump: {
      imageSrc: './images/samuraiMack/Jump.png',
      framesMax: 2 // Number of frames in the jump animation
    },
    fall: {
      imageSrc: './images/samuraiMack/Fall.png',
      framesMax: 2 // Number of frames in the fall animation
    },
    attack1: {
      imageSrc: './images/samuraiMack/Attack1.png',
      framesMax: 6 // Number of frames in the attack animation
    },
    takeHit: {
      imageSrc: './images/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4 // Number of frames in the take hit animation
    },
    death: {
      imageSrc: './images/samuraiMack/Death.png',
      framesMax: 6 // Number of frames in the death animation
    }
  },
  attackBox: {
    offset: {
      x: 100, // Offset for the attack box
      y: 50
    },
    width: 160, // Width of the attack box
    height: 50 // Height of the attack box
  }
});

// Create the enemy character with its properties and sprites
const enemy = new Fighter({
  position: {
    x: 700, // Initial x position of the enemy
    y: 100  // Initial y position of the enemy
  },
  velocity: {
    x: 0, // Initial x velocity
    y: 0  // Initial y velocity
  },
  color: 'blue', // Color of the enemy (not used in the sprite)
  offset: {
    x: -50, // Offset for the enemy's position
    y: 0
  },
  imageSrc: './images/kenji/Idle.png', // Path to the idle image for the enemy
  framesMax: 4, // Number of frames in the idle animation
  scale: 2.5, // Scale factor for the enemy size
  offset: {
    x: 215, // Horizontal offset for sprite positioning
    y: 167  // Vertical offset for sprite positioning
  },
  sprites: {
    // Define the different states and animations for the enemy
    idle: {
      imageSrc: './images/kenji/Idle.png',
      framesMax: 4 // Number of frames in the idle animation
    },
    run: {
      imageSrc: './images/kenji/Run.png',
      framesMax: 8 // Number of frames in the run animation
    },
    jump: {
      imageSrc: './images/kenji/Jump.png',
      framesMax: 2 // Number of frames in the jump animation
    },
    fall: {
      imageSrc: './images/kenji/Fall.png',
      framesMax: 2 // Number of frames in the fall animation
    },
    attack1: {
      imageSrc: './images/kenji/Attack1.png',
      framesMax: 4 // Number of frames in the attack animation
    },
    takeHit: {
      imageSrc: './images/kenji/Take hit.png',
      framesMax: 3 // Number of frames in the take hit animation
    },
    death: {
      imageSrc: './images/kenji/Death.png',
      framesMax: 7 // Number of frames in the death animation
    }
  },
  attackBox: {
    offset: {
      x: -170, // Offset for the attack box of the enemy
      y: 50
    },
    width: 170, // Width of the enemy's attack box
    height: 50 // Height of the enemy's attack box
  }
});

// Log player object to the console for debugging
console.log(player);

// Key states to track user inputs for movement
const keys = {
  a: {
    pressed: false // 'A' key for moving left
  },
  d: {
    pressed: false // 'D' key for moving right
  },
  ArrowRight: {
    pressed: false // Right arrow key for moving right
  },
  ArrowLeft: {
    pressed: false // Left arrow key for moving left
  }
};

// Start the timer countdown function
decreaseTimer();

// Function to control enemy AI behavior based on distance to the player
function enemyAI(enemy, player) {
  // Calculate the distance between the enemy and player in the x-axis
  const distanceX = player.position.x - enemy.position.x;

  // Follow the player if within a certain range
  if (Math.abs(distanceX) < 500) {
    // Move towards the player based on their position
    if (distanceX > 0) {
      enemy.velocity.x = 2; // Move right
      enemy.switchSprite('run'); // Switch to run animation
      enemy.lastKey = 'ArrowRight'; // Record the last key pressed
    } else {
      enemy.velocity.x = -2; // Move left
      enemy.switchSprite('run'); // Switch to run animation
      enemy.lastKey = 'ArrowLeft'; // Record the last key pressed
    }
  } else {
    // Move randomly if the player is far away
    if (Math.random() < 0.01) {
      enemy.velocity.x = 2; // Move right randomly
      enemy.switchSprite('run'); // Switch to run animation
      enemy.lastKey = 'ArrowRight'; // Record the last key pressed
    } else if (Math.random() < 0.02) {
      enemy.velocity.x = -2; // Move left randomly
      enemy.switchSprite('run'); // Switch to run animation
      enemy.lastKey = 'ArrowLeft'; // Record the last key pressed
    } else {
      enemy.velocity.x = 0; // Stop moving
      enemy.switchSprite('idle'); // Switch to idle animation
    }
  }

  // Attack the player if within a certain distance
  if (Math.abs(distanceX) < 100 && !enemy.isAttacking) {
    enemy.attack(); // Call the attack method
  }

  // Handle jumping state based on vertical velocity
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump'); // Switch to jump animation
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall'); // Switch to fall animation
  }
}


function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0;

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // Implement enemy AI behavior
  enemyAI(enemy, player);

  // detect for collision & enemy gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    });
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // this is where our player gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to('#playerHealth', {
      width: player.health + '%'
    });
  }

  // if player misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -20;
        break;
      case ' ':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -20;
        break;
      case 'ArrowDown':
        enemy.attack();
        break;
    }
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
