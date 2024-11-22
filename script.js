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

    if (userCode.includes("len(wireSequence) != len(correctSequence)")) {
        responseElement.textContent = "Success! Bomb defused.";
        clearInterval(countdown);
    } else {
        attempts++;
        responseElement.textContent = `ERROR: Incorrect fix! Attempts left: ${3 - attempts}`;
        if (attempts >= 3) {
            detonateBomb("Too many incorrect attempts! Bomb detonated.");
        }
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("explosionCanvas");
    const ctx = canvas.getContext("2d");
    const gameOverText = document.getElementById("gameOverText");

    // Resize the canvas to fill the screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let explosionComplete = false;

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

    function startExplosion() {
        canvas.style.display = "block";
        createParticles();
        const explosionInterval = setInterval(() => {
            drawParticles();
            if (explosionComplete) {
                clearInterval(explosionInterval);
            }
        }, 30);
    }

    // Simulate explosion trigger (e.g., bomb timer ends)
    setTimeout(startExplosion, 10000); // Replace with your own logic
});



/*
// Confetti logic
function detonateBomb(message) {
    responseElement.textContent = message;
    startConfetti();
}

function startConfetti() {
    canvas.style.visibility = "visible";
    let particles = [];
    for (let i = 0; i < 300; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 5 + 2,
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            p.y += p.r / 2;
            if (p.y > canvas.height) p.y = 0;
        });
        requestAnimationFrame(draw);
    }
    draw();
}
*/
