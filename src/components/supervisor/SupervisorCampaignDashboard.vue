<template>
  <div>

    <h1>{{campaignName}}</h1>

    <div>
      <table class="campaign-progression-table">
        <th>Nom du formulaire</th>
        <th>Progression</th>
        <th>qsdfef</th>
        <tr v-for="v in campaignFormsProgress" :key="v.name">
          <td>{{v.name}}</td>
          <td>
            <SupervisorCampaignProgressChart :data="[v]"/>
          </td>
          <td>{{v.value}}</td>
        </tr>
      </table>
    </div>

    <SupervisorProgressChart
      :percentage="campaignFormsProgress.reduce( ( sum, { value } ) => sum + value , 0)/ campaignFormsProgress.length"></SupervisorProgressChart>

    <DockingMenu class="supervisor-campaign-bottom-menu">
      <div slot="body">

        <div class="creator-form-buttons-wrapper">

          <div class="creator-form-buttons-type">
          <button class="bottom-button" title="Progression"><i class="material-icons">timeline</i></button>
          <button class="bottom-button" title="Conflits"><i class="material-icons">event_busy</i></button>
          </div>

          <div class="creator-form-buttons-sort">
            <button class="bottom-button" title="Progression"><i class="material-icons">sort</i></button>
            <button class="bottom-button" title="Conflits"><i class="material-icons">sort_by_alpha</i></button>
          </div>

        </div>

      </div>
    </DockingMenu>


  </div>
</template>

<script>
  import SupervisorCampaignProgressChart from "@/components/supervisor/SupervisorCampaignProgressChart";
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";
  import DockingMenu from "@/components/containers/DockingMenu";
  import {getPercentage} from "@/helpers/userAnswersHelpers";

  export default {
    name: "SupervisorCampaignDashboard",
    components: {SupervisorProgressChart, SupervisorCampaignProgressChart, DockingMenu},

    data() {
      return {}
    },

    computed: {
      campaign() {
        return this.$store.getters.currentCampaign;
      },

      publishedForms() {
        return this.$store.getters.publishedForms;
      },

      campaignForms() {
        return this.campaign ? this.campaign.forms || [] : []
      },

      campaignFullForms() {
        return this.campaign ? this.$store.getters.campaignFullForms || [] : []
      },

      campaignFormsProgress() {
        return this.campaignFullForms.map(f => ({
          name: f.title,
          value: getPercentage('answered', Object.keys(f.entries).map(formEntryKey => f.entries[formEntryKey]), f.usersAnswers)
        }));
      },

      campaignName() {
        return this.campaign ? this.campaign.name : 'Campagne inconnue'
      },

      campaignID() {
        return this.campaign ? this.campaign.id : this.$route.params.campaignID;
      },
    },

    methods: {},

    created() {
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setCurrentCampaign', {campaignID: this.$route.params.campaignID});
    },
    watch: {
      //we watch the route to get the campaign ID
      //since the user can change the URL manualy
      '$route'(to, from) {

        this.$store.dispatch('setCurrentCampaign', {campaignID: this.$route.params.campaignID});

      },

      campaign(newValue, oldValue) {
        this.$store.dispatch('setCampaignFullForms');
      }
    }
  }
</script>

<style scoped>
  .supervisor-campaign-bottom-menu{
    height: 5em;
  }

  .campaign-progression-table {
    width: 100%;
  }

  .campaign-progression-table td {

    border-bottom: 1px solid #e8e8e8;
  }

  .creator-form-buttons-type{
    margin-left: 1em;
    margin-right: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .creator-form-buttons-sort{
    margin-left: 1em;
    margin-right: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .creator-form-buttons-wrapper{
    padding: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .bottom-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #2d8246;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
</style>
