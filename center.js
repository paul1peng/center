var dm = 50;

var ma, circles;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); 
  colorMode(RGB);
  initCenter();
}

function initCenter() {
  /* pick number of elements and speed */
  var n = floor(random(112, 145));
  var s = random(0.1875, 0.3125);

  /* pick initial angle at which to point elements */
  var ar = width / height;
  var ir = random([
    createVector(1, 1),            // sinister 45 degrees
    createVector(1, -1),           // baroque 45 degrees
    createVector(0, 1),            // vertical
    createVector(1, 0),            // horizontal
    createVector(width, height),   // sinister diagonal
    createVector(width, -height),  // baroque diagonal
    createVector(height, width),   // sinister reciprocal
    createVector(height, -width)   // baroque reciprocal
  ]).mult(random([-1, 1]))
    .angleBetween(createVector(1, 0));

  /* pick function to color elements with */
  //var nseed = floor(random(256));
  //var nunit = random(0.15, 1);
  //noiseSeed(nseed);
  var minv = 32;
  var maxv = 224;
  var fv = random([
    function blackToWhiteToBlack(i) {
      return i < n / 2 ? map(i, 0, n / 2, minv, maxv) :
        map(i, n / 2, n, maxv, minv);
    },
    function whiteToBlackToWhite(i) {
      return i < n / 2 ? map(i, 0, n / 2, maxv, minv) :
        map(i, n / 2, n, minv, maxv);
    },
    /*
    function blackToWhite(i) {
      return i / n * 255;
    },
    function fromNoise(i) {
      return i < n / 4 ? 255 * noise(map(i, 0, n / 4, 0, nunit), 0) :
        i < n / 2 ? 255 * noise(nunit, map(i, n / 4, n / 2, 0, nunit)) :
        i < n * 3 / 4 ? 255 * noise(map(i, n / 2, n * 3 / 4, nunit, 0), nunit) :
        255 * noise(map(i, n * 3 / 4, n, nunit, 0), 0);
    }
    */
  ]);

  ma = s * 192;
  circles = [];

  /* generate elements in every direction from center */
  for (var i = 0; i < n; i++) {
    var r = ir + i / n * TWO_PI;
    circles.push({
      x: width / 2,
      y: height / 2,
      dx: cos(r) * s,
      dy: sin(r) * s,
      v: fv(i)
    });
  }

  background(128);
}

function draw() {
  var n = circles.length;
  moveCircles();
  drawCircleInteractions();
}

function moveCircles() {
  /* move each circle, wrapping around drawing surface if necessary */
  for (var i = 0; i < circles.length; i++) {
    var e = circles[i];
    e.x = mod(e.x + e.dx, width); 
    e.y = mod(e.y + e.dy, height);
  }
}

function drawCircleInteractions() {
  /* draw line between overlapping circles */
  for (var i = 0; i < circles.length; i++) {
    var e1 = circles[i];
    for (var j = 0; j < i; j++) {
      var e2 = circles[j];
      var d = dist(e1.x, e1.y, e2.x, e2.y);
      if (d <= dm) { // if overlapping
        stroke(
          /* average of the two circles' colors */
          (e1.v + e2.v) / 2,
          //(e1.r + e2.r) / 2,
          //(e1.g + e2.g) / 2,
          //(e1.b + e2.b) / 2,
          /* lighter when further, darker when closer */
          ma - d / dm * ma
        );
        line(e1.x, e1.y, e2.x, e2.y);
      }
    }
  }
}

function mod(n, m) {
  return (n + m) % m;
}
