let canvas;
let ctx;

canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
// document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, houndReady, gateReady, overReady, zeusReady, fireReady;
let bgImage, heroImage, monsterImage, houndImage, gateImage, overImage, zeusImage, fireImage;

let startTime = Date.now();
let elapsedTime = 0;

let gateX = 400;
let gateY = 400;

let overX = 250;
let overY = 250;

let zeusX = Math.round(Math.random() * canvas.width - 30);
let zeusY = Math.round(Math.random() * canvas.height - 30);

let fireX;
let fireY;

let fireSpeedX;
let fireSpeedY;

let gateSpeedX = 3;
let gateSpeedY = 3;

let score = 0;
let round = 0;

let newHighScore = 0;
let newBestTime = 0;

let player = null;

function getHighest(type) {
  return localStorage.getItem(type);
}

function save() {
  let currentHighestScore = getHighest('newHighScore');
  let currentBestTime = getHighest('newBestTime');

  if (!currentHighestScore || (currentHighestScore && currentHighestScore < score)) {
    localStorage.setItem("newHighScore", score);
  }

  if (!currentBestTime || (currentBestTime && currentBestTime < elapsedTime)) {
    localStorage.setItem("newBestTime", elapsedTime);
  }
}



let speedX = 3;
let speedY = 3;

// Sound effect
let collideSound = new Audio("audio/collide.mp3");
let loseSound = new Audio("audio/over.mp3");
let startSound = new Audio("audio/start.mp3");
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


// Music control;
let myAudio = document.getElementById("audio");
let isPlaying = true;

myAudio.autoplay = false;

function togglePlay() {
  if (!isPlaying) {
    myAudio.pause();
    document.getElementById("audio-button").innerHTML = "🎶 ON 🎶";
    document.getElementById("audio-button").className = "btn btn-success";
  } else {
    myAudio.play();
    document.getElementById("audio-button").innerHTML = "🏳 OFF 🏳";
    document.getElementById("audio-button").className = "btn btn-warning text-white";
  }
};
myAudio.onplaying = function () {
  isPlaying = false;
};
myAudio.onpause = function () {
  isPlaying = true;
};

let game = true;
let update = function () {
  if (!game) {
    save()
    overReady = true
    return;
  }
  if (heroX <= houndX + 35 &&
    houndX <= heroX + 35 &&
    heroY <= houndY + 35 &&
    houndY <= heroY + 35) {
    game = false;
    loseSound.play();
  }
  if (score >= 5 &&
      heroX <= gateX + 38 &&
      gateX <= heroX + 38 &&
      heroY <= gateY + 38 &&
      gateY <= heroY + 30
    ) {
      game = false;
      loseSound.play();
    } 
    if (score >= 10 &&
      heroX <= fireX + 25 &&
      fireX <= heroX + 25 &&
      heroY <= fireY + 25 &&
      fireY <= heroY + 25) {
      game = false;
      loseSound.play();
    }
  // Update the time.
  elapsedTime = Math.floor((Date.now() - startTime) / 1000);

  houndX += speedX;
  houndY += speedY;

  if (38 in keysDown) {
    // Player is holding up key
    heroY -= 5; //Speed of moving character
  }
  if (40 in keysDown) {
    // Player is holding down key
    heroY += 5;
  }
  if (37 in keysDown) {
    // Player is holding left key
    heroX -= 5;
  }
  if (39 in keysDown) {
    // Player is holding right key
    heroX += 5;
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

  if (gateX > (canvas.width - 100) || gateX < 15) {
    gateSpeedX = -gateSpeedX;
  } else if (gateY > (canvas.height - 100) || gateY < 15) {
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

  if (score >=5) {
    gateReady = true
    gateX += gateSpeedX;
    gateY += gateSpeedY;
    console.log(gateSpeedX, gateSpeedY)
  }

  // Check if player and monster collided. Our images
  // are about 42 pixels big.
  if (
    heroX <= monsterX + 42 &&
    monsterX <= heroX + 42 &&
    heroY <= monsterY + 42 &&
    monsterY <= heroY + 42
  ) {
    collideSound.play();
    monsterX = monsterX + Math.ceil(Math.random() * (canvas.width - 52));
    monsterY = monsterY + Math.ceil(Math.random() * (canvas.height - 59));

    score += 1;

    if (score === 8 || score === 15 || score === 20) {
      zeusReady = true
    }

    if (score === 6 || score === 18) {
      gateSpeedX = gateSpeedX*(1.5);
      gateSpeedY = gateSpeedY*(1.5);
      speedX = speedX*(1.5);
      speedX = speedY*(1.5);
    } else if (score === 13 || score === 22) {
      gateSpeedX = gateSpeedX*2;
      gateSpeedY = gateSpeedY*2;
      speedX = speedX*2;
      speedX = speedY*2;
    } else if (score === 25 || score === 30) {
      gateSpeedX = gateSpeedX*3;
      gateSpeedY = gateSpeedY*3;
      speedX = speedX*3;
      speedX = speedY*3;
    }
  }

  if ( zeusReady === true &&
    heroX <= zeusX + 32 &&
    zeusX <= heroX + 32 &&
    heroY <= zeusY + 32 &&
    zeusY <= heroY + 32
  ) {
    gateSpeedX = gateSpeedX/2;
    gateSpeedY = gateSpeedY/2;
    speedX = speedX/2;
    speedX = speedY/2;
    zeusReady = false
  }

  if (score >= 10) {
    fireReady = true
  }

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
};

let reset = function () {
  save()
  location.reload();
}

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
  document.getElementById('best-time').innerHTML = getHighest('newBestTime');
  document.getElementById("high-score").innerHTML = getHighest('newHighScore');
  document.getElementById("score-area").innerHTML = `${score}`;
  document.getElementById("elapsed-time").innerHTML = `${elapsedTime}`;
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

function startGame() {
  startSound.play()
  document.querySelector(".notice-screen").style.display = "none";
  document.querySelector(".start-game").style.display = "none";
  document.querySelector(".boxCanvas").style.display = "block";
  document.getElementById("canvas").style.display = "block";
  startTime = Date.now();
  runTheGame();
  setupKeyboardListeners();
  main();
}

function submitName() {
  let player = document.getElementById("player");
  if (!currentName) {
  let userInputName = document.getElementById("nameInput").value;
  if (userInputName === "" && (currentName === null)) {
    player.innerHTML = "<p style='color:red;'>Fill Your Name Above To Play</p>";
    document.querySelector(".input-area").style.display = "block";
    document.querySelector(".start-game").style.display = "none";
    return;
  } else {
    localStorage.setItem('player', userInputName)
    player.innerHTML = "⚜ Hello " + userInputName + "!";
    document.querySelector(".input-area").style.display = "none";
    document.querySelector(".start-game").style.display = "block";
  }
} else {
  player.innerHTML = "⚜ Hello " + currentName + "!";
  document.querySelector(".input-area").style.display = "none";
  document.querySelector(".start-game").style.display = "block";
}
};

let submitButton = document.getElementById("submitBtn");
submitButton.addEventListener("click", submitName);

let currentName = localStorage.getItem('player')

if (!currentName) {
  document.querySelector(".input-area").style.display = "block";
  document.querySelector(".start-game").style.display = "none";
  submitName()
} else {
  document.querySelector(".input-area").style.display = "none";
  document.querySelector(".start-game").style.display = "block";
  let play = document.getElementById("player").innerHTML = "⚜ Hello " + currentName + "!";
}