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

var x = 50;
var y = 50;

var lastPress = null;

var dir = DERECHA;

var pause = false;

var rect1 = new Rectangle(50, 50, 100, 60, "#f00");

var player = new Rectangle(40, 40, 10, 10, "#0f0");

var food = new Rectangle(80, 80, 10, 10, "#f00");

var score = 0;

var gameover = false;

var wall = [];
var iBody = new Image();
var iFood = new Image();
var aComer = new Audio();
var aMorir = new Audio();

var numMediosCargados = 0;
var dirWall = random(4);

var medios = [];
// medios["iBody"] = new Image();
// medios["iBody"].src = "imgs/body.png";
// medios["iBody"].addEventListener("load", cargaMedio, false);

iBody.src = "recursos/imgs/body.png";
iFood.src = "recursos/imgs/fruit.png";
aComer.src = "sounds/chomp.m4a";
aMorir.src = "sounds/dies.m4a";

aComer.play();
aMorir.play();

wall.push(new Rectangle(100, 50, 10, 10, "#999"));
wall.push(new Rectangle(100, 100, 10, 10, "#999"));
wall.push(new Rectangle(200, 50, 10, 10, "#999"));
wall.push(new Rectangle(200, 100, 10, 10, "#999"));

var body = [];

body.length = 0;
body.push(new Rectangle(40, 40, 10, 10, "#0f0"));
body.push(new Rectangle(0, 0, 10, 10, "#0f0"));
body.push(new Rectangle(0, 0, 10, 10, "#0f0"));

body.push(new Rectangle(0, 0, 10, 10, "#0f0"));

var iBody = new Image();
var iFood = new Image();
iBody.src = "imgs/body.png";
iFood.src = "imgs/fruit.png";

function iniciar() {
  canvas = document.getElementById("lienzo");
  lienzo = canvas.getContext("2d");

  var imagen = new Image();
  imagen.src = "imgs/fruit.png";
  imagen.addEventListener(
    "load",
    function () {
      lienzo.drawImage(imagen, 20, 20);
    },
    false
  );

  run();

  var gradiente = lienzo.createLinearGradient(0, 0, 10, 100);
  gradiente.addColorStop(0.5, "#0000FF");
  gradiente.addColorStop(1, "#000000");
  lienzo.fillStyle = gradiente;
  lienzo.fillRect(10, 10, 100, 100);

  lienzo.font = "bold 12px verdana, sans-serif";
  lienzo.textAlign = "start";
  lienzo.fillText("Mi mensaje", 100, 100);

  paint(lienzo);
}

function instanciar() {

  for (var i = 0, l = wall.length; i < l; i++) {
    wall[i].fill(lienzo);
  }

  for (var i = 0; i < body.length; i++) {
    body[i].fill(lienzo);
  }

  for (var i = body.length - 1; i > 0; i--) {
    body[i].x = body[i - 1].x;
    body[i].y = body[i - 1].y;
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

function run() {
  setTimeout(run, 50);
  act();
  paint(lienzo);
}

function act() {
  if (!pause && !gameover) {
    if (lastPress == KEY_UP) dir = ARRIBA;
    if (lastPress == KEY_RIGHT) dir = DERECHA;
    if (lastPress == KEY_DOWN) dir = ABAJO;
    if (lastPress == KEY_LEFT) dir = IZQUIERDA;

    if (dir == DERECHA) {
      body[0].x += 10;
    }
    if (dir == IZQUIERDA) {
      body[0].x -= 10;
    }
    if (dir == ARRIBA) {
      body[0].y -= 10;
    }
    if (dir == ABAJO) {
      body[0].y += 10;
    }

    if (body[0].x >= canvas.width) {
      body[0].x = 0;
    }
    if (body[0].y >= canvas.height) {
      body[0].y = 0;
    }
    if (body[0].x < 0) {
      body[0].x = canvas.width - 10;
    }
    if (body[0].y < 0) {
      body[0].y = canvas.height - 10;
    }
  }

  if (lastPress == KEY_P) {
    pause = !pause;
    lastPress = null;
  }

  if (body[0].intersects(food)) {
    score++;
    food.x = random(canvas.width / 10 - 1) * 10;
    food.y = random(canvas.height / 10 - 1) * 10;
    body.push(new Rectangle(0, 0, 10, 10, "#0f0"));
  }

  for (var i = 0; i < wall.length; i++) {
    if (food.intersects(wall[i])) {
      food.x = random(canvas.width / 10 - 1) * 10;
      food.y = random(canvas.height / 10 - 1) * 10;
    }

    if (body[0].intersects(wall[i])) {
      gameover = true;
    }
  }

  if (gameover && lastPress == KEY_ENTER) {
    reset();
  }

  for (var i = 2; i < body.length; i++) {
    if (body[0].intersects(body[i])) {
      gameover = true;
      pause = !pause;
    }
  }
}

function reset() {
  score = 0;
  dir = DERECHA;
  body[0].x = 40;
  body[0].y = 40;
  food.x = random(canvas.width / 10 - 1) * 10;
  food.y = random(canvas.height / 10 - 1) * 10;
  lastPress = null;
  gameover = false;
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
  lienzo.fillText("Last key pressed: " + lastPress, 5, 30);
  food.fill(lienzo);

  lienzo.fillText("Score: " + score, 10, 50);


  instanciar()
//   setTimeout(()=>{
//     instanciar()
//   },200) 



  if (pause || gameover) {
    if (gameover) {
      lienzo.fillText("GAME OVER", 150, 75);
    } else {
      lienzo.fillText("PAUSE", 150, 75);
    }
  }

  for (var i = 0; i < body.length; i++) {
    lienzo.drawImage(iBody, body[i].x, body[i].y);
  }
  lienzo.drawImage(iFood, food.x, food.y);
  for (var i = 0, l = wall.length; i < l; i++) {
    lienzo.drawImage(iWall, wall[i].x, wall[i].y);
  }

  aComer.play();
  medios["aComer"].play();
  lienzo.drawImage(iBody, body[i].x, body[i].y);
  lienzo.drawImage(medios["iBody"], body[i].x, body[i].y);
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
  aComer.src = "sounds/chomp.ogg";
  aMorir.src = "sounds/dies.ogg";
} else {
  aComer.src = "sounds/chomp.m4a";
  aMorir.src = "sounds/dies.m4a";
}

function cargaMedio() {
  numMediosCargados++;
}

medios["aComer"] = new Audio();
if (canPlayOgg()) medios["aComer"].src = "sounds/chomp.ogg";
else medios["aComer"].src = "sounds/chomp.m4a";
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

this.fill = function (lienzo) {
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
    lastPress = evt.keyCode;
  },
  false
);
