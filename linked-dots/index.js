/* jshint browser:true */
/* global dat */

(function () {

  var c = document.getElementById('c');
  var ctx = c.getContext('2d');

  var params = {
    raf: false,
    colored: true,
    lineWidth: 2,
    dotRadius: 4,
    dotNumber: 150,
    dotSpeed: 10,
    minDistance: 80
  };

  var gui = new dat.GUI();
  gui.add(params, 'colored').name('Colored dots?');
  gui.add(params, 'dotNumber', 10, 1000, 1).name('Number of dots').onChange(reset);
  gui.add(params, 'minDistance', 1, 500, 1).name('Distance for links');
  gui.add(params, 'dotSpeed', 1, 100, 1).name('Dot speed');
  var more = gui.addFolder('More settings');
  more.add(params, 'lineWidth', 1, 5, 1).name('Line width');
  more.add(params, 'dotRadius', 2, 10, 1).name('Dot radius');
  more.add(params, 'raf').name('RAF?');


  var points = [];

  function makePoint() {
    return {
      x: rand(0, c.width),
      y: rand(0, c.height),
      angle: rand(0, 2 * Math.PI),
      color: 'hsl(' + Math.round(rand(0, 360)) +', 100%, 65%)'
    };
  }

  function rand(a, b) {
    return a + (b - a) * Math.random();
  }

  function update(dt) {
    for (var i = 0; i < points.length; i++) {
      updatePoint(points[i], dt);
    }
  }

  function updatePoint(p, dt) {
    p.x += dt * Math.cos(p.angle) * params.dotSpeed;
    p.y += dt * Math.sin(p.angle) * params.dotSpeed;
    if (p.x < 0) {
      p.x = c.width;
    }
    if (p.x > c.width) {
      p.x = 0;
    }
    if (p.y < 0) {
      p.y = c.height;
    }
    if (p.y > c.height) {
      p.y = 0;
    }
  }

  function draw() {
    drawLinks();
    ctx.globalAlpha = 1;
    for (var i = 0; i < points.length; i++) {
      drawPoint(points[i]);
    }
  }

  function drawPoint(p) {
    ctx.fillStyle = params.colored ? p.color : 'black';
    ctx.beginPath();
    ctx.arc(p.x, p.y, params.dotRadius, 0, 2 * Math.PI);
    ctx.fill();
    if (params.colored) {
      ctx.stroke();
    }
  }

  function drawLinks() {
    ctx.lineWidth = params.lineWidth;
    for (var i = 0; i < points.length; i++) {
      for (var j = i; j < points.length; j++) {
        var p1 = points[i], p2 = points[j];
        var dx = p1.x - p2.x, dy = p1.y - p2.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < params.minDistance) {
          var ratio = (params.minDistance - d) / params.minDistance;
          ctx.globalAlpha = Math.sqrt(ratio);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  }

  function clear() {
    ctx.clearRect(0, 0, c.width, c.height);
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

    if (params.raf) {
      requestAnimationFrame(loop);
    }
    else {
      setTimeout(loop, 40);
    }
  }

  function onResize() {
    var w = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    c.width  = w;
    c.height = h;
  };

  window.onresize = onResize;

  function reset() {
    onResize();
    points = [];
    for (var i = 0; i < params.dotNumber; i++) {
      points.push(makePoint());
    }
  }

  reset();

  loop();

}());
