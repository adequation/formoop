<template>
  <div class="creator-form">

    <DockingMenu class="creator-form-top-menu"
                 ref="top-menu"
                 top>
      <div slot="body">
        <Tabs :current-tab="currentTab" :tabs="tabs" @change-tab="changeTab($event)"/>

      </div>
    </DockingMenu>

    <div class="creator-form-header"></div>

    <div class="form-delete-button" title="Supprimer le formulaire">
      <i class="material-icons md-48" role="button" @click.stop=""
         @click="deleteForm">clear</i>
    </div>

    <!-- ////////////////////////////////////////// CREATE AREA ////////////////////////////////////////// !-->

    <div v-if="currentTab === 'create'">

      <input title="" type="text" class="creator-form-title" v-model="formTitle" placeholder="Titre du formulaire"/>


      <div v-for="(entry, i) in formEntries">
        <!--<div v-if="i <= 0">
          <div v-for="label in labels" v-if="label.under < 0">
            <button type="button" @click="addLabel(i)">+label</button>
            <CreatorFormLabel :label="label"/>
          </div>
        </div>!-->

        <div
             :key="entry.id"
             @click="focusEntry(entry)"
             :ref="`top_${entry.id}`"
             :class="['smooth', {focusedEntry: focusedEntry ? focusedEntry.id === entry.id : false}]">

          <CreatorFormEntry
            :key="entry.id"
            :entry="entry"
            :opened="focusedEntry ? focusedEntry.id === entry.id : false"
            :ref="entry.id"
            :formSections="formSections"
            :currentSection="entry.section"
          />
        </div>

        <!--<div class="label-buttons-wrapper">
          <div class="smooth add-label-button-left" title="ajouter un label" @click="addLabel(i)"></div>
          <div class="smooth add-label-button-right" title="ajouter un label" @click="addLabel(i)"></div>
        </div>


        <div v-if="!!labels.find(l => l.under === i)">
          <div v-for="label in labels" v-if="label.under === i">
            <CreatorFormLabel :label="label"/>
          </div>
        </div>!-->
      </div>

      <div class="fake-entry">
        <div @click="addEntry(false)"><i class="material-icons md-48">add_circle</i></div>
        <div @click="addEntry(true)"><i class="material-icons md-48">info</i></div>
      </div>


      <div class="creator-form-footer"></div>
    </div>

    <!-- ////////////////////////////////////////// SORT AREA ////////////////////////////////////////// !-->

    <div class="sorting-tab" v-if="currentTab === 'sort'">

      <div class="sorting-section-grid-wrapper">
        <CustomGrid
          ref="sectionSortingGrid"
          :center="false"
          :draggable="true"
          :sortable="true"
          :items="formSections"
          :cell-width="80"
          :cell-height="80"
          @change="gridChange"
          @remove="gridRemove"
          @click="gridClick"
          @sort="gridSort">
          <template slot="cell" slot-scope="props">
            <div
              :item="props.item"
              :index="props.index"
              @remove="props.remove()">

              <CustomGridSection
                :section="props.item"
                :index="props.index"
                :cell-width="props.cellWidth"
                :cell-height="props.cellHeight"
                :padding="2"
                :color="getGridSectionColor(props.item)"/>

            </div>

          </template>
        </CustomGrid>
      </div>

      <hr/>

      <div class="sorting-grid-wrapper">
        <CustomGrid
          ref="entrySortingGrid"
          :center="false"
          :draggable="true"
          :sortable="true"
          :items="formEntries"
          :cell-width="112"
          :cell-height="62"
          @change="gridChange"
          @remove="gridRemove"
          @click="gridClick"
          @sort="gridSort">
          <template slot="cell" slot-scope="props">
            <div
              :item="props.item"
              :index="props.index"
              @remove="props.remove()">

              <CustomGridEntry
                :entry="props.item"
                :index="props.index"
                :cell-width="props.cellWidth"
                :cell-height="props.cellHeight"
                :padding="2"
                :color="getEntryColor(props.item)"/>

            </div>

          </template>
        </CustomGrid>
      </div>


      <button type="button" @click="gridRetreiveSortedItems">Trier !</button>
    </div>


    <!-- ////////////////////////////////////////// SHARE AREA ////////////////////////////////////////// !-->

    <div v-if="currentTab === 'share'">
      <CreatorFormShareTab :isPublished="isPublished"
                           :form-entries="formEntries"
                           :publishing-campaigns="publishingCampaigns"
                           :save-form="saveForm"
                           :form-title="formTitle"
                           :entryPoints="entryPoints"/>
    </div>

    <!-- ////////////////////////////////////////// CAMPAIGNS AREA ////////////////////////////////////////// !-->

    <div v-if="currentTab === 'campaigns'">

      <CreatorCampaignSelect/>

    </div>

    <div v-else>

    </div>

    <DockingMenu class="creator-form-bottom-menu">
      <div slot="body">

        <div class="creator-form-buttons-wrapper">

          <div class="creator-form-entry-buttons-wrapper">
            <button type="button" class="creator-form-entry-button"
                    @click="addEntry(false)" title="Ajouter une question">
              <i class="material-icons md-36">add_box</i>
            </button>

            <button type="button" class="creator-form-entry-button"
                    @click="addEntry(true)" title="Ajouter une question générique">
              <i class="material-icons md-36">ballot</i>
            </button>

            <div class="vertical-separator"></div>


            <div class="creator-form-sections-buttons-wrapper">
              <input title="" type="text" placeholder="Nom de la section" class="creator-section-name-input"
                     v-model="newSection"
                     v-on:keyup.enter="addSection"/>

              <button type="button" class="creator-form-section-button"
                      @click="addSection" title="Créer une nouvelle Section">
                <i class="material-icons md-36">create_new_folder</i>
              </button>
            </div>

          </div>

          <div class="creator-form-utils-buttons-wrapper">
            <button type="button" @click="saveForm" class="creator-form-save-button md-36"
                    title="Enregistrer le formulaire">
              <i class="material-icons md-36">save</i>
            </button>

          </div>
        </div>

      </div>
    </DockingMenu>

  </div>
</template>

<script>
  import * as uuid from "uuid";

  import CreatorFormEntry from './CreatorFormEntry'
  import * as Firebase from "firebase";
  import {saveAndFilterCampaignsFB, saveCreatorFormFB} from "@/thunks/creatorForm";
  import {getCreatedFormFromID} from "@/helpers/firebaseHelpers";
  import CreatorPublication from "@/components/creator/CreatorPublication";
  import DockingMenu from "@/components/containers/DockingMenu";
  import CreatorCampaignSelect from "@/components/creator/CreatorCampaignSelect";
  import {isFormGeneric} from "@/helpers/genericQuestionHelpers";
  import Drawer from "@/components/containers/Drawer";
  import CustomGrid from "@/components/containers/CustomGrid/CustomGrid";
  import {getSectionColor} from "@/helpers/sectionsHelpers";
  import CustomGridEntry from "@/components/containers/CustomGrid/CustomGridEntry";
  import Tabs from "@/components/containers/Tabs";
  import CustomGridSection from "@/components/containers/CustomGrid/CustomGridSection";
  import autoScrollMixin from "@/mixins/autoScrollMixin";
  import CreatorFormShareTab from "@/components/creator/formTabs/CreatorFormShareTab";
  import CreatorFormLabel from "@/components/creator/CreatorFormLabel";
  import {saveCreatedFormsFB, saveFormCampaignsFB, savePublishedFormsFB} from "@/thunks/creatorForm"
  import {deleteFormFromCreated, deleteFormFromPublished, deleteFormFromCampaigns} from "@/helpers/creatorHelpers";

  export default {
    name: 'CreatorForm',
    mixins: [autoScrollMixin],
    components: {
      CreatorFormLabel,
      CreatorFormShareTab,
      CustomGridSection,
      Tabs,
      CustomGridEntry,
      CustomGrid, Drawer, CreatorPublication, CreatorFormEntry, DockingMenu, CreatorCampaignSelect
    },
    data() {
      return {
        focusedEntry: null,
        formEntries: [],
        labels: [],
        defaultFormEntry: {
          question: {title: ''},
          type: 'radio',
          answers: [],
          initialyOpened: true //Opened collapse by default
        },
        defaultQuestion: {title: 'Titre de la question'},
        defaultAnswers: [{id: "", text: 'Option'}],
        formTitle: 'Formulaire sans titre',
        defaultFormTitle: 'Formulaire sans titre',
        showDrawer: false,
        newSection: null,
        formSections: [],
        currentSections: [],
        publishingCampaigns: [],
        tabs: [
          {title: 'Créer', value: 'create', icon: 'edit'},
          {title: 'Paramétrer', value: 'sort', icon: 'settings'},
          {title: 'Campagnes', value: 'campaigns', icon: 'insert_chart'},
          {title: 'Partager', value: 'share', icon: 'share'},
        ],
        currentTab: 'create',

        //boolean to check if we scroll down on a new entry or not
        firstMount: true
      }
    },
    methods: {

      changeTab(newTab) {
        if (this.currentTab === newTab) return;

        this.firstMount = true; //prevent a full scroll down on tab change
        this.currentTab = newTab;

      },

      gridClick({items, index}) {
        const value = items.find(v => v.index === index);
        this.selected = value.item;
      },

      gridChange(event) {
      },

      gridRemove(itemIndex) {
        this.items.splice(itemIndex, 1);
      },

      gridSort(event) {
      },

      gridRetreiveSortedItems() {
        this.formEntries = this.$refs.entrySortingGrid.getListClone();
        this.formSections = this.$refs.sectionSortingGrid.getListClone();

      },

      getEntryColor(entry) {
        return getSectionColor(entry.section, this.formSections) || '#aaaaaa';
      },
      getGridSectionColor(section) {
        return getSectionColor(section, this.formSections) || '#aaaaaa';
      },

      closeDrawer() {
        this.showDrawer = false;
      },

      focusEntry(entry, scroll = true) {
        if (!entry) return;

        if (this.focusedEntry) {

          if (this.focusedEntry.id === entry.id) this.focusedEntry = null;
          else this.focusedEntry = entry;

        } else this.focusedEntry = entry;

        if (scroll) this.scrollToFocused(this.$refs[`top_${entry.id}`][0]);
      },

      getNextEntry(currentEntry) {
        if (!currentEntry) return null;

        const currentEntryIndex = this.formEntries.findIndex(fe => fe.id === currentEntry.id);

        if (currentEntryIndex >= 0 && currentEntryIndex < this.formEntries.length - 1)
          return this.formEntries[currentEntryIndex + 1];

        return null;
      },

      getPreviousEntry(currentEntry) {
        if (!currentEntry) return null;

        const currentEntryIndex = this.formEntries.findIndex(fe => fe.id === currentEntry.id);

        if (currentEntryIndex > 0 && currentEntryIndex < this.formEntries.length)
          return this.formEntries[currentEntryIndex - 1];

        return null;
      },

      disableClick(e) {
        e.preventDefault();
      },

      addLabel(under){
        const id = uuid.v4();

        const label = {
          title: 'Séparateur !',
          content: 'Avec du contenu !',
          id,
          under
        };

        //this.labels.push(label);
      },

      addEntry(generic) {
        const id = uuid.v4();

        const entry = {
          ...this.defaultFormEntry,
          question: {...this.defaultQuestion},
          answers: [...this.defaultAnswers.map(a => ({...a, id: uuid.v4()}))],
          id,
        };

        if (generic) {
          entry.genericProperty = '';
          entry.generic = true;
          entry.question.blocks = [
            {
              id: uuid.v4(),
              type: 'text',
              content: "Une question avec"
            },
            {
              id: uuid.v4(),
              type: 'variable',
              content: "variable"
            }
          ];
        }

        //copy default answer array, and generate new option ids
        this.formEntries.push(entry);

        this.firstMount = false;
      },

      addFormEntryAnswer(id, answer, newOptionIndex) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.answers.splice(newOptionIndex, 0, answer);
          this.formEntries = tmp;
        }

      },

      changeOptionIndex(id, optionIndex, newOptionIndex) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (!(optionIndex === 0 && newOptionIndex < 0)) {
          if (!(optionIndex === fe.answers.length - 1 && newOptionIndex >= fe.answers.length)) {
            if (fe) {
              const el = fe.answers[optionIndex];
              fe.answers.splice(optionIndex, 1, fe.answers[newOptionIndex]);
              fe.answers[newOptionIndex] = el;
              this.formEntries = tmp;
            }
          }
        }
      },

      setFormEntryType(id, type) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.type = type;
          this.formEntries = tmp;
        }
      },

      addSection() {
        if (this.formSections.includes(this.newSection)) {
          this.newSection = null;
          return;
        }
        if (this.newSection) this.formSections.push(this.newSection);
        this.newSection = null;
      },

      setFormEntrySection(id, section) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.section = section;
          this.formEntries = [...tmp];
        }
      },

      setFormEntryRequirement(id, requirement) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.required = requirement;
          this.formEntries = tmp;
        }
      },

      setFormPublishingCampaign(publishingCampaigns) {
        this.publishingCampaigns = publishingCampaigns;
      },

      setForm(form) {
        if (!form) {
          this.formEntries = [];
          this.formTitle = this.defaultFormTitle;
          this.currentSections = [];
          return;
        }
        this.formEntries = form.formEntries || [];
        this.formTitle = form.formTitle || this.defaultFormTitle;
        this.currentSections = form.currentSections || [];
      },

      async getFormFromFB(creatorID, formID) {
        await Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
          .once('value', (snapshot) => {
            const value = snapshot.val();
            if (value) {
              this.setForm({formEntries: value.entries, formTitle: value.title, currentSections: value.sections || []});
            } else {
              this.setForm(null);
            }
          })
      },

      //make sure that the form is ready to deploy
      validateEntries() {
        this.formEntries = this.formEntries.map((fe, i) => {
          delete fe.initialyOpened; // we remove the default state of the collapse

          return ({
            ...fe,
            question: {...fe.question, title: (fe.question.title || "Titre de la question " + (i + 1))},
            index: i
          })
        });
      },

      //save form into firebase
      //then reset data from what we saved on firebase to stay in sync
      async saveForm() {

        this.validateEntries();

        await saveCreatorFormFB(this.creatorID,
          this.formID,
          {
            id: this.formID,
            title: this.formTitle,
            entries: this.formEntries,
            sections: this.formSections || []
          });

        //if everything is done, we reset the form's data
        await this.getFormFromFB(this.creatorID, this.formID);

        //remove the form where we don't want it to be
        //and add it where it is not
        //if (!isFormGeneric(this.formEntries))
          saveAndFilterCampaignsFB({
            id: this.formID,
            title: this.formTitle
          }, this.formCampaigns, this.publishingCampaigns);

      },

      handleGlobalKeyDown(e) {
        switch (e.key) {
          case 'ArrowDown' :
            const nextEntry = this.focusEntry(this.getNextEntry(this.focusedEntry));
            if (nextEntry) this.focusEntry(nextEntry);
            e.preventDefault();
            break;
          case 'ArrowUp' :
            const previousEntry = this.getPreviousEntry(this.focusedEntry);
            if (previousEntry) this.focusEntry(previousEntry);
            e.preventDefault();
            break;
        }
      },


      deleteForm() {
        if (confirm(`Êtes vous sur de vouloir supprimer ce formoop?
                      \nAttention!
                      \nCelui-ci perdra ses questions, et sera supprimé des campagnes et des formoops publiés.
                      \nVous n'aurez plus accès aux réponse du formoop `)) {

          //delete from created forms
          const createdFormsChanged = deleteFormFromCreated(this.createdForms, this.formID);
          saveCreatedFormsFB(this.creatorID, createdFormsChanged);

          //delete from campaigns
          const campaignsChanged = deleteFormFromCampaigns(this.formCampaigns, this.formID);
          saveFormCampaignsFB(campaignsChanged);

          //delete published form
          const publishedFormsChanged = deleteFormFromPublished(this.publishedForms, this.formID);
          savePublishedFormsFB(publishedFormsChanged);

          this.$router.replace("/create");
        }
      }
    },
    created: function () {
      //when arriving, set the ID in the store from the router
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setCreatorID', {formID: null});
      this.$store.dispatch('setFormCampaigns');

      //global key press handling
      window.addEventListener('keydown', (e) => {
        this.handleGlobalKeyDown(e)
      });

      //emitting of a new entry
      this.$root.$on('add-entry-answer', (id, answer, newOptionIndex) => {
        this.addFormEntryAnswer(id, answer, newOptionIndex)
      });

      this.$root.$on('option-change-index', (id, optionIndex, newOptionIndex) => {
        this.changeOptionIndex(id, optionIndex, newOptionIndex);
      });


      //emitting the type of an entry
      this.$on('set-entry-type', (id, type) => {
        this.setFormEntryType(id, type)
      });

      //emitting the type of an entry
      this.$root.$on('set-entry-type', (id, type) => {
        this.setFormEntryType(id, type)
      });

      this.$on('set-form-section', (id, section) => {
        this.setFormEntrySection(id, section)
      });

      this.$on('set-entry-requirement', (id, requirement) => {
        this.setFormEntryRequirement(id, requirement)
      });

      this.$on('set-publishing-campaign', publishingCampaigns => {
        this.setFormPublishingCampaign(publishingCampaigns)
      });

      //when an entry is mounted
      this.$root.$on('mounted-entry', (id) => {
        //we don't want to be at the bottom of the page when arriving

        if (!this.firstMount) {
          this.focusEntry(this.formEntries.find(e => e.id === id), false);
          this.scrollTo(150);
        }

      });

      //emitting of a new entry option
      this.$root.$on('edit-entry-option', (entryID, optionID, optionText) => {
        const entryToEdit = this.formEntries.find(e => e.id === entryID);
        if (entryToEdit) {
          const optionToEdit = entryToEdit.answers.find(o => o.id === optionID);
          if (optionToEdit) {
            optionToEdit.text = optionText;
          }
        }
      });

      //emitting of the removal of a label
      this.$on('delete-label', (labelID) => {
        const tmp = [...this.labels];
        const labelToDeleteIndex = tmp.findIndex(l => l.id === labelID);
        if (labelToDeleteIndex >= 0) {
          tmp.splice(labelToDeleteIndex, 1);
          this.labels = tmp;
        }
      });

      //emitting of the removal of an entry
      this.$on('delete-entry', (entryID) => {
        const tmp = [...this.formEntries];
        const entryToDeleteIndex = tmp.findIndex(e => e.id === entryID);
        if (entryToDeleteIndex >= 0) {
          tmp.splice(entryToDeleteIndex, 1);
          this.formEntries = tmp;
        }
      });

      //emitting of the removal of an entry option
      this.$root.$on('delete-entry-option', (entryID, optionID) => {
        const entryToEdit = this.formEntries.find(e => e.id === entryID);
        if (entryToEdit) {
          const optionToDeleteIndex = entryToEdit.answers.findIndex(o => o.id === optionID);
          if (optionToDeleteIndex >= 0) {
            entryToEdit.answers.splice(optionToDeleteIndex, 1);
          }
        }
      });

      //retreive form
      this.getFormFromFB(this.creatorID, this.formID);

    },
    computed: {
      formID() {
        return this.$store.getters.getCreatorFormID
      },

      isPublished() {
        return !!this.$store.getters.publishedForms.find(pe => pe.id === this.formID) || this.hasPublishedGenericForms;
      },

      hasPublishedGenericForms(){
        if(this.containsGenericQuestion){
          return !!this.$store.getters.publishedForms.find(pe => pe.id.includes(this.formID));
        }

        return false;
      },

      containsGenericQuestion() {
        let containsGenericQuestion = false;

        this.formEntries.forEach(fe => {
          if (fe.generic) containsGenericQuestion = true;
        });

        return containsGenericQuestion;
      },

      entryPoints() {
        const publishedForm = this.$store.getters.publishedForms.find(pe => pe.id === this.formID);

        if (publishedForm) {
          if (publishedForm.entryPoint)
            return Object.keys(publishedForm.entryPoint).map(k => publishedForm.entryPoint[k]);
        }

        return [];
      },


      creatorID() {
        return this.$store.getters.creatorID;
      },

      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

      sections() {
        return this.currentSections;
      },

      publishedForms(){
        return this.$store.getters.publishedForms || [];
      },

      createdForms() {
        return this.$store.getters.createdForms || [];
      },
    },
    watch: {
      //we watch the route to get the form ID
      //since the user can change the URL manualy
      '$route'(to, from) {

        //need to swap forms when the id changes
        if (this.formID !== this.$route.params.formID) {
          this.getFormFromFB(this.creatorID, this.$route.params.formID);
        }

        this.$store.dispatch('setFormID', {formID: this.$route.params.formID});

      },

      sections(value) {
        const tmp = this.sections;

        this.formSections.forEach(fs => {
          if (!tmp.includes(fs) && fs && fs !== '-1') tmp.push(fs);
        });

        this.formSections = tmp.slice();

      }
    }
  }
</script>

<style scoped>
  @import '../../style/animations.css';

  .creator-form {
    background-color: white;
  }

  .creator-form-top-menu {
    background-color: #4286f4 !important;
    padding-bottom: 2px;
  }

  .creator-form-footer {
    margin: 9em;
  }

  .creator-form-header {
    margin: 4em;
  }

  .creator-form-buttons-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 1.5em;
  }

  .creator-form-entry-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #4286f4;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .creator-form-entry-button:hover {
    background: #3462ad;
  }

  .creator-form-section-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #4286f4;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .creator-form-save-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #2d8246;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .creator-form-save-button:hover {
    background: #276a35;
  }

  .creator-form-utils-buttons-wrapper {
    float: right;

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .creator-form-entry-buttons-wrapper {
    float: left;

    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .creator-form-sections-buttons-wrapper {
    margin-left: 0.5em;
    padding-left: 0.5em;
    background: #4286f4;
    width: 50%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 7px;
  }

  .creator-form-sections-buttons-wrapper input {
    width: 90%;
    color: #ffffff;
    border-bottom: 1px solid #00000055;
  }

  .creator-form-sections-buttons-wrapper input:focus {
    outline: none;
  }

  .creator-section-name-input {
    background: none;
    border: none;
    width: auto;
  }

  .creator-section-name-input::placeholder {
    color: white;
    opacity: 0.8;
  }

  .vertical-separator {
    border-left: 1px solid #00000055;
    border-right: 1px solid #00000055;
    height: 60px;
    top: 10px;
  }

  .drawer-opener {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 15px;
    background: #eeeeee;
  }

  .sorting-tab {
    margin: 7em 3em 3em;
  }

  .fake-entry {
    position: relative;

    margin: 1em auto;
    padding: 0.3em;
    width: 85%;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
  }

  .fake-entry div {
    border: none;
    background: none;
    cursor: pointer;
    color: #00000070;
  }

  .fake-entry div:hover {
    border: none;
    background: none;
    cursor: pointer;
    color: #000000aa;
  }

  .focusedEntry {
    background: #00000015;
  }

  .label-buttons-wrapper{
    width : 90%;
    margin: 5px auto;

    height: 0;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  .add-label-button-left {
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-left: 15px solid #00000000;
  }


  .add-label-button-left:hover{
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-left:20px solid #00000090;

    cursor: pointer;
  }

  .add-label-button-right {
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-right: 15px solid #00000000;
  }


  .add-label-button-right:hover{
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;

    border-right:15px solid #00000090;

    cursor: pointer;
  }

  .creator-form-title{
    margin-top: 1em;
    margin-bottom: 0.5em;
    width: 300px;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1.5em;
    text-align: center;
    color: #2c3e50;
  }

  .form-delete-button{
    position: fixed;
    top: 0;
    right: 0;
    z-index: 999;
    color: tomato;
  }

  .form-delete-button:hover{
    cursor: pointer;
  }

</style>
