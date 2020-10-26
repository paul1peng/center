var n = 127; // sym ==> 128; asym ==> 127
var dm = 50;
var s = 1;
var ma = s * 256;

var elements = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  //background(0); // for contrast-y b&w
  background(128); // for smooth b&w
  angleMode(RADIANS); 

  //colorMode(HSB, 255); background(0, 0, 128);

  for (var i = 0; i < n; i++) {
    var r = i / n * TWO_PI;
    elements.push({
      x: width / 2,
      y: height / 2,
      dx: sin(r) * s,
      dy: cos(r) * s,
      //v: 255 * (i % 2) // for contrast-y b&w (works best with even n)
      v: i / n * 255 // for smooth b&w
      //v: random(255) // just fuck me up!!!
    });
  }
}

function draw() {
  for (var i = 0; i < n; i++) {
    var e = elements[i];
    // for compositionally sound version
    e.x = mod(e.x + e.dx, width); 
    e.y = mod(e.y + e.dy, height);
    /*
    // for cropped version
    e.x = mod(e.x + e.dx + dm, width + dm * 2) - dm;
    e.y = mod(e.y + e.dy + dm, height + dm * 2) - dm;
    */
  }
  for (var i = 0; i < n; i++) {
    var e1 = elements[i];
    for (var j = 0; j < i; j++) {
      var e2 = elements[j];
      var d = dist(e1.x, e1.y, e2.x, e2.y);
      if (d <= dm) {
        stroke(
          (e1.v + e2.v) / 2,
          //255, 255, // for HSB version
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
