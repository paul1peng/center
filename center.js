var dm = 50;

var ma, circles;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); 
  colorMode(RGB);
  initCenter();
}

function initCenter() {
  var n = 127; // sym ==> 128; asym ==> 127
  var s = 1;

  ma = s * 256;
  circles = [];

  for (var i = 0; i < n; i++) {
    var r = i / n * TWO_PI;
    circles.push({
      x: width / 2,
      y: height / 2,
      dx: sin(r) * s,
      dy: cos(r) * s,
      r: 255 * (i % 2),
      g: 255 * (i % 2),
      b: 255 * (i % 2)
      //v: 255 * (i % 2) // for contrast-y b&w (works best with even n)
      //v: i / n * 255 // for smooth b&w
      //v: random(255) // just fuck me up!!!
    });
  }

  //background(0); // for contrast-y b&w
  background(128); // for smooth b&w
}

function draw() {
  var n = circles.length;

  /* move each circle, wrapping around drawing surface as necessary */
  for (var i = 0; i < n; i++) {
    var e = circles[i];
    e.x = mod(e.x + e.dx, width); 
    e.y = mod(e.y + e.dy, height);
  }

  /* draw line between overlapping circles */
  for (var i = 0; i < n; i++) {
    var e1 = circles[i];
    for (var j = 0; j < i; j++) {
      var e2 = circles[j];
      var d = dist(e1.x, e1.y, e2.x, e2.y);
      if (d <= dm) { // if overlapping
        stroke(
          /* average of the two circles' colors */
          (e1.r + e2.r) / 2,
          (e1.g + e2.g) / 2,
          (e1.b + e2.b) / 2,
          /* lighter when further, darker when closer */
          ma - d / dm * ma
        );
        line(e1.x, e1.y, e2.x, e2.y);
      }
    }
  }
}

function keyTyped() {
  if (key === 's') {
    save('drawing.png');
  }
}

function mod(n, m) {
  return (n + m) % m;
}
