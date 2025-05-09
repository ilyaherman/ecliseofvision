// In settings.js or your main game file

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundImage = new Image();
backgroundImage.src = "assets/images/levels/1/1level_sera.png";

const warningIconImage = new Image();
warningIconImage.src = "assets/images/warning_icon.png";

const blockWidth = 140;
const blockHeight = 20;
const platformCount = 7;

const rainCount = 100;

const gravity = 0.8;

const gameState = {
  gameOver: false,
  animationFrameId: null,
  paused: false
};

// Pause menu function that darkens the game background
function drawPauseMenu() {
  // Draw darker semi-transparent overlay to dim the game background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)"; // Dark overlay with 70% opacity
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw menu title
  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2 - 80);

  // Draw buttons with better styling
  // Continue button
  ctx.fillStyle = "#333333";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 - 30, 240, 50);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - 120, canvas.height / 2 - 30, 240, 50);
  
  // Exit button
  ctx.fillStyle = "#333333";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 40, 240, 50);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - 120, canvas.height / 2 + 40, 240, 50);

  // Button text
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Продолжить", canvas.width / 2, canvas.height / 2);
  ctx.fillText("Выход", canvas.width / 2, canvas.height / 2 + 70);
}

// Function to toggle pause state
function togglePause() {
  gameState.paused = !gameState.paused;
  if (gameState.paused) {
    // Pause game logic and sounds
    if (soundManager && typeof soundManager.pause === 'function') {
      soundManager.pause('rain');
    }
    cancelAnimationFrame(gameState.animationFrameId);
    drawPauseMenu(); // Draw pause menu immediately
  } else {
    // Resume game logic and sounds
    if (soundManager && typeof soundManager.play === 'function') {
      soundManager.play('rain');
    }
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// Handle Esc key for pausing
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !gameState.gameOver) {
    togglePause();
    e.preventDefault();
  }
});

// Handle pause menu button clicks
canvas.addEventListener("click", function(e) {
  if (!gameState.paused) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Continue button boundaries
  if (
    x >= canvas.width / 2 - 120 && x <= canvas.width / 2 + 120 &&
    y >= canvas.height / 2 - 30 && y <= canvas.height / 2 + 20
  ) {
    togglePause(); // Resume game
  }

  // Exit button boundaries
  if (
    x >= canvas.width / 2 - 120 && x <= canvas.width / 2 + 120 &&
    y >= canvas.height / 2 + 40 && y <= canvas.height / 2 + 90
  ) {
    // Handle exit action - could redirect to main menu or reset game
    window.location.href = "index.html"; // Example: return to main menu page
    // Alternative: window.location.reload(); // Simply reload the current page
  }
});