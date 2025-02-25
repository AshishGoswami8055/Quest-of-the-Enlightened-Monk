// meditation.js

// Grabbing the necessary elements
const meditationContainer = document.querySelector('.meditation-container');
const meditationVideo = document.getElementById('meditation-video');
const pauseButton = document.getElementById('pause-video');
const playButton = document.getElementById('play-video');
const closeButton = document.getElementById('close-popup');

// Function to trigger the meditation popup
function triggerMeditation() {
    meditationContainer.style.visibility = 'visible';  // Show popup
    meditationVideo.play();  // Automatically play video when popup is shown
}

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

// Function to check for collisions and open meditation in a new tab
function checkMeditationCollision() {
    const meditationObj = document.querySelectorAll('.meditation');
    meditationObj.forEach((obj) => {
        const img = obj.querySelector('img');
        if (checkCollision(player, img) && !obj.classList.contains('fade-out')) {
            console.log('Collision detected!');
            window.open('meditation.html', '_blank'); // Open meditation game in a new tab
        }
    });
}

// Export the checkMeditationCollision function if needed
// export { checkMeditationCollision };
