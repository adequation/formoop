<template>
  <Collapse class="form-entry" :initialy-opened="initialyOpened" :showArrow="true">

    <div slot="header">
      <h3 class="form-entry-title" v-if="entry.generic">{{getGenericTitle(entry.question.blocks)}}</h3>
      <h3 class="form-entry-title" v-else>{{entry.question.title}}</h3>
    </div>

    <form slot="body" class="form-entry-content">

      <div>

        <CreatorGenericQuestionBlock v-if="entry.generic" :entry="entry"/>
        <input v-else title="" type="text" class="questionTitle" v-model="entry.question.title"
               placeholder="Titre de la question"/>

        <select title="" @change="onChange($event.target)">
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

      <select title="" @change="onChangeSection($event.target)">
        <option value="-1">Aucune</option>
        <option v-for="t in formSections"
                :key="t"
                :name="t"
                :value="t"
                :selected="t === entry.section">
          {{t}}
        </option>
      </select>

      <button type="button" @click="deleteEntry">Supprimer la question</button>

    </form>
  </Collapse>

</template>

<script>
  import CreatorAnswer from './CreatorAnswer'
  import Collapse from '@/components/containers/Collapse'
  import CreatorGenericQuestionBlock from "@/components/creator/CreatorGenericQuestionBlock";
  import {getGenericQuestionTitle} from "@/helpers/genericQuestionHelpers";

  export default {
    name: 'CreatorFormEntry',
    components: {CreatorGenericQuestionBlock, CreatorAnswer, Collapse},
    props: {
      entry: {
        type: Object,
        required: true
      },
      initialyOpened: {
        type: Boolean,
        required: false
      },
      formSections: {
        type: Array,
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
      onChange(target) {
        this.setEntryType(target.value);
      },
      setEntryType(type) {
        this.$parent.$emit('set-entry-type', this.entry.id, type);
      },
      onChangeSection(target) {
        this.setEntrySection(target.value);
      },
      setEntrySection(section) {
        this.$parent.$emit('set-form-section', this.entry.id, section);
      },
      deleteEntry() {
        this.$parent.$emit('delete-entry', this.entry.id);
      },
      getGenericTitle(blocks) {
        return getGenericQuestionTitle(blocks);
      }
    },
    mounted() {
      this.$root.$emit('mounted-entry', this.entry.id);
    }
  }
</script>

<style scoped>
  .form-entry {
    margin-top: 0.2em;
  }

  .form-entry-title {

  }

  .form-entry-content {

  }

</style>
