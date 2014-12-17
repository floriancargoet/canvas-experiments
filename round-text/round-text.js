/*jshint browser:true */
(function () {
  var canvas = document.getElementById('c');
  var ctx    = canvas.getContext('2d');


  window.onresize = function () {
    onResize();
    draw();
  };

  function onResize() {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth   || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    canvas.width  = w;
    canvas.height = h;
  }


  function getOriginalCoords(x, y) {
    var dx = x - canvas.width/2;
    var dy = y - canvas.height/2;
    var r = Math.sqrt(dx*dx+dy*dy);
    if (r < 60 || r > 100) {
      return;
    }
    var th = Math.atan2(dy, dx) + Math.PI;
    var origY = (100 - r)*4;
    var origX = th * canvas.width / (Math.PI);

    return {
      x: Math.round(origX),
      y: Math.round(origY)
    };
  }

  function draw() {
    // reset canvas
    canvas.width = canvas.width;
    ctx.font = '80px Arial';
    ctx.fillText('coucou ça tourne ? et hop, c\'est parti pour un tour !!!', 5, 78);

    var original = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var pixels = original.data;
    // create a new image
    var newImage = ctx.createImageData(canvas.width, canvas.height);
    var data = newImage.data;
    // for each new pixel, find the corresponding original pixel
    for (var i = 0; i < data.length; i += 4) {
      var x = (i / 4) % canvas.width;
      var y = (i / 4 - x) / canvas.width;
      var orig = getOriginalCoords(x, y);
      if (orig) {
        var j = orig.x * 4 + orig.y * 4 * canvas.width;
        data[i + 0] = pixels[j + 0];
        data[i + 1] = pixels[j + 1];
        data[i + 2] = pixels[j + 2];
        data[i + 3] = pixels[j + 3];
      }
    }
    ctx.putImageData(newImage, 0, 0);

  }

  // initial rendering
  onResize();
  draw();

}());
