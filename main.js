class Graphics {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
    this.tileSize = 16;

    this.camY = 0;
    this.camX = 0;

    this.rooms = [
      {
        startTileX: 0,
        startTileY: 0,
        width: 20,
        height: 20,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 20,
        startTileY: 10,
        width: 10,
        height: 40,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 30,
        startTileY: 10,
        width: 50,
        height: 5,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 0,
        startTileY: -10,
        width: 50,
        height: 10,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 50,
        startTileY: -10,
        width: 10,
        height: 30,
        icon: botbIcon.random16icon()
      },
      {
        startTileX: 20,
        startTileY: 0,
        width: 10,
        height: 10,
        icon: botbIcon.random16icon()
      }
    ];

    this.lightsources = [
      {
        tileX: Math.floor(Math.random() * 20),
        tileY: Math.floor(Math.random() * 20),
        intensity: 2
      },
      {
        tileX: Math.floor(Math.random() * 20),
        tileY: Math.floor(Math.random() * 20),
        intensity: 0.9
      },
      {
        tileX: Math.floor(Math.random() * 20),
        tileY: Math.floor(Math.random() * 20),
        intensity: 0.3
      }
    ];

    this.roomNameElement = document.getElementById("roomName");
    this.currentRoomNameValue = "";
    this.currentRoom = this.rooms[0];
  }

  clearScreen() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

    this.ctx.setTransform(
      scale,
      0,
      0,
      scale,
      this.canvas.width / 2 + (x - this.camX),
      this.canvas.height / 2 + (y - this.camY)
    );
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

  moveCamera(x, y) {
    var camX = -x + this.canvas.width / 2;
    var camY = -y + this.canvas.height / 2;

    this.ctx.translate(camX, camY);
  }

  drawMap() {
    for (let room of this.rooms) {
      if (
        this.camX < (room.startTileX + room.width) * this.tileSize &&
        this.camX > (room.startTileX + 1) * this.tileSize &&
        this.camY < (room.startTileY + room.height) * this.tileSize &&
        this.camY > (room.startTileY + 1) * this.tileSize
      ) {
        if (this.currentRoomNameValue !== "room of " + room.icon.name) {
          this.currentRoom = room;
          this.currentRoomNameValue = "room of " + room.icon.name;
          this.roomNameElement.innerHTML = this.currentRoomNameValue;
        }
      }

      for (let rowindex = 0; rowindex < room.height; rowindex++) {
        for (let tileindex = 0; tileindex < room.width; tileindex++) {
          let alpha = 1;
          for (let source of this.lightsources) {
            let xpos =
              (1 + room.startTileX) * this.tileSize + tileindex * this.tileSize;
            let ypos =
              (1 + room.startTileY) * this.tileSize + rowindex * this.tileSize;

            let xtile = xpos / this.tileSize;
            let ytile = ypos / this.tileSize;

            alpha -=
              source.intensity /
              Math.sqrt(
                Math.abs(
                  (xtile - source.tileX) ** 2 + (ytile - source.tileY) ** 2
                ) * 5
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
              "rgba(0,0,0," + alpha.toFixed(1) + ")"
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
    this.maxSpeedLimit = 30;
    this.minSpeedLimit = -this.maxSpeedLimit;

    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.debug = false;
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

    graphics.camX = this.xpos;
    graphics.camY = this.ypos;

    graphics.lightsources[0].tileX = Math.round(this.xpos / graphics.tileSize);
    graphics.lightsources[0].tileY = Math.round(this.ypos / graphics.tileSize);
  }

  // return true if the given x and y position is in bounds given a specific room
  // false if out of bounds
  checkRoomBounds(room, xpos, ypos) {
    if (
      xpos < (room.startTileX + 1) * graphics.tileSize ||
      xpos > (room.startTileX + room.width) * graphics.tileSize
    ) {
      return false;
    }

    if (
      ypos < (room.startTileY + 1) * graphics.tileSize ||
      ypos > (room.startTileY + room.height) * graphics.tileSize
    ) {
      return false;
    }

    return true;
  }

  checkCollision() {
    if (this.debug) {
      document.getElementById("posX").innerHTML =
        "player.xpos = " + this.xpos.toFixed(0);
      document.getElementById("posY").innerHTML =
        "player.ypos = " + this.ypos.toFixed(0);
    }
    if (
      this.xpos < (graphics.currentRoom.startTileX + 1) * graphics.tileSize ||
      this.xpos >
        (graphics.currentRoom.startTileX + graphics.currentRoom.width) *
          graphics.tileSize
    ) {
      for (let room of graphics.rooms) {
        if (
          this.xpos <
            (graphics.currentRoom.startTileX + graphics.currentRoom.width / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos - graphics.tileSize, this.ypos)
        ) {
          return;
        }

        if (
          this.xpos >
            (graphics.currentRoom.startTileX + graphics.currentRoom.width / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos + graphics.tileSize, this.ypos)
        ) {
          return;
        }
      }
      this.xpos = graphics.lightsources[0].tileX * graphics.tileSize;
    }

    if (
      this.ypos < (graphics.currentRoom.startTileY + 1) * graphics.tileSize ||
      this.ypos >
        (graphics.currentRoom.startTileY + graphics.currentRoom.height) *
          graphics.tileSize
    ) {
      // check if player is moving up or down
      // if moving up check bounds between all rooms for player y position - 16
      // if valid bounds don't do anything and return
      // otherwise set ypos to the current player light source
      // same for moving down but for the player y position + 16

      for (let room of graphics.rooms) {
        if (
          this.ypos <
            (graphics.currentRoom.startTileY +
              graphics.currentRoom.height / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos, this.ypos - graphics.tileSize)
        ) {
          return;
        }

        if (
          this.ypos >
            (graphics.currentRoom.startTileY +
              graphics.currentRoom.height / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos, this.ypos + graphics.tileSize)
        ) {
          return;
        }
      }
      this.ypos = graphics.lightsources[0].tileY * graphics.tileSize;
    }
  }

  draw() {
    this.updatePositions();
    this.checkCollision();
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
  function gameLoop() {
    graphics.clearScreen();
    graphics.drawMap();
    player.draw();
    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
