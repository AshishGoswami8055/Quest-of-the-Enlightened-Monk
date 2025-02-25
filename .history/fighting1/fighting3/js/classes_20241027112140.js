class Sprite {
  // Constructor to initialize a Sprite object
  constructor({
    position,       // Position of the sprite
    imageSrc,      // Source path for the sprite image
    scale = 1,     // Scale factor for the sprite
    framesMax = 1, // Maximum number of frames for animation
    offset = { x: 0, y: 0 } // Offset for positioning the sprite
  }) {
    this.position = position; // Set sprite position
    this.width = 50;          // Default width of the sprite
    this.height = 150;        // Default height of the sprite
    this.image = new Image(); // Create a new image object
    this.image.src = imageSrc; // Set the image source
    this.scale = scale;        // Set the scale factor
    this.framesMax = framesMax; // Set maximum frames for animation
    this.framesCurrent = 0;    // Initialize current frame
    this.framesElapsed = 0;    // Initialize elapsed frames counter
    this.framesHold = 5;       // Frames to hold before switching
    this.offset = offset;       // Set the offset for the sprite
  }

  // Method to draw the sprite on the canvas
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // Calculate source x based on current frame
      0,                                                        // Source y (always 0 for sprites)
      this.image.width / this.framesMax,                       // Source width based on frame count
      this.image.height,                                       // Source height (full height)
      this.position.x - this.offset.x,                        // Destination x (considering offset)
      this.position.y - this.offset.y,                        // Destination y (considering offset)
      (this.image.width / this.framesMax) * this.scale,      // Destination width (scaled)
      this.image.height * this.scale                           // Destination height (scaled)
    );
  }

  // Method to animate the frames of the sprite
  animateFrames() {
    this.framesElapsed++; // Increment the frame counter

    // Check if it's time to switch to the next frame
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++; // Move to the next frame
      } else {
        this.framesCurrent = 0; // Loop back to the first frame
      }
    }
  }

  // Method to update the sprite's position and draw it
  update() {
    this.draw(); // Draw the sprite
    this.animateFrames(); // Update the frame animation
  }
}

class Fighter extends Sprite {
  // Constructor to initialize a Fighter object
  constructor({
    position,          // Position of the fighter
    velocity,         // Velocity of the fighter
    color = 'red',    // Default color of the fighter
    imageSrc,         // Source path for the fighter image
    scale = 1,        // Scale factor for the fighter
    framesMax = 1,    // Maximum number of frames for animation
    offset = { x: 0, y: 0 }, // Offset for positioning the fighter
    sprites,          // Object containing different sprite states
    attackBox = { offset: {}, width: undefined, height: undefined } // Attack box properties
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.velocity = velocity; // Set the fighter's velocity
    this.width = 50;          // Default width of the fighter
    this.height = 150;        // Default height of the fighter
    this.lastKey;             // Track the last pressed key
    this.attackBox = {        // Initialize the attack box
      position: {
        x: this.position.x,   // Position of the attack box
        y: this.position.y
      },
      offset: attackBox.offset, // Offset for the attack box
      width: attackBox.width,   // Width of the attack box
      height: attackBox.height   // Height of the attack box
    };
    this.color = color;        // Set the fighter's color
    this.isAttacking;          // Flag to check if the fighter is attacking
    this.health = 100;         // Set the fighter's health
    this.framesCurrent = 0;    // Initialize current frame for animation
    this.framesElapsed = 0;    // Initialize elapsed frames counter
    this.framesHold = 5;       // Frames to hold before switching
    this.dead = false;         // Flag to check if the fighter is dead

    this.sprites = sprites;    // Store the sprites for different states

    // Load the images for the different sprite states
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image(); // Create a new image object for each sprite
      sprites[sprite].image.src = sprites[sprite].imageSrc; // Set the source for the sprite image
    }

    console.log(this.sprites); // Log the sprites for debugging
  }

  // Method to update the fighter's position and draw it
  update() {
    this.draw(); // Draw the fighter
    if (!this.dead) this.animateFrames(); // Animate frames unless dead

    // Update the attack box's position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // Uncomment to draw the attack box for debugging
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // )

    this.position.x += this.velocity.x; // Update x position based on velocity
    this.position.y += this.velocity.y; // Update y position based on velocity

    // Gravity function to handle falling
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0; // Reset vertical velocity
      this.position.y = 330; // Reset position to ground level
    } else this.velocity.y += gravity; // Apply gravity
  }

  // Method to initiate an attack
  attack() {
    this.switchSprite('attack1'); // Switch to attack animation
    this.isAttacking = true; // Set attacking flag
  }

  // Method to handle taking damage
  takeHit() {
    this.health -= 20; // Reduce health by 20

    // Check if the fighter's health is 0 or below
    if (this.health <= 0) {
      this.switchSprite('death'); // Switch to death animation
    } else this.switchSprite('takeHit'); // Switch to take hit animation
  }

  // Method to switch between different sprite animations
  switchSprite(sprite) {
    // Prevent switching to the death sprite if already dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true; // Set dead flag if on last frame
      return; // Exit the method
    }

    // Prevent switching to the attack sprite if currently attacking
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return; // Exit if in the middle of an attack animation

    // Prevent switching to the takeHit sprite if currently taking a hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return; // Exit if in the middle of taking a hit animation

    // Switch to the appropriate sprite based on the input
    switch (sprite) {
      case 'idle':
        // Switch to idle animation if not already in that state
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image; // Set image to idle
          this.framesMax = this.sprites.idle.framesMax; // Set frames for idle
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'run':
        // Switch to run animation if not already in that state
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image; // Set image to run
          this.framesMax = this.sprites.run.framesMax; // Set frames for run
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'jump':
        // Switch to jump animation if not already in that state
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image; // Set image to jump
          this.framesMax = this.sprites.jump.framesMax; // Set frames for jump
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'fall':
        // Switch to fall animation if not already in that state
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image; // Set image to fall
          this.framesMax = this.sprites.fall.framesMax; // Set frames for fall
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'attack1':
        // Switch to attack animation if not already in that state
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image; // Set image to attack
          this.framesMax = this.sprites.attack1.framesMax; // Set frames for attack
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'takeHit':
        // Switch to take hit animation if not already in that state
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image; // Set image to take hit
          this.framesMax = this.sprites.takeHit.framesMax; // Set frames for take hit
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
      case 'death':
        // Switch to death animation if not already in that state
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image; // Set image to death
          this.framesMax = this.sprites.death.framesMax; // Set frames for death
          this.framesCurrent = 0; // Reset frame counter
        }
        break;
    }
  }
}
