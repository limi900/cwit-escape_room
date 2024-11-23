let timer = 600; // 10 minutes in seconds
let attempts = 0;

const timerElement = document.getElementById("timer");
if (!timerElement) {
    console.error("Timer element not found in the DOM.");
}
const responseElement = document.getElementById("response");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

// Timer countdown
const countdown = setInterval(() => {
    if (timer >= 0) { // Ensure timer doesn't go negative
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
        timer--;
    } else {
        clearInterval(countdown);
        detonateBomb("Time's up! Bomb detonated.");
    }
}, 1000);

// Submit button logic
document.getElementById("submitBtn").addEventListener("click", () => {
    const userCode = document.getElementById("codeInput").value;
    console.log('click');

    if (userCode.includes("if wireSequence[i] != correctSequence[i]:")) {
        //responseElement.textContent = "Success! Bomb defused.";
        //detonateBomb("Success! Bomb defused.");
        startConfetti("Success! Bomb defused.");
       // clearInterval(countdown);
    } else {
        attempts++;
        responseElement.textContent = `ERROR: Incorrect fix! Attempts left: ${3 - attempts}`;
        if (attempts >= 3) {
            detonateBomb("Too many incorrect attempts! Bomb detonated.");

        }
    }
});

function detonateBomb(message) {
    responseElement.textContent = message;
    bombEffect();
}

function bombEffect(){
    const canvas = document.getElementById("explosionCanvas");
    const ctx = canvas.getContext("2d");
    const gameOverText = document.getElementById("gameOverText");

    // Resize the canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let explosionComplete = false;
    let explosionEndTime = Date.now() + 5 * 1000; // Run for 30 seconds

    canvas.style.display = "block";

    function createParticles(centerX, centerY) {
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: centerX,
                y: centerY,
                radius: Math.random() * 5 + 2,
                color: `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 150)}, 0)`, // Shades of red and orange
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                alpha: 1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
            ctx.fill();

            // Update particle position and alpha
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.alpha -= 0.02;

            // Remove particles that are no longer visible
            // if (particle.alpha <= 0) {
            //     particles.splice(index, 1);
            // }
        });

        // Stop the explosion after given seconds
        if (Date.now() < explosionEndTime) {
            requestAnimationFrame(drawParticles);
        } else if (!explosionComplete) {
            explosionComplete = true;
            fadeToBlack();
        }
    }

    function fadeToBlack() {
        let opacity = 0;
        const fadeInterval = setInterval(() => {
            opacity += 0.02;
            canvas.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

            if (opacity >= 1) {
                clearInterval(fadeInterval);
                canvas.style.display = "none"; // Hide canvas after fade
                showGameOver();
            }
        }, 50);
    }

    function showGameOver() {
        canvas.style.display = "none";
        gameOverText.style.visibility = "visible";
    }

    // Trigger explosions at random positions
    function triggerRandomExplosions() {
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;
        createParticles(randomX, randomY);
    }

    // Schedule explosions at random intervals
    const explosionInterval = setInterval(() => {
        if (Date.now() < explosionEndTime) {
            triggerRandomExplosions();
        } else {
            clearInterval(explosionInterval);
        }
    }, 500); // Trigger an explosion every 500ms

    drawParticles(); // Start the animation
}

/*
    createParticles();
    const explosionInterval = setInterval(() => {
        drawParticles();
        if (explosionComplete) {
            clearInterval(explosionInterval);
        }
    }, 30);

    function createParticles() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        for (let i = 0; i < 100; i++) {
            particles.push({
                x: centerX,
                y: centerY,
                radius: Math.random() * 5 + 2,
                color: `rgb(${Math.random() * 255}, ${Math.random() * 100}, 0)`,
                velocityX: (Math.random() - 0.5) * 10,
                velocityY: (Math.random() - 0.5) * 10,
                alpha: 1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((particle, index) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`;
            ctx.fill();

            // Update particle position and alpha
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.alpha -= 0.02;

            // Remove particles that are no longer visible
            if (particle.alpha <= 0) {
                particles.splice(index, 1);
            }
        });

        // When all particles are gone, start fading the screen to black
        if (particles.length === 0 && !explosionComplete) {
            explosionComplete = true;
            fadeToBlack();
        }
    }

    function fadeToBlack() {
        let opacity = 0;
        const fadeInterval = setInterval(() => {
            opacity += 0.02;
            canvas.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

            if (opacity >= 1) {
                clearInterval(fadeInterval);
                showGameOver();
            }
        }, 50);
    }

    function showGameOver() {
        canvas.style.display = "none";
        gameOverText.style.visibility = "visible";
    }
}
*/

function startConfetti(message) {
    responseElement.textContent = message;
    canvas.style.display = "block";
    canvas.style.visibility = "visible";
    let particles = [];
    const gameOverText = document.getElementById("gameSuccess");

    // Adjust canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameOverText.style.visibility = "visible";

    (function frame() {
    // launch a few confetti from the left edge
    confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
    });
    // and launch a few from the right edge
    confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
    });
    requestAnimationFrame(frame);

    // keep going until we are out of time
    // if (Date.now() < end) {
    //     requestAnimationFrame(frame);
    // }
    }());
}

