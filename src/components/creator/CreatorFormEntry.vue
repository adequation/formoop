<template>

  <div class="creator-form-entry smooth"
       :style="{ borderLeft: `10px solid ${borderColor}`}">

    <h3 class="form-entry-title">
      <span v-if="entry.generic">{{getGenericTitle(entry.question.blocks)}}</span>
      <span v-else>{{entry.question.title}}</span>

      <span v-if="entry.required" class="form-entry-required">*</span>
    </h3>

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

    <div v-if="opened">
      <div class="creator-form-entry-tools-wrapper">
        <div class="creator-form-entry-section-select">

        </div>

        <button type="button"
                :class="['creator-form-entry-requirement', entry.required ? 'creator-form-entry-required' : 'creator-form-entry-not-required']"
                title="Rendre important"
                @click="onChangeRequirement">*
        </button>
      </div>


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

      <CreatorAnswer :answers="entry.answers" :types="types" :type="entry.type" :entryID="entry.id"></CreatorAnswer>

      <button type="button" @click="deleteEntry">Supprimer la question</button>
    </div>



  </div>

</template>

<script>
  import CreatorAnswer from './CreatorAnswer'
  import Collapse from '@/components/containers/Collapse'
  import CreatorGenericQuestionBlock from "@/components/creator/CreatorGenericQuestionBlock";
  import {getGenericQuestionTitle} from "@/helpers/genericQuestionHelpers";
  import {getSectionColor} from "@/helpers/sectionsHelpers";

  export default {
    name: 'CreatorFormEntry',
    components: {CreatorGenericQuestionBlock, CreatorAnswer, Collapse},
    props: {
      entry: {
        type: Object,
        required: true
      },
      opened: {
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
    computed: {
      borderColor(){
        return getSectionColor(this.entry.section, this.formSections) || '#aaaaaa';
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
      onChangeRequirement() {
        this.setEntryRequirement(!this.entry.required);
      },
      setEntryRequirement(requirement) {
        this.$parent.$emit('set-entry-requirement', this.entry.id, requirement);
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

  .creator-form-entry {
    position: relative;
    background-color: #f6f6f6;
    margin: 0.5em auto;
    padding: 0.3em;
    width: 85%;

    border-left: 7px solid #aaaaaa;
  }

  .creator-form-entry:hover{
    cursor: pointer;
    transform: scale(1.01);
  }


  .form-entry-title {

  }


  .creator-form-entry-tools-wrapper {
    width: auto;

    padding-left: 2em;
    padding-right: 2em;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .creator-form-entry-requirement {
    background: none;
    border: none;
  }

  .form-entry-required {
    color: tomato;
    font-weight: bold;
    font-size: 30px;
  }

  .creator-form-entry-required {
    color: tomato;
    font-weight: bold;
    font-size: 60px;
  }

  .creator-form-entry-required:hover {
    color: #dc472f;
  }

  .creator-form-entry-not-required {
    color: lightslategrey;
    font-weight: bold;
    font-size: 60px;
  }

  .creator-form-entry-not-required:hover {
    color: #5f6c7a;

  }

</style>
