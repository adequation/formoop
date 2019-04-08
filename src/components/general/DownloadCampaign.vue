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
          },
          campaignForms: {
            type: Array,
            required: true,
          },
          campaignClosedForms: {
            type: Array,
            required: true,
          }
      },
      computed: {
        campaignToConvert(){
          return getCampaignWithForms(this.campaign, this.campaignForms, this.campaignClosedForms);
        }
      },
      methods: {
        /**
         * @return {string}
         */
        JsonParsing(campaign){
            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parseCampaign(this.campaignToConvert), null, 2));

          },
      }
    }
</script>

<style scoped>
 a {
   color: #fff;
 }
</style>
