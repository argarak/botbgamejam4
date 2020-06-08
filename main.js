document.addEventListener("DOMContentLoaded", () => {
  console.log("dom loaded");

  let canvas = document.getElementById("gameCanvas");
  let ctx = canvas.getContext("2d");

  let spritesheet = document.getElementById("spritesheet");

  let iconTest = botbIcon.getIcon("nsf");

  ctx.drawImage(spritesheet, 33, 71, 104, 124, 21, 20, 87, 104);
  ctx.drawImage(
    spritesheet,
    iconTest.posX,
    iconTest.posY,
    iconTest.width,
    iconTest.height,
    100,
    100,
    iconTest.width,
    iconTest.height
  );
});
