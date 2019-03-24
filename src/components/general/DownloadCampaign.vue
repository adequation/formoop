<template>
  <div>
    <a :href="JsonParsing(campaign)" :download="form.title + '.json'"> Download </a>
  </div>
</template>

<script>
  import  {parseCampaign } from '@/helpers/jsonExportHelpers'
    export default {
        name: "DownloadCampaign",
      props:{
          campaign:{
            type: Object,
            required: true,
          }
      },
      methods: {
          JsonParsing(campaign){
            return parseCampaign(campaign);
          }
      }
    }
</script>

<style scoped>

</style>
