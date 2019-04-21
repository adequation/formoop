<template>
  <div>
    <h1>Campagnes</h1>

    <div v-if="campaignAsArray.length > 0">

      <div v-for="campaign in campaignAsArray">
        <router-link :to=getCampaignPath(campaign)>{{campaign.name}} ({{(campaign.forms || []).length}} Formoop)</router-link>
        <i class="material-icons md-18" role="button" @click.stop=""
           @click="deleteCampaign(campaign.id)">clear</i>
      </div>

    </div>

    <div v-else>
      <h1>Il n'y a aucune campagne en cours pour l'instant</h1>
    </div>

    <input class="create-campaign-box"
           type="text"
           placeholder="Nom de la campagne"
           v-model="newCampaignName"
           @keydown.enter="createNewCampaign"
    />
    <button class="create-campaign-button" @click="createNewCampaign">Créer une campagne</button>
    <p v-if="newCampaignAlreadyExists">Cette campagne existe déjà</p>


  </div>
</template>

<script>
  import * as uuid from "uuid";
  import {saveFormCampaignFB} from "../../thunks/creatorForm";
  import {doesCampaignExists, deleteCampaignFromFormCampaigns} from "../../helpers/campaignsHelpers";
  import {saveFormCampaignsFB} from "@/thunks/creatorForm"

  export default {
    name: "FormCampaign",
    data() {
      return {
        newCampaignName: null,
        newCampaignAlreadyExists: false
      }
    },

    methods: {
      getCampaignPath(campaign) {
        return "monitor/campaign/".concat(campaign.id);
      },

      createNewCampaign() {
        this.newCampaignAlreadyExists = false;
        if (this.newCampaignName) {
          // Check if campaign already exists
          if (!doesCampaignExists(this.formCampaigns, this.newCampaignName)) {
            const newCampaignID = uuid.v4();
            saveFormCampaignFB(newCampaignID, {id: newCampaignID, name: this.newCampaignName});
          } else this.newCampaignAlreadyExists = true;
        }
        this.newCampaignName = null;
      },

      deleteCampaign(campaignID){
        if (confirm(`Etes vous sur de vouloir supprimer cette campagne? \nToute progression associée sera perdue`)){
         const campaignsChanged = deleteCampaignFromFormCampaigns(this.formCampaigns, campaignID);
         saveFormCampaignsFB(campaignsChanged);
        }
      }
    },

    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

      campaignAsArray(){
        return Object.keys(this.formCampaigns).map(key => this.formCampaigns[key]);
      },
    },

    created() {
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setFormCampaigns');
    }
  }
</script>

<style scoped>
  .create-campaign-button{
    cursor: pointer;
  }
</style>
