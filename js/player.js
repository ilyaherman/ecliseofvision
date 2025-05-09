const playerImages = {
  idle_right: new Image(),
  idle_left: new Image(),
  jump: new Image()
};
playerImages.idle_right.src = "assets/images/hero/main_character_right.png";
playerImages.idle_left.src = "assets/images/hero/main_character_left.png";
playerImages.jump.src = "assets/images/hero/main_character_up.png";

const player = {
  x: 100,
  y: 0,
  width: 50,
  height: 50,
  speed: 5,
  vx: 0,
  vy: 0,
  grounded: false,
  facing: "right",
  jumping: false,
  jumpPower: 15,
  jumpStartTime: 0,
  jumpDuration: 500,
  health: 100,
  isWaterSlowed: false,
  slowWaterTimer: 0
};

const keys = {
  left: false,
  right: false,
  up: false
};

function createTestButtons() {
  const buttonContainer = document.createElement('div');
  buttonContainer.style.position = 'absolute';
  buttonContainer.style.bottom = '10px';
  buttonContainer.style.left = '10px';
  buttonContainer.style.zIndex = '100';
  
  const leftButton = document.createElement('button');
  leftButton.textContent = '←';
  leftButton.style.width = '50px';
  leftButton.style.height = '50px';
  leftButton.style.margin = '5px';
  leftButton.style.fontSize = '20px';
  
  const rightButton = document.createElement('button');
  rightButton.textContent = '→';
  rightButton.style.width = '50px';
  rightButton.style.height = '50px';
  rightButton.style.margin = '5px';
  rightButton.style.fontSize = '20px';
  
  const jumpButton = document.createElement('button');
  jumpButton.textContent = '↑';
  jumpButton.style.width = '50px';
  jumpButton.style.height = '50px';
  jumpButton.style.margin = '5px';
  jumpButton.style.fontSize = '20px';
  
  leftButton.addEventListener('mousedown', () => keys.left = true);
  leftButton.addEventListener('mouseup', () => keys.left = false);
  leftButton.addEventListener('touchstart', (e) => { keys.left = true; e.preventDefault(); });
  leftButton.addEventListener('touchend', () => keys.left = false);
  
  rightButton.addEventListener('mousedown', () => keys.right = true);
  rightButton.addEventListener('mouseup', () => keys.right = false);
  rightButton.addEventListener('touchstart', (e) => { keys.right = true; e.preventDefault(); });
  rightButton.addEventListener('touchend', () => keys.right = false);
  
  jumpButton.addEventListener('mousedown', () => keys.up = true);
  jumpButton.addEventListener('mouseup', () => keys.up = false);
  jumpButton.addEventListener('touchstart', (e) => { keys.up = true; e.preventDefault(); });
  jumpButton.addEventListener('touchend', () => keys.up = false);
  
  buttonContainer.appendChild(leftButton);
  buttonContainer.appendChild(jumpButton);
  buttonContainer.appendChild(rightButton);
  
  document.body.appendChild(buttonContainer);
}

function checkPlatformCollisions() {
  player.grounded = false;
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockW = block.width || blockWidth;
    
    if (player.x + player.width > block.x && 
        player.x < block.x + blockW && 
        player.y + player.height > block.y && 
        player.y + player.height < block.y + blockHeight && 
        player.vy >= 0) {
      
      player.grounded = true;
      player.y = block.y - player.height;
      player.vy = 0;
      break;
    }
  }
  
  if (!player.grounded) {
    player.vy += gravity;
  }
}

function drawHealthBar() {
  const barWidth = 100;
  const barHeight = 10;
  const x = 10;
  const y = 10;

  ctx.fillStyle = "#555";
  ctx.fillRect(x, y, barWidth, barHeight);

  ctx.fillStyle = player.health > 50 ? "green" : player.health > 20 ? "yellow" : "red";
  ctx.fillRect(x, y, (player.health / 100) * barWidth, barHeight);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, barWidth, barHeight);
}

function updatePlayer() {
  if (gameState.gameOver) return;

  player.vx = 0;
  
  if (keys.left) {
    player.vx = -player.speed;
    player.facing = "left";
  }
  
  if (keys.right) {
    player.vx = player.speed;
    player.facing = "right";
  }

  if (keys.up && player.grounded && !player.jumping) {
    player.vy = -player.jumpPower;
    player.grounded = false;
    player.jumping = true;
    player.jumpStartTime = Date.now();
  }

  player.x += player.vx;
  player.y += player.vy;

  checkPlatformCollisions();
  checkFallingPlatformCollision();
  checkWarningIconCollision();

  if (player.isWaterSlowed) {
    player.slowWaterTimer += 1000 / 60;
    if (player.slowWaterTimer >= 3000) {
      player.isWaterSlowed = false;
      waterRiseSpeed = 0.2;
    }
  }

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  
  if (player.y + player.height > canvas.height - waterLevel) {
    gameState.gameOver = true;
  }

  const jumpTimeElapsed = Date.now() - player.jumpStartTime;
  if (player.jumping && jumpTimeElapsed > player.jumpDuration) {
    player.jumping = false;
  }
}

function drawPlayer() {
  let img;
  
  if (player.jumping) {
    img = playerImages.jump;
  } else {
    img = player.facing === "right" ? playerImages.idle_right : playerImages.idle_left;
  }

  ctx.drawImage(img, player.x, player.y + cameraOffsetY, player.width, player.height);
}