<template>
  <div>
    <form>

      <div class="option" v-for="(a,i) in answers" :key="i">

      <span>
        <input v-if="type==='radio'" title="" type="radio" checked @click="disableClick($event)"/>
        <input v-if="type==='checkbox'" title="" type="checkbox" checked @click="disableClick($event)"/>
        <span v-if="type==='select'">⌄</span>
      </span>

        <span>
        <input title="" type="text" :value="a.text" v-on:input="optionTextOnChange($event.target, a.id)"/>
      </span>

        <span>
        <button class="option-button delete-option-button" :id="'deleteButton' + i" type="button" @click="deleteOption(a.id)">✖</button>
      </span>

      </div>

      <div class="fake-option">

      <span>
        <input v-if="type==='radio'" title="" type="radio"  @click="disableClick($event)"/>
        <input v-if="type==='checkbox'" title="" type="checkbox"  @click="disableClick($event)"/>
        <span v-if="type==='select'">⌄</span>
      </span>

        <span>
        <input title="" disabled type="text" value=". . ." @click="addOption"/>
      </span>

        <span>
              <button class="option-button add-option-button" @click="addOption" type="button">✚</button>
      </span>

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
        defaultOption: {id: "", text: 'Option '},
      }
    },
    methods: {

      addOption() {
        const newAnswer = {id: uuid.v4(), text: this.defaultOption.text.concat('' + (this.answers.length + 1))};
        this.$root.$emit('add-entry-answer', this.entryID, newAnswer);
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
      }

    }
  }
</script>

<style scoped>

  .option {
    margin-top: 0.5em;
  }

  .fake-option {
    margin-top: 0.5em;
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

    outline-style:none;
    box-shadow:none;
  }

  .delete-option-button {
  }

  .delete-option-button:hover {
    color: rgba(255, 0, 0, 0.75);
  }

  .add-option-button {
    margin-top: 0.1em;
  }

  .add-option-button:hover {
    color: rgba(75, 200, 0, 0.75);
  }
</style>
