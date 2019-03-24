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
        JsonParsing(BrutForm){
          return parseForm(BrutForm);
        }
      }
    }
</script>

<style scoped>

</style>
