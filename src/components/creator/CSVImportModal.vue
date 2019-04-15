<template>
  <div class="csv-import-modal">

    <Modal v-if="showModal" @close="closeModal">
      <h1 slot="header">Génération du formulaire</h1>

      <div slot="body">
        <div class="override-warning-message">
          <h2 v-if="override" class="override-message">Écrasement des Formoops déjà générés et publiés</h2>
          <h2 v-else class="update-message">Mise à jour des Formoops déjà publiés</h2>
        </div>

        <p>Fichier .csv de génération :
          <CSVParser/>
        </p>

        <div v-if="publishable">

          <p>Publication et création de {{Object.keys(importedEntities).length}} formulaires</p>

          <button type="button" @click="generateAndPublishForms">Générer !</button>
        </div>

        <div v-else-if="!publishable && errors">
          ERREURS
        </div>

      </div>
    </Modal>

  </div>
</template>

<script>
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {generateGenericFormsFB, publishGenericFormsFB} from "@/thunks/creatorForm";
  import Modal from "@/components/containers/Modal";
  import CSVParser from "@/components/general/CSVParser";
  import {getPropArrayFromBlock} from "@/helpers/genericQuestionHelpers";

  export default {
    name: "CSVImportModal",
    components: {Modal, CSVParser},
    data() {
      return {
        importedEntities: {},
        publishable: false,
        errors: false,
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
        this.$emit('close');
      },

      getGenericEntries() {
        return this.formEntries.filter(fe => fe.generic);
      },

      generateAndPublishForms() {


        publishGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.publishingCampaigns || [], this.override);

        /*
                if(this.formCampaign.publishingCampaign){ //all forms will be under the same campaign

                  if(this.newPublishingCampaign){ // we create a new campaign
                    saveFormCampaignFB(this.formCampaign.publishingCampaign, {id: this.formCampaign.publishingCampaign, name:this.formCampaign.newPublishingCampaignName}).then((e) => {

                      generateGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.formCampaign.publishingCampaign);

                    }).catch((e) => {
                      console.log(e);
                    });
                  }else{ //we use an existing campaign
                    generateGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.formCampaign.publishingCampaign);
                  }
                }else{ // no campaigns
                  generateGenericFormsFB(this.creatorID, this.formID, this.importedEntities);
                }
        */

        this.closeModal();
      },

      verifyEntitiesIntegrity(entities, entries) {

        return Object.keys(entries).every(
          entryKey => this.verifyTitles(entities, entries[entryKey].question.blocks)
        );

      },

      verifyTitles(entities, blocks) {
        const variableBlocksPath = blocks.filter(b => b.type === 'variable').map(v => getPropArrayFromBlock(v));

        return Object.keys(entities).every(
          entityKey => {
            return variableBlocksPath.every(vbp => {


              if (vbp.length > 2) return false;

              let currentValue = entities[entityKey];

              //we only go to 2 lvl of depth.
              if (vbp.length === 1) {
                return !!currentValue[vbp[0]];
              }

              if (vbp.length === 2) {
                const firstLevel = currentValue[vbp[0]];



                if (firstLevel) {



                  if (Array.isArray(firstLevel))
                    return firstLevel.every(p => !!p[vbp[1]]);


                  return !!currentValue[vbp[1]];
                }


                return false;
              }
            });


          });
      }
    },

    created: function () {

      this.$root.$on('csv-parsed', (parsed) => {
        this.importedEntities = parsed;

        this.publishable = !!this.verifyEntitiesIntegrity(this.importedEntities, this.getGenericEntries());
        this.errors = !this.publishable
      });

      this.$store.dispatch('setFormCampaigns')

    }
  }
</script>

<style scoped>
  .override-warning-message {
    margin: 0 auto;
  }

  .override-message {
    color: tomato;
  }

  .update-message {
    color: #42b983;
  }
</style>
