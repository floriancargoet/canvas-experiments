/* jshint browser:true */

(function () {
  var c1 = document.getElementById('c1');
  var c2 = document.getElementById('c2');

  function draw(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ccc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    for (var x = 10; x < canvas.width; x += 15) {
      for (var y = 10; y < canvas.width; y += 15) {
        drawCircle(ctx, x, y);
      }
    }
  }

  function drawCircle(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
  }

  draw(c1);
  draw(c2);
}());
