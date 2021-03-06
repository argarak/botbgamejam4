class Graphics {
  constructor() {
    // main game canvas
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    // map canvas where the map is drawn
    this.mapcanvas = document.getElementById("mapCanvas");
    this.mapctx = this.mapcanvas.getContext("2d");

    this.mapctx.imageSmoothingEnabled = false;
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
    this.tileSize = 16;

    this.camY = 0;
    this.camX = 0;

    this.lighting = true;

    // number of alpha decimal places
    // e.g. value of 1 will limit lighting to .1, .2, .3 etc.
    // can make lighting look more "retro"
    this.lightingResolution = 2;
    this.lightMapOffset = 2;

    this.rooms = roomgen.generate();
    this.level = 0;

    this.lightsources = [
      {
        tileX: Math.floor(Math.random() * 20),
        tileY: Math.floor(Math.random() * 20),
        intensity: 1
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

    this.nextLevelButton = document.getElementById("levelButton");
    this.levelElement = document.getElementById("dungeonLevel");
  }

  showNextLevelButton() {
    this.nextLevelButton.style.display = "block";
  }

  clearScreen() {
    this.ctx.fillStyle = "#000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawIcon(
    icon,
    x,
    y,
    scale = 1,
    rotate = 0,
    cx = -1,
    cy = -1,
    tint = "",
    ctx = this.ctx
  ) {
    let xpos = cx;
    let ypos = cy;

    if (cx === -1) {
      cx = icon.width * scale / 2;
    }

    if (cy === -1) {
      cy = icon.height * scale / 2;
    }

    // this.ctx.setTransform(
    //   scale,
    //   0,
    //   0,
    //   scale,
    //   this.canvas.width / 2 + (x - this.camX),
    //   this.canvas.height / 2 + (y - this.camY)
    // );
    // this.ctx.rotate(rotate * Math.PI / 180);

    ctx.drawImage(
      this.spritesheet,
      icon.posX,
      icon.posY,
      icon.width,
      icon.height,
      x,
      y,
      icon.width * scale,
      icon.height * scale
    );

    if (tint) {
      this.ctx.fillStyle = tint;
      this.ctx.fillRect(-xpos, -ypos, icon.width * scale, icon.height * scale);
    }

    //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  updateRoom() {
    for (let room of this.rooms) {
      if (
        this.camX - 8 < (room.startTileX + room.width) * this.tileSize &&
        this.camX - 8 > room.startTileX * this.tileSize &&
        this.camY - 8 < (room.startTileY + room.height) * this.tileSize &&
        this.camY - 8 > room.startTileY * this.tileSize
      ) {
        let name = room.icon.name;
        if (name.includes("trophy")) {
          let splitName = name.split("_");
          if (splitName.length > 2) {
            let trophyType = splitName[splitName.length - 1];
            let trophy = "";
            if (trophyType === "g") {
              trophy = "gold";
            }
            if (trophyType === "s") {
              trophy = "silver";
            }
            if (trophyType === "b") {
              trophy = "bronze";
            }
            name = trophy + " " + splitName[1];
          }
        }
        if (this.currentRoom !== room) {
          this.currentRoom = room;
          this.currentRoomNameValue = "room of " + name;
          this.roomNameElement.innerHTML = this.currentRoomNameValue;
        }
      }
    }
  }

  drawLightMap() {
    let alpha = 1;
    for (
      let col = -this.lightMapOffset;
      col < this.canvas.height / this.tileSize + this.lightMapOffset;
      col++
    ) {
      for (let row = -2; row < this.canvas.width / this.tileSize + 2; row++) {
        alpha = 1;

        let xtile = Math.round(
          row + (this.camX - this.canvas.width / 2) / this.tileSize
        );
        let ytile = Math.round(
          col + (this.camY - this.canvas.height / 2) / this.tileSize
        );

        for (let source of this.lightsources) {
          if (this.lighting) {
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
          } else {
            alpha = 0;
          }
        }

        let xoffset =
          this.camX - Math.round(this.camX / this.tileSize) * this.tileSize;
        let yoffset =
          this.camY - Math.round(this.camY / this.tileSize) * this.tileSize;

        this.ctx.fillStyle =
          "rgba(0,0,0, " + alpha.toFixed(this.lightingResolution) + ")";
        this.ctx.fillRect(
          Math.round(row * this.tileSize - xoffset),
          Math.round(col * this.tileSize - yoffset),
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  drawMap() {
    for (let room of this.rooms) {
      for (let rowindex = 0; rowindex < room.height; rowindex++) {
        for (let tileindex = 0; tileindex < room.width; tileindex++) {
          let xpos =
            (1 + room.startTileX) * this.tileSize + tileindex * this.tileSize;
          let ypos =
            (1 + room.startTileY) * this.tileSize + rowindex * this.tileSize;

          let xtile = xpos / this.tileSize;
          let ytile = ypos / this.tileSize;

          this.drawIcon(room.icon, xpos, ypos, 1, 0, -1, -1, "", this.mapctx);
        }
      }
    }

    graphics.updateRoom();
  }
}

var graphics = new Graphics();

class Player {
  constructor() {
    this.xpos = 148 * 16;
    this.ypos = 63 * 16;
    this.icon = botbIcon.getIcon("n00b");

    this.playerClass = "n00b";
    this.xp = 0;
    this.level = 0;

    this.xpLevels = [
      0,
      25,
      34,
      41,
      53,
      73,
      109,
      173,
      284,
      477,
      816,
      1290,
      1922,
      2682,
      3478,
      4331,
      5421,
      6500,
      7677,
      9872,
      10266,
      11677,
      12796,
      16856,
      21799,
      28640,
      36512,
      45596,
      56049,
      72335,
      92645,
      118353,
      245792,
      510494,
      1060247,
      99999999
    ];

    this.levelTextElement = document.getElementById("level");
    this.levelProgressElement = document.getElementById("levelxp");

    this.nearestTileX = 0;
    this.nearestTileY = 0;
    this.health = 100;
    this.healthTextElement = document.getElementById("health");
    this.healthProgressElement = document.getElementById("hp");

    // player movement
    this.speedX = 0;
    this.speedY = 0;
    this.acceleration = 5;
    this.friction = 1;
    this.maxSpeedLimit = 30;
    this.minSpeedLimit = -this.maxSpeedLimit;

    this.mouseAngle = 0;
    this.weaponFire = false;
    this.weaponDistance = 5;
    this.meleeDistance = this.weaponDistance;
    this.maxMeleeDistance = 16 * 1.6;
    this.meleeSwingSpeed = 1.3;
    this.weaponTileX = 0;
    this.weaponTileY = 0;
    this.weaponDamage = 50;
    this.weaponPositionCompensationFactor = 1.5;
    this.weaponKnockback = 32;
    this.mouseHeldDown = false;

    this.movingUp = false;
    this.movingDown = false;
    this.movingLeft = false;
    this.movingRight = false;

    this.endingDisplayed = false;
    this.endingElement = document.getElementById("ending");

    this.gameOverElement = document.getElementById("gameOver");
    this.dead = false;

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

    this.nearestTileX = Math.round(this.xpos / graphics.tileSize);
    this.nearestTileY = Math.round(this.ypos / graphics.tileSize);

    graphics.lightsources[0].tileX = this.nearestTileX;
    graphics.lightsources[0].tileY = this.nearestTileY;
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

  // writing collisions for this was a long and hard process :(
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
      let preventMovement = true;
      for (let room of graphics.rooms) {
        if (
          this.xpos <
            (graphics.currentRoom.startTileX + graphics.currentRoom.width / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos - graphics.tileSize, this.ypos)
        ) {
          preventMovement = false;
          break;
        }

        if (
          this.xpos >
            (graphics.currentRoom.startTileX + graphics.currentRoom.width / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos + graphics.tileSize, this.ypos)
        ) {
          preventMovement = false;
          break;
        }
      }
      if (preventMovement) {
        this.xpos =
          Math.round(this.xpos / graphics.tileSize) * graphics.tileSize;
        //this.xpos = graphics.lightsources[0].tileX * graphics.tileSize;
      }
    }

    if (
      this.ypos < (graphics.currentRoom.startTileY + 1) * graphics.tileSize ||
      this.ypos >
        (graphics.currentRoom.startTileY + graphics.currentRoom.height) *
          graphics.tileSize
    ) {
      let preventMovement = true;
      for (let room of graphics.rooms) {
        if (
          this.ypos <
            (graphics.currentRoom.startTileY +
              graphics.currentRoom.height / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(
            room,
            this.xpos,
            Math.floor(this.ypos) - graphics.tileSize
          )
        ) {
          preventMovement = false;
          break;
        }

        if (
          this.ypos >
            (graphics.currentRoom.startTileY +
              graphics.currentRoom.height / 2) *
              graphics.tileSize &&
          this.checkRoomBounds(room, this.xpos, this.ypos + graphics.tileSize)
        ) {
          preventMovement = false;
          break;
        }
      }
      if (preventMovement) {
        this.ypos =
          Math.round(this.ypos / graphics.tileSize) * graphics.tileSize;
        //this.ypos = graphics.lightsources[0].tileY * graphics.tileSize;
      }
    }
  }

  updateHealth() {
    if (this.health <= 0 && !this.dead) {
      // you became kill
      this.dead = true;

      this.gameOverElement.style.display = "block";
    }

    if (this.health >= 0) {
      this.healthTextElement.innerHTML = "health: " + this.health + "/100";
      this.healthProgressElement.value = this.health;
    } else {
      this.healthTextElement.innerHTML = "health: 0/100";
      this.healthProgressElement.value = 0;
    }
  }

  updateXp() {
    for (let xpLevel = this.xpLevels.length - 1; xpLevel > 0; xpLevel--) {
      if (this.xpLevels[xpLevel] < this.xp) {
        this.level = xpLevel;
        break;
      }
    }

    if (this.level === 33 && !this.endingDisplayed) {
      // end of game
      this.endingDisplayed = true;
      this.endingElement.style.display = "block";
    }

    this.levelTextElement.innerHTML =
      "level " + this.level + " " + this.playerClass;
    if (this.level === 34) {
      this.levelProgressElement.value = 100;
    } else {
      this.levelProgressElement.value =
        (this.xp - this.xpLevels[this.level]) /
        (this.xpLevels[this.level + 1] - this.xpLevels[this.level]) *
        100;
    }
  }

  weaponDraw() {
    let weaponIcon = null;
    if (this.playerClass === "n00b" || this.dead) {
      return;
    } else if (this.playerClass === "hostist") {
      weaponIcon = botbIcon.getIcon("battle");
    } else if (this.playerClass === "grafxicist") {
      weaponIcon = botbIcon.getIcon("pencil");
    } else if (this.playerClass === "chipist") {
      weaponIcon = botbIcon.getIcon("wrench");
    }
    graphics.ctx.setTransform(
      1,
      0,
      0,
      1,
      graphics.canvas.width / 2 + graphics.tileSize / 2,
      graphics.canvas.height / 2 + graphics.tileSize / 2
    );
    graphics.ctx.rotate((135 + this.mouseAngle) * Math.PI / 180);

    if (this.meleeDistance > this.weaponDistance && !this.weaponFire) {
      this.meleeDistance /= this.meleeSwingSpeed;
    }
    if (this.weaponFire) {
      this.meleeDistance *= this.meleeSwingSpeed;
    }

    this.weaponTileX = Math.round(
      (this.xpos +
        this.meleeDistance *
          this.weaponPositionCompensationFactor *
          Math.sin((this.mouseAngle - 90) * Math.PI / 180)) /
        graphics.tileSize
    );

    this.weaponTileY = Math.round(
      (this.ypos +
        this.meleeDistance *
          this.weaponPositionCompensationFactor *
          Math.cos((this.mouseAngle + 90) * Math.PI / 180)) /
        graphics.tileSize
    );

    graphics.lightsources[1].tileX = this.weaponTileX;
    graphics.lightsources[1].tileY = this.weaponTileY;

    if (this.weaponFire) {
      // check collision with enemies
      let enemyIndex = enemy.hitEnemyTile(this.weaponTileX, this.weaponTileY);

      if (enemyIndex) {
        enemy.enemies[enemyIndex].health -= this.weaponDamage;

        if (enemy.enemies[enemyIndex].health < 1) {
          sound.killSound.play();
          let beforeXp = this.xp;
          //this.xp += enemy.getXp(enemy.enemies[enemyIndex].type);

          // calculate xp level bonus
          this.xp +=
            enemy.getXp(enemy.enemies[enemyIndex].type) *
            Math.pow(Math.E, this.level / 6);
          console.log("you just got " + (this.xp - beforeXp) + " xp");
          this.updateXp();
          let enemiesLeft = enemy.enemiesLeft();

          if (enemiesLeft === 0) {
            graphics.showNextLevelButton();
          }
        } else {
          sound.hitSound.play();
        }

        enemy.enemies[enemyIndex].tileX += Math.round(
          Math.sin((this.mouseAngle - 90) * Math.PI / 180) *
            this.weaponKnockback /
            graphics.tileSize
        );

        enemy.enemies[enemyIndex].tileY += Math.round(
          Math.cos((this.mouseAngle + 90) * Math.PI / 180) *
            this.weaponKnockback /
            graphics.tileSize
        );

        this.weaponFire = false;
      }
    }

    if (this.meleeDistance > this.maxMeleeDistance) {
      //this.meleeDistance = this.weaponDistance;
      this.weaponFire = false;
    }

    if (this.meleeDistance <= this.weaponDistance && this.mouseHeldDown) {
      this.weaponFire = true;
    }

    graphics.drawIcon(weaponIcon, this.meleeDistance, this.meleeDistance);
    graphics.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  draw() {
    if (this.dead) {
      return;
    }
    if (this.speedX !== 0 || this.speedY !== 0) {
      graphics.updateRoom();
    }
    this.updatePositions();
    this.checkCollision();
    graphics.drawIcon(
      this.icon,
      graphics.canvas.width / 2,
      graphics.canvas.height / 2
    );

    this.weaponDraw();
  }
}

var player = new Player();

class Enemy {
  constructor() {
    this.enemiesLeftElement = document.getElementById("enemiesLeft");
    this.bug = {
      icon: botbIcon.getIcon("bug"),
      activationDistance: 250,
      maxHealth: 100
    };
    this.rat = {
      icon: botbIcon.getIcon("rat"),
      activationDistance: 250,
      maxHealth: 100
    };
    this.bat = {
      icon: botbIcon.getIcon("actualbat"),
      activationDistance: 200,
      maxHealth: 100
    };
    this.pumpking = {
      icon: botbIcon.getIcon("pumpking"),
      activationDistance: 300,
      maxHealth: 300
    };
    this.mummi = {
      icon: botbIcon.getIcon("mummi"),
      activationDistance: 300,
      maxHealth: 300
    };
    this.zombi = {
      icon: botbIcon.getIcon("zombi"),
      activationDistance: 300,
      maxHealth: 200
    };
    this.ghost = {
      icon: botbIcon.getIcon("defle"),
      activationDistance: 500,
      maxHealth: 100
    };
    this.tick = 0;
    this.maxTick = 1000;
    this.bugTickMultiple = () => {
      return this.randint(12, 20);
    };
    this.ratTickMultiple = () => {
      return this.randint(17, 25);
    };
    this.pumpkingTickMultiple = () => {
      return this.randint(25, 35);
    };
    this.ghostTickMultiple = () => {
      return this.randint(5, 10);
    };
    this.enemies = [];
  }

  enemiesLeft() {
    let enemiesCount = 0;

    for (let enemy of this.enemies) {
      if (enemy.health > 0) {
        enemiesCount++;
      }
    }

    this.enemiesLeftElement.innerHTML = enemiesCount + " enemies left";

    return enemiesCount;
  }

  spawnEnemies() {
    for (let room of graphics.rooms) {
      // all levels spawn bugs and rats

      let random1 = this.randint(0, 2);
      if (random1 == 0) {
        for (let bug = 0; bug < this.randint(0, 2 + graphics.level); bug++) {
          let bugobj = {
            type: this.bug,
            tileX: room.startTileX + this.randint(1, room.width - 1),
            tileY: room.startTileY + this.randint(1, room.height - 1),
            health: this.bug.maxHealth,
            activateTickMultiple: this.bugTickMultiple(),
            visitedTiles: []
          };
          this.enemies.push(bugobj);
        }
      } else if (random1 == 1) {
        for (let rat = 0; rat < this.randint(0, 2 + graphics.level); rat++) {
          let bugobj = {
            type: this.rat,
            tileX: room.startTileX + this.randint(1, room.width - 1),
            tileY: room.startTileY + this.randint(1, room.height - 1),
            health: this.rat.maxHealth,
            activateTickMultiple: this.ratTickMultiple(),
            visitedTiles: []
          };
          this.enemies.push(bugobj);
        }
      }
      if (graphics.level > 0) {
        // start spawning bats and pumpkings
        let random2 = this.randint(0, 4);
        if (random2 == 0) {
          // spawn one or two pumpkings
          for (let pumpking = 0; pumpking < this.randint(0, 2); pumpking++) {
            let bugobj = {
              type: this.pumpking,
              tileX: room.startTileX + this.randint(1, room.width - 1),
              tileY: room.startTileY + this.randint(1, room.height - 1),
              health: this.pumpking.maxHealth,
              activateTickMultiple: this.pumpkingTickMultiple(),
              visitedTiles: []
            };
            this.enemies.push(bugobj);
          }
        } else if (random2 == 4) {
          // only spawn one evil bat because they're really evil and
          // annoying wow
          for (let bat = 0; bat < this.randint(0, 1); bat++) {
            let bugobj = {
              type: this.bat,
              tileX: room.startTileX + this.randint(1, room.width - 1),
              tileY: room.startTileY + this.randint(1, room.height - 1),
              health: this.bat.maxHealth,
              activateTickMultiple: 0,
              visitedTiles: []
            };
            this.enemies.push(bugobj);
          }
        }
      }
      if (graphics.level > 1) {
        // start spawning zombis
        let random3 = this.randint(0, 3);
        if (random3 == 3) {
          for (let zombi = 0; zombi < this.randint(0, 3); zombi++) {
            let bugobj = {
              type: this.zombi,
              tileX: room.startTileX + this.randint(1, room.width - 1),
              tileY: room.startTileY + this.randint(1, room.height - 1),
              health: this.zombi.maxHealth,
              activateTickMultiple: 0,
              visitedTiles: []
            };
            this.enemies.push(bugobj);
          }
        }
      }
      if (graphics.level > 2) {
        // start spawning mummis and ghosts
        let random3 = this.randint(0, 5);
        if (random3 == 5) {
          for (let mummi = 0; mummi < this.randint(0, 1); mummi++) {
            let bugobj = {
              type: this.mummi,
              tileX: room.startTileX + this.randint(1, room.width - 1),
              tileY: room.startTileY + this.randint(1, room.height - 1),
              health: this.mummi.maxHealth,
              activateTickMultiple: 0,
              visitedTiles: []
            };
            this.enemies.push(bugobj);
          }
        } else if (random3 == 4) {
          for (let ghost = 0; ghost < this.randint(0, 1); ghost++) {
            let bugobj = {
              type: this.ghost,
              tileX: room.startTileX + this.randint(1, room.width - 1),
              tileY: room.startTileY + this.randint(1, room.height - 1),
              health: this.ghost.maxHealth,
              activateTickMultiple: this.ghostTickMultiple(),
              visitedTiles: []
            };
            this.enemies.push(bugobj);
          }
        }
      }
    }

    this.enemiesLeft();
  }

  getXp(type) {
    switch (type) {
      case this.bug:
        return this.randint(20, 30);
      case this.rat:
        return this.randint(15, 25);
      case this.pumpking:
        return this.randint(25, 50);
      case this.bat:
        return this.randint(30, 40);
      case this.mummi:
        return this.randint(50, 60);
      case this.zombi:
        return this.randint(40, 50);
      case this.ghost:
        return this.randint(40, 50);
    }
    return 0;
  }

  getDamage(type) {
    switch (type) {
      case this.bug:
        return this.randint(5, 7);
      case this.rat:
        return this.randint(3, 4);
      case this.pumpking:
        return this.randint(10, 12);
      case this.bat:
        return this.randint(5, 7);
      case this.mummi:
      case this.zombi:
        return 15;
      case this.ghost:
        return 2;
    }
    return 0;
  }

  distanceToPlayer(tileX, tileY) {
    return Math.sqrt(
      Math.pow(tileX * graphics.tileSize - player.xpos, 2) +
        Math.pow(tileY * graphics.tileSize - player.ypos, 2)
    );
  }

  // returns true if any enemy is on given tile
  enemyTile(tileX, tileY) {
    for (let enemy of this.enemies) {
      if (enemy.tileX === tileX && enemy.tileY === tileY) {
        return true;
      }
    }
    return false;
  }

  // returns the enemy index if any enemy is hit on a given tile
  hitEnemyTile(tileX, tileY) {
    for (let index in this.enemies) {
      if (this.enemies[index].health > 0) {
        if (
          this.enemies[index].tileX === tileX &&
          this.enemies[index].tileY === tileY
        ) {
          return index;
        }
      }
    }
    return null;
  }

  // returns true if the tile given is in a valid location
  // of any room
  roomTile(tileX, tileY) {
    for (let room of graphics.rooms) {
      if (
        player.checkRoomBounds(
          room,
          tileX * graphics.tileSize,
          tileY * graphics.tileSize
        )
      ) {
        return true;
      }
    }
    return false;
  }

  // returns true if the tile given has already been visited
  // by the enemy
  visitedTile(enemy, tileX, tileY) {
    for (let visitedTile of enemy.visitedTiles) {
      //console.log(visitedTile);
      if (visitedTile[0] === tileX && visitedTile[1] === tileY) {
        return true;
      }
    }
    return false;
  }

  // random integer (inclusive)
  randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // the most basic enemy ai

  // path finding:::
  // get array of valid tiles around the enemy

  // ---  calculate the distance between each tile
  // -E-  and the player, then choose the tile
  // ---  with the smallest distance

  // the tile must not have already been visited
  bugAI(enemy) {
    let tileX = enemy.tileX;
    let tileY = enemy.tileY;

    let distance = this.distanceToPlayer(tileX, tileY);

    if (tileX == player.nearestTileX && tileY == player.nearestTileY) {
      player.health -= this.getDamage(enemy.type);
      player.updateHealth();
    }

    if (distance < 10) {
      // player get hurt
      return;
    }

    let allTiles = [
      [tileX + 1, tileY],
      [tileX - 1, tileY],
      [tileX, tileY + 1],
      [tileX, tileY - 1],
      [tileX + 1, tileY + 1],
      [tileX - 1, tileY - 1],
      [tileX + 1, tileY - 1],
      [tileX - 1, tileY + 1]
    ];

    let validTiles = [];

    for (let tile of allTiles) {
      if (
        this.roomTile(tile[0], tile[1]) &&
        !this.enemyTile(tile[0], tile[1]) &&
        !this.visitedTile(enemy, tile[0], tile[1])
      ) {
        validTiles.push(tile);
      }
    }

    if (validTiles.length === 0) {
      enemy.visitedTiles = [];
      return;
    }

    let minTileIndex = 0;

    for (let tileIndex = 0; tileIndex < validTiles.length; tileIndex++) {
      let minDistance = this.distanceToPlayer(
        validTiles[minTileIndex][0],
        validTiles[minTileIndex][1]
      );
      let currDistance = this.distanceToPlayer(
        validTiles[tileIndex][0],
        validTiles[tileIndex][1]
      );

      if (currDistance < minDistance) {
        minTileIndex = tileIndex;
      }
    }

    enemy.visitedTiles.push(validTiles[minTileIndex]);

    enemy.tileX = validTiles[minTileIndex][0];
    enemy.tileY = validTiles[minTileIndex][1];
  }

  // similar to bugAI but a bit more jittery and random
  // oh and a lot more irritating lol
  batAI(enemy) {
    let tileX = enemy.tileX;
    let tileY = enemy.tileY;

    let distance = this.distanceToPlayer(tileX, tileY);

    if (tileX == player.nearestTileX && tileY == player.nearestTileY) {
      player.health -= this.getDamage(enemy.type);
      player.updateHealth();
    }

    if (distance < 10) {
      // player get hurt
      return;
    }

    let allTiles = [
      [tileX + 1, tileY],
      [tileX - 1, tileY],
      [tileX, tileY + 1],
      [tileX, tileY - 1],
      [tileX + 1, tileY + 1],
      [tileX - 1, tileY - 1],
      [tileX + 1, tileY - 1],
      [tileX - 1, tileY + 1]
    ];

    let validTiles = [];

    for (let tile of allTiles) {
      if (
        this.roomTile(tile[0], tile[1]) &&
        !this.enemyTile(tile[0], tile[1]) &&
        !this.visitedTile(enemy, tile[0], tile[1])
      ) {
        validTiles.push(tile);
      }
    }

    if (validTiles.length === 0) {
      enemy.visitedTiles = [];
      return;
    }

    let minTileIndex = 0;

    for (let tileIndex = 0; tileIndex < validTiles.length; tileIndex++) {
      let minDistance = this.distanceToPlayer(
        validTiles[minTileIndex][0],
        validTiles[minTileIndex][1]
      );
      let currDistance = this.distanceToPlayer(
        validTiles[tileIndex][0],
        validTiles[tileIndex][1]
      );

      if (currDistance < minDistance) {
        minTileIndex = tileIndex;
      }
    }

    // 1/3 times randomly move about
    if (this.randint(0, 2) == 0) {
      minTileIndex = this.randint(0, validTiles.length - 1);
    }

    enemy.visitedTiles.push(validTiles[minTileIndex]);

    enemy.tileX = validTiles[minTileIndex][0];
    enemy.tileY = validTiles[minTileIndex][1];
  }

  // simple "ghost" ai that can go through anything as long
  // as it eventually gets to the player
  ghostAI(enemy) {
    let tileX = enemy.tileX;
    let tileY = enemy.tileY;

    let distance = this.distanceToPlayer(tileX, tileY);

    if (tileX == player.nearestTileX && tileY == player.nearestTileY) {
      player.health -= this.getDamage(enemy.type);
      player.updateHealth();
    }

    if (distance < 10) {
      // player get hurt
      return;
    }

    if (enemy.tileX > player.nearestTileX) {
      enemy.tileX--;
    }
    if (enemy.tileX < player.nearestTileX) {
      enemy.tileX++;
    }
    if (enemy.tileY > player.nearestTileY) {
      enemy.tileY--;
    }
    if (enemy.tileY < player.nearestTileY) {
      enemy.tileY++;
    }
  }

  handleEnemyAI(enemy) {
    if (enemy.type == this.bat) {
      if (this.randint(0, 1) == 0) {
        enemy.activateTickMultiple = 5;
      } else {
        enemy.activateTickMultiple = 40;
      }
    }

    if (enemy.type == this.mummi) {
      let distance = this.distanceToPlayer(enemy.tileX, enemy.tileY);
      if (distance > 10) {
        enemy.activateTickMultiple = Math.round(distance / 2);
      } else {
        enemy.activateTickMultiple = 50;
      }
    }

    if (enemy.type == this.zombi) {
      let distance = this.distanceToPlayer(enemy.tileX, enemy.tileY);
      if (distance > 10) {
        enemy.activateTickMultiple = Math.round(distance);
      } else {
        enemy.activateTickMultiple = 50;
      }
    }

    if (this.tick % enemy.activateTickMultiple !== 0) {
      return;
    }

    let distance = this.distanceToPlayer(enemy.tileX, enemy.tileY);

    if (distance > enemy.type.activationDistance) {
      return;
    }

    switch (enemy.type) {
      case this.bug:
      case this.rat:
      case this.pumpking:
      case this.mummi:
      case this.zombi:
        this.bugAI(enemy);
        break;
      case this.bat:
        this.batAI(enemy);
        break;
      case this.ghost:
        this.ghostAI(enemy);
        break;
    }
  }

  drawHealthBar(enemy, xdraw, ydraw) {
    let fractionHealth = enemy.health / enemy.type.maxHealth;

    if (fractionHealth === 1) {
      return;
    }

    graphics.ctx.fillStyle = "#f00";
    graphics.ctx.fillRect(
      xdraw,
      ydraw + graphics.tileSize,
      graphics.tileSize,
      2
    );
    graphics.ctx.fillStyle = "#0f0";
    graphics.ctx.fillRect(
      xdraw,
      ydraw + graphics.tileSize,
      graphics.tileSize * fractionHealth,
      2
    );
  }

  draw() {
    this.tick = (this.tick + 1) % this.maxTick;
    for (let enemy of this.enemies) {
      if (enemy.health < 1) {
        continue;
      }

      this.handleEnemyAI(enemy);

      let xdraw =
        graphics.canvas.width / 2 +
        (enemy.tileX * graphics.tileSize - player.xpos);
      let ydraw =
        graphics.canvas.height / 2 +
        (enemy.tileY * graphics.tileSize - player.ypos);

      graphics.drawIcon(enemy.type.icon, xdraw, ydraw);
      this.drawHealthBar(enemy, xdraw, ydraw);
    }
  }
}

var enemy = new Enemy();

class Sound {
  constructor() {
    this.ambience = document.getElementById("ambience");
    this.killSound = document.getElementById("killSound");
    this.hitSound = document.getElementById("hitSound");
    this.ambiencePlaying = false;
  }
}

var sound = new Sound();

document.addEventListener("keydown", e => {
  if (e.code === "KeyW") {
    player.movingUp = true;
  }

  if (e.code === "KeyA") {
    player.movingLeft = true;
  }

  if (e.code === "KeyS") {
    player.movingDown = true;
  }

  if (e.code === "KeyD") {
    player.movingRight = true;
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "KeyW") {
    player.movingUp = false;
  }

  if (e.code === "KeyA") {
    player.movingLeft = false;
  }

  if (e.code === "KeyS") {
    player.movingDown = false;
  }

  if (e.code === "KeyD") {
    player.movingRight = false;
  }
});

document.addEventListener("click", e => {
  player.weaponFire = true;
});

document.addEventListener("mousedown", e => {
  if (e.buttons === 1) {
    player.mouseHeldDown = true;
  } else {
    player.mouseHeldDown = false;
  }
});

document.addEventListener("mouseup", e => {
  if (e.buttons !== 1) {
    player.mouseHeldDown = false;
  }
});

document.addEventListener("mousemove", e => {
  if (!sound.ambiencePlaying) {
    sound.ambience.play();
  }

  let relativex = document.body.clientWidth / 2 - e.clientX;
  let relativey = document.body.clientHeight / 2 - e.clientY;
  player.mouseAngle = Math.round(
    Math.atan2(relativey, relativex) * 180 / Math.PI
  );
});

graphics.nextLevelButton.addEventListener("click", e => {
  graphics.nextLevelButton.style.display = "none";
  graphics.level++;

  // place player at default location
  player.xpos = 148 * 16;
  player.ypos = 63 * 16;

  graphics.rooms = roomgen.generate();

  graphics.mapctx.fillStyle = "#000";
  graphics.mapctx.fillRect(
    0,
    0,
    graphics.mapcanvas.width,
    graphics.mapcanvas.height
  );

  graphics.drawMap();

  enemy.enemies = [];
  enemy.spawnEnemies();

  graphics.levelElement.innerHTML = "you're in level " + graphics.level;

  // player.health = 100;
  // player.updateHealth();
});

function gameLoad() {
  graphics.drawMap();
  player.updateXp();
  player.updateHealth();
  enemy.spawnEnemies();

  document.getElementById("continueButton").addEventListener("click", e => {
    player.endingElement.style.display = "none";
  });

  document.getElementById("retryButton").addEventListener("click", e => {
    player.gameOverElement.style.display = "none";

    // place player at default location
    player.xpos = 148 * 16;
    player.ypos = 63 * 16;

    graphics.rooms = roomgen.generate();

    graphics.mapctx.fillStyle = "#000";
    graphics.mapctx.fillRect(
      0,
      0,
      graphics.mapcanvas.width,
      graphics.mapcanvas.height
    );

    graphics.drawMap();

    enemy.enemies = [];
    enemy.spawnEnemies();

    graphics.levelElement.innerHTML = "you're in level " + graphics.level;

    player.dead = false;
    player.health = 100;
    player.updateHealth();
  });

  document.getElementById("restartButton").addEventListener("click", e => {
    graphics.level = 0;
    player.xp = 0;
    player.level = 0;
    player.playerClass = "n00b";
    player.updateXp();

    document.getElementById("class").style.display = "block";
    player.gameOverElement.style.display = "none";

    // place player at default location
    player.xpos = 148 * 16;
    player.ypos = 63 * 16;

    graphics.rooms = roomgen.generate();

    graphics.mapctx.fillStyle = "#000";
    graphics.mapctx.fillRect(
      0,
      0,
      graphics.mapcanvas.width,
      graphics.mapcanvas.height
    );

    graphics.drawMap();

    enemy.enemies = [];
    enemy.spawnEnemies();

    graphics.levelElement.innerHTML = "you're in level " + graphics.level;

    player.icon = botbIcon.getIcon("n00b");
    player.dead = false;
    player.health = 100;
    player.updateHealth();
  });

  document.getElementById("mapCanvas").addEventListener("click", e => {
    e.target.style.display = "none";
  });

  document.getElementById("mapButton").addEventListener("click", e => {
    document.getElementById("mapCanvas").style.display = "block";
  });

  function gameLoop() {
    graphics.clearScreen();

    var camX = -player.xpos + graphics.canvas.width / 2;
    var camY = -player.ypos + graphics.canvas.height / 2;

    graphics.ctx.drawImage(graphics.mapcanvas, camX, camY);
    graphics.drawLightMap();
    enemy.draw();
    player.draw();

    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("grafxicist").addEventListener("click", e => {
    if (player.playerClass === "n00b") {
      player.playerClass = "grafxicist";
      player.icon = botbIcon.getIcon("grafxicist");
      player.updateXp();
      document.getElementById("class").style.display = "none";
    }
  });
  document.getElementById("chipist").addEventListener("click", e => {
    if (player.playerClass === "n00b") {
      player.playerClass = "chipist";
      player.icon = botbIcon.getIcon("chipist");
      player.updateXp();
      document.getElementById("class").style.display = "none";
    }
  });
  document.getElementById("hostist").addEventListener("click", e => {
    if (player.playerClass === "n00b") {
      player.playerClass = "hostist";
      player.icon = botbIcon.getIcon("hostist");
      player.updateXp();
      document.getElementById("class").style.display = "none";
    }
  });

  if (graphics.spritesheet.complete) {
    gameLoad();
  } else {
    graphics.spritesheet.addEventListener("load", gameLoad, false);
  }
});
