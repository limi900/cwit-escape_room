let attempts = 0; // Track user attempts
let timer = 600; // 10 minutes in seconds
const timerElement = document.getElementById("timer");
const bomb = document.getElementById("bomb");
const responseElement = document.getElementById("response");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

// Adjust canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Timer countdown
const countdown = setInterval(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    timer--;

    if (timer < 0) {
        clearInterval(countdown);
        detonateBomb("Time's up! Bomb detonated.");
    }
}, 1000);

// Bomb detonation
function detonateBomb(message) {
    responseElement.textContent = message;
    startConfetti();
    clearInterval(countdown);
}

// User submission handler
document.getElementById("submitBtn").addEventListener("click", function () {
    const userCode = document.getElementById("codeInput").value;

    // Basic validation for the correct fix
    if (userCode.includes("len(wireSequence) != len(correctSequence)")) {
        responseElement.textContent = "Success! Bomb defused.";
        clearInterval(countdown);
        bomb.style.animation = "defused 2s forwards";
    } else {
        attempts++;
        responseElement.textContent = `ERROR: Incorrect fix! Attempts left: ${3 - attempts}`;
        if (attempts >= 3) {
            detonateBomb("Too many incorrect attempts! Bomb detonated.");
        }
    }
});

// Confetti effect
function startConfetti() {
    canvas.style.visibility = "visible";
    let particles = [];

    for (let i = 0; i < 300; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 5 + 2,
            d: Math.random() * 10,
            color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
            tilt: Math.random() * 10 - 5,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let particle of particles) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            particle.y += particle.d / 2;
            particle.x += Math.sin(particle.d);
            particle.tilt += Math.random() * 0.5;

            if (particle.y > canvas.height) {
                particle.y = -10;
                particle.x = Math.random() * canvas.width;
            }
        }

        requestAnimationFrame(draw);
    }

    draw();
}