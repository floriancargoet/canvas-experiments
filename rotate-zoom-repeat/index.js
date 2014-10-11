/* jshint browser:true */
/* global dat */

(function() {
  var canvas = document.getElementById('c');
  var ctx    = canvas.getContext('2d');

  var params = {
    angle  : 0,
    zoom   : 0,
    shape  : '',
    colors : ['#000000', '#FFFFFF', '#FF0000']
  };

  var presets = [{
    shape : 'triangle',
    angle : 50,
    zoom  : 89
  }, {
    shape : 'square',
    angle : 67,
    zoom  : 89
  }, {
    shape : 'triangle',
    angle : 3,
    zoom  : 92
  }, {
    shape : 'square',
    angle : 5,
    zoom  : 92
  }, {
    shape : 'triangle',
    angle : 34,
    zoom  : 90
  }, {
    shape : 'square',
    angle : 24.8,
    zoom  : 94.4
  }, {
    shape : 'triangle',
    angle : 55.3,
    zoom  : 99
  }, {
    shape : 'square',
    angle : 55.3,
    zoom  : 99
  }];


  var gui = new dat.GUI();
  gui.add(params, 'shape', ['square', 'triangle', 'ellipse']).listen().onChange(draw);
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
      params.shape = preset.shape;
      params.angle = preset.angle;
      params.zoom  = preset.zoom;
      draw();
    };
    presetFolder.add(presets, i).name([preset.shape, preset.angle, preset.zoom].join(' / '));
  });

  window.onresize = function () {
    onResize();
    draw();
  };

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
    var shape  = params.shape;

    // reset canvas
    canvas.width = canvas.width;
    // center transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);

    var a = Math.max(canvas.width, canvas.height) * 2; // size of first shape

    for (
      var i = 0, gZoom = 1;
      gZoom * a > 1; // until 1px resolution
      i++
    ) {
      gZoom *= zoom;
      ctx.rotate(angle);
      ctx.scale(zoom, zoom);
      ctx.fillStyle = styles[i % styles.length];
      draw[shape](a);
    }
  }

  draw.square = function (a) {
    ctx.fillRect(-a, -a, 2 * a, 2 * a);
  };

  draw.triangle = function (a) {
    ctx.beginPath();
    ctx.moveTo(0, a);
    ctx.lineTo( Math.sqrt(3) * a / 2, -a / 2);
    ctx.lineTo(-Math.sqrt(3) * a / 2, -a / 2);
    ctx.closePath();
    ctx.fill();
  };

  draw.ellipse = function (a) {
    ctx.beginPath();
    ctx.ellipse(0, 0, a, 0.8 * a, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  };

  // initial rendering
  onResize();
  // pick and apply a random preset
  var randomPreset = presets[Math.floor(Math.random() * presets.length)];
  randomPreset();
}());