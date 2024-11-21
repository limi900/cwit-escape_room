let timer = 600; // 10 minutes in seconds
let attempts = 0;

const timerElement = document.getElementById("timer");
const responseElement = document.getElementById("response");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

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
