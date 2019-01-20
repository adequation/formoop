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

  .material-icons.md-18 {
    font-size: 18px;
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
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
