<template>
  <div class="creator-form">

    <div class="drawer-opener" @click="showDrawer = true">

    </div>
    <Drawer v-if="showDrawer" @close="closeDrawer">

        <div slot="body">
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

          <button type="button" @click="closeDrawer">Trier !</button>

        </div>

    </Drawer>

    <input title="" type="text" class="creator-form-title" v-model="formTitle" placeholder="Titre du formulaire"/>

    <CreatorCampaignSelect/>

    <div v-for="(entry, i) in formEntries"
         :key="entry.id"
         @click="focusEntry(entry)">
      <CreatorFormEntry
                        :key="entry.id"
                        :entry="entry"
                        :opened="focusedEntry ? focusedEntry.id === entry.id : false"
                        :ref="entry.id"
                        :formSections="formSections"

      />
    </div>


    <div class="creator-form-footer"></div>

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
              <input title="" type="text" placeholder="Nom de la section" class="creator-section-name-input" v-model="newSection"/>

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

            <CreatorPublication :form-entries="formEntries" :publishing-campaigns="publishingCampaigns" :save-form="saveForm" :form-title="formTitle"/>
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
  import CustomGridEntry from "@/components/general/CustomGridEntry";

  export default {
    name: 'CreatorForm',
    components: {
      CustomGridEntry,
      CustomGrid, Drawer, CreatorPublication, CreatorFormEntry, DockingMenu, CreatorCampaignSelect},
    data() {
      return {
        focusedEntry: null,
        formEntries: [],
        defaultFormEntry: {
          question: {title: ''},
          type: 'radio',
          answers: [],
          initialyOpened: true //Opened collapse by default
        },
        defaultQuestion: {title: 'Titre de la question'},
        defaultAnswers: [{id: "", text: 'Option 1'}],
        formTitle: 'Formulaire sans titre',
        defaultFormTitle: 'Formulaire sans titre',
        showDrawer: false,
        newSection: null,
        formSections: [],
        publishingCampaigns: []

      }
    },
    methods: {


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

      gridRetreiveSortedItems(){
        this.formEntries = this.$refs.entrySortingGrid.getListClone();
      },

      getEntryColor(entry){
        return getSectionColor(entry.section, this.formSections) || '#aaaaaa';
      },

      closeDrawer() {
        this.showDrawer = false;
        this.gridRetreiveSortedItems();
      },

      focusEntry(entry){
        if(this.focusedEntry){

          if(this.focusedEntry.id === entry.id) this.focusedEntry = null;
          else this.focusedEntry = entry;

        } else this.focusedEntry = entry;
      },

      disableClick(e) {
        e.preventDefault();
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
              content: "Texte standard"
            },
            {
              id: uuid.v4(),
              type: 'variable',
              content: "nom_variable"
            }
          ];
        }

        //copy default answer array, and generate new option ids
        this.formEntries.push(entry);
      },

      addFormEntryAnswer(id, answer) {
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.answers.push(answer);
          this.formEntries = tmp;
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
          this.formEntries = tmp;
        }
      },

      setFormEntryRequirement(id, requirement){
        const tmp = [...this.formEntries];
        const fe = tmp.find(e => e.id === id);
        if (fe) {
          fe.required = requirement;
          this.formEntries = tmp;
        }
      },

      setFormPublishingCampaign(publishingCampaigns){
        this.publishingCampaigns = publishingCampaigns;
      },

      setForm(form) {
        if (!form) {
          this.formEntries = [];
          this.formTitle = this.defaultFormTitle;
          return;
        }
        this.formEntries = form.formEntries || [];
        this.formTitle = form.formTitle || this.defaultFormTitle;
      },

      getFormFromFB(creatorID, formID) {
        Firebase.database().ref(getCreatedFormFromID(creatorID, formID))
          .on('value', (snapshot) => {
            const value = snapshot.val();
            if (value) {
              this.setForm({formEntries: value.entries, formTitle: value.title});
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
      saveForm() {
        this.validateEntries();

        saveCreatorFormFB(this.creatorID,
          this.formID,
          {id: this.formID, title: this.formTitle, entries: this.formEntries}).then((e) => {

          //if everything is done, we reset the form's data
          this.getFormFromFB(this.creatorID, this.formID);

        }).catch((e) => {
          console.log(e);
        });

        //remove the form where we don't want it to be
        //and add it where it is not
        if(!isFormGeneric(this.formEntries))
          saveAndFilterCampaignsFB({id: this.formID, title: this.formTitle}, this.formCampaigns, this.publishingCampaigns);

      },
    },
    created: function () {
      //when arriving, set the ID in the store from the router
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setCreatorID', {formID: null});
      this.$store.dispatch('setFormCampaigns');


      //emitting of a new entry
      this.$root.$on('add-entry-answer', (id, answer) => {
        this.addFormEntryAnswer(id, answer)
      });

      //emitting the type of an entry
      this.$on('set-entry-type', (id, type) => {
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
        window.scrollTo(0, document.body.scrollHeight);
        this.focusEntry(this.formEntries.find(e => e.id === id));
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
        return this.$store.getters.publishedForms.find(pe => pe.id === this.formID)
      },

      creatorID() {
        return this.$store.getters.creatorID;
      },

      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

      sections() {
        const sections = [];
        this.formEntries.forEach(e => {
          if (!sections.includes(e.section) && e.section && e.section !== '-1') sections.push(e.section);
        });
        return sections;
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

      formEntries() {
        const tmp = this.sections;

        this.formSections.forEach(fs => {
          if (!tmp.includes(fs) && fs && fs !== '-1') tmp.push(fs);
        });

        tmp.sort((a,b) => a.localeCompare(b));
        this.formSections = tmp.slice();

      }
    }
  }
</script>

<style scoped>

  .creator-form {
    background-color: white;
  }

  .creator-form-footer {
    margin: 9em;
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

  .creator-form-section-button{
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

  .creator-section-name-input::placeholder{
    color: white;
    opacity: 0.8;
  }

  .vertical-separator {
    border-left: 1px solid #00000055;
    border-right: 1px solid #00000055;
    height: 60px;
    top: 10px;
  }

  .drawer-opener{
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 15px;
    background: #eeeeee;
  }



</style>
