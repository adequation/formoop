<template>
  <transition name="modal">

    <div class="modal-mask" @click="$emit('close')">
      <div class="modal-wrapper" >
        <div class="modal-container" v-on:click.stop="">

          <div class="modal-closer">
            <slot name="upper-right" v-if="showCloseButton">
              <button class="modal-close-button" @click="$emit('close')">
                <i class="material-icons">close</i>
              </button>
            </slot>
          </div>

          <div class="modal-header">
            <slot name="header">

            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">

            </slot>
          </div>

          <div class="modal-footer">
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
    name: "Modal",

    props: {
      showCloseButton: {
        type: Boolean,
        required : false,
        default: true
      }
    }
  }
</script>

<style scoped>
  .modal-mask {
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

  .modal-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  .modal-container {
    z-index: 9999;
    width: 70%;
    margin: 1em auto;
    padding: 1em;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    font-family: Helvetica, Arial, sans-serif;
    max-height: 80vh;
    overflow-y: auto;
  }

  .modal-header h3 {
    margin-top: 0;
    color: #42b983;
    text-align: center;
  }

  .modal-body {
    margin: 20px 0;
  }

  .modal-closer {
    float: right;
  }

  .modal-default-button {
    float: right;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }

  .modal-close-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #bbbbbb;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .modal-close-button:hover {
    background: tomato;
  }
</style>
