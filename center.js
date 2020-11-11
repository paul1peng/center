/* Center
 * Paul Peng
 *
 * Invisible circles, each with a color, coming out from the center
 * of the drawing, evenly spaced. When a circle goes past the edge,
 * it comes back in from the other side. Draw a line between the centers
 * of overlapping circles colored the average of the circles' colors,
 * lighter when further apart, heavier when closer together.
 *
 * paulpengdotcom.com
 */

var s = 0.5;       // circle speed
var ma = s * 192;  // circle max opacity
var dm = 50;       // circle diameter
var minv = 0;      // minimum circle value
var maxv = 255;    // maximum circle value
// potential start angles at which the first circle spawns
var irs = [0, Math.PI / 2, Math.PI, Math.PI * 3 / 2];

var circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); 
  colorMode(RGB);
  randCenter();
}

function draw() {
  var n = circles.length;
  moveCircles();
  drawCircleInteractions();
}

/* Call initCenter with random arguments, printing out said call */
function randCenter() {
  /* pick number of elements */
  var n = floor(random(112, 145));
  
  /* pick initial angle at which to point elements */
  var iri = floor(random(4));

  /* pick Perlin noise seeds and interval */
  var pnseed = floor(random(256));
  var pnunit = floor(random(30, 101));

  initCenter(n, iri, pnseed, pnunit);

  print("initCenter(" + n + ", " + iri + ", " + pnseed + ", " + pnunit + ")");
}

/* Initialize Center over these parameters.
 * n      -- number of circles
 * iri    -- index of which direction to
 * pnseed -- seed for generating circle colors from Perlin noise
 * pnunit -- interval of Perlin noise we generate circle colors from
 */
function initCenter(n, iri, pnseed, pnunit) {
  /* pick initial angle at which to point elements */
  var ir = irs[mod(floor(iri), irs.length)];

  /* seed Perlin noise and define value function */
  noiseSeed(pnseed);
  var nunit = pnunit / 100;
  function fv(i) {
    return i < n / 4 ? 255 * noise(map(i, 0, n / 4, 0, nunit), 0) :
      i < n / 2 ? 255 * noise(nunit, map(i, n / 4, n / 2, 0, nunit)) :
      i < n * 3 / 4 ? 255 * noise(map(i, n / 2, n * 3 / 4, nunit, 0), nunit) :
      255 * noise(0, map(i, n * 3 / 4, n, nunit, 0));
  }

  circles = [];

  /* generate elements in every direction from center
   * keep track of min and max values to normalize later
   */
  var rawminv = null;
  var rawmaxv = null;
  for (var i = 0; i < n; i++) {
    var r = ir + i / n * TWO_PI;
    var v = fv(i)
    if (rawminv === null || v < rawminv) rawminv = v;
    if (rawmaxv === null || rawmaxv < v) rawmaxv = v;
    circles.push({
      x: width / 2,
      y: height / 2,
      dx: cos(r) * s,
      dy: sin(r) * s,
      v: v
    });
  }

  /* normalize values */
  for (var i = 0; i < circles.length; i++) {
    circles[i].v = map(circles[i].v, rawminv, rawmaxv, minv, maxv);
  }

  background(128);
}

/* move each circle, wrapping around drawing surface if necessary */
function moveCircles() {
  for (var i = 0; i < circles.length; i++) {
    var e = circles[i];
    e.x = mod(e.x + e.dx, width); 
    e.y = mod(e.y + e.dy, height);
  }
}

/* draw line between overlapping circles */
function drawCircleInteractions() {
  for (var i = 0; i < circles.length; i++) {
    var e1 = circles[i];
    for (var j = 0; j < i; j++) {
      var e2 = circles[j];
      var d = dist(e1.x, e1.y, e2.x, e2.y);
      if (d <= dm) { // if overlapping
        stroke(
          /* average of the two circles' colors */
          (e1.v + e2.v) / 2,
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
