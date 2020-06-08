class Graphics {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;

    this.spritesheet = document.getElementById("spritesheet");
  }

  drawIcon(iconName, x, y, scale = 1, rotate = 0, cx = -1, cy = -1) {
    let icon = botbIcon.getIcon(iconName);
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

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

let graphics = new Graphics();

document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded");

  var testRotate = 0;
  var testScale = 0;

  function testAnim() {
    testRotate += 2;
    testScale = Math.sin(testRotate / 50) * 3;

    graphics.drawIcon("pixel", 100, 100, testScale, testRotate);

    window.requestAnimationFrame(testAnim);
  }

  testAnim();
});
