<template>

  <div>

    <div v-if="publishedCampaign.length > 0" >

      <div v-for="campaign in publishedCampaign">

          <h3 slot="header" class="publishedCampaignTitle"> {{ campaign.campaignName}}</h3>
          <p v-for="form in campaign.forms" slot="body" class="publishedCampaignBody">
            <router-link :to=getPublishedFormPath(form)>{{form.title}} ({{form.questionNumber}} questions)</router-link>
          </p>

      </div>
    </div>

    <div v-if="publishedForms.length > 0">

      <h3 slot="header" class="publishedFormTitle">Formulaires sans campagne</h3>
      <p v-for="form in publishedForms" slot="body" class="publishedFormBody">
        <router-link :to=getPublishedFormPath(form)>{{form.title}} ({{form.questionNumber}} questions)</router-link>
      </p>

    </div>

    <div v-else>
      <h1>Il n'y a aucun sondage en cours pour l'instant</h1>
    </div>

  </div>

</template>

<script>
  import Collapse from "../containers/Collapse";
  export default {
        name: "PublishedForms",
    components: {Collapse},
    methods:{
        getPublishedFormPath({id}) {
          return "/answer/".concat(id);
        },
      },
      computed:{
          publishedForms(){
            return this.$store.getters.publishedForms;
          },
          publishedCampaign(){
            return this.$store.getters.publishedCampaign;
          }
      },
      created(){
        this.$store.dispatch('setPublishedForms');
        this.$store.dispatch('setPublishedCampaign')
      }
    }
</script>

<style scoped>

</style>
