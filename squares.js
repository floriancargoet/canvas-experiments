(function() {
  var canvas = document.getElementById('c');
  var ctx    = canvas.getContext('2d');

  var params = {
    angle  : 5,
    zoom   : 92,
    colors : ['#000000', '#FFFFFF', '#FF0000']
  };

  var presets = [{
    angle : 67,
    zoom  : 89
  }, {
    angle : 5,
    zoom  : 92
  }, {
    angle : 24.8,
    zoom  : 94.4
  }, {
    angle : 55.3,
    zoom  : 99
  }];

  var gui = new dat.GUI();
  gui.add(params, 'angle',  0, 90, 0.1).listen().onChange(draw);
  gui.add(params, 'zoom',  50, 99, 0.1).listen().onChange(draw);

  var colorFolder = gui.addFolder('Colors');
  params.colors.forEach(function (color, i) {
    colorFolder.addColor(params.colors, i).name('Color ' + (i + 1)).onChange(draw);
  });

  var presetFolder = gui.addFolder('Presets');
  presets.forEach(function (preset, i) {
    // apply function
    presets[i] = function () {
      params.angle = preset.angle;
      params.zoom  = preset.zoom;
      draw();
    };
    presetFolder.add(presets, i).name('Preset ' + (i + 1));
  });

  window.onresize = function () {
    onResize();
    draw();
  }

  function onResize() {
    var w = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    canvas.width  = w;
    canvas.height = h;
  }

  function draw() {
    var angle  = params.angle * Math.PI / 180;
    var zoom   = params.zoom / 100;
    var styles = params.colors;

    // reset canvas
    canvas.width = canvas.width;
    // center transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);

    var a = Math.max(canvas.width, canvas.height); // half size of squares

    for (
      var i = 0, gZoom = 1;
      gZoom * a * 2 > 1; // until 1px resolution
      i++
    ) {
      gZoom *= zoom;
      ctx.rotate(angle);
      ctx.scale(zoom, zoom);
      ctx.fillStyle = styles[i % styles.length];
      ctx.fillRect(-a, -a, 2 * a, 2 * a);
    }
  }

  // initial rendering
  onResize();
  draw();

}());