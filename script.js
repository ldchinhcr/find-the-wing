let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, houndReady, gateReady, overReady, zeusReady, fireReady;
let bgImage, heroImage, monsterImage, houndImage, gateImage, overImage, zeusImage, fireImage;

let startTime = Date.now();
let elapsedTime = 0;

let gateX = 600;
let gateY = 500;

let overX = 250;
let overY = 250;

let zeusX = Math.round(Math.random() * (canvas.width - 60));
let zeusY = Math.round(Math.random() * (canvas.height - 60));

let fireX;
let fireY;

let fireSpeedX;
let fireSpeedY;

let gateSpeedX = 2;
let gateSpeedY = 2;

let notRestarted = true;

let score = 0;
let round = 0;
let visibleScore = 0;
let highScore = 0;
let highRound = 0;

let collideSound;
let loseSound;

let speedX = 2,
    speedY = 2;
function runTheGame() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/background.jpg";
  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/pika.gif";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/wing.png";

  houndImage = new Image();
  houndImage.onload = function () {
    // show the hound image
    houndReady = true;
  };
  houndImage.src = "images/dragon-hound.gif";

  gateImage = new Image();
  gateImage.onload = function () {
    // show the gate image
    gateReady = false;
  };
  gateImage.src = "images/gate.png";

  overImage = new Image();
  overImage.onload = function () {
    // show the gate image
    overReady = false;
  };
  overImage.src = "images/gameover.png";

  zeusImage = new Image();
  zeusImage.onload = function () {
    // show the background image
    zeusReady = false;
  };
  zeusImage.src = "images/zeus.gif";

  fireImage = new Image();
  fireImage.onload = function () {
    // show the background image
    fireReady = false;
  };
  fireImage.src = "images/fire.gif";
}

let heroX = canvas.width / 2;
let heroY = canvas.height * 8 / 9;

let monsterX = 100;
let monsterY = 100;

let houndX = 100;
let houndY = 100;

let keysDown = {};
function setupKeyboardListeners() {
  addEventListener(
    "keydown",
    function (key) {
      keysDown[key.keyCode] = true;
    },
    false
  );

  addEventListener(
    "keyup",
    function (key) {
      delete keysDown[key.keyCode];
    },
    false
  );
}

let game = true;
let update = function () {
  if (!game) {
    overReady = true
    return;
  }
  if (heroX <= houndX + 35 &&
    houndX <= heroX + 35 &&
    heroY <= houndY + 35 &&
    houndY <= heroY + 35) {
    game = false
  }
  if (score >= 5) {
    gateReady = true
    if (
      heroX <= gateX + 38 &&
      gateX <= heroX + 38 &&
      heroY <= gateY + 38 &&
      gateY <= heroY + 30
    ) {
      game = false
    } else if (score >= 10 &&
      heroX <= fireX + 25 &&
      fireX <= heroX + 25 &&
      heroY <= fireY + 25 &&
      fireY <= heroY + 25) {
      game = false
    }
  }
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  houndX += speedX;
  houndY += speedY;

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 3; //Speed of moving character
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 3;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 3;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 3;
  }

  // Wrap character in screen

  if (heroX > canvas.width - 50) {
    heroX = canvas.width - 50;
  }
  if (heroX < 5) {
    heroX = 5;
  }
  // Wrap HeroY in screen (height)
  if (heroY > canvas.height - 58) {
    heroY = canvas.height - 58;
  }
  if (heroY < 5) {
    heroY = 5;
  }

  if (monsterX > canvas.width - 58) {
    monsterX = 5;
  }
  if (monsterX < 5) {
    monsterX = canvas.width - 58;
  }
  // Wrap HeroY in screen (height)
  if (monsterY > canvas.height - 50) {
    monsterY = 50;
  }
  if (monsterY < 5) {
    monsterY = canvas.height - 50;
  }

  if (houndX > canvas.width - 100 || houndX < 15) {
    speedX = -speedX;
  } else if (houndY > canvas.height - 100 || houndY < 15) {
    speedY = -speedY;
  }

  if (gateX > canvas.width - 100 || gateX < 15) {
    gateSpeedX = -gateSpeedX;
  } else if (gateY > canvas.height - 100 || gateY < 15) {
    gateSpeedY = -gateSpeedY;
  }

  if (zeusX > canvas.width - 50) {
    zeusX = canvas.width - 50;
  }
  if (zeusX < 15) {
    zeusX = 15;
  }
  // Wrap HeroY in screen (height)
  if (zeusY > canvas.height - 58) {
    zeusY = canvas.height - 58;
  }
  if (zeusY < 15) {
    zeusY = 15;
  }

  // Check if player and monster collided. Our images
  // are about 42 pixels big.
  if (
    heroX <= monsterX + 42 &&
    monsterX <= heroX + 42 &&
    heroY <= monsterY + 42 &&
    monsterY <= heroY + 42
  ) {

    monsterX = monsterX + Math.ceil(Math.random() * (canvas.width - 52));
    monsterY = monsterY + Math.ceil(Math.random() * (canvas.height - 59));

    score += 1;

    if (score === 8 || score === 15) {
      zeusReady = true
    }
    if (score === 5) {
      gateSpeedX = 2.5;
      gateSpeedY = 2.5;
      speedX = 2.5;
      speedX = 2.5;
    } else if (score === 13) {
      gateSpeedX = 3;
      gateSpeedY = 3;
      speedX = 3;
      speedX = 3;
    }
  }

  if (score >= 10) {
    fireReady = true
    if (elapsedTime % 2 === 0) {
      fireX = houndX
      fireY = houndY
    }
    if ((fireX, fireY)) {
      fireSpeedX = heroX - houndX;
      fireSpeedY = heroY - houndY;

      fireX += fireSpeedX / 40
      fireY += fireSpeedY / 40
    }
  }

  gateX += gateSpeedX
  gateY += gateSpeedY

  if (score === 8 || score === 15) {
    zeusReady = false
  }

  if (
    heroX <= zeusX + 32 &&
    zeusX <= heroX + 32 &&
    heroY <= zeusY + 32 &&
    zeusY <= heroY + 32
  ) {
    gateSpeedX = 1;
    gateSpeedY = 1;
    speedX = 1;
    speedX = 1;
    zeusReady = false
  }




};

var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }
  if (heroReady) {
    ctx.drawImage(heroImage, heroX, heroY);
  }
  if (monsterReady) {
    ctx.drawImage(monsterImage, monsterX, monsterY);
  }
  if (gateReady) {
    ctx.drawImage(gateImage, gateX, gateY);
  }
  if (zeusReady) {
    ctx.drawImage(zeusImage, zeusX, zeusY);
  }
  if (fireReady) {
    ctx.drawImage(fireImage, fireX, fireY);
  }
  if (overReady) {
    ctx.drawImage(overImage, overX, overY);
  }
  if (houndReady) {
    ctx.drawImage(houndImage, houndX, houndY);
  }
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "15px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`Eslapsed Time: ${elapsedTime}`, 20, 20);
  ctx.fillText(`Score: ${score}`, 20, 35);
};

var main = function () {
  update();
  render();
  requestAnimationFrame(main);
};

var w = window;
requestAnimationFrame =
  w.requestAnimationFrame ||
  w.webkitRequestAnimationFrame ||
  w.msRequestAnimationFrame ||
  w.mozRequestAnimationFrame;

runTheGame();
setupKeyboardListeners();
main();
