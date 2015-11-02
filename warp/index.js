/* jshint browser:true */

(function () {
  var c = document.getElementById('c');
  var ctx = c.getContext('2d');
  var w = c.width;
  var h = c.height;

  var mouseX = w / 2;
  var mouseY = h / 2;

  c.addEventListener('mousemove', function (ev) {
    mouseX = ev.pageX - c.offsetLeft;
    mouseY = ev.pageY - c.offsetTop;
  }, false);

  var circles = [];
  var n = 15;

  function update(dt) {
    for (var i = 0; i < n ; i++) {
      var ratio = 1 - i / n;
      var targetX = (1 - ratio) * w / 2 + ratio * mouseX;
      var targetY = (1 - ratio) * h / 2 + ratio * mouseY;
      var dx = targetX - circles[i].x;
      var dy = targetY - circles[i].y;

      if (Math.abs(dx) > 0.01) {
        circles[i].x += (ratio ) * dx * 30 * dt;
      }
      if (Math.abs(dy) > 0.01) {
        circles[i].y += (ratio ) * dy * 30 * dt;
      }
    }
  }

  function draw() {
    for (var i = 0; i < circles.length; i++) {
      drawCircle(ctx, circles[i]);
      drawJoints(ctx, circles[i], circles[i + 1]);
    }
  }

  function drawCircle(ctx, c) {
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);

    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(255,255,255,' + (c.opacity / 4).toFixed(2) + ')';
    ctx.stroke();

    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255,255,255,' + (c.opacity / 2).toFixed(2) + ')';
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,255,255,' + c.opacity.toFixed(2) + ')';
    ctx.stroke();
  }

  function drawJoints(ctx, c1, c2) {
    if (!c2) return;
    for (var i = 0; i < 8; i++) {
      var a = (i/8) * 2 * Math.PI;
      var x1 = c1.x + Math.cos(a) * c1.r;
      var y1 = c1.y + Math.sin(a) * c1.r;
      var x2 = c2.x + Math.cos(a) * c2.r;
      var y2 = c2.y + Math.sin(a) * c2.r;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);

      ctx.lineWidth = 10;
      ctx.strokeStyle = 'rgba(255,255,255,' + (c1.opacity / 4).toFixed(2) + ')';
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255,255,255,' + (c1.opacity / 2).toFixed(2) + ')';
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,' + c1.opacity.toFixed(2) + ')';
      ctx.stroke();
    }
  }

  function clear() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, c.width, c.height);
  }

  function frame(dt) {
    clear();
    update(dt);
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

  function onResize() {
    w = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    c.width  = w;
    c.height = h;
  };

  window.onresize = onResize;

  function reset() {
    onResize();
    circles = [];
    for (var i = 0; i < n; i++) {
      var ratio = (i) / n;
      ratio = Math.pow(ratio, 2.5);
      circles.push({
        x: w / 2,
        y: h / 2,
        r: ratio * h,
        opacity: ratio
      });
    }
  }

  reset();

  loop();

}());
