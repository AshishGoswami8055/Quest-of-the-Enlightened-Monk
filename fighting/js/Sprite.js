import Fighter from './Fighter.js'

// Get the canvas element and its 2D rendering context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Sprite class to manage individual sprite animations and rendering
class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, holdFrames = 30, offsetFrame = { x: 0, y: 0 } }) {
        this.position = position; // Position of the sprite on the canvas
        this.height = 150; // Default height of the sprite
        this.width = 50; // Default width of the sprite
        this.image = new Image(); // Create a new image object
        this.image.src = imageSrc; // Set the source of the image
        this.scale = scale; // Scale factor for the sprite size
        this.maxFrames = maxFrames; // Maximum number of frames in the sprite sheet
        this.currentFrame = 0; // Current frame index for animation
        this.elapsedFrames = 0; // Counter for frames passed since the last frame change
        this.holdFrames = holdFrames; // Number of frames to hold before changing to the next frame
        this.offsetFrame = offsetFrame; // Offset for the frame rendering
    }

    // Draw the sprites on the canvas
    draw() {
        // Calculate the cropping properties and draw the image
        c.drawImage(
            this.image,
            this.currentFrame * (this.image.width / this.maxFrames), // Crop start point
            0, // Crop Y start point
            this.image.width / this.maxFrames, // Crop width
            this.image.height, // Crop height
            this.position.x - this.offsetFrame.x, // X position to draw
            this.position.y - this.offsetFrame.y, // Y position to draw
            (this.image.width / this.maxFrames) * this.scale, // Width after scaling
            this.image.height * this.scale // Height after scaling
        );
    }

    // Handle the animation frames of the sprite
    animateFrames() {
        this.elapsedFrames++; // Increment the elapsed frame counter
        // Check if enough frames have passed to update the current frame
        if (this.elapsedFrames % this.holdFrames === 0) {
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++; // Move to the next frame
            } else {
                // Reset the frame depending on the instance type (Fighter or other sprite)
                if (this instanceof Fighter) { 
                    if (this.health > 0) {  // Ensure that death animation does not reset
                        this.currentFrame = 0; // Reset to the first frame for normal animations
                    }
                } else {
                    this.currentFrame = 0; // Reset for non-fighter sprites
                }
            }
        }
    }

    // Update the sprite every frame
    update() {
        this.draw(); // Draw the sprite on the canvas
        this.animateFrames(); // Handle the animation frame updates
    }
}

// Create a background sprite instance
export const background = new Sprite({
    position: {
        x: 0, // X position of the background
        y: -387 // Y position of the background
    },
    imageSrc: '../assets/img/bg.png' // Background image source
})

// Export the Sprite class for use in other modules
export default Sprite;
