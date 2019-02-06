<template>
  <div class="creator-form">

    <h1 class="creator-form-ghost-text" v-bind:class="isPublished ? 'creator-published-form' : ''">{{formID}}</h1>


    <input title="" type="text" class="creator-form-title" v-model="formTitle" :placeholder="formID"/>


    <CreatorFormEntry v-for="(entry, i) in formEntries"
                      :key="entry.id"
                      :entry="entry"
                      :initialyOpened="entry.initialyOpened"
                      :ref="entry.id"
                      :formSections="formSections"
    />

    <div class="creator-form-footer">
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
              <input title="" type="text" placeholder="Nom de la section" class="creator-section-name-input" v-model="newSection"/>

              <button type="button" class="creator-form-entry-button"
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

            <JsonImportModal :form-entries="formEntries" :save-form="saveForm"/>
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
  import {saveCreatorFormFB, publishCreatorFormFB} from "@/thunks/creatorForm";
  import {getCreatedFormFromID, nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import JsonImportModal from "@/components/creator/JsonImportModal";
  import DockingMenu from "@/components/containers/DockingMenu";

  export default {
    name: 'CreatorForm',
    components: {JsonImportModal, CreatorFormEntry, DockingMenu},
    data() {
      return {
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
        showModal: false,
        newSection: null,
        formSections: []
      }
    },
    methods: {

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
          console.log(JSON.stringify(fe));
          this.formEntries = tmp;
        }
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

      },
    },
    created: function () {
      //when arriving, set the ID in the store from the router
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setCreatorID', {formID: null});

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

      //when an entry is mounted
      this.$root.$on('mounted-entry', (id) => {
        window.scrollTo(0, document.body.scrollHeight);
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
        this.formSections = tmp;

      }
    }
  }
</script>

<style scoped>

  .creator-form {
    background-color: white;
  }

  .creator-form-ghost-text {
    color: lightgray;
  }

  .creator-published-form {
    color: steelblue;
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


  .creator-section-name-input {
    background: none;
    border: none;
    width: auto;
  }

  .vertical-separator {
    border-left: 1px solid #00000055;
    border-right: 1px solid #00000055;
    height: 60px;
    top: 10px;
  }

</style>
