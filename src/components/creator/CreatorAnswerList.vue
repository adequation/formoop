<template>
  <div>
    <form>

      <div class="option" v-for="(a,i) in answers" :key="i">

      <span>
        {{getSymbol(type)}}
      </span>

        <span>
          <input title="" type="text" :value="a.text" v-on:input="optionTextOnChange($event.target, a.id)"/>
        </span>

        <span>
          <button id="deleteOptionButton" type="button" @click="deleteOption(a.id)">Supprimer l'option </button>
        </span>

      </div>

      <button id="addOptionButton" @click="addOption" type="button">Ajouter une option</button>

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
      getSymbol(type) {
        const icons = {default: 'x', radio: 'o', checkbox: '[x]', select: '>'};
        return icons[type] ? icons[type] : icons['default'];
      },
      addOption() {
        const newAnswer = {id: uuid.v4(), text: this.defaultOption.text.concat('' + (this.answers.length + 1))};
        this.$root.$emit('add-entry-answer', this.entryID, newAnswer);
      },
      editOption(optionID, optionText) {
        this.$root.$emit('edit-entry-option', this.entryID, optionID, optionText)
      },
      deleteOption(optionID) {
        if(this.answers.length > 1)
        this.$root.$emit('delete-entry-option', this.entryID, optionID);
      },
      optionTextOnChange(target, optionID) {
        this.editOption(optionID, target.value)
      }

    }
  }
</script>

<style scoped>

</style>
