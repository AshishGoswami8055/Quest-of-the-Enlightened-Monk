class Sprite {
  // Constructor for the Sprite class
  constructor({
    position, // Position of the sprite on the canvas
    imageSrc, // Source of the sprite's image
    scale = 1, // Scale factor for the sprite's size
    framesMax = 1, // Maximum frames for animation
    offset = { x: 0, y: 0 } // Offset to adjust position
  }) {
    this.position = position; // Set the position
    this.width = 50; // Width of the sprite
    this.height = 150; // Height of the sprite
    this.image = new Image(); // Create a new image object
    this.image.src = imageSrc; // Set the image source
    this.scale = scale; // Set the scale
    this.framesMax = framesMax; // Set maximum frames
    this.framesCurrent = 0; // Current frame for animation
    this.framesElapsed = 0; // Frames elapsed for animation timing
    this.framesHold = 5; // Frames to hold before switching
    this.offset = offset; // Offset for positioning
  }

  // Draw the sprite on the canvas
  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax), // Source X
      0, // Source Y
      this.image.width / this.framesMax, // Source Width
      this.image.height, // Source Height
      this.position.x - this.offset.x, // Destination X
      this.position.y - this.offset.y, // Destination Y
      (this.image.width / this.framesMax) * this.scale, // Destination Width
      this.image.height * this.scale // Destination Height
    );
  }

  // Animate the sprite frames
  animateFrames() {
    this.framesElapsed++; // Increment frames elapsed

    // Check if it's time to switch frames
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++; // Move to next frame
      } else {
        this.framesCurrent = 0; // Reset to first frame
      }
    }
  }

  // Update the sprite (draw and animate)
  update() {
    this.draw(); // Draw the sprite
    this.animateFrames(); // Animate frames
  }
}

class Fighter extends Sprite {
  // Constructor for the Fighter class, extending Sprite
  constructor({
    position, // Initial position of the fighter
    velocity, // Velocity of the fighter
    color = 'red', // Color for debug purposes
    imageSrc, // Source of the fighter's image
    scale = 1, // Scale factor
    framesMax = 1, // Maximum frames for animation
    offset = { x: 0, y: 0 }, // Offset for positioning
    sprites, // Object containing all sprite animations
    attackBox = { offset: {}, width: undefined, height: undefined } // Hitbox for attacks
  }) {
    super({
      position, // Call the superclass constructor
      imageSrc,
      scale,
      framesMax,
      offset
    });

    this.velocity = velocity; // Set velocity
    this.width = 50; // Set fighter width
    this.height = 150; // Set fighter height
    this.lastKey; // Store the last key pressed for movement
    this.attackBox = {
      position: {
        x: this.position.x, // Initial position of the attack box
        y: this.position.y
      },
      offset: attackBox.offset, // Offset for the attack box
      width: attackBox.width, // Width of the attack box
      height: attackBox.height // Height of the attack box
    };
    this.color = color; // Set color
    this.isAttacking; // Flag for attack state
    this.health = 100; // Set initial health
    this.framesCurrent = 0; // Current frame for animation
    this.framesElapsed = 0; // Frames elapsed for animation timing
    this.framesHold = 5; // Frames to hold before switching
    this.dead = false; // Flag for death state

    this.sprites = sprites; // Store sprite animations

    // Load all sprite images
    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    console.log(this.sprites); // Log sprite images for debugging
  }

  // Update fighter position, draw, and check for animations
  update() {
    this.draw(); // Draw the fighter
    if (!this.dead) this.animateFrames(); // Animate frames if not dead

    // Update attack box position based on current fighter position
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    this.position.x += this.velocity.x; // Update horizontal position
    this.position.y += this.velocity.y; // Update vertical position

    // Handle gravity and ground collision
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0; // Stop falling
      this.position.y = 330; // Reset position to ground level
    } else this.velocity.y += gravity; // Apply gravity
  }

  // Initiate an attack
  attack() {
    this.switchSprite('attack1'); // Switch to attack animation
    this.isAttacking = true; // Set attacking state
  }

  // Handle when the fighter takes a hit
  takeHit() {
    this.health -= 20; // Decrease health

    // Check if health drops to zero or below
    if (this.health <= 0) {
      this.switchSprite('death'); // Switch to death animation
    } else this.switchSprite('takeHit'); // Switch to hit animation
  }

  // Switch between different sprite animations
  switchSprite(sprite) {
    // Prevent switching to death animation if already dead
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1)
        this.dead = true; // Set dead state
      return;
    }

    // Prevent switching to attack animation while attacking
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    )
      return;

    // Prevent switching to hit animation while being hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    // Switch based on the specified sprite
    switch (sprite) {
      case 'idle':
        // Switch to idle sprite if not already in idle
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax; // Update frames max
          this.framesCurrent = 0; // Reset current frame
        }
        break;
      case 'run':
        // Switch to run sprite if not already in running
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'jump':
        // Switch to jump sprite if not already in jumping
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'fall':
        // Switch to fall sprite if not already in falling
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'attack1':
        // Switch to attack1 sprite if not already in attack1
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'takeHit':
        // Switch to takeHit sprite if not already in taking hit
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case 'death':
        // Switch to death sprite if not already in death
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
    }
  }
}
