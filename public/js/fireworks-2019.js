/**
 * Copyright 2011 Paul Lewis. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var imagesLandscape = [
  'images/newyears-2019/backgrounds/2013-01-01-0171.jpg',
  'images/newyears-2019/backgrounds/DSC_0280.JPG',
  'images/newyears-2019/backgrounds/DSC_0300.JPG',
  'images/newyears-2019/backgrounds/DSC_0306.JPG',
  'images/newyears-2019/backgrounds/DSC_0488.JPG',
  'images/newyears-2019/backgrounds/DSC_0497.JPG',
];

var Fireworks = (function() {

  // declare the variables we need
  var particles = [],
      mainCanvas = null,
      mainContext = null,
      fireworkCanvas = null,
      fireworkContext = null,
      backgroundImage = null,
      banners = [],
      bannerText1 = null,
      bannerText2 = null,
      bannerText3 = null,
      bannerText4 = null,
      viewportWidth = 0,
      viewportHeight = 0,
      isUpdating = false;

  function loadRandomImage() {
    var image = new Image();
    var randomNumber = Math.floor(Math.random() * imagesLandscape.length);
    var imageUrl = imagesLandscape[randomNumber];
    image.src = imageUrl;
    return image;
  }

  /**
   * Create DOM elements and get your game on
   */
  function initialize() {

    // start by measuring the viewport
    onWindowResize();
    backgroundImage = loadRandomImage();

    // create a canvas for the fireworks
    mainCanvas = document.createElement('canvas');
    mainContext = mainCanvas.getContext('2d');

    // and another one for, like, an off screen buffer
    // because that's rad n all
    fireworkCanvas = document.createElement('canvas');
    fireworkContext = fireworkCanvas.getContext('2d');

    // set up the colours for the fireworks
    createFireworkPalette(12);

    // set the dimensions on the canvas
    setMainCanvasDimensions();
    banners.push(new MovingBanner(mainContext, viewportWidth, viewportHeight, "~ May your dreams come true ~ Let's make 2019 a better year than 2018! ~"));
    banners.push(new StaticBanner(mainContext, viewportWidth, viewportHeight, 1, "~ Deepthi ~"));
    banners.push(new StaticBanner(mainContext, viewportWidth, viewportHeight, 2, "Happy New Year"));
    banners.push(new StaticBanner(mainContext, viewportWidth, viewportHeight, 3, "To You!"));

    // add the canvas in
    document.body.appendChild(mainCanvas);
    document.addEventListener('mouseup', createExplosionAtMouseEvent, true);
    document.addEventListener('touchend', createExplosionAtTouchEvent, true);

    window.onorientationchange = Fireworks.onWindowResize;
    window.onresize = function () {
      Fireworks.onWindowResize();
    };

    // Create 3 fireworks to start the show
    createFirework();
    createFirework();
    createFirework();
    // and now we set off
    update();
    createTimedFirework();

    // Workaround for Chrome displaying font in wrong size?
    onWindowResize();
    // var sf = new StarField(mainCanvas, 500, ["#f8f7ff", "#9bb0ff", "#ffcc6f", "#cad7ff"], 30);
  }

  /**
   * Pass through function to create a
   * new firework on touch / click
   */
  function createFirework() {
    createParticle();
  }

  function createExplosionAtMouseEvent(event) {
    createParticle({x: event.clientX, y: event.clientY}, {y: event.clientY});
  }

  function createExplosionAtTouchEvent(event) {
    var touch = event.touches.item(0);
    var x = touch ? touch.clientX : event.clientX,
        y = touch ? touch.clientY : event.clientY;
    if (x && y) {
      createParticle({x: x, y: y}, {y: y});
    }
  }

    /**
     * Create a new Firework timed every few seconds
     */
  function createTimedFirework(freq) {
      if (isUpdating) {
        createFirework(freq);
        isUpdating = false;
      }
    freq = freq || 1000;
    window.setTimeout(createTimedFirework, freq+(1000*Math.random()))
  }
  /**
   * Creates a block of colours for the
   * fireworks to use as their colouring
   */
  function createFireworkPalette(gridSize) {

    var size = gridSize * 10;
    fireworkCanvas.width = size;
    fireworkCanvas.height = size;
    fireworkContext.globalCompositeOperation = 'source-over';

    // create 100 blocks which cycle through
    // the rainbow... HSL is teh r0xx0rz
    for(var c = 0; c < 100; c++) {

      var marker = (c * gridSize);
      var gridX = marker % size;
      var gridY = Math.floor(marker / size) * gridSize;

      fireworkContext.fillStyle = "hsl(" + Math.round(c * 3.6) + ",100%,60%)";
      fireworkContext.fillRect(gridX, gridY, gridSize, gridSize);
      fireworkContext.drawImage(
        Library.bigGlow,
        gridX,
        gridY);
    }
  }

  /**
   * Update the canvas based on the
   * detected viewport size
   */
  function setMainCanvasDimensions() {
    mainCanvas.width = viewportWidth;
    mainCanvas.height = viewportHeight;
  }

  /**
   * The main loop where everything happens
   */
  function update() {
    clearContext();
    requestAnimFrame(update);
    isUpdating = true;
    drawBackground();
    drawText();
    drawFireworks();
  }

  /**
   * Clears out the canvas with semi transparent
   * black. The bonus of this is the trails effect we get
   */
  function clearContext() {
    mainContext.fillStyle = "rgba(0,0,0,0.2)";
    mainContext.fillRect(0, 0, viewportWidth, viewportHeight);
  }

  /**
   * Passes over all particles particles
   * and draws them
   */
  function drawFireworks() {
    var a = particles.length;

    while(a--) {
      var firework = particles[a];

      // if the update comes back as true
      // then our firework should explode
      if(firework.update()) {

        // kill off the firework, replace it
        // with the particles for the exploded version
        particles.splice(a, 1);

        // if the firework isn't using physics
        // then we know we can safely(!) explode it... yeah.
        if(!firework.usePhysics) {

          if(Math.random() < 0.8) {
            FireworkExplosions.star(firework);
          } else {
            FireworkExplosions.circle(firework);
          }
        }
      }

      // pass the canvas context and the firework
      // colours to the
      firework.render(mainContext, fireworkCanvas);
    }
  }

  function drawBackground() {
    mainContext.drawImage(backgroundImage, 0, 0, viewportWidth, viewportHeight);
  }

  function drawText() {
    for (i = 0; i < banners.length; ++i) {
      var bannerText = banners[i];
      bannerText.update();
      bannerText.render();
      if(!bannerText.startNext) {
        return;
      }
    }
  }

  /**
   * Creates a new particle / firework
   */
  function createParticle(pos, target, vel, color, usePhysics) {

    pos = pos || {};
    target = target || {};
    vel = vel || {};

    particles.push(
      new Particle(
        // position
        {
          x: pos.x || (viewportWidth * 0.25) + Math.random() * viewportWidth * 0.5,
          y: pos.y || viewportHeight + 10
        },

        // target
        {
          y: target.y || 150 + Math.random() * 100
        },

        // velocity
        {
          x: vel.x || Math.random() * 3 - 1.5,
          y: vel.y || 0
        },

        color || Math.floor(Math.random() * 100) * 12,

        usePhysics)
    );
  }

  /**
   * Callback for window resizing -
   * sets the viewport dimensions
   */
  function onWindowResize() {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    if (mainContext) {
      setMainCanvasDimensions();
    }
    if (bannerText1) {
      bannerText1.resetToNewViewportSize(viewportWidth, viewportHeight);
      bannerText2.resetToNewViewportSize(viewportWidth, viewportHeight);
      bannerText3.resetToNewViewportSize(viewportWidth, viewportHeight);
    }
  }

  // declare an API
  return {
    initialize: initialize,
    createParticle: createParticle,
    onWindowResize: onWindowResize
  };

})();

var MovingBanner = function(context, viewportWidth, viewportHeight, text, font) {
  this.context = context;
  this.text = text || "Wishing You A Happy New Year With Much Health, Love, Laughter and Happiness!";
  this.font = font || "600% Annie Use Your Telescope";
  this.startNext = true;

  this.gradient = this.createBaseGradient(context, viewportWidth);

  this.calculateStartX(viewportWidth);
  this.x = this.startX;
  this.calculateY(viewportHeight);

  context.save();
  context.font = this.font;
  var t = context.measureText(this.text);
  this.textWidth = t.width;
  this.vel = viewportWidth / t.width * 1.3;
  context.restore();
};

MovingBanner.prototype = {
  calculateStartX: function(viewportWidth) {
    this.startX = viewportWidth - 10;
  },

  calculateY: function(viewportHeight) {
    this.y = viewportHeight - Math.floor(viewportHeight / 7.0);
  },

  resetToNewViewportSize: function(viewportWidth, viewportHeight) {
    this.calculateStartX(viewportWidth);
    if (this.x > viewportWidth) {
      this.x = this.startX;
    }
    this.calculateY(viewportHeight);
  },

  update: function() {
    this.x = this.x - this.vel;
    if (this.x < - this.textWidth) {
      this.x = this.startX;
    }
  },

  render: function () {
    var context = this.context;
    context.save();
    context.fillStyle = this.gradient;
    context.font = this.font;
    context.fillText(this.text, this.x, this.y);
    context.restore();
  },

  createBaseGradient: function(context, width) {
    var gradient = context.createLinearGradient(0,0,width,50);
    gradient.addColorStop(0, "magenta");
    gradient.addColorStop(0.5, "blue");
    gradient.addColorStop(1.0, "hsl(170, 80%, 80%)");
    return gradient;
  }

};

var StaticBanner = function(context, viewportWidth, viewportHeight, line, text, font) {
  this.context = context;
  this.text = text || "~ Deepthi ~";
  this.font = font || "800% Caveat";
  this.line = line || 1;

  this.textWidth = this.calculateTextWidth();
  this.textHeight = this.approximateTextHeight();

  this.fadingGradients = this.createFadingGradients(context, viewportWidth);
  this.twinklingGradients = this.createTwinklingGradients(context, viewportWidth);
  this.currentStep = 0;
  this.fadeFinished = false;
  this.startNext = false;

  this.resetToNewViewportSize(viewportWidth, viewportHeight);
};

StaticBanner.prototype = {
  createFadingGradients: function(context, width) {
    var gradients = [];

    width = width || 200;
    for(var c = 0; c < 100; c++) {
      var grd = context.createLinearGradient(0, 0, width, 50);
      grd.addColorStop(0.0, "hsl(170, " + c + "%, " + Math.floor(c * 0.7) + "%)");
      grd.addColorStop(0.5, "hsl(300, " + c + "%, " + Math.floor(c * 0.7) + "%)");
      grd.addColorStop(1.0, "hsl(180, " + c + "%, " + Math.floor(c * 0.6) + "%)");
      gradients.push(grd);
    }

    return gradients;
  },

  createTwinklingGradients: function(context, width) {
    var gradients = [];

    width = width || 200;
    for(var i = 0; i < 100; i++) {
      var c = (i < 50 ? 25 - i % 50 : -25 + i % 50);
      var grd = context.createLinearGradient(0, 0, width, 50);
      grd.addColorStop(0.0, "hsl(170, " + (75 + c) + "%, " + (70 + c) + "%)");
      grd.addColorStop(0.5, "hsl(300, " + (75 + c) + "%, " + (70 + c) + "%)");
      grd.addColorStop(1.0, "hsl(180, " + (75 + c) + "%, " + (60 + Math.floor(c * (40.0 / 25.0))) + "%)");
      gradients.push(grd);
    }

    return gradients;
  },

  calculateTextWidth: function (text) {
    var context = this.context;
    context.save();
    context.font = this.font;
    var t = context.measureText(text || this.text);
    context.restore();
    return t.width;
  },

  approximateTextHeight: function () {
    return this.calculateTextWidth("M") * 1.1;
  },

  resetToNewViewportSize: function(viewportWidth, viewportHeight) {
    this.x = Math.floor((viewportWidth - this.textWidth) * 0.4);
    this.y = Math.floor((viewportHeight / 10.0) + (this.textHeight * this.line * 2));
    while (this.x > 0 && (this.x + this.textWidth >= viewportWidth*0.9)) {
      this.x = Math.floor(this.x / 2.0);
    }
  },

  update: function() {
    if (Math.floor(this.currentStep) === this.fadingGradients.length-1) {
      this.fadeFinished = true;
      this.currentStep = 0;
    }
    if (this.currentStep > 30) {
      this.startNext = true;
    }
    this.currentStep = this.currentStep + 0.15;
  },

  render: function () {
    var context = this.context;
    context.save();
    var gradients = this.fadeFinished ? this.twinklingGradients : this.fadingGradients;
    context.fillStyle = gradients[Math.floor(this.currentStep)];
    context.font = this.font;
    context.fillText(this.text, this.x, this.y);
    context.restore();
  }
};

/**
 * Represents a single point, so the firework being fired up
 * into the air, or a point in the exploded firework
 */
var Particle = function(pos, target, vel, marker, usePhysics) {

  // properties for animation
  // and colouring
  this.GRAVITY  = 0.06;
  this.alpha    = 1;
  this.easing   = Math.random() * 0.02;
  this.fade     = Math.random() * 0.1;
  this.gridX    = marker % 120;
  this.gridY    = Math.floor(marker / 120) * 12;
  this.color    = marker;

  this.pos = {
    x: pos.x || 0,
    y: pos.y || 0
  };

  this.vel = {
    x: vel.x || 0,
    y: vel.y || 0
  };

  this.lastPos = {
    x: this.pos.x,
    y: this.pos.y
  };

  this.target = {
    y: target.y || 0
  };

  this.usePhysics = usePhysics || false;

};

/**
 * Functions that we'd rather like to be
 * available to all our particles, such
 * as updating and rendering
 */
Particle.prototype = {

  update: function() {

    this.lastPos.x = this.pos.x;
    this.lastPos.y = this.pos.y;

    if(this.usePhysics) {
      this.vel.y += this.GRAVITY;
      this.pos.y += this.vel.y;

      // since this value will drop below
      // zero we'll occasionally see flicker,
      // ... just like in real life! Woo! xD
      this.alpha -= this.fade;
    } else {

      var distance = (this.target.y - this.pos.y);

      // ease the position
      this.pos.y += distance * (0.03 + this.easing);

      // cap to 1
      this.alpha = Math.min(distance * distance * 0.00005, 1);
    }

    this.pos.x += this.vel.x;

    return (this.alpha < 0.005);
  },

  render: function(context, fireworkCanvas) {

    var x = Math.round(this.pos.x),
        y = Math.round(this.pos.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5;

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = Math.random() * this.alpha;

    // draw the line from where we were to where
    // we are now
    context.fillStyle = "rgba(255,255,255,0.3)";
    context.beginPath();
    context.moveTo(this.pos.x, this.pos.y);
    context.lineTo(this.pos.x + 1.5, this.pos.y);
    context.lineTo(this.pos.x + xVel, this.pos.y + yVel);
    context.lineTo(this.pos.x - 1.5, this.pos.y);
    context.closePath();
    context.fill();

    // draw in the images
    context.drawImage(fireworkCanvas,
      this.gridX, this.gridY, 12, 12,
      x - 6, y - 6, 12, 12);
    context.drawImage(Library.smallGlow, x - 3, y - 3);

    context.restore();
  }

};

/**
 * Stores references to the images that
 * we want to reference later on
 */
var Library = {
  bigGlow: document.getElementById('big-glow'),
  smallGlow: document.getElementById('small-glow')
};

/**
 * Stores a collection of functions that
 * we can use for the firework explosions. Always
 * takes a firework (Particle) as its parameter
 */
var FireworkExplosions = {

  /**
   * Explodes in a roughly circular fashion
   */
  circle: function(firework) {

    var count = 100;
    var angle = (Math.PI * 2) / count;
    while(count--) {

      var randomVelocity = 4 + Math.random() * 4;
      var particleAngle = count * angle;

      Fireworks.createParticle(
        firework.pos,
        null,
        {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },
        firework.color,
        true);
    }
  },

  /**
   * Explodes in a star shape
   */
  star: function(firework) {

    // set up how many points the firework
    // should have as well as the velocity
    // of the exploded particles etc
    var points          = 6 + Math.round(Math.random() * 15);
    var jump            = 3 + Math.round(Math.random() * 7);
    var subdivisions    = 10;
    var radius          = 80;
    var randomVelocity  = -(Math.random() * 3 - 6);

    var start           = 0;
    var end             = 0;
    var circle          = Math.PI * 2;
    var adjustment      = Math.random() * circle;

    do {

      // work out the start, end
      // and change values
      start = end;
      end = (end + jump) % points;

      var sAngle = (start / points) * circle - adjustment;
      var eAngle = ((start + jump) / points) * circle - adjustment;

      var startPos = {
        x: firework.pos.x + Math.cos(sAngle) * radius,
        y: firework.pos.y + Math.sin(sAngle) * radius
      };

      var endPos = {
        x: firework.pos.x + Math.cos(eAngle) * radius,
        y: firework.pos.y + Math.sin(eAngle) * radius
      };

      var diffPos = {
        x: endPos.x - startPos.x,
        y: endPos.y - startPos.y,
        a: eAngle - sAngle
      };

      // now linearly interpolate across
      // the subdivisions to get to a final
      // set of particles
      for(var s = 0; s < subdivisions; s++) {

        var sub = s / subdivisions;
        var subAngle = sAngle + (sub * diffPos.a);

        Fireworks.createParticle(
          {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          null,
          {
            x: Math.cos(subAngle) * randomVelocity,
            y: Math.sin(subAngle) * randomVelocity
          },
          firework.color,
          true);
      }

    // loop until we're back at the start
    } while(end !== 0);

  }

};

// Go
window.onload = function() {
  Fireworks.initialize();
};
