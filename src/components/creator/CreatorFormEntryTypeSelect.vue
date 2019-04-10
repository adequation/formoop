<template>
  <div class="type-select">

    <div class="select-box" @click="showList = !showList" title="Type de réponse">

      <div class="selected-type-option-display" v-if="typeSelected">

          <i v-if="typeSelected.value === 'radio'" class="material-icons md-20" >radio_button_checked</i>
          <i v-if="typeSelected.value === 'text'" class="material-icons md-20" >short_text</i>
          <i v-if="typeSelected.value === 'textarea'" class="material-icons md-20" >subject</i>
          <i v-if="typeSelected.value === 'checkbox'" class="material-icons md-20" >check_box</i>
          <i v-if="typeSelected.value === 'select'" class="material-icons md-20" >arrow_drop_down_circle</i>

        <span class="selected-type-text">{{typeSelected.displayName}}</span>

      </div>
      <span v-else>Type réponse</span>

      <i class="material-icons" @click.stop="" @click="showList = !showList">keyboard_arrow_down</i>

    </div>


    <transition name="accordion-fade-slide" mode="out-in">
      <div class="types-list" v-if="showList">

        <div class="type-to-select"
             v-for="t in types"
             @click="onChangeType(t)"
        >
          <div class="list-type-option-display" >
          <i v-if="t.value === 'radio'" class="material-icons md-20" @click.stop="">radio_button_checked</i>
          <i v-if="t.value === 'text'" class="material-icons md-20" @click.stop="">short_text</i>
          <i v-if="t.value === 'textarea'" class="material-icons md-20" @click.stop="">subject</i>
          <i v-if="t.value === 'checkbox'" class="material-icons md-20" @click.stop="">check_box</i>
          <i v-if="t.value === 'select'" class="material-icons md-20" @click.stop="">arrow_drop_down_circle</i>
            <span class="list-type-text">{{t.displayName}}</span>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {
    name: "CreatorFormEntryTypeSelect",
    data() {
      return {
        typeSelected: this.type,
        showList: false
      }
    },
    props: {
      types: {
        type: Array,
        required: true
      },
      type: {
        type: Object,
        required: true
      },
      entryID: {
        type: String,
        required: true
      }
    },
    methods: {
      onChangeType(type) {
        this.typeSelected = type;
        this.showList = false;
        this.setEntryType(type.value);
      },
      setEntryType(type) {
        this.$root.$emit('set-entry-type', this.entryID, type);
      },
    }
  }
</script>

<style scoped>

  .type-select {
    width: 180px;
    margin-top: 0.5em;
    margin-right: auto;
    margin-left: auto;
  }


  .selected-type-option-display {
    width: 100%;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
    margin-left: 2px;
  }

  .selected-type-text{
    margin-left: 3px;
  }

  .list-type-option-display {
    width: 100%;
    display: inline-flex;
    vertical-align: middle;
    align-items: center;
  }

  .list-type-text{
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

  .types-list {
    position: absolute;
    width: 180px;
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    background: white;

    max-height: 155px;
    overflow-y: auto;
  }

  .types-list:hover {
    cursor: pointer;
  }

  .type-to-select {
    text-align: left;

    margin: 2px 0px 2px 0px;
    padding: 2px;
    border-bottom: 1px solid rgb(217, 217, 217);
  }

  .type-to-select:hover {
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
