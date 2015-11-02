/* jshint browser:true */

(function () {
  var c = document.getElementById('c');
  var ctx = c.getContext('2d');

  var params = {
    d: 28,
    r: 7,
    speed: 40
  }

  var gui = new dat.GUI();
  gui.add(params, 'd', 20, 200).name('Distance').onChange(resetCoords);
  gui.add(params, 'r', 1, 50, 1).name('Radius');
  gui.add(params, 'speed', 1, 300, 1).name('Speed');

  var sqrt32 = Math.sqrt(3) / 2;

  var x1, y1, x2, y2, x3, y3, x4, y4;

  var acc = 0;
  var direction = 'horizontal';
  function update(dt) {
    var movement = params.speed * dt;
    acc += movement;
    while (acc > params.d) {
      acc -= params.d;
      resetCoords();
      changeDirection();
    }
    move[direction](movement);
  }

  function resetCoords() {
    var d = params.d
    x1 = -10;
    y1 = -10;
    x2 = x1 + d;
    y2 = y1;
    x3 = x1 + d / 2;
    y3 = y1 + sqrt32 * d;
    x4 = x3 + d;
    y4 = y3;
  }
  resetCoords();

  function changeDirection() {
    if (direction === "horizontal") {
      direction = "oblique1";
      return;
    }
    if (direction === "oblique1") {
      direction = "oblique2";
      return;
    }
    if (direction === "oblique2") {
      direction = "horizontal";
      return;
    }
  }

  var move = {
    horizontal: function (m) {
      x1 += m;
      x2 += m;
      x3 -= m;
      x4 -= m;
    },
    oblique1: function (m) {
      x1 -= m / 2;
      y1 += m * sqrt32;
      x4 -= m / 2;
      y4 += m * sqrt32;

      x2 += m / 2;
      y2 -= m * sqrt32;
      x3 += m / 2;
      y3 -= m * sqrt32;
    },
    oblique2: function (m) {
      x1 += m / 2;
      y1 += m * sqrt32;
      x3 += m / 2;
      y3 += m * sqrt32;

      x2 -= m / 2;
      y2 -= m * sqrt32;
      x4 -= m / 2;
      y4 -= m * sqrt32;
    }
  }

  function draw() {
    var d = params.d;
    var r = params.r;
    ctx.fillStyle = "white";
    var dx, dy;
    for (var i = 0; i < 15; i++) {
      for (var j = 0; j < 8; j++) {
        dx = 2 * i * d;
        dy = 2 * Math.sqrt(3) * j * d;
        drawCircle(ctx, x1 + dx, y1 + dy, r);
        drawCircle(ctx, x2 + dx, y2 + dy, r);
        drawCircle(ctx, x3 + dx, y3 + dy, r);
        drawCircle(ctx, x4 + dx, y4 + dy, r);
        dx -= d;
        dy += Math.sqrt(3) * d;
        drawCircle(ctx, x1 + dx, y1 + dy, r);
        drawCircle(ctx, x2 + dx, y2 + dy, r);
        drawCircle(ctx, x3 + dx, y3 + dy, r);
        drawCircle(ctx, x4 + dx, y4 + dy, r);
      }
    }
  }

  function drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
  }

  function clear() {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  function frame(dt) {
    update(dt);
    clear();
    draw();
  }

  var t = Date.now();
  function loop() {
    var dt = Date.now() - t;
    t = Date.now();

    if (dt > 1000) {
      dt = 20;
    }
    while (dt > 20) {
      dt -= 20;
      frame(20 / 1000);
    }
    frame(dt / 1000);

    requestAnimationFrame(loop);
  }

  loop();

}());
