<template>

  <transition name="drawer">
    <div class="drawer-mask" @click="$emit('close')">
      <div class="drawer-wrapper" >

        <div class="drawer-container " @click.stop="">

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

          <div class="drawer-body" >
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
  </transition>
</template>

<script>
  export default {
    name: "Drawer",
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
    display: table;
    transition: opacity .3s ease;
  }

  .drawer-wrapper {
    height: 100%;

  }

  .drawer-container {
    z-index: 9999;
    width: 18%;
    height: 100vh;
    margin: 0;
    padding: 1em;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .5s cubic-bezier(0.820, 0.085, 0.395, 0.895);
  }

  .drawer-body {
    margin: 20px 0;
  }

  .drawer-closer {
    float: right;
  }

  .drawer-enter-active {
    transition: all .3s cubic-bezier(0.820, 0.085, 0.395, 0.895);
  }

  .drawer-leave-active {
    opacity: 0;
    transition: all .3s cubic-bezier(0.820, 0.085, 0.395, 0.895);
  }

  .drawer-enter {
    transform: translate(-18%,0);
  }
  .drawer-leave-to{
    transform: translate(-18%,0);
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

  @media screen and (max-width: 880px) {
    .drawer-container {
      width: 140px;
    }
  }
</style>
