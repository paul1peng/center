var dm = 50;

var ma, circles;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS); 
  colorMode(RGB);
  initCenter();
}

function initCenter() {
  //var rseed = floor(random(0, 128));
  // TODO choose ird between : horiz, vert, 45s, diags, recips
  var ird = floor(random(0, 32));
  var n = floor(random(112, 145));
  var s = 1; // random(0.1875, 0.3125); 


  /*
  var fv = random([
    function(i) { return 255 * (i % 2); },
    // 64 + 128 * (i % 2) // 32 + 192 * (i % 2)
    function(i) { return i / n * 255; },
    // i < n / 2 ? map(i, 0, n / 2, 255, 0): map (i, n/2, n, 0, 255)
    // i < n / 2 ? 2 * i / n * 255 : 255 - (i - n / 2) / n * 255
    // i < n / 2 ? 2 * i / n * 255 : 255 - 2 * (i % n / 2) / n * 255
    function(i) { return random(255); },
    function(i) { return noise(25 * i / n) * 255; }
  ]);
  */

  ma = s * 192;
  circles = [];

  var ir = TWO_PI * (ird / 32);
  for (var i = 0; i < n; i++) {
    var r = ir + i / n * TWO_PI;
    circles.push({
      x: width / 2,
      y: height / 2,
      dx: sin(r) * s,
      dy: cos(r) * s,
      v: i / n * 255
      //v: i / n * 255
      //r: 255 * (i % 2),
      //g: 255 * (i % 2),
      //b: 255 * (i % 2)
    });
  }

  background(128); // for contrast-y b&w
  //background(128); // for smooth b&w
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
