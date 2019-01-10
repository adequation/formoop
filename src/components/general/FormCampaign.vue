<template>
  <div>

    <div v-if="formCampaigns.length > 0">

      <p v-for="campaign in formCampaigns">
        <router-link :to=getCampaignPath(campaign)>{{campaign.name}} ({{campaign.formNumber}} formulaires)</router-link>
      </p>

    </div>

    <div v-else>
      <h1>Il n'y a aucune campagne en cours pour l'instant</h1>
    </div>

    <button @click="createNewCampaign">Créer une campagne</button>

  </div>
</template>

<script>
  import * as uuid from "uuid";

  export default {
    name: "FormCampaign",

    methods: {
      getCampaignPath(campaign) {
        return "/campaigns/".concat(campaign.id);
      },

      createNewCampaign() {
        this.$router.replace(this.getCampaignPath({id: uuid.v4()}));
      }
    },

    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      }
    },

    created() {
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setFormCampaigns');
    }
  }
</script>

<style scoped>

</style>
