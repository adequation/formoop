<template>
  <div>
    <form>

      <div class="option" v-for="(a,i) in answers" :key="i">
        <div class="change-option-position-button-container">
          <button class="change-option-position-button" type="button" @click="optionGoUp(a.id, i)" :disabled="i === 0">
            <i class="material-icons md-16">keyboard_arrow_up</i>
          </button>
          <button class="change-option-position-button" type="button" @click="optionGoDown(a.id, i)"
                  :disabled="i === answers.length-1">
            <i class="material-icons md-16">keyboard_arrow_down</i>
          </button>
        </div>


        <span class="option-type-identifier">
          <i v-if="type==='checkbox'" class="material-icons md-16">check_box_outline_blank</i>
          <i v-if="type==='radio'" class="material-icons md-16">radio_button_unchecked</i>
          <i v-if="type==='select'" class="material-icons md-16">keyboard_arrow_right</i>
        </span>

        <input class="option-list-input" title="" ref="optionList" type="text" :value="a.text"
               v-on:input="optionTextOnChange($event.target, a.id)" @keyup.enter="addOption(i)"/>

        <button class="option-button delete-option-button" type="button" title="Supprimer l'option"
                @click="deleteOption(a.id)">
          <i class="material-icons md-16">clear</i>
        </button>

      </div>

      <div class="fake-option">
        <div class="space-fake-option">

        </div>

        <span class="option-type-identifier">
          <i v-if="type==='checkbox'" class="material-icons md-16">check_box_outline_blank</i>
          <i v-if="type==='radio'" class="material-icons md-16">radio_button_unchecked</i>
          <i v-if="type==='select'" class="material-icons md-16">keyboard_arrow_right</i>
        </span>

        <input class="new-option-input" ref="newOption" type="text" title="Ajouter une option"
               placeholder="Ajouter une option" v-model="newOptionText"
               @keyup.enter="addOption(answers.length-1)"/>

        <button class="option-button add-option-button" title="Ajouter une option"
                @click="addOption(answers.length-1)" type="button">
          <i class="material-icons md-16">add</i>
        </button>

      </div>

    </form>
  </div>
</template>

<script>
  import * as uuid from "uuid";

  export default {
    name: 'CreatorAnswerList',
    props: {
      answers: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      entryID: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        //default id is never used
        defaultOption: {id: "", text: 'Option'},
        newOptionText: ''
      }
    },
    methods: {
      addOption(optionIndex) {
        const newOptionIndex = optionIndex + 1;

        if (this.newOptionText) {
          this.addOptionWithText(newOptionIndex);
        } else this.addNewOption(newOptionIndex);
      },


      addOptionWithText(newOptionIndex) {
        const newAnswer = {id: uuid.v4(), text: this.newOptionText};

        this.newOptionText = '';

        this.$root.$emit('add-entry-answer', this.entryID, newAnswer, newOptionIndex);

        this.$nextTick(() => {
          this.$refs.newOption.select()
        });
      },

      addNewOption(newOptionIndex) {
        const newAnswer = {id: uuid.v4(), text: this.defaultOption.text};

        this.$root.$emit('add-entry-answer', this.entryID, newAnswer, newOptionIndex);

        this.$nextTick(() => {
          this.$refs.optionList[newOptionIndex].select()
        });
      },


      editOption(optionID, optionText) {
        this.$root.$emit('edit-entry-option', this.entryID, optionID, optionText)
      },

      deleteOption(optionID) {
        if (this.answers.length > 1)
          this.$root.$emit('delete-entry-option', this.entryID, optionID);
      },

      optionTextOnChange(target, optionID) {
        this.editOption(optionID, target.value)
      },

      disableClick(e) {
        e.preventDefault();
      },

      optionGoUp(optionID, optionIndex) {
        this.$root.$emit('option-change-index', this.entryID, optionIndex, optionIndex - 1);
      },

      optionGoDown(optionID, optionIndex) {
        this.$root.$emit('option-change-index', this.entryID, optionIndex, optionIndex + 1);
      }

    }
  }
</script>

<style scoped>

  .option {


    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2px;
  }

  .fake-option {

    width: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 2px;
  }

  input[type=text] {
    background: none;
    border: none;
    border-bottom: 1px solid lightgrey;
    font-size: large;
  }

  button.option-button {
    background: none;
    color: rgba(0, 0, 0, 0.4);
    font-size: large;
    border: none;

    outline-style: none;
    box-shadow: none;
  }

  .delete-option-button {
  }

  .delete-option-button:hover {
    color: tomato;
    cursor: pointer;
  }

  .add-option-button {
    margin-top: 0.1em;
  }

  .add-option-button:hover {
    color: #2d8246;
    cursor: pointer;
  }


  .option-list-input {
    color: #2c3e50;
    outline: none;
  }

  .new-option-input {
    color: #00000077;
    outline: none;
  }

  .new-option-input::placeholder {
    color: #00000077;
  }

  .option-type-identifier {
    color: rgba(0, 0, 0, 0.4);
    margin: 0.2em;
  }


  .change-option-position-button {
    background: none;
    color: rgba(0, 0, 0, 0.7);
    font-size: large;
    border: none;

    outline-style: none;
    box-shadow: none;
    display: block;
  }

  .change-option-position-button:hover {
    cursor: pointer;
  }

  .change-option-position-button:disabled {
    color: rgba(0, 0, 0, 0.3);
    cursor: default;
  }

  .space-fake-option{
    margin:1em;
  }
</style>
