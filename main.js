class Graphics {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
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
}

let graphics = new Graphics();

document.addEventListener("DOMContentLoaded", () => {
  var testRotate = 0;
  var testScale = 0;
  var tintTest = 0;

  let randIcon = botbIcon.random16icon();

  function gameLoop() {
    testRotate += 2;
    testScale = 1 + Math.sin(testRotate / 50) * 3;

    tintTest = Math.abs(Math.sin(testRotate / 50));

    graphics.clearScreen();
    graphics.drawIcon(
      randIcon,
      200 + Math.sin(testRotate / 50) * 100,
      200,
      testScale,
      testRotate,
      -1,
      -1,
      "rgba(0,0,0, " + tintTest + ")"
    );

    window.requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
