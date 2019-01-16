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
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background-color: #f5f5f5;
}
</style>
