import Fighter from './Fighter.js'; // Import the Fighter class for specific sprite behavior

// Select the canvas element and get its 2D drawing context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Define the Sprite class to handle drawing and animating sprites
class Sprite {
    constructor({ position, imageSrc, scale = 1, maxFrames = 1, holdFrames = 30, offsetFrame = { x: 0, y: 0 } }) {
        this.position = position; // Position of the sprite on the canvas
        this.height = 150; // Height of the sprite
        this.width = 50; // Width of the sprite
        this.image = new Image(); // Create a new image instance
        this.image.src = imageSrc; // Set the source of the image
        this.scale = scale; // Scale factor for the sprite size
        this.maxFrames = maxFrames; // Maximum number of frames in the sprite animation
        this.currentFrame = 0; // Current frame index for animation
        this.elapsedFrames = 0; // Count of frames that have passed for animation timing
        this.holdFrames = holdFrames; // Frames to hold on the current frame before switching
        this.offsetFrame = offsetFrame; // Offset for drawing the sprite
    }

    // Method to draw the sprite on the canvas
    draw() {
        // Draw the image on the canvas with cropping based on the current frame
        c.drawImage(this.image, 
            this.currentFrame * (this.image.width / this.maxFrames), // Crop from the image
            0, 
            this.image.width / this.maxFrames, // Width of the current frame
            this.image.height, // Height of the image
            this.position.x - this.offsetFrame.x, // Adjusted x position
            this.position.y - this.offsetFrame.y, // Adjusted y position
            (this.image.width / this.maxFrames) * this.scale, // Scaled width
            this.image.height * this.scale // Scaled height
        );
    }

    // Method to handle animation of frames
    animateFrames() {
        this.elapsedFrames++; // Increment the frame counter
        // Only update the current frame if we've reached the hold frames count
        if (this.elapsedFrames % this.holdFrames === 0) {
            // Check if we can move to the next frame
            if (this.currentFrame < this.maxFrames - 1) {
                this.currentFrame++; // Move to the next frame
            } else {
                // Check if the sprite is a Fighter to avoid resetting during death animation
                if (this instanceof Fighter) {
                    if (this.health > 0) { // Only reset if health is above 0
                        this.currentFrame = 0; // Reset the frame to the start of the animation
                    }
                } else {
                    this.currentFrame = 0; // Reset the frame for non-Fighter sprites
                }
            }
        }
    }

    // Method to update the sprite each frame
    update() {
        this.draw(); // Draw the sprite on the canvas
        this.animateFrames(); // Handle frame animation
    }
}

// Create a background sprite instance
export const background = new Sprite({
    position: {
        x: 0,
        y: -387 // Y position for the background
    },
    imageSrc: '../assets/img/bg.png' // Source image for the background
});

// Export the Sprite class for use in other modules
export default Sprite;
