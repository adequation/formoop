<template>
    <div :class="['docking-menu', top ? 'position-top' : 'position-bottom']">

      <div class="docking-menu-body">
        <slot name="body">

        </slot>
      </div>

    </div>
</template>

<script>
    export default {
        name: "DockingMenu",
      props: {
          top:{
            type: Boolean,
            required: false,
            default: false
          }
      }
    }
</script>

<style scoped>

.docking-menu{

  padding-right: 5em;

  border-top: 1px solid #00000055;

  position: fixed;

  width: 100%;
  left: 0;

  background-color: #c0c0c0;

  z-index: 12;
}

  .position-bottom {
    bottom: 0;
  }


  .position-top {
    top: 0;
  }
</style>
