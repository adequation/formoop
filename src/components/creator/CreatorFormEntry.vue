<template>
  <div class="full-entry-wrapper">

    <div class="creator-form-entry smooth"
         :style="{ borderLeft: `10px solid ${borderColor}`}">

      <CustomSelect :options="formSections" :optionType="optionType" :selected="entry.section" class="section-select"/>

      <div class="creator-form-entry-tools-wrapper">


        <div :class="[opened ? 'form-entry-title-opened' : 'form-entry-title-closed']">
          <h3 v-if="!opened">
            <span v-if="entry.generic">{{getGenericTitle(entry.question.blocks)}}</span>
            <span v-else>{{entry.question.title}}</span>

            <span v-if="entry.required" class="form-entry-required">*</span>
          </h3>

          <div v-else @click.stop>
            <CreatorGenericQuestionBlock v-if="entry.generic" :entry="entry"/>
            <input v-else title="" type="text" class="question-title" v-model="entry.question.title"
                   placeholder="Titre de la question"/>
          </div>

        </div>


        <button type="button"
                :class="['creator-form-entry-requirement', entry.required ? 'creator-form-entry-required' : 'creator-form-entry-not-required']"
                title="Rendre important"
                @click="onChangeRequirement"
                @click.stop>*
        </button>

      </div>

      <transition
        name="expand"
        @enter="expandEnter"
        @afterEnter="expandAfterEnter"
        @beforeLeave="expandBeforeLeave"
      >
        <div v-if="opened" @click.stop>

          <CreatorFormEntryTypeSelect :types="types" :type="defaultEntryType" :entryID="entry.id"/>

          <CreatorAnswer :answers="entry.answers" :types="types" :type="entry.type" :entryID="entry.id"></CreatorAnswer>

          <button type="button" @click="deleteEntry">Supprimer la question</button>
        </div>

      </transition>

    </div>
  </div>
</template>

<script>
  import CreatorAnswer from './CreatorAnswer'
  import Collapse from '@/components/containers/Collapse'
  import CreatorGenericQuestionBlock from "@/components/creator/CreatorGenericQuestionBlock";
  import CreatorFormEntryTypeSelect from "@/components/creator/CreatorFormEntryTypeSelect";
  import {getGenericQuestionTitle} from "@/helpers/genericQuestionHelpers";
  import {getSectionColor} from "@/helpers/sectionsHelpers";
  import expandAnimationMixin from "@/mixins/expandAnimationMixin";
  import CustomSelect from "../general/CustomSelect";

  export default {
    name: 'CreatorFormEntry',
    components: {CustomSelect, CreatorFormEntryTypeSelect, CreatorGenericQuestionBlock, CreatorAnswer, Collapse},
    mixins: [expandAnimationMixin],
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
      },
      currentSection: {
        type: String,
        required: false,
        default: ''
      }
    },
    data() {
      return {
        // maybe put the types into FB later
        types: [
          {value: 'radio', displayName: 'Choix multiples'},
          {value: 'text', displayName: 'Réponse courte'},
          {value: 'textarea', displayName: 'Paragraphe'},
          {value: 'checkbox', displayName: 'Cases à cocher'},
          {value: 'select', displayName: 'Liste déroulante'}
        ],
        optionType: "Section"
      }
    },
    computed: {
      borderColor() {
        return getSectionColor(this.currentSection, this.formSections) || '#aaaaaa';
      },
      defaultEntryType() {
        return this.types.find(t => {
          if (t.value === this.entry.type) return t
        })
      }
    },
    methods: {
      onChange(target) {
        this.setEntryType(target.value);
      },
      setEntryType(type) {
        this.$parent.$emit('set-entry-type', this.entry.id, type);
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
      },
    },
    mounted() {
      this.$root.$emit('mounted-entry', this.entry.id);
    },
    created(){
      this.$on('set-option-selection', option => {
        this.setEntrySection(option)
      });
    }
  }
</script>

<style scoped>

  @import '../../style/animations.css';

  .creator-form-entry {
    position: relative;
    background-color: #f6f6f6;
    margin: 0.5em auto;
    padding: 0.3em;
    width: 85%;

    border-left: 7px solid #aaaaaa;
  }

  .creator-form-entry:hover {
    cursor: pointer;
    width: 87%;
    margin: 0.7em auto;
    padding: 0.5em;
  }

  .form-entry-title-closed {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .form-entry-title-opened {
    margin-top: 2em;
  }

  .creator-form-entry-tools-wrapper {
    width: auto;

    padding-left: 2em;
    padding-right: 2em;

  }

  .creator-form-entry-requirement {
    position: absolute;
    top:0;
    right: 0;
    background: none;
    border: none;
  }

  .form-entry-required {

    color: tomato;
    font-weight: bold;
    font-size: 30px;
  }

  .question-title{
    width: 175px;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1em;
    text-align: center;
    color: #2c3e50;
  }

  .creator-form-entry-required {
    color: tomato;
    font-weight: bold;
    font-size: 60px;
  }

  .creator-form-entry-required:hover {
    color: #dc472f;
    cursor: pointer;
  }

  .creator-form-entry-not-required {
    color: lightslategrey;
    font-weight: bold;
    font-size: 60px;
  }

  .creator-form-entry-not-required:hover {
    color: #5f6c7a;
    cursor: pointer;
  }

  .section-select{
    position: absolute;
    top: 0;
    left: 0;
    width: 180px;
    margin-top: 0.5em;
    margin-right: auto;
    margin-left: 10px;
  }


</style>
