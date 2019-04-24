<template>
  <div>

    <DockingMenu class="campaigns-top-menu"
                 ref="top-menu"
                 top>
      <div slot="body">
        <Tabs :current-tab="currentTab" :tabs="tabs" @change-tab="changeTab($event)"/>

      </div>
    </DockingMenu>

    <div class="campaign-form-header"></div>

    <!-- ////////////////////////////////////////// CONSULT AREA ////////////////////////////////////////// !-->

    <div v-if="currentTab === 'consult'">


      <h1>{{campaignName}}</h1>


      <Modal v-if="showSingleForm" @close="showSingleForm = false">

        <div slot="body">

          <div class="single-form-wrapper">
            <div class="single-form">

              <SupervisorForceDirectedGraph v-if="selectedForm.usersAnswers"
                                            :userAnswers="selectedForm.usersAnswers"
                                            :formEntries="selectedForm ?
                                          Object.keys(selectedForm.entries).map(k =>  selectedForm.entries[k]) : []"
                                            :users="selectedForm.users"/>

            </div>
          </div>


        </div>
      </Modal>

      <div v-if="campaignFullForms.length > 0">

        <div>
          <table class="campaign-progression-table">
            <th>Nom du formulaire</th>
            <th>Progression</th>
            <th>Points d'entrée</th>
            <th>Nombre de participants</th>
            <th>Nombre de participants actifs</th>
            <th>État</th>
            <tr v-for="form in campaignFullForms" :key="'O-' + form.id" @click="openSingleForm(form)">
              <td>{{form.title}}</td>
              <td>
                <SupervisorCampaignProgressChart :data="[getFormProgress(form)]"/>
              </td>
              <td><span class="tag" v-for="e in getEntryPoints(form).map(ep => ep.name)">{{e}}</span></td>
              <td>{{(form.users ? Object.keys(form.users) : []).length}}</td>
              <td>{{getActivePeople(form.usersAnswers, (form.users ? Object.keys(form.users) : []).length)}}</td>
              <td><i class="material-icons">lock_open</i></td>
            </tr>
            <tr v-for="form in campaignClosedForms" :key="'C-' + form.id" @click="openSingleForm(form)">
              <td>{{form.title}}</td>
              <td>
                <SupervisorCampaignProgressChart :data="[getFormProgress(form)]"/>
              </td>
              <td><span class="tag" v-for="e in getEntryPoints(form).map(ep => ep.name)">{{e}}</span></td>
              <td>{{(form.users ? Object.keys(form.users) : []).length}}</td>
              <td>{{getActivePeople(form.usersAnswers, (form.users ? Object.keys(form.users) : []).length)}}</td>
              <td><i class="material-icons">lock</i></td>
            </tr>
          </table>
        </div>

        <SupervisorProgressChart
          :percentage="campaignFormsProgress.reduce( ( sum, { value } ) => sum + value , 0)/ campaignFormsProgress.length"></SupervisorProgressChart>

        <div class="supervisor-footer">

        </div>
      </div>

      <div v-else>
        <h3>Aucun formoop dans cette campagne</h3>
      </div>

      <DockingMenu class="supervisor-campaign-bottom-menu">
        <div slot="body">

          <div class="supervisor-campaign-bottom-menu-wrapper">


            <div class="creator-form-buttons-wrapper">

              <div class="creator-form-buttons-type">
                <button class="bottom-button filter-button" title="Progression"><i class="material-icons">timeline</i>
                </button>
                <button class="bottom-button filter-button" title="Conflits"><i class="material-icons">event_busy</i>
                </button>
              </div>

              <div class="creator-form-buttons-sort">
                <button class="bottom-button sort-button" title="Filtrer">
                  <i class="material-icons">sort</i>
                </button>
                <button class="bottom-button sort-button" title="Filtrer par ordre alphabetique">
                  <i class="material-icons">sort_by_alpha</i>
                </button>
              </div>

            </div>


            <div class="creator-form-tools-wrapper">
              <!--<download-campaign class="bottom-button tool-button" title="Récupérer les résultats" :campaign="campaign"
                                 :campaign-forms="campaignFullForms" :campaign-closed-forms="campaignClosedForms"/>-->
              <button class="bottom-button tool-button" title="Récupérer les résultats"
                      @click="showDownloadForm = true"><i class="material-icons md-36">save_alt</i></button>
              <DownloadCampaignModal :campaign="this.campaign" :open-forms-to-select="this.campaignFullForms"
                                     :closed-forms-to-select="this.campaignClosedForms" :show-modal="showDownloadForm"
                                     @close="showDownloadForm = false"/>
              <button class="bottom-button tool-button" title="Progression"><i
                class="material-icons md-36">description</i></button>
            </div>
          </div>


        </div>
      </DockingMenu>

    </div>

    <!-- ////////////////////////////////////////// DELETE AREA ////////////////////////////////////////// !-->

    <div v-if="currentTab === 'delete'" class="delete-area">

      <p class="delete-infos-message">
        Attention ! <br/>
        En supprimant cette campagne, toute progression liée à celle-ci sera perdue.
      </p>

      <div class="delete-area">
        <div class="delete-campaign-button" title="Supprimer la campagne" @click="deleteCampaign">
          <i class="material-icons md-36" role="button" @click.stop=""
          >delete</i>
          <p>Supprimer la campagne</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import SupervisorCampaignProgressChart from "@/components/supervisor/SupervisorCampaignProgressChart";
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";
  import DockingMenu from "@/components/containers/DockingMenu";
  import {activeParticipantNumber, getPercentage} from "@/helpers/userAnswersHelpers";
  import Modal from "@/components/containers/Modal";
  import SupervisorBasicFormInfo from "@/components/supervisor/SupervisorBasicFormInfo";
  import SupervisorForceDirectedGraph from "@/components/supervisor/SupervisorForceDirectedGraph";
  import DownloadCampaign from "../general/DownloadCampaign";
  import DownloadForm from "../general/DownloadForm";
  import DownloadCampaignModal from "./DownloadCampaignModal";
  import {deleteCampaignFromFormCampaignsFB} from "@/thunks/creatorForm";
  import Tabs from "@/components/containers/Tabs";

  export default {
    name: "SupervisorCampaignDashboard",
    components: {
      DownloadCampaignModal,
      DownloadForm,
      DownloadCampaign,
      Tabs,
      SupervisorForceDirectedGraph,
      SupervisorBasicFormInfo, Modal, SupervisorProgressChart, SupervisorCampaignProgressChart, DockingMenu
    },

    data() {
      return {
        showSingleForm: false,
        showDownloadForm: false,
        selectedForm: null,
        tabs: [
          {title: 'Consulter', value: 'consult', icon: 'search'},
          {title: 'Supprimer', value: 'delete', icon: 'delete'},
        ],
        currentTab: 'consult',
      }
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

      campaignClosedForms() {
        return this.campaign ? this.$store.getters.campaignClosedForms || [] : []
      },

      campaignFormsProgress() {
        return this.campaignFullForms.map(f => this.getFormProgress(f));
      },

      campaignName() {
        return this.campaign ? this.campaign.name : 'Campagne inconnue'
      },

      campaignID() {
        return this.campaign ? this.campaign.id : this.$route.params.campaignID;
      },

      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

    },

    methods: {

      changeTab(newTab) {
        if (this.currentTab === newTab) return;
        this.currentTab = newTab;
      },

      getFormProgress(form) {
        return {
          name: form.title,
          id: form.id,
          value: getPercentage('answered',
            Object.keys(form.entries).map(formEntryKey => form.entries[formEntryKey]),
            form.usersAnswers)
        }
      },

      getEntryPoints(form) {
        return form.entryPoint ? Object.keys(form.entryPoint).map(key => form.entryPoint[key]) : []
      },

      openSingleForm(form) {
        this.selectedForm = form;
        this.showSingleForm = true;
      },

      getActivePeople(usersAnswers, totalNumberOfInvitedPeople) {
        let activePercentage = 0;
        if (totalNumberOfInvitedPeople > 0)
          activePercentage = activeParticipantNumber(usersAnswers) / totalNumberOfInvitedPeople;

        return `${activeParticipantNumber(usersAnswers)} (${activePercentage * 100}%)`;
      },

      deleteCampaign() {
        if (confirm(`Es-tu sûr de vouloir supprimer cette campagne? \nToute progression associée sera perdue`)) {
          deleteCampaignFromFormCampaignsFB(this.campaignID);
          this.$router.replace("/campaigns");
        }
      }

    },

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
        this.$store.dispatch('setCampaignClosedForms');
      }
    }
  }
</script>

<style scoped>
  .supervisor-campaign-bottom-menu {
    height: 5em;

  }

  .supervisor-campaign-bottom-menu-wrapper {
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .campaign-progression-table {
    width: 100%;
    border-collapse: collapse;
  }

  .campaign-progression-table td {
    border-bottom: 1px solid #e8e8e8;
  }

  .campaign-progression-table tr:hover {
    background: #00000011;
    cursor: pointer;
  }

  .creator-form-buttons-type {
    margin-left: 1em;
    margin-right: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .creator-form-buttons-sort {
    margin-left: 1em;
    margin-right: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .creator-form-buttons-wrapper {
    padding: 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  .creator-form-tools-wrapper {

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

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .filter-button {
    background: #4286f4;
  }

  .sort-button {
    background: #fa7d32;
  }

  .tool-button {
    background: #2d8246;
  }

  .filter-button:hover {
    background: #3462ad;
  }

  .sort-button:hover {
    background: #c86428;
  }

  .tool-button:hover {
    background: #276a35;
  }

  .single-form {

    overflow-y: hidden;
    max-height: 75vh;
  }

  .single-form-wrapper {
    height: 100%;
  }

  .tag {
    display: inline-block;
    white-space: nowrap;
    height: 20px;
    line-height: 20px;
    text-decoration: none solid rgba(0, 0, 0, 0.65);
    background: rgb(250, 250, 250);
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    margin: 0 10px 10px 0;
    padding: 0 7px;

    overflow: hidden;

    cursor: pointer;
  }

  .supervisor-footer {
    margin: 8em;
  }

  .form-delete-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 999;
    color: tomato;
  }

  .form-delete-button:hover {
    cursor: pointer;
  }

  .campaign-form-header {
    margin: 4em;
  }

  .campaigns-top-menu {
    background-color: #4286f4 !important;
    padding-bottom: 2px;
  }

  .delete-campaign-button {
    color: white;
    background: tomato;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 200px;
    border-radius: 16px;
    padding-right: 5px;
  }

  .delete-campaign-button:hover {
    cursor: pointer;
    background: #dc472f;
  }

  .delete-infos-message {
  }

  .delete-area {
    display: inline-block;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

</style>
