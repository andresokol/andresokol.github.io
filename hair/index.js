function max(a, b) {
  return a > b ? a : b;
}
function min(a, b) {
  return a < b ? a : b;
}

var canvas = document.getElementById("graph"),
  context = canvas.getContext("2d"),
  graph = [
    [false, true, true, true],
    [true, false, false, true],
    [true, false, false, false],
    [true, true, false, false]
  ],
  pos = [],
  phi = [],
  w = [],
  wForce = [],
  glen = 15,
  rad = 50,
  movement = 0,
  const1 = 5 * 1e4,
  const2 = 0.05,
  const3 = 100,
  eps = 1e-3,
  fps = 50;

const L = 300;
const segmentMass = 1.0;

var drawPoint = function(x, y) {
  context.beginPath();
  context.arc(x, y, 1.2, 0, 2 * Math.PI, false);
  context.fillStyle = "black";
  context.fill();
};

var drawLine = function(x1, y1, x2, y2) {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.strokeStyle = "gray";
  context.stroke();
};

var getX = function(i) {
  return (
    rad * Math.cos(2 * Math.PI / glen * i) +
    canvas.width / 2 +
    Math.random() -
    0.5
  );
};

var getY = function(i) {
  return (
    rad * Math.sin(2 * Math.PI / glen * i) +
    canvas.height / 2 +
    Math.random() -
    0.5
  );
};

var handleForces = function() {
  const DL = L / glen;

  let angleSum = 0;
  for (let j = 0; j <= glen - 1; j += 1) angleSum += phi[j];
  wForce[glen - 1] =
    -9.8 * segmentMass * DL / 2 * Math.cos(Math.PI / 2 - angleSum);

  for (let i = glen - 2; i >= 0; i -= 1) {
    for (let j = 0; j <= i; j += 1) angleSum += phi[j];
    wForce[i] = -9.8 * segmentMass * DL / 2 * Math.cos(Math.PI / 2 - angleSum);
    wForce += wForce[i + 1] * segmentMass * DL * Math.cos(Math.PI - phi[i + 1]);
  }

  for (let i = 1; i < glen; i += 1) {
    w[i] += wForce[i] / fps;
    w[i] *= 0.95;
  }

  for (let i = 0; i < glen; i += 1) {
    phi[i] += w[i] / fps;
  }

  let angle = 0.0;
  for (let i = 1; i < glen; i += 1) {
    angle += phi[i];
    pos[i][0] = pos[i - 1][0] + Math.sin(angle) * DL;
    pos[i][1] = pos[i - 1][1] + Math.cos(angle) * DL;
  }

  console.log("phi", phi);
};

var render = function() {
  console.log("Rendering...");
  const dx = canvas.width / 2;
  const dy = canvas.height / 2;
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < glen - 1; i++) {
    drawLine(
      pos[i][0] + dx,
      dy - pos[i][1],
      pos[i + 1][0] + dx,
      dy - pos[i + 1][1]
    );
    // drawLine(
    //     pos[i + 1][0] + dx,
    //     dy - pos[i + 1][1],
    //     dx + pos[i + 1][0] * (1 + wForce[i + 1] * 0.1),
    //     dy - pos[i + 1][1] * (1 + wForce[i + 1] * 0.1)
    // );
  }

  for (var i = 0; i < glen; i++) drawPoint(pos[i][0] + dx, dy - pos[i][1]);
};

var draw = function() {
  handleForces();
  render();
};

var main = function() {
  draw();
  window.setInterval(() => draw(), 1000 / fps);
};

var start = function() {
  var input = document.getElementById("input").value;
  input = input.split("\n");
  glen = parseInt(input[0]);

  pos = new Array(glen);
  phi = new Array(glen);
  w = new Array(glen);
  wForce = new Array(glen);
  for (let i = 0; i < glen; i += 1) {
    pos[i] = [0, 0];
    phi[i] = Math.PI;
    w[i] = 0;
    wForce[i] = 0;
  }
  phi[0] = Math.PI;

  render();

  console.log("started...", Math.PI, pos, phi, wForce);

  main();
};
