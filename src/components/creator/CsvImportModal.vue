<template>
  <div class="csv-import-modal">

    <Modal v-if="showModal" @close="closeModal">
      <h1 slot="header"></h1>

      <div slot="body">
        <div class="override-warning-message">
          <h2 v-if="override" class="override-message">Écrasement des Formoops déjà générés et publiés</h2>
          <h2 v-else class="update-message">Mise à jour des Formoops déjà publiés</h2>
        </div>

        <p>Fichier .csv de génération :
          <CsvParser/>
        </p>

        <div v-if="publishable">

          <h3>Publication et création de {{Object.keys(importedEntities.data).length}} formulaires</h3>

          <button type="button"
                  @click="generateAndPublishForms"
                  class="generate-forms-button">Générer !
          </button>
        </div>

        <hr v-if="this.errors || this.warnings"/>
        <CsvErrorAndWarning class="csv-messages-container"
                            v-if="this.errors || this.warnings"
                            :errors="errors || []"
                            :warnings="warnings || []"/>

        <button type="button" @click="$router.push({ name: 'CsvHelp'})">Un peu d'aide pour le CSV ?</button>

      </div>
    </Modal>

  </div>
</template>

<script>
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {publishGenericFormsFB} from "@/thunks/creatorForm";
  import Modal from "@/components/containers/Modal";
  import CsvParser from "@/components/general/CsvParser";
  import {NON_EXISTING_VARIABLE} from "@/helpers/csvParserHelpers";
  import CsvErrorAndWarning from "@/components/creator/CsvErrorAndWarning";

  export default {
    name: "CsvImportModal",
    components: {CsvErrorAndWarning, Modal, CsvParser},
    data() {
      return {
        importedEntities: {},
        entitiesIntegrity: {},
        publishable: false,
        errors: false,
        warnings: false
      }
    },

    props: {
      formEntries: {
        type: Array,
        required: true
      },
      saveForm: {
        type: Function,
        required: true
      },
      showModal: {
        type: Boolean,
        required: true,
      },
      publishingCampaigns: {
        type: Array,
        required: true
      },
      override: {
        type: Boolean,
        required: true
      }
    },

    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },
      formID() {
        return this.$store.getters.getCreatorFormID;
      },
      creatorID() {
        return this.$store.getters.creatorID;
      },
      user() {
        return nativeFbFunctions.getCurrentUser();
      }
    },

    methods: {
      closeModal() {
        this.publishable = false;
        this.errors = false;
        this.warnings = false;
        this.$emit('close');
      },

      getGenericEntries() {
        return this.formEntries.filter(fe => fe.generic);
      },

      generateAndPublishForms() {

        publishGenericFormsFB(this.creatorID, this.formID, this.importedEntities.data, this.publishingCampaigns || [], this.formCampaigns, this.override);

        this.closeModal();
      },

      verifyEntitiesIntegrity(entities, entries) {
        let errors = [];
        let warnings = [];

        Object.keys(entries).forEach(entryKey => {
            const verifyTitles = this.checkEntityIntegrity(entities, entries[entryKey].question.blocks);

            errors = errors.concat(verifyTitles.errors);
            warnings = warnings.concat(verifyTitles.warnings);
          }
        );

        return {errors, warnings}

      },

      checkEntityIntegrity(entities, blocks) {

        const feedBack = {errors: [], warnings: []};

        const valuesLength = {};

        Object.keys(entities).forEach(
          entityKey => {
            blocks.filter(b => b.type === 'variable').forEach(b => {

              let currentValue = entities[entityKey];

              if (!currentValue[b.content]) {
                feedBack.errors.push({
                  message: NON_EXISTING_VARIABLE,
                  place: `variable @${b.content} pour ${entityKey}`
                });
              } else if (currentValue[b.content].length <= 0) {
                feedBack.errors.push({
                  message: NON_EXISTING_VARIABLE,
                  place: `variable @${b.content} pour ${entityKey}`
                });
              } else {
                const nullIndex = currentValue[b.content].findIndex(value => value === '' || undefined || null);
                if (nullIndex >= 0) {
                  feedBack.errors.push({
                    message: NON_EXISTING_VARIABLE,
                    place: `variable @${b.content} pour ${entityKey}`
                  });
                }
              }

            });

          });


        return feedBack;
      }
    },

    created: function () {

      this.$root.$on('csv-parsed', (parsed) => {
        this.importedEntities = parsed.data;

        this.errors = this.importedEntities.errors;
        this.warnings = this.importedEntities.warnings;

        this.entitiesIntegrity = this.verifyEntitiesIntegrity(this.importedEntities.data, this.getGenericEntries());


        this.errors = this.importedEntities.errors.concat(this.entitiesIntegrity.errors);
        this.warnings = this.importedEntities.warnings.concat(this.entitiesIntegrity.warnings);

        this.publishable = this.errors.length <= 0;
      });

      this.$store.dispatch('setFormCampaigns')

    }
  }
</script>

<style scoped>
  .csv-import-modal {
  }

  .override-warning-message {
    margin: 0 auto;
  }

  .override-message {
    color: tomato;
  }

  .update-message {
    color: #42b983;
  }

  .csv-messages-container {
    height: 40vh;
    min-height: 100px;
    max-height: 400px;
  }

  .generate-forms-button {
    background: #4286f4;
    color: white;
    padding: .5rem 1rem;
    font-size: 1.5625rem;
    line-height: 1.5;
    text-align: center;

    width: fit-content;

    cursor: pointer;
    border: none;
    border-radius: 16px 16px 16px 16px;

    margin: 0.5em;
  }

  .generate-forms-button:hover {
    background: #3462ad;
    cursor: pointer;
  }
</style>
