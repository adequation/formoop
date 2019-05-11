<template>
  <div class="firework-holder">

    <h1 class="thank-you-text hand-written"
        @mouseup="canvasMouseup">
      Merci d'avoir participé au formoop !
    </h1>

    <canvas id="fireworks-canvas"
            ref="fireworks"
            :width="windowWidth"
            height="1000"
            @mousemove="canvasMousemove"
            @mousedown="canvasMousedown"
            @mouseup="canvasMouseup"
    ></canvas>
  </div>
</template>

<script>
  import windowSize from "@/mixins/windowSize";
  import {Firework, Particle, randomRange} from "@/helpers/fireworksHelpers";

  export default {
    name: "ClosedForm",
    mixins: [windowSize],

    data() {
      return {
        // full screen dimensions

        // firework collection
        fireworks: [],

        // particle collection
        particles: [],

        // starting hue
        hue: 120,

        // when launching fireworks with a click,
        // too many get launched at once without a limiter,
        // one launch per 5 loop ticks
        limiterTotal: 5,
        limiterTick: 0,

        //auto launches of fireworks, one launch per 80 loop ticks
        timerTotal: 80,
        timerTick: 0,
        mousedown: false,

        // mouse x coordinate,
        mx: 0,

        // mouse y coordinate
        my: 0
      }
    },

    computed: {
      canvas() {
        return this.$refs.fireworks
      },
      ctx() {
        return this.canvas.getContext('2d')
      },
    },

    methods: {

      // create particle group/explosion
      createParticles(x, y) {
        // increase the particle count for a bigger explosion, beware of the canvas performance hit with the increased particles though
        let particleCount = 30;
        while (particleCount--) {
          this.particles.push(new Particle(x, y, this.hue));
        }
      },

      // main demo loop
      loop() {
        // this function will run endlessly with requestAnimationFrame

        if(!requestAnimFrame) return;

        requestAnimFrame(this.loop);

        // increase the hue to get different colored fireworks over time
        //hue += 0.5;

        // create random color
        this.hue = randomRange(0, 360);

        // normally, clearRect() would be used to clear the canvas
        // we want to create a trailing effect though
        // setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
        this.ctx.globalCompositeOperation = 'destination-out';
        // decrease the alpha property to create more prominent trails
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.windowWidth, this.windowHeight);
        // change the composite operation back to our main mode
        // lighter creates bright highlight points as the fireworks and particles overlap each other
        this.ctx.globalCompositeOperation = 'lighter';

        // loop over each firework, draw it, update it
        let i = this.fireworks.length;
        while (i--) {
          this.fireworks[i].draw(this.ctx);
          this.fireworks[i].update(i, this);
        }

        // loop over each particle, draw it, update it
        i = this.particles.length;
        while (i--) {
          this.particles[i].draw(this.ctx);
          this.particles[i].update(i, this);
        }

        // launch fireworks automatically to random coordinates, when the mouse isn't down
        if (this.timerTick >= this.timerTotal) {
          if (!this.mousedown) {
            // start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
            this.fireworks.push(new Firework(this.windowWidth / 2, this.windowHeight, randomRange(0, this.windowWidth), randomRange(0, this.windowHeight / 2), this.hue));
            this.timerTick = 0;
          }
        } else {
          this.timerTick++;
        }
        // limit the rate at which fireworks get launched when mouse is down
        if (this.limiterTick >= this.limiterTotal) {
          if (this.mousedown) {
            // start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
            this.fireworks.push(new Firework(this.windowWidth / 2, this.windowHeight, this.mx, this.my, this.hue));
            this.limiterTick = 0;
          }
        } else {
          this.limiterTick++;
        }
      },

      canvasMousemove(e) {
        this.mx = e.offsetX;
        this.my = e.offsetY;
      },

      canvasMousedown(e) {
        e.preventDefault();
        this.mousedown = true;
      },

      canvasMouseup(e) {
        e.preventDefault();
        this.mousedown = false;
      },


    },

    destroyed(){
      window.onload = null;
      window.requestAnimFrame = null;
    },

    created() {
      window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||

          window.webkitRequestAnimationFrame ||

          window.mozRequestAnimationFrame ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
          };

      })();

      // once the window loads, we are ready for some fireworks!
      window.onload = this.loop;
    },

    mounted() {
      this.loop()
    },
  }
</script>

<style scoped>
  #fireworks-canvas {
    cursor: crosshair;
    display: block;
  }

  .firework-holder {
    background: #16161d;
    width: auto;
    height: auto;
  }

  .thank-you-text {
    top: 2em;
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    margin: auto;
    color: white;

    font-size: 3rem;

    user-select: none;
  }
</style>
