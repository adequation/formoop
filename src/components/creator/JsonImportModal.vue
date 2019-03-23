<template>
  <div class="json-import-modal">

    <Modal v-if="showModal" @close="closeModal">
      <h1 slot="header">Génération du formulaire</h1>

      <div slot="body">
        <p>Fichier de génération :
          <JsonParser/>
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
  import Modal from "@/components/containers/Modal";
  import JsonParser from "@/components/general/JsonParser";
  import {publishCreatorFormFB, publishGenericFormsFB, saveFormCampaignFB} from "@/thunks/creatorForm";
  import * as uuid from "uuid";
  import EntryPointModal from "./EntryPointModal";
  import {inviteUser} from "@/thunks/userAccountThunks";
  import {nativeFbFunctions} from "../../helpers/firebaseHelpers";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";
  import {generateGenericFormsFB} from "../../thunks/creatorForm";

  export default {
    name: "JsonImportModal",
    components: {EntryPointModal, Modal, JsonParser},
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
      user(){
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
        console.log(JSON.stringify(this.publishingCampaigns))


        if(this.publishingCampaigns.length > 0){ // forms under campaigns
          generateGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.publishingCampaigns)
        } else { // no campaign
          generateGenericFormsFB(this.creatorID, this.formID, this.importedEntities);
        }


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
        const fields = Object.keys(entries).every(
          entryKey => this.verifyFields(entities, entries[entryKey].genericProperty)
        );
        if (!fields) return false;

        const titles = Object.keys(entries).every(
          entryKey => this.verifyTitles(entities, entries[entryKey].genericProperty, entries[entryKey].question.blocks)
        );

        return fields && titles;
      },

      verifyFields(entities, property) {
        return Object.keys(entities).every(entityKey => {
          return !!entities[entityKey][property];
        })
      },

      verifyTitles(entities, property, blocks) {
        const variableBlocks = blocks.filter(b => b.type === 'variable');

        return Object.keys(entities).every(
          entityKey => (
            variableBlocks.every(vb => {
              const propertyValue = entities[entityKey][property];

              if (propertyValue.length) return propertyValue.every(v => {

                return v[vb.content];
              });
              return propertyValue[vb.content];
            })
          )
        )
      }
    },

    created: function () {

      this.$root.$on('json-parsed', (parsed) => {
        this.importedEntities = parsed;

        this.publishable = !!this.verifyEntitiesIntegrity(this.importedEntities, this.getGenericEntries());
        this.errors = !this.publishable
      });

      this.$store.dispatch('setFormCampaigns')

    }
  }
</script>

<style scoped>

</style>
