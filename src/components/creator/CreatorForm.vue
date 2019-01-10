<template>
  <div class="form">

    <h1 class="ghostText" v-bind:class="{ publishedForm: isPublished }">{{formID}}</h1>


    <input title="" type="text" class="formTitle" v-model="formTitle" :placeholder="formID"/>


    <CreatorFormEntry v-for="(entry, i) in formEntries"
                      :key="entry.id"
                      :entry="entry"
                      :initialyOpened="entry.initialyOpened"
    />

    <button @click="addEntry">Ajouter une question</button>

    <div>
      <button @click="saveForm">Enregistrer le formulaire</button>
      <button @click="publishForm">Publier le formulaire</button>
    </div>


  </div>
</template>

<script>
  import * as uuid from "uuid";

  import CreatorFormEntry from './CreatorFormEntry'
  import * as Firebase from "firebase";
  import {saveCreatorFormFB, publishCreatorFormFB} from "@/thunks/creatorForm";
  import {getCreatedFormFromID, nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: 'CreatorForm',
    components: {CreatorFormEntry},
    data() {
      return {
        formEntries: [],
        defaultFormEntry: {question:{title: ''},
          type: 'radio',
          answers: [],
          initialyOpened : true //Opened collapse by default
        },
        defaultQuestion: {title: 'Titre de la question'},
        defaultAnswers: [{id: "", text: 'Option 1'}],
        formTitle: 'Formulaire sans titre',
        defaultFormTitle: 'Formulaire sans titre',
      }
    },
    methods: {

      disableClick(e) {
        e.preventDefault();
      },

      addEntry() {
        const id = uuid.v4();
        //copy default answer array, and generate new option ids
        this.formEntries.push({
          ...this.defaultFormEntry,
          question: {...this.defaultQuestion},
          answers: [...this.defaultAnswers.map(a => ({...a, id: uuid.v4()}))],
          id
        })
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

      setForm(form){
        if(!form) {
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
            if(value){
              this.setForm({formEntries: value.entries, formTitle: value.title});
            }else{
              this.setForm(null);
            }
          })
      },

      //make sure that the form is ready to deploy
      validateEntries() {
        this.formEntries = this.formEntries.map((fe, i) => {
          delete fe.initialyOpened; // we remove the default state of the collapse

          return ({...fe,
            question: {...fe.question, title: (fe.question.title || "Titre de la question "+(i+1))},
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

      //publish form into firebase
      publishForm() {
        this.saveForm();

        publishCreatorFormFB(this.creatorID, this.formID);
      }

    },
    created: function () {
      //when arriving, set the ID in the store from the router
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setCreatorID', {formID: null})

      //emitting of a new entry
      this.$root.$on('add-entry-answer', (id, answer) => {
        this.addFormEntryAnswer(id, answer)
      });

      //emitting the type of an entry
      this.$on('set-entry-type', (id, type) => {
        this.setFormEntryType(id, type)
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

      isPublished(){
        return this.$store.getters.publishedForms.find(pe => pe.id === this.formID)
      },

      creatorID(){
        return this.$store.getters.creatorID;
      }
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

      }
    }
  }
</script>

<style scoped>

  .form{
    background-color: white;
  }

  .ghostText {
    color: lightgray;
  }

  .publishedForm {
    color: steelblue;
  }

</style>
