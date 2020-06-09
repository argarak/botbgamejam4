class Graphics {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
    this.tileSize = 16;
    this.testIcon = botbIcon.random16icon();

    this.rooms = [
      {
        startTileX: 0,
        startTileY: 0,
        width: 50,
        height: 50,
        icon: this.testIcon
      }
    ];

    this.lightsources = [
      {
        tileX: Math.floor(Math.random() * 50),
        tileY: Math.floor(Math.random() * 50),
        intensity: 0.4,
        color: [0, 0, 0]
      },
      {
        tileX: Math.floor(Math.random() * 50),
        tileY: Math.floor(Math.random() * 50),
        intensity: 0.4,
        color: [0, 0, 0]
      },
      {
        tileX: Math.floor(Math.random() * 50),
        tileY: Math.floor(Math.random() * 50),
        intensity: 0.4,
        color: [0, 0, 0]
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
    for (let room of this.rooms) {
      for (let rowindex = 0; rowindex < room.height; rowindex++) {
        for (let tileindex = 0; tileindex < room.width; tileindex++) {
          let alpha = 1;
          for (let source of this.lightsources) {
            let xpos =
              (1 + room.startTileX) * this.tileSize + tileindex * this.tileSize;
            let ypos =
              (1 + room.startTileX) * this.tileSize + rowindex * this.tileSize;

            let xtile = xpos / this.tileSize;
            let ytile = ypos / this.tileSize;

            alpha -=
              source.intensity /
              Math.sqrt(
                Math.abs(
                  (xtile - source.tileX) ** 2 + (ytile - source.tileY) ** 2
                )
              );

            // if the tile IS the source, make it full brightness
            if (source.tileX == xtile && source.tileY == ytile) {
              alpha = 0;
            }

            this.drawIcon(
              room.icon,
              xpos,
              ypos,
              1,
              0,
              -1,
              -1,
              "rgba(" +
                source.color[0] +
                ", " +
                source.color[1] +
                "  , " +
                source.color[2] +
                " , " +
                alpha +
                "  )"
            );
          }
        }
      }
    }
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
    this.maxSpeedLimit = 40;
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

    this.xpos += this.speedX / 10;
    this.ypos += this.speedY / 10;

    graphics.lightsources[0].tileX = Math.round(this.xpos / graphics.tileSize);
    graphics.lightsources[0].tileY = Math.round(this.ypos / graphics.tileSize);
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
