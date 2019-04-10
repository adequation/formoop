<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>


  export default {
    name: 'App'
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  @import url('https://fonts.googleapis.com/css?family=Lato');

  .material-icons.md-16 {
    font-size: 16px;
  }

  .material-icons.md-18 {
    font-size: 18px;
  }

  .material-icons.md-20 {
    font-size: 20px;
  }

  .material-icons.md-24 {
    font-size: 24px;
  }

  .material-icons.md-36 {
    font-size: 36px;
  }

  .material-icons.md-48 {
    font-size: 48px;
  }

  .material-icons.md-dark {
    color: rgba(0, 0, 0, 0.54);
  }

  .material-icons.md-dark.md-inactive {
    color: rgba(0, 0, 0, 0.26);
  }

  .material-icons.md-light {
    color: white;
  }

  .material-icons.md-light.md-inactive {
    color: rgba(255, 255, 255, 0.3);
  }

  #app {
    font-family: 'Lato', sans-serif, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .accordion-fade-slide-enter-active {
    transition: all 0.5s;
  }

  .accordion-fade-slide-leave-active {
    transition: all 0.5s;
  }

  .accordion-fade-slide-enter {
    opacity: 0;
  }

  .accordion-fade-slide-leave-to {
    opacity: 0;
  }

  .smooth{
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s;
  }

  .shake{
    /* Start the shake animation and make the animation last for 0.5 seconds */
    animation: shakeKeys 0.5s;

    /* When the animation is finished, start again */
    animation-iteration-count: infinite;
  }

  @keyframes shakeKeys {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
  }
</style>
