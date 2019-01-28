<template>
  <div class="json-import-modal">

    <button type="button" class="creator-form-save-button"
            @click="publishForm"><i class="material-icons md-36">send</i></button>

    <Modal v-if="showModal" @close="closeModal">

      <h1 slot="header">Publication du formulaire</h1>

      <div slot="body">
        <p>Fichier de génération :
          <JsonParser/>
        </p>

        <div v-if="publishable">

          <p>Publication et création de {{Object.keys(importedEntities).length}} formulaires</p>

          <p>
            Publier dans la campagne :
            <select @change="onCampaignChange($event.target)" title="">
              <option value="none">Aucune</option>
              <option value="new">Nouvelle campagne</option>
              <option v-for="c in formCampaigns" :key="c.id" :value="c.id">{{c.name}}</option>
            </select>

            <input v-if="newPublishingCampaign" type="text" title="" v-model="newPublishingCampaignName"/>
          </p>

          <button type="button" @click="generateAndPublishForms">Publier !</button>
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

  export default {
    name: "JsonImportModal",
    components: {Modal, JsonParser},
    data() {
      return {
        showModal: false,
        importedEntities: {},
        publishable: false,
        errors: false,
        newPublishingCampaign: false,
        newPublishingCampaignName: '',
        publishingCampaign: null
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
    },

    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

      formID() {
        return this.$store.getters.getCreatorFormID
      },

      creatorID() {
        return this.$store.getters.creatorID;
      }
    },

    methods: {
      closeModal() {
        this.showModal = false;
        this.publishable = false;
        this.errors = false;
      },

      onCampaignChange: function (target) {
        if (target.value === 'none') {
          this.newPublishingCampaign = false;
          this.publishingCampaign = null;

        } else if (target.value === 'new') {
          this.newPublishingCampaign = true;
          this.newPublishingCampaignName = "Nouvelle campagne";
          this.publishingCampaign = uuid.v4();

        } else {
          this.newPublishingCampaign = false;
          this.publishingCampaign = target.value;
        }
      },

      formContainsGenericQuestion() {
        let containsGenericQuestion = false;

        this.formEntries.forEach(fe => {
          if (fe.generic) containsGenericQuestion = true;
        });

        return containsGenericQuestion;
      },

      getGenericEntries() {
        return this.formEntries.filter(fe => fe.generic);
      },

      //publish form into firebase
      publishForm() {
        this.saveForm();

        if (this.formContainsGenericQuestion()) {
          this.showModal = true;
        } else {
          console.log("publi");
          publishCreatorFormFB(this.creatorID, this.formID);
        }

      },

      generateAndPublishForms() {

        if(this.publishingCampaign){ //all forms will be under the same campaign

          if(this.newPublishingCampaign){ // we create a new campaign
            saveFormCampaignFB(this.publishingCampaign, {id: this.publishingCampaign, name:this.newPublishingCampaignName}).then((e) => {

              publishGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.publishingCampaign);

            }).catch((e) => {
              console.log(e);
            });
          }else{ //we use an existing campaign
            publishGenericFormsFB(this.creatorID, this.formID, this.importedEntities, this.publishingCampaign);
          }
        }else{ // no campaigns
          publishGenericFormsFB(this.creatorID, this.formID, this.importedEntities);
        }

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

</style>
