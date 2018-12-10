<template>
  <div class="formEntry">
    <form>
      <div>
        <input title="" type="text" class="questionTitle" v-model="entry.question.title" placeholder="Titre de la question"/>
        <select title=""  @change="onChange($event.target)">
          <option v-for="(t, i) in types"
                  :key="i"
                  :name="t.value"
                  :value="t.value"
                  :selected="t.value === entry.type">
            {{t.displayName}}
          </option>
        </select>
      </div>
      <CreatorAnswer :answers="entry.answers" :types="types" :type="entry.type" :entryID="entry.id"></CreatorAnswer>
      <button type="button" @click="deleteEntry">Supprimer la question</button>
    </form>
  </div>
</template>

<script>
  import CreatorAnswer from './CreatorAnswer'

  export default {
    name: 'CreatorFormEntry',
    components: {CreatorAnswer},
    props: {
      entry: {
        type: Object,
        required: true
      }
    },
    data() {
      return {

        // fetch types into FB later
        types: [
          {value: 'radio', displayName: 'Choix multiples'},
          {value: 'text', displayName: 'Réponse courte'},
          {value: 'textarea', displayName: 'Paragraphe'},
          {value: 'checkbox', displayName: 'Cases à cocher'},
          {value: 'select', displayName: 'Liste déroulante'}
        ]
      }
    },
    methods: {
      onChange (target) {
        this.setEntryType(target.value);
      },
      setEntryType (type) {
        this.$parent.$emit('set-entry-type', this.entry.id, type)
      },
      deleteEntry(){
        this.$parent.$emit('delete-entry', this.entry.id);
      }
    },
  }
</script>

<style scoped>
  .formEntry {
    background-color: #f6f6f6;
    margin: 1em;
    border: 1px solid #00000020;
    padding: 0.5em;
  }

</style>
