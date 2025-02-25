document.addEventListener('DOMContentLoaded', () => {
    // Function to check for collision between the player and meditation object
    function checkMeditationCollision() {
        const meditationObj = document.querySelector('.meditation');
        const img = meditationObj.querySelector('img');
                if (checkCollision(player, img)) {
            console.log('Collision detected! Redirecting to meditation page');
            window.location.href = 'meditation.html'; // Redirect to meditation page
        }
    }

    // Periodically checks for collisions to trigger the meditation redirect
    setInterval(checkMeditationCollision, 100); // This function can be called in your game loop or wherever necessary
});
