<template>
  <div class="json-parser">
    <input type="file" accept=".csv" @change="onChangeCSVInput($event)"/>


    <input type="text" title="" v-model="entityIdProp" placeholder="Colonne du CSV servant d'identifiant unique"/>


      <button :disabled="!csvRawFile || !entityIdProp" type="button" @click="parseCSV">Lire le fichier CSV</button>



    <div v-if="errors">
      <p>{{errors}}</p>
    </div>
  </div>
</template>

<script>
  import {parseEntitiesCSV} from "@/helpers/csvParserHelpers";

  export default {
    name: "CSVParser",
    data() {
      return {
        entityIdProp: '',
        csvRawFile: null,
        parsedData: null,
        errors: ''
      }
    },
    props: {},
    methods: {
      onChangeCSVInput(e) {
        this.csvRawFile = e.target.files[0];
      },

      parseCSV() {
        const reader = new FileReader();
        reader.readAsText(this.csvRawFile, "UTF-8");

        reader.onload = (evt) => {
          const rawFile = evt.target.result;
          this.parsedData = parseEntitiesCSV(rawFile, this.entityIdProp);

          this.$root.$emit("csv-parsed", {errors: null, data: this.parsedData});
        };

        reader.onerror = function (evt) {
          this.errors = evt.target;
          this.$root.$emit("csv-parsed", {errors: this.errors, data: []});
        }

      }
    }
  }
</script>

<style scoped>

</style>
