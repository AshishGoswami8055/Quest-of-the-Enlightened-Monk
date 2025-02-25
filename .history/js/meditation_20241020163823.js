// meditation.js

document.addEventListener('DOMContentLoaded', () => {
    // Function to check for collision
    function checkMeditationCollision() {
        const meditationObj = document.querySelector('.meditation');
        const img = meditationObj.querySelector('img');
        
        // Replace 'player' with your actual player element
        if (checkCollision(player, img)) {
            console.log('Collision detected! Redirecting to meditation page');
            window.location.href = 'meditation.html'; // Redirect to meditation page
        }
    }

    // This function can be called in your game loop or wherever necessary
    setInterval(checkMeditationCollision, 100); // Example: check for collision every 100ms
});
