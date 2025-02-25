import Sprite from './Sprite.js'
const canvas = document.querySelector('canvas');

// Canvas' dimension.
canvas.width = 1500;
canvas.height = 576;
const gravity = 1;

class Fighter extends Sprite {
    constructor({ name, position, offset, imageSrc, scale, maxFrames, holdFrames, offsetFrame = { x: 0, y: 0 }, sprites, keys, attackTime }) {
        super({ position, imageSrc, scale, maxFrames, holdFrames, offsetFrame });
        this.name = name;
        this.height = 150;
        this.width = 50;
        this.velocity = { x: 0, y: 0 } // Initial velocity is 0 in both axis.
        this.moveFactor = 6;    // Determinates how fast this sprite can move due to user input.
        this.lastKey;           // Last key pressed by this sprite.
        this.inTheAir = false;  // Avoid the sprite jump if it's already in the air.
        this.isAttacking = false;
        this.health = 100;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offSet: offset, // AttackBox's offset.
            width: 150,
            height: 150
        };  // End attack box.
        this.sprites = sprites;
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
        this.keys = keys;
        this.attackTime = attackTime;   // ms to perform his attack animation.
        this.attackCooldown = true; // Fighter can only attack when his cooldown is up.
        this.isTakingHit = false;   // Fighter is taking a hit from another fighter.
    }

    attack(enemyFighter) {
        if (this.isAttacking && this.health > 0 && this.attackCooldown) {
            this.attackCooldown = false;
            setTimeout(() => { this.attackCooldown = true }, 1000)
            this.switchSprite('attack')
            if (this.isHitting(enemyFighter)) {
                enemyFighter.health -= 20;
                gsap.to('#' + enemyFighter.name + 'Health', { width: enemyFighter.health + '%' });
                enemyFighter.switchSprite('takehit');
                enemyFighter.isTakingHit = true;
            }
        }
    }

    // Check if this fighter attackbox is hitting the enemy fighter.
    isHitting(enemyFighter) {
        return (this.attackBox.position.x + this.attackBox.width >= enemyFighter.position.x &&
            this.attackBox.position.x <= enemyFighter.position.x + enemyFighter.width &&
            this.attackBox.position.y + this.attackBox.height >= enemyFighter.position.y &&
            this.attackBox.position.y <= enemyFighter.position.y + enemyFighter.height)
    }

    movement() {
        // This determinates if the player moves to the left or to the right. It wont let the player leave the canvas at the sides.
        let running = false;    // Determinate if player is running or not.
        if (this.health > 0) {
            if (Object.values(this.keys)[0].pressed && (this.lastKey === 'a' || this.lastKey === 'ArrowLeft') && this.position.x >= 0) {
                this.velocity.x = -this.moveFactor; // 'a' is pressed and it's the last pressed key, then move to the left.
                this.switchSprite('run')
                running = true;
            } else if (Object.values(this.keys)[1].pressed && (this.lastKey === 'd' || this.lastKey === 'ArrowRight') && this.position.x <= (canvas.width - this.width)) {
                this.velocity.x = this.moveFactor;  // 'd' is pressed and it's the last pressed key, then move to the right.
                this.switchSprite('run')
                running = true;
            }
        }
        return running;
    }

    // Update the sprite every frame.
    update() {
        super.update();
        this.attackBox.position.x = this.position.x + this.attackBox.offSet.x;    // Update attack box position to follow the sprite.
        this.attackBox.position.y = this.position.y;    // Update attack box position to follow the sprite.
        this.position.y += this.velocity.y;     // Move the sprite in 'y' direction his 'y' velocity.
        this.position.x += this.velocity.x;    // Move the sprite in 'x' direction his 'x' velocity.

        // If the sprite is in the air, then it gets affected by gravity.
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 95) { // Sprite reach the bottom of the canvas.
            this.velocity.y = 0;
            this.inTheAir = false;  // Sprite touch the bottom of the canvas, is not in the air and can jump again.
        } else {    // Sprite is in the air, gets affected by gravity.
            this.velocity.y += gravity; // Add gravity speed to the sprite every frame to slow it down.
            if (this.velocity.y > 0) {  // Sprite's y velocity is positive, it's falling.
                this.switchSprite('fall');
            } else {    // Sprite is still going up.
                this.inTheAir = true;   // Sprite is in the air and can't jump againg.
                this.switchSprite('jump');
            }
        }
    }

    switchSprite(sprite) {
        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image && !this.inTheAir && this.health > 0) {
                    //console.log("idle")
                    this.image = this.sprites.idle.image;
                    this.maxFrames = this.sprites.idle.maxFrames;
                    this.currentFrame = 0;  // To avoid flickering when changing between different sprites.
                }
                break;
            case 'run':
                if (!this.isAttacking && !this.isTakingHit) {   // Can only run if is not attacking or taking a hit
                    //console.log("correr")
                    this.image = this.sprites.run.image;
                    this.maxFrames = this.sprites.run.maxFrames;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.attack1.image) {
                    //console.log("saltar")
                    this.image = this.sprites.jump.image;
                    this.maxFrames = this.sprites.jump.maxFrames;
                    this.currentFrame = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.attack1.image) {    // Show attack anim while falling.
                    //console.log("caer")
                    this.image = this.sprites.fall.image;
                    this.maxFrames = this.sprites.fall.maxFrames;
                    this.currentFrame = 0;
                }
                break;
            case 'death':   //TODO: Hacer que el fighter caiga al suelo al morir.
                //console.log("morir");
                this.image = this.sprites.death.image;
                this.maxFrames = this.sprites.death.maxFrames;
                this.currentFrame = 0;
                break;
            case 'attack':
                //console.log("attack")
                this.image = this.sprites.attack1.image;
                this.maxFrames = this.sprites.attack1.maxFrames;
                this.currentFrame = 0;
                setTimeout(() => { this.isAttacking = false }, this.attackTime)
                break;
            case 'takehit':
                //console.log("take hit");
                this.image = this.sprites.takeHit.image;
                this.maxFrames = this.sprites.takeHit.maxFrames;
                this.currentFrame = 0;
                setTimeout(() => { this.isTakingHit = false }, 500);
                break;
        }
    }
}

// Detect whenever the attackBox of this fighter hits another fighter while attacking.


// Create player sprite.
export const player = new Fighter({
    name: "player", // Name of the player character
    position: { // Initial position of the player on the canvas
        x: 0, // X-coordinate
        y: 0  // Y-coordinate
    },
    offset: { // Offset for rendering the sprite
        x: 75, // X-offset to center the sprite
        y: 0   // Y-offset
    },
    imageSrc: '../assets/img/samuraiMack/Idle.png', // Source of the idle sprite image
    scale: 2.5, // Scale factor for the sprite size
    maxFrames: 8, // Maximum frames for the idle animation
    holdFrames: 4, // Frames to hold the current animation state
    offsetFrame: { x: 215, y: 154 }, // Offset for the animation frame
    sprites: {  // Sprites for different animations
        idle: {
            imageSrc: '../assets/img/samuraiMack/Idle.png', // Source for the idle animation
            maxFrames: 8, // Maximum frames for the idle animation
        },
        run: {
            imageSrc: '../assets/img/samuraiMack/Run.png', // Source for the running animation
            maxFrames: 8, // Maximum frames for the running animation
        },
        jump: {
            imageSrc: '../assets/img/samuraiMack/Jump.png', // Source for the jumping animation
            maxFrames: 2, // Maximum frames for the jumping animation
        },
        fall: {
            imageSrc: '../assets/img/samuraiMack/Fall.png', // Source for the falling animation
            maxFrames: 2, // Maximum frames for the falling animation
        },
        death: {
            imageSrc: '../assets/img/samuraiMack/Death.png', // Source for the death animation
            maxFrames: 6, // Maximum frames for the death animation
        },
        attack1: {
            imageSrc: '../assets/img/samuraiMack/Attack1.png', // Source for the attack animation
            maxFrames: 6, // Maximum frames for the attack animation
        },
        takeHit: {
            imageSrc: '../assets/img/samuraiMack/Take hit White.png', // Source for the hit reaction animation
            maxFrames: 4, // Maximum frames for the hit reaction animation
        }
    },
    keys: { // Key bindings for player controls
        'a': { // Move left
            pressed: false // Key state
        },
        'd': { // Move right
            pressed: false // Key state
        },
        'w': { // Jump
            pressed: false // Key state
        },
        ' ': { // Attack
            pressed: false // Key state
        }
    },
    attackTime: 400 // Time duration for the attack animation
});

// Create enemy sprite.
export const enemy = new Fighter({
    name: "enemy", // Name of the enemy character
    position: { // Initial position of the enemy on the canvas
        x: 950, // X-coordinate
        y: 0    // Y-coordinate
    },
    offset: { // Offset for rendering the enemy sprite
        x: -160, // X-offset to center the sprite
        y: 0     // Y-offset
    },
    imageSrc: '../assets/img/kenji/Idle.png', // Source of the idle sprite image for the enemy
    scale: 2.5, // Scale factor for the enemy sprite size
    maxFrames: 4, // Maximum frames for the idle animation
    holdFrames: 6, // Frames to hold the current animation state
    offsetFrame: { x: 215, y: 172 }, // Offset for the enemy animation frame
    sprites: {   // Sprites for different animations of the enemy
        idle: {
            imageSrc: '../assets/img/kenji/Idle.png', // Source for the enemy idle animation
            maxFrames: 4, // Maximum frames for the idle animation
        },
        run: {
            imageSrc: '../assets/img/kenji/Run.png', // Source for the enemy running animation
            maxFrames: 8, // Maximum frames for the running animation
        },
        jump: {
            imageSrc: '../assets/img/kenji/Jump.png', // Source for the enemy jumping animation
            maxFrames: 2, // Maximum frames for the jumping animation
        },
        fall: {
            imageSrc: '../assets/img/kenji/Fall.png', // Source for the enemy falling animation
            maxFrames: 2, // Maximum frames for the falling animation
        },
        death: {
            imageSrc: '../assets/img/kenji/Death.png', // Source for the enemy death animation
            maxFrames: 7, // Maximum frames for the death animation
        },
        attack1: {
            imageSrc: '../assets/img/kenji/Attack1.png', // Source for the enemy attack animation
            maxFrames: 4, // Maximum frames for the attack animation
        },
        takeHit: {
            imageSrc: '../assets/img/kenji/Take hit white.png', // Source for the enemy hit reaction animation
            maxFrames: 3, // Maximum frames for the hit reaction animation
        }
    },
    keys: { // Key bindings for enemy controls
        'ArrowLeft': { // Move left
            pressed: false // Key state
        },
        'ArrowRight': { // Move right
            pressed: false // Key state
        },
        'ArrowUp': { // Jump
            pressed: false // Key state
        },
        'Control': { // Attack
            pressed: false // Key state
        }
    },
    attackTime: 350 // Time duration for the enemy attack animation
});

// Export the Fighter class for use in other modules
export default Fighter;
