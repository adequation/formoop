<template>
  <div>
    <a :href="JsonParsing(form)" :download="form.title + '.json'"> Download </a>
  </div>

</template>

<script>
  import  {parseForm } from '@/helpers/jsonExportHelpers'

    export default {
      name: "DownloadForm",
      props: {
          form: {
            type: object,
            required: true,
          }
      },
      methods: {
        /**
         * @return {string}
         */
        JsonParsing(BrutForm){
          return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parseForm(BrutForm), null, 2));
        }
      }
    }
</script>

<style scoped>

</style>
