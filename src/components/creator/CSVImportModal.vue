<template>
  <div class="csv-import-modal">

    <Modal v-if="showModal" @close="closeModal">
      <h1 slot="header">Génération du formulaire</h1>

      <div slot="body">
        <p>Fichier de génération :
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
    export default {
        name: "CSVImportModal"
    }
</script>

<style scoped>

</style>
