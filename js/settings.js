// settings.js

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
  paused: false,
  currentScreen: 1,
  totalScreens: 9,
  victory: false
};

// Pause menu function
function drawPauseMenu() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2 - 80);

  ctx.fillStyle = "#333333";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 - 30, 240, 50);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - 120, canvas.height / 2 - 30, 240, 50);

  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Продолжить", canvas.width / 2, canvas.height / 2);

  ctx.fillStyle = "#333333";
  ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 40, 240, 50);
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.strokeRect(canvas.width / 2 - 120, canvas.height / 2 + 40, 240, 50);

  ctx.fillStyle = "white";
  ctx.fillText("Выход", canvas.width / 2, canvas.height / 2 + 70);
}

// Victory screen
function drawVictoryScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Поздравляем! Вы победили!", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText("Чтобы начать заново, нажмите R", canvas.width / 2, canvas.height / 2 + 20);

  soundManager.stop('rain');
}

// Toggle pause state
function togglePause() {
  gameState.paused = !gameState.paused;
  if (gameState.paused) {
    if (soundManager && typeof soundManager.pause === 'function') {
      soundManager.pause('rain');
    }
    cancelAnimationFrame(gameState.animationFrameId);
    drawPauseMenu();
  } else {
    if (soundManager && typeof soundManager.play === 'function') {
      soundManager.play('rain');
    }
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }
}

// Handle Esc key for pausing
window.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && !gameState.gameOver && !gameState.victory) {
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

  if (
    x >= canvas.width / 2 - 120 && x <= canvas.width / 2 + 120 &&
    y >= canvas.height / 2 - 30 && y <= canvas.height / 2 + 20
  ) {
    togglePause();
  }

  if (
    x >= canvas.width / 2 - 120 && x <= canvas.width / 2 + 120 &&
    y >= canvas.height / 2 + 40 && y <= canvas.height / 2 + 90
  ) {
    window.location.href = "index.html";
  }
});

// Log image loading status
backgroundImage.onload = function() {
  console.log("Background image loaded successfully");
};
backgroundImage.onerror = function() {
  console.error("Failed to load background image: assets/images/levels/1/1level_sera.png");
};
