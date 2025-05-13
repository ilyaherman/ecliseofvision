// level1.js
const blocks = [];
let waveOffset = 0;
const rainDrops = [];
let waterLevel = 100;
let waterRiseSpeed = 0.2;
let fallingPlatform = null;
let warningIcon = null;
let fallingPlatformTimer = 0;
const fallingPlatformInterval = 4000;
const warningDuration = 4000;
const redFallingPlatforms = [];
const redPlatformSpawnInterval = 5000;
let redPlatformTimer = 0;
let currentScreen = 1;
let cameraOffsetY = 0;

function generatePlatforms(screen = 1) {
  blocks.length = 0;

  // Adjust minY and maxY to stay within the current screen
  const minY = canvas.height - 120; // Top of the screen
  const maxY = 100; // Bottom of the screen
  const verticalStep = Math.floor((minY - maxY) / platformCount);

  const startPlatformY = canvas.height - 195;
  blocks.push({ 
    x: 100,
    y: startPlatformY,
    width: blockWidth + 60
  });

  player.y = startPlatformY - player.height;
  player.x = blocks[0].x + blocks[0].width / 2 - player.width / 2;
  player.vy = 0;
  player.grounded = true;

  for (let i = 0; i < platformCount; i++) {
    const y = minY - i * verticalStep;
    const x = Math.random() * (canvas.width - blockWidth);
    blocks.push({ 
      x, 
      y,
      width: blockWidth
    });
  }

  console.log(`Generated platforms for screen ${screen}:`, blocks);
}

function createFallingPlatform(x) {
  fallingPlatform = {
    x: x,
    y: 0,
    width: blockWidth,
    height: blockHeight,
    fallSpeed: 10
  };
  console.log("Created falling platform:", fallingPlatform);
}

function createRedFallingPlatform() {
  redFallingPlatforms.push({
    x: Math.random() * (canvas.width - blockWidth),
    y: 0,
    width: blockWidth,
    height: blockHeight,
    fallSpeed: 8
  });
  console.log("Created red falling platform:", redFallingPlatforms[redFallingPlatforms.length - 1]);
}

function createWarningIcon() {
  const availablePlatforms = blocks
    .map((block, index) => ({ block, index }))
    .filter(({ block, index }) => index > 0 && block.y + blockHeight <= canvas.height - waterLevel);

  if (availablePlatforms.length === 0) {
    console.log("No available platforms for warning icon");
    return;
  }

  const { block: platform } = availablePlatforms[Math.floor(Math.random() * availablePlatforms.length)];
  
  warningIcon = {
    x: platform.x + (platform.width - 40) / 2,
    y: platform.y - 40,
    width: 40,
    height: 40
  };
  console.log("Created warning icon:", warningIcon);
}

function checkFallingPlatformCollision() {
  if (fallingPlatform) {
    if (
      player.x + player.width > fallingPlatform.x &&
      player.x < fallingPlatform.x + fallingPlatform.width &&
      player.y + player.height > fallingPlatform.y &&
      player.y < fallingPlatform.y + fallingPlatform.height
    ) {
      player.health -= 20;
      if (player.health < 0) player.health = 0;
      if (player.health === 0) gameState.gameOver = true;
      fallingPlatform = null;
      console.log("Player hit by falling platform, health:", player.health);
    }
  }

  for (let i = redFallingPlatforms.length - 1; i >= 0; i--) {
    const platform = redFallingPlatforms[i];
    if (
      player.x + player.width > platform.x &&
      player.x < platform.x + platform.width &&
      player.y + player.height > platform.y &&
      player.y < platform.y + platform.height
    ) {
      player.health -= 20;
      if (player.health < 0) player.health = 0;
      if (player.health === 0) gameState.gameOver = true;
      redFallingPlatforms.splice(i, 1);
      console.log("Player hit by red platform, health:", player.health);
    }
  }
}

function checkWarningIconCollision() {
  if (!warningIcon) return;

  if (
    player.x + player.width > warningIcon.x &&
    player.x < warningIcon.x + warningIcon.width &&
    player.y + player.height > warningIcon.y &&
    player.y < warningIcon.y + warningIcon.height
  ) {
    warningIcon = null;
    fallingPlatformTimer = 0;
    player.isWaterSlowed = true;
    player.slowWaterTimer = 0;
    waterRiseSpeed = 0.05;
    console.log("Player collected warning icon, water rise slowed");
  }
}

function checkWaterCollision() {
  const waterTop = canvas.height - waterLevel;
  const playerBottom = player.y + player.height;
  if (playerBottom >= waterTop) {
    gameState.gameOver = true;
    console.log("Player drowned, game over");
  }
}

function updateFallingPlatform() {
  if (gameState.gameOver) return;

  fallingPlatformTimer += 1000 / 60;
  redPlatformTimer += 1000 / 60;

  if (fallingPlatformTimer >= fallingPlatformInterval && !warningIcon && !fallingPlatform) {
    createWarningIcon();
    fallingPlatformTimer = 0;
  }

  if (warningIcon && fallingPlatformTimer >= warningDuration) {
    createFallingPlatform(warningIcon.x);
    warningIcon = null;
  }

  if (fallingPlatform) {
    fallingPlatform.y += fallingPlatform.fallSpeed;
    if (fallingPlatform.y + fallingPlatform.height > canvas.height - waterLevel) {
      fallingPlatform = null;
    }
  }

  for (let i = redFallingPlatforms.length - 1; i >= 0; i--) {
    const platform = redFallingPlatforms[i];
    platform.y += platform.fallSpeed;
    if (platform.y + platform.height > canvas.height - waterLevel) {
      redFallingPlatforms.splice(i, 1);
    }
  }

  if (redPlatformTimer >= redPlatformSpawnInterval) {
    createRedFallingPlatform();
    redPlatformTimer = 0;
  }
}

function drawBlocks() {
  ctx.fillStyle = "#ccc";
  blocks.forEach(block => {
    const blockW = block.width || blockWidth;
    ctx.fillRect(block.x, block.y, blockW, blockHeight);
    ctx.strokeStyle = "#999";
    ctx.strokeRect(block.x, block.y, blockW, blockHeight);
  });

  if (fallingPlatform) {
    ctx.save();
    ctx.filter = 'blur(5px)';
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    ctx.fillRect(fallingPlatform.x, fallingPlatform.y, fallingPlatform.width, fallingPlatform.height);
    ctx.strokeStyle = "#999";
    ctx.strokeRect(fallingPlatform.x, fallingPlatform.y, fallingPlatform.width, fallingPlatform.height);
    ctx.restore();
  }

  redFallingPlatforms.forEach(platform => {
    ctx.save();
    ctx.filter = 'blur(5px)';
    ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.strokeStyle = "#999";
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    ctx.restore();
  });

  if (warningIcon) {
    if (warningIconImage.complete && warningIconImage.naturalWidth !== 0) {
      ctx.drawImage(warningIconImage, warningIcon.x, warningIcon.y, warningIcon.width, warningIcon.height);
    } else {
      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.moveTo(warningIcon.x + warningIcon.width / 2, warningIcon.y);
      ctx.lineTo(warningIcon.x, warningIcon.y + warningIcon.height);
      ctx.lineTo(warningIcon.x + warningIcon.width, warningIcon.y + warningIcon.height);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#000";
      ctx.stroke();
      console.warn("Warning icon image not loaded, using fallback");
    }
  }
}

function drawWater() {
  const waveHeight = 5;
  const waveLength = 150;
  const yStart = canvas.height - waterLevel;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, yStart);

  for (let x = 0; x <= canvas.width; x++) {
    const y = yStart + Math.sin((x + waveOffset) / waveLength * Math.PI * 2) * waveHeight + Math.sin((x + waveOffset * 0.5) / (waveLength * 1.5) * Math.PI * 2) * waveHeight * 0.5;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(canvas.width, canvas.height);
  ctx.lineTo(0, canvas.height);
  ctx.closePath();

  ctx.fillStyle = "rgba(80, 80, 80, 0.5)";
  ctx.fill();
  ctx.restore();

  waveOffset += 1.5;
  if (!gameState.gameOver) {
    waterLevel += waterRiseSpeed;
    if (waterLevel > canvas.height) {
      waterLevel = canvas.height;
    }
  }
}

function createRain() {
  while (rainDrops.length < rainCount) {
    rainDrops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: 10 + Math.random() * 10,
      speed: 4 + Math.random() * 4
    });
  }
  console.log("Created rain drops:", rainDrops.length);
}

function updateRain() {
  if (!gameState.gameOver) {
    for (let i = 0; i < rainDrops.length; i++) {
      const drop = rainDrops[i];
      drop.y += drop.speed;

      if (drop.y >= canvas.height - waterLevel) {
        drop.y = -drop.length;
        drop.x = Math.random() * canvas.width;
      }
    }
  }
}

function drawRain() {
  ctx.strokeStyle = "rgba(180,180,180,0.6)";
  ctx.lineWidth = 1;
  for (let i = 0; i < rainDrops.length; i++) {
    const drop = rainDrops[i];
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x, drop.y + drop.length);
    ctx.stroke();
  }
}

function drawGameOver() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Игра завершена", canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = "20px Arial";
  ctx.fillText("Чтобы продолжить, нажмите на R", canvas.width / 2, canvas.height / 2 + 20);

  soundManager.stop('rain');
}

function transitionToNextScreen() {
  if (currentScreen < gameState.totalScreens) {
    currentScreen++;
    cameraOffsetY = 0; // Reset camera for simplicity
    player.y = canvas.height - 195 - player.height; // Reposition player
    player.x = 100 + (blockWidth + 60) / 2 - player.width / 2;
    waterLevel = 100;
    waveOffset = 0;
    rainDrops.length = 0;
    createRain();
    generatePlatforms(currentScreen);
    console.log(`Transitioned to screen ${currentScreen}, player at:`, { x: player.x, y: player.y });
  } else {
    gameState.gameOver = true;
    gameState.victory = true;
    console.log("Victory achieved!");
  }
}

function resetGame() {
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.facing = "right";
  player.jumping = false;
  player.jumpStartTime = 0;
  player.health = 100;
  player.isWaterSlowed = false;
  player.slowWaterTimer = 0;

  waterLevel = 100;
  waveOffset = 0;
  waterRiseSpeed = 0.2;

  fallingPlatform = null;
  warningIcon = null;
  fallingPlatformTimer = 0;
  redFallingPlatforms.length = 0;
  redPlatformTimer = 0;

  rainDrops.length = 0;
  createRain();

  currentScreen = 1;
  cameraOffsetY = 0;
  gameState.victory = false;

  generatePlatforms(currentScreen);

  gameState.gameOver = false;

  if (gameState.animationFrameId) {
    cancelAnimationFrame(gameState.animationFrameId);
  }

  soundManager.play('rain');

  gameLoop();
}

function gameLoop() {
  if (gameState.paused) return;

  ctx.fillStyle = "#555";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (backgroundImage.complete && backgroundImage.naturalWidth !== 0) {
    const scale = canvas.width / backgroundImage.width;
    const scaledHeight = backgroundImage.height * scale;
    const yOffset = (canvas.height - scaledHeight) / 2;
    ctx.drawImage(backgroundImage, 0, yOffset, canvas.width, scaledHeight);
  } else {
    console.warn("Background image not loaded, skipping draw");
  }

  drawBlocks();
  drawWater();
  updateRain();
  drawRain();
  updateFallingPlatform();
  updatePlayer();
  drawPlayer();
  drawHealthBar();
  checkWaterCollision();
  checkFallingPlatformCollision();
  checkWarningIconCollision();

  if (player.y < 0 && currentScreen < gameState.totalScreens) {
    transitionToNextScreen();
  }

  if (gameState.gameOver) {
    if (gameState.victory) {
      drawVictoryScreen();
    } else {
      drawGameOver();
    }
    cancelAnimationFrame(gameState.animationFrameId);
  } else {
    gameState.animationFrameId = requestAnimationFrame(gameLoop);
  }

  console.log(`Game loop running, screen: ${currentScreen}, player:`, { x: player.x, y: player.y });
}

function initGame() {
  console.log("============================================");
  console.log("Игра инициализирована");
  console.log("Управление: стрелки влево/вправо - движение, стрелка вверх или пробел - прыжок");
  console.log("============================================");
  
  generatePlatforms(currentScreen);
  createRain();
  soundManager.play('rain');
  gameLoop();
}

window.addEventListener("keydown", function(e) {
  if ((gameState.gameOver || gameState.victory) && e.key.toLowerCase() === "r") {
    resetGame();
    return;
  }

  switch(e.key) {
    case "ArrowLeft":
      keys.left = true;
      break;
    case "ArrowRight":
      keys.right = true;
      break;
    case "ArrowUp":
    case " ":
      keys.up = true;
      break;
  }
  
  if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
    e.preventDefault();
  }
});

window.addEventListener("keyup", function(e) {
  switch(e.key) {
    case "ArrowLeft":
      keys.left = false;
      break;
    case "ArrowRight":
      keys.right = false;
      break;
    case "ArrowUp":
    case " ":
      keys.up = false;
      break;
  }
});

backgroundImage.onload = initGame;

window.addEventListener('load', function() {
  console.log("Страница загружена, ожидание загрузки фона...");
});
