const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_P = 80;
const KEY_ENTER = 13;

const ARRIBA = 0;
const DERECHA = 1;
const ABAJO = 2;
const IZQUIERDA = 3;

var lienzo = null;
var canvas = null;

var lastPress = null;

var dir = DERECHA;

var pause = false;

var player = new Rectangle(40, 40, 10, 10, "#0f0");

var food = new Rectangle(80, 80, 10, 10, "#f00");

var score = 0;

var gameover = true;

var snakeImg = new Image();
var foodImg = new Image();

var aComer = new Audio();
var aMorir = new Audio();

var numMediosCargados = 0;
var dirWall = random(4);

var medios = [];

snakeImg.src = "recursos/imgs/snake.png";
foodImg.src = "recursos/imgs/fruit.png";

aComer.src = "recursos/sounds/chomp.m4a";
aMorir.src = "recursos/sounds/dies.m4a";

var obstacles = [];

function createObstacles() {
  obstacles = [];
  obstacles.push(new Rectangle(100, 50, 10, 10, "#999"));
  obstacles.push(new Rectangle(100, 100, 10, 10, "#999"));
  obstacles.push(new Rectangle(200, 50, 10, 10, "#999"));
  obstacles.push(new Rectangle(200, 100, 10, 10, "#999"));
}

var snake = [];

function createSnake() {
  snake = [];
  snake.push(new Rectangle(40, 40, 10, 10, "#0f0"));
  snake.push(new Rectangle(0, 0, 10, 10, "#0f0"));
  snake.push(new Rectangle(0, 0, 10, 10, "#0f0"));
  snake.push(new Rectangle(0, 0, 10, 10, "#0f0"));
}

function createFood(isRandom) {
  if (isRandom) {
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    return;
  }

  food.x = 40;
  food.y = 40;
}

var snakeImg = new Image();
var foodImg = new Image();
var obstacleImg = new Image();

snakeImg.src = "recursos/imgs/snake.png";
foodImg.src = "recursos/imgs/fruit.png";
obstacleImg.src = "recursos/imgs/obstacle.png";

food.x = 40;
food.y = 40;

function iniciar() {
  canvas = document.getElementById("lienzo");
  lienzo = canvas.getContext("2d");

  createObstacles();

  run();

  var gradiente = lienzo.createLinearGradient(0, 0, 10, 100);
  gradiente.addColorStop(0.5, "#0000FF");
  gradiente.addColorStop(1, "#000000");
  lienzo.fillStyle = gradiente;
  lienzo.fillRect(10, 10, 100, 100);

  lienzo.font = "bold 12px verdana, sans-serif";
  lienzo.textAlign = "start";

  lienzo.drawImage(foodImg, 20, 20);

  paint(lienzo);
}

function instanciar() {
  obstacles.forEach((obstacle) => {
    obstacle.fill(lienzo);
  });

  for (var i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }
}

function cargando() {
  if (numMediosCargados < Array.longitud(medios)) {
    lienzo.fillStyle = "#fff";
    lienzo.fillRect(0, 0, canvas.width, canvas.height);
    lienzo.fillStyle = "#0f0";
    lienzo.fillText(
      "Cargando " + numMediosCargados + " de " + Array.longitud(medios),
      10,
      10
    );
    setTimeout(cargando, 100);
  } else {
    iniciar();
  }
}

let interval;

function run() {
  interval = setInterval(() => {
    act();
    paint(lienzo);
  }, 50);
}

function act() {
  if (pause) return;

  if (!gameover) {
    if (lastPress == KEY_UP) dir = ARRIBA;
    if (lastPress == KEY_RIGHT) dir = DERECHA;
    if (lastPress == KEY_DOWN) dir = ABAJO;
    if (lastPress == KEY_LEFT) dir = IZQUIERDA;

    if (dir == DERECHA) {
      snake[0].x += 10;
    }
    if (dir == IZQUIERDA) {
      snake[0].x -= 10;
    }
    if (dir == ARRIBA) {
      snake[0].y -= 10;
    }
    if (dir == ABAJO) {
      snake[0].y += 10;
    }

    if (snake[0].x >= canvas.width) {
      snake[0].x = 0;
    }
    if (snake[0].y >= canvas.height) {
      snake[0].y = 0;
    }
    if (snake[0].x < 0) {
      snake[0].x = canvas.width - 10;
    }
    if (snake[0].y < 0) {
      snake[0].y = canvas.height - 10;
    }
  }

  if (snake[0].intersects(food)) {
    eatFood();
  }

  for (var i = 0; i < obstacles.length; i++) {
    if (food.intersects(obstacles[i])) {
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
    }

    if (snake[0].intersects(obstacles[i])) {
      gameover = true;
      clearInterval(interval);
    }
  }

  for (var i = 2; i < snake.length; i++) {
    if (snake[0].intersects(snake[i])) {
      clearInterval(interval);
      gameover = true;
      // pause = !pause;
    }
  }
}

function reset() {
  score = 0;
  dir = DERECHA;

  createSnake();
  createObstacles();
  createFood(true);

  snake[0].x = 40;
  snake[0].y = 40;

  lastPress = null;
  gameover = false;
  pause = false;

  clearInterval(interval);
  run();
}

/* - - - F U N C I Ó N  P I N T A R - - - */

function paint(lienzo) {
  var gradiente = lienzo.createLinearGradient(0, 0, 0, canvas.height);
  gradiente.addColorStop(0.5, "#0000FF");
  gradiente.addColorStop(1, "#000000");

  lienzo.fillStyle = gradiente;
  lienzo.fillRect(0, 0, canvas.width, canvas.height);
  lienzo.fillStyle = "#0f0";
  lienzo.fillStyle = "#fff";
  lienzo.fillText("Score: " + score, 10, 20);

  instanciar();

  if (pause || gameover) {
    if (gameover) {
      die();
    } else {
      lienzo.fillText("PAUSE", 150, 75);
    }
  }

  snake.forEach((piece) => {
    lienzo.drawImage(snakeImg, piece.x, piece.y);
  });

  lienzo.drawImage(foodImg, food.x, food.y);

  obstacles.forEach((obstacle) => {
    lienzo.drawImage(obstacleImg, obstacle.x, obstacle.y);
  });
}

function random(max) {
  return Math.floor(Math.random() * max);
}

function canPlayOgg() {
  var aud = new Audio();
  if (aud.canPlayType("audio/ogg").replace(/no/, "")) return true;
  else return false;
}

if (canPlayOgg()) {
  aComer.src = "recursos/sounds/chomp.ogg";
  aMorir.src = "recursos/sounds/dies.ogg";
} else {
  aComer.src = "recursos/sounds/chomp.m4a";
  aMorir.src = "recursos/sounds/dies.m4a";
}

function cargaMedio() {
  numMediosCargados++;
}

medios["aComer"] = new Audio();
if (canPlayOgg()) medios["aComer"].src = "recursos/sounds/chomp.ogg";
else medios["aComer"].src = "recursos/sounds/chomp.m4a";
medios["aComer"].addEventListener("canplaythrough", cargaMedio, false);

Array.longitud = function (obj) {
  return Object.getOwnPropertyNames(obj).length - 1;
};

longitud = Array.longitud(medios);

function Rectangle(x, y, width, height, color) {
  this.x = x == null ? 0 : x;
  this.y = y == null ? 0 : y;
  this.width = width == null ? 0 : width;
  this.height = height == null ? this.width : height;
  this.color = color == null ? "#000" : color;
}

Rectangle.prototype.intersects = function (rect) {
  if (rect != null) {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }
};

Rectangle.prototype.fill = function (lienzo) {
  if (lienzo != null) {
    lienzo.fillStyle = this.color;
    lienzo.fillRect(this.x, this.y, this.width, this.height);
  }
};

/* - - - F U N C I Ó N  R E P A I N T - - - */

function repaint() {
  requestAnimationFrame(repaint);
  paint(lienzo);
}

window.requestAnimationFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 17);
    }
  );
})();

window.addEventListener("load", iniciar, false);

document.addEventListener(
  "keydown",
  function (evt) {
    if (evt.key === "Enter" && gameover) {
      reset();
    }

    if (evt.key === "p") {
      pause = !pause;
    }

    lastPress = evt.keyCode;
  },
  false
);

function eatFood() {
  score++;

  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;

  snake.push(new Rectangle(0, 0, 10, 10, "#0f0"));

  aComer.play();
}

function die() {
  lienzo.fillText("GAME OVER", 120, 75);
  aMorir.play();
}
