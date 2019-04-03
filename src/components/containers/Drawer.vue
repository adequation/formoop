<template>
  <div class="drawer-mask" @click="$emit('close')">
    <div class="drawer-wrapper" >
      <div class="drawer-container" v-on:click.stop="">

        <div class="drawer-closer">
          <slot name="upper-right">
            <button class="drawer-close-button" @click="$emit('close')">
              <i class="material-icons">arrow_back_ios</i>
            </button>
          </slot>
        </div>

        <div class="drawer-header">
          <slot name="header">

          </slot>
        </div>

        <div class="drawer-body">
          <slot name="body">

          </slot>
        </div>

        <div class="drawer-footer">
          <slot name="footer">
          </slot>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Drawer"
    }
</script>

<style scoped>
  .drawer-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  .drawer-wrapper {
    height: 100%;


  }

  .drawer-container {
    z-index: 9999;
    width: 20%;
    height: 100%;
    margin: 0;
    padding: 1em;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;

  }

  .drawer-body {
    margin: 20px 0;

  }

  .drawer-closer {
    float: right;
  }

  .drawer-enter {
    opacity: 0;
  }

  .drawer-leave-active {
    opacity: 0;
  }

  .drawer-enter .drawer-container,
  .drawer-leave-active .drawer-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .drawer-close-button {
    color: #00000055;
    background: none;

    cursor: pointer;
    font-size: large;
    border: none;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .drawer-close-button:hover {
    color: #00000077;
  }
</style>
