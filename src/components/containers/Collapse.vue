<template>
  <div class="collapse">

    <div class="collapse-arrow" v-if="showArrow" @click="handleCollapsed">

      <transition name="arrow-rotate" mode="out-in">

        <div key="collapsedArrow" v-if="collapsed"><i class="material-icons">chevron_right</i></div>
        <div key="uncollapsedArrow" class="uncollapsed-arrow"
             v-else><i class="material-icons">chevron_right</i>
        </div>

      </transition>

    </div>

    <div class="collapse-header" @click="handleCollapsed">

      <slot name="header"></slot>

    </div>


    <transition name="accordion-fade-slide" mode="out-in">

      <div class="collapse-body"
           v-if="!collapsed">

        <slot name="body"></slot>

      </div>

    </transition>

  </div>
</template>

<script>
  export default {
    name: "Collapse",
    data() {
      return {
        collapsed: !this.initialyOpened && true
      }
    },

    props: {
      initialyOpened: {
        type: Boolean,
        required: false
      },
      showArrow: {
        type: Boolean,
        required: false
      }
    },

    methods: {
      handleCollapsed() {
        this.collapsed = !this.collapsed;
      },
      open() {
        this.collapsed = false;
      },
      close() {
        this.collapsed = true;
      }
    }
  }
</script>

<style scoped>

  .collapse {
  }

  .collapse-header {
    background-color: #f5f5f5;
    padding: 0.2em ;
    border-top: 1px solid #00000020;

    border-radius: 5px 5px 0 0;

  }

  .collapse-body {
    background-color: #fcfcfc;
    border-bottom: 10px solid #f5f5f5;
    border-left: 10px solid #f5f5f5;
    border-right: 10px solid #f5f5f5;

    border-radius: 0 0 5px 5px;

    padding: 0.5em;
  }

  .collapse-arrow {
    font-size: x-large;
    float: right;
    margin-right: 0.2em;
    margin-top: 15px;
  }

  .collapse-header-and-arrow {

  }

  .accordion-fade-slide-enter-active, .accordion-fade-slide-leave-active {
    transition: all 0.25s;
  }

  .accordion-fade-slide-enter {
    transform: translateY(-10px);
    opacity: 0;
  }

  .accordion-fade-slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }

  .arrow-rotate-enter-active {

  }

  .arrow-rotate-leave-active {
    transition: all 0.25s;
  }

  .arrow-rotate-enter {
  }

  .arrow-rotate-leave-to {
    transform: rotateZ(90deg);
  }

  .uncollapsed-arrow {
    transform: rotateZ(90deg);
  }

  .uncollapsed-arrow.arrow-rotate-leave-to {
    transform: rotateZ(0deg);
  }


</style>
