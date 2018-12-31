/*
  This file from: https://gist.github.com/r8n5n/89dff3bf98d73c458e73d052cd80fa1c

 */

/**
 *
 * @param {type} x position
 * @param {type} y position
 * @param {type} r radius
 * @param {type} b brightness
 * @param {type} c colour
 */
Star = function (x, y, r, b, c) {
  //
  this.x = x;
  this.y = y;
  this.radius = r;
  this.brightness = b;
  this.fillStyle = c;
  //
  this.arcRad = Math.PI * 2;
};

/**
 *
 * @param {type} canvas
 * @param {type} numStars
 * @param {type} colours
 * @param {type} twinkleSpeed
 */
Star.prototype.draw = function (context) {
  //draw the star
  context.beginPath();
  context.globalAlpha = this.brightness;
  context.fillStyle = this.fillStyle;
  context.arc(this.x, this.y, this.radius, 0, this.arcRad, true);
  context.fill();
  context.closePath();
};

/**
 *
 * @param {type} canvas
 * @param {type} numStars
 * @param {type} colours
 * @param {type} twinkleSpeed
 */
StarField = function (canvas, numStars, colours, twinkleSpeed) {
  this.context = canvas.getContext('2d'),
    this.w = canvas.width,
    this.h = canvas.height,
    this.numStars = numStars,
    this.stars = [],
    this.colours = colours,
    this.numColours = colours.length,
    this.count = 0,
    this.alter = twinkleSpeed;
  //
  this.create();
  this.draw();
};

/**
 *
 */
StarField.prototype.create = function () {

  this.context.save();
  //
  for (var i = 0; i < this.numStars; i++) {
    //
    var x = Math.random() * this.w | 0,
      y = Math.random() * this.h | 0,
      r = Math.round((Math.random()) * 100) * 0.01,
      b = this.randomBetween(80, 100) * 0.01,
      c = this.colours[this.randomBetween(0, this.numColours)];
    //
    var s = new Star(x, y, r, b, c);
    this.stars.push(s);
    s.draw(this.context);
  }

  this.context.restore();
};

/**
 * Generate a random integer between min and max
 * @param {type} min
 * @param {type} max
 * @returns {Number}
 */
StarField.prototype.randomBetween = function (min, max) {
  return Math.round((Math.random() * max - min) + min);
};

/**
 *
 * @param {type} array
 * @returns shuffled array
 */
StarField.prototype.shuffle = function (array) {
  var counter = array.length,
    temp, index;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

/**
 * raf draw
 */
StarField.prototype.draw = function () {
  this.alterBrightness();
  this.context.clearRect(0, 0, this.w, this.h);
  //
  for (var i = 0; i < this.numStars; i++) {
    var s = this.stars[i];
    s.draw(this.context);
  }
  //
  window.requestAnimationFrame(this.draw.bind(this));
};

/**
 * alter the brightness of selected stars
 */
StarField.prototype.alterBrightness = function () {
  for (var i = this.count; i < this.alter; i++) {
    var s = this.stars[i];
    s.brightness = this.randomBetween(80, 100) * 0.01;
  }
  //
  this.count += this.alter;
  if (this.count >= this.numStars) {
    this.count = 0;
    this.shuffle(this.stars);
  }
};
