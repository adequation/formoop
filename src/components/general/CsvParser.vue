<template>
  <div class="json-parser">
    <input type="file" accept=".csv" @change="onChangeCSVInput($event)"/>


    <div class="parse-link-wrapper">
      <input title=""
             class="parse-link-input"
             type="text"
             v-model="entityIdProp"
             placeholder="Clé de regroupement"
             ref="formLinkInput"/>

      <button
        type="button"
        :class="['parse-link-button', 'smooth', {enabled: csvRawFile && entityIdProp}]"
        :disabled="!csvRawFile || !entityIdProp"
        @click="parseCSV"
        title="Lire le fichier CSV">
        <i class="material-icons">note_add</i>
      </button>
    </div>

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
        justParsed: false,
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

      },
    }
  }
</script>

<style scoped>
  .parse-link-wrapper {
    width: auto;
    margin: 15px auto;

    border-radius: 10px;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    box-shadow: 0 0 0 0 #4286f488;

    outline: none;
  }



  .parse-link-input {
    height: 50px;

    width: auto;

    border: none;
    background: #eeeeee;

    padding: 0 5px 0 5px;

    margin: 0;

    border-radius: 10px 0 0 10px;

    text-align: center;

    outline: none;
  }

  .parse-link-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;

    min-width: 50px;
    min-height: 50px;

    border-radius: 0 10px 10px 0;

    padding: 0;
    margin: 0;

    color: white;

    background: #aaaaaa;
    border: none;

    outline: none;

    cursor: pointer;
  }

  .enabled{
    background: #4286f4 !important;
  }

  .enabled:hover{
    background: #3462ad !important;
  }
</style>
