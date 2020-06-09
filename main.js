class Graphics {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
    this.testIcon = botbIcon.random16icon();

    this.lightsources = [
      {
        x: 0,
        y: 0,
        intensity: 10,
        color: [25, 250, 20]
      }
    ];
  }

  clearScreen() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawIcon(icon, x, y, scale = 1, rotate = 0, cx = -1, cy = -1, tint = "") {
    let xpos = cx;
    let ypos = cy;

    if (cx === -1) {
      xpos = icon.width * scale / 2;
    }

    if (cy === -1) {
      ypos = icon.height * scale / 2;
    }

    this.ctx.setTransform(scale, 0, 0, scale, x, y);
    this.ctx.rotate(rotate * Math.PI / 180);

    this.ctx.drawImage(
      this.spritesheet,
      icon.posX,
      icon.posY,
      icon.width,
      icon.height,
      -xpos,
      -ypos,
      icon.width * scale,
      icon.height * scale
    );

    if (tint) {
      this.ctx.fillStyle = tint;
      this.ctx.fillRect(-xpos, -ypos, icon.width * scale, icon.height * scale);
    }

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  drawMap() {
    let maptest = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    for (let rowindex = 0; rowindex < maptest.length; rowindex++) {
      for (
        let tileindex = 0;
        tileindex < maptest[rowindex].length;
        tileindex++
      ) {
        switch (maptest[rowindex][tileindex]) {
          case 1:
            this.drawIcon(
              this.testIcon,
              16 + tileindex * 16,
              16 + rowindex * 16,
              1,
              0,
              -1,
              -1
            );
            break;
          case 0:
            this.drawIcon(
              this.testIcon,
              16 + tileindex * 16,
              16 + rowindex * 16,
              1,
              0,
              -1,
              -1,
              "rgba(0,0,0,0.8)"
            );
            break;
        }
      }
    }

    //this.drawIcon(botbIcon.random16icon(), 0, 0, 1);
  }
}

var graphics = new Graphics();

class Player {
  constructor() {
    this.xpos = 16 * 4;
    this.ypos = 16 * 4;
    this.icon = botbIcon.getIcon("n00b");

    // player movement
    this.speedX = 0;
    this.speedY = 0;
    this.acceleration = 5;
    this.friction = 1;
    this.maxSpeedLimit = 20;
    this.minSpeedLimit = -this.maxSpeedLimit;

    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.debug = true;
  }

  updatePositions() {
    if (this.debug) {
      document.getElementById("speedX").innerHTML =
        "player.speedX = " + this.speedX;
    }

    if (this.movingDown) {
      if (this.speedY < this.maxSpeedLimit) {
        this.speedY += this.acceleration;
      }
    } else {
      if (this.speedY > 0) {
        this.speedY -= this.friction;
      }
    }

    if (this.movingUp) {
      if (this.speedY > this.minSpeedLimit) {
        this.speedY -= this.acceleration;
      }
    } else {
      if (this.speedY < 0) {
        this.speedY += this.friction;
      }
    }

    if (this.movingLeft) {
      if (this.speedX > this.minSpeedLimit) {
        this.speedX -= this.acceleration;
      }
    } else {
      if (this.speedX < 0) {
        this.speedX += this.friction;
      }
    }

    if (this.movingRight) {
      if (this.speedX < this.maxSpeedLimit) {
        this.speedX += this.acceleration;
      }
    } else {
      if (this.speedX > 0) {
        this.speedX -= this.friction;
      }
    }

    if (this.xpos > 0) {
      this.xpos += this.speedX / 10;
    }

    if (this.ypos > 0) {
      this.ypos += this.speedY / 10;
    }
  }

  draw() {
    this.updatePositions();
    graphics.drawIcon(this.icon, this.xpos, this.ypos);
  }
}

var player = new Player();

document.addEventListener("keydown", function(event) {
  if (event.code === "KeyW") {
    player.movingUp = true;
  }

  if (event.code === "KeyA") {
    player.movingLeft = true;
  }

  if (event.code === "KeyS") {
    player.movingDown = true;
  }

  if (event.code === "KeyD") {
    player.movingRight = true;
  }
});

document.addEventListener("keyup", function(event) {
  if (event.code === "KeyW") {
    player.movingUp = false;
  }

  if (event.code === "KeyA") {
    player.movingLeft = false;
  }

  if (event.code === "KeyS") {
    player.movingDown = false;
  }

  if (event.code === "KeyD") {
    player.movingRight = false;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  graphics.drawMap();
  function gameLoop() {
    graphics.clearScreen();
    graphics.drawMap();
    player.draw();
    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
