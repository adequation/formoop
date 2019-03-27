<template>
  <div>
    <a :href="JsonParsing(campaign)" :download="campaign.name + '.json'"><i class="material-icons md-36">save_alt</i> </a>
  </div>
</template>

<script>
  import  {parseCampaign } from '@/helpers/jsonExportHelpers'
  import {getCampaignWithForms} from "../../helpers/campaignsHelpers";
    export default {
      name: "DownloadCampaign",
      props:{
          campaign:{
            type: Object,
            required: true,
          }
      },
      computed: {
        campaignToConvert(){
          return getCampaignWithForms(this.campaign, this.$store.getters.campaignFullForms, this.$store.getters.finishedForms);
        }
      },
      methods: {
        /**
         * @return {string}
         */
        JsonParsing(campaign){
            console.log(this.campaignToConvert);
            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parseCampaign(this.campaignToConvert), null, 2));

          },
      }
    }
</script>

<style scoped>

</style>
