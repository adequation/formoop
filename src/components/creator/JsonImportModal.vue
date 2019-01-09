<template>
  <div class="json-import-modal">

    <button @click="publishForm">Publier le formulaire</button>

    <Modal v-if="showModal" @close="showModal = false">

      <h3 slot="header">Ajouter un fichier pour créer une question générique</h3>

      <div slot="body">
        <JsonParser/>
      </div>

      {{importedEntities}}

    </Modal>

  </div>
</template>

<script>
  import Modal from "@/components/containers/Modal";
  import JsonParser from "@/components/general/JsonParser";

  export default {
    name: "JsonImportModal",
    components: {Modal, JsonParser},
    data() {
      return {
        showModal: false,
        importedEntities: {}
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
      }
    },
    methods: {
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
        }
        //publishCreatorFormFB(this.creatorID, this.formID);

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

        if (this.verifyEntitiesIntegrity(this.importedEntities, this.getGenericEntries())) console.log('ok');
        else console.log('non');
      });

    }
  }
</script>

<style scoped>

</style>
