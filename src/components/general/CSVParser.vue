<template>
  <div class="json-parser">
    <input type="file" accept=".csv" @change="onChangeCSVInput($event)"/>
    <div v-if="errors">
      <p>{{errors}}</p>
    </div>
  </div>
</template>

<script>
  import {parsePromoteurCSV} from "@/helpers/csvParserHelpers";

  export default {
        name: "CSVParser",
      data(){
        return {
          parsedData : null,
          errors: ''
        }
      },
      props: {
      },
      methods: {
        onChangeCSVInput(e) {
          const reader = new FileReader();
          reader.readAsText(e.target.files[0], "UTF-8");

          reader.onload = (evt) => {
            const rawFile = evt.target.result;
            this.parsedData = parsePromoteurCSV(rawFile);

            this.$root.$emit("csv-parsed", this.parsedData);
          };

          reader.onerror = function (evt) {
            this.errors = evt.target;
            console.log(this.errors);
          }

        }
      }
    }
</script>

<style scoped>

</style>
