<template>
  <div class="custom-select" @click.stop="">

    <div class="select-box" @click="showList = !showList" :title="optionType">

      <div class="selected-option-display" v-if="selectedOption || selected">
        {{selectedOption || selected }}
      </div>
      <span v-else class="selected-option-display">Aucune {{optionType.toLowerCase()}}</span>

      <i class="material-icons" @click.stop="" @click="showList = !showList">keyboard_arrow_down</i>
    </div>

    <transition name="accordion-fade-slide" mode="out-in">
      <div class="options-list" v-if="showList">
        <div class="option-to-select" @click="onChangeOption(null)">
          <span class="list-option-text">Aucune {{optionType.toLowerCase()}}</span>
        </div>
        <div class="option-to-select"
             v-for="option in options"
             @click="onChangeOption(option)"
        >
          <span class="list-option-text">{{option}}</span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {
    name: "CustomSelect",
    data() {
      return {
        selectedOption: this.selected,
        showList: false
      }
    },
    props: {
      options: {
        type: Array,
        required: true
      },
      optionType: {
        type: String,
        required: true
      },
      selected: {
        type: String,
        required: false,
        default: ''
      }
    },
    methods: {
      onChangeOption(option) {
        if(option === null){
          this.selectedOption = "Aucune " + this.optionType.toLowerCase() ;
        }
        else{
          this.selectedOption = option;
        }
        this.$parent.$emit('set-option-selection', option);
        this.showList = false;
      }
    },
    watch: {
      selected: function (val) {
        this.selectedOption = val || null;
      }
    },
  }
</script>

<style scoped>

  .custom-select {

  }

  .selected-option-display {
    width: 100%;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    margin-left: 5px;
  }

  .selected-option-text {
    margin-left: 3px;
  }

  .list-option-text {
    margin-left: 3px;
  }

  .select-box {
    width: 100%;

    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    background: white;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
  }

  .options-list {
    z-index: 999;
    position: absolute;
    width: 180px;
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    background: white;

    max-height: 155px;
    overflow-y: auto;
  }

  .options-list:hover {
    cursor: pointer;
  }

  .option-to-select {
    text-align: left;

    margin: 2px 0px 2px 0px;
    padding: 2px;
    border-bottom: 1px solid rgb(217, 217, 217);
  }

  .option-to-select:hover {
    background: #00000033;

    cursor: pointer;
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


</style>
