<template>
    <div class="docking-menu">

      <div class="docking-menu-body">
        <slot name="body">

        </slot>
      </div>

    </div>
</template>

<script>
    export default {
        name: "DockingMenu"
    }
</script>

<style scoped>

.docking-menu{

  padding-right: 5em;

  border-top: 1px solid #00000055;

  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;


  background-color: #c0c0c0;

  z-index: 12;
}
</style>
