<template>
  <div class="form-campaigns">

    <h1>Campagnes</h1>

    <div class="space-header"></div>

    <div class="campaigns-header">

      <div class="input-wrapper">
        <input class="input"
               type="text"
               placeholder="Rechercher une campagne"
               v-model="searchQuery"
               @click.stop=""/>
        <div class="campaigns-button">
          <i v-if="searchQuery" class="material-icons md-18" role="button" @click.stop=""
             @click="searchQuery = ''">clear</i>
        </div>
      </div>

      <div class="create-campaign">
        <div class="input-wrapper">
          <input class="input"
                 type="text"
                 placeholder="Ajouter une campagne"
                 v-model="newCampaignName"
                 @keydown.enter="createNewCampaign"
          />
          <div @click="createNewCampaign" class="campaigns-button">
            <i class="material-icons md-24"
               title="Créer une campagne">add_circle</i>
          </div>
        </div>
        <p v-if="newCampaignAlreadyExists" class="new-campaign-already-exits-text">Cette campagne existe déjà</p>
      </div>

    </div>

    <div v-if="campaignAsArray.length > 0">

      <div v-if="searchedCampaign.length > 0 ">

        <div class="campaigns-grid">

          <div v-for="campaign in searchedCampaign"
               :key="campaign.id"
               class="campaign-grid-entry"
               @click="navigate(campaign)"
               :title="campaign.name"
          >
            <div class="campaign-content">
              <div class="campaign-grid-title">
                {{campaign.name}}
              </div>

              <hr/>

              <div class="campaign-form-number">
                {{(campaign.forms || []).length}} Formoop{{(campaign.forms || []).length >1 ? 's' : ''}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <h3>Aucune campagne correspondant à la recherche trouvée</h3>
      </div>
    </div>

    <div v-else>
      <h1>Aucune campagne</h1>
    </div>

  </div>
</template>

<script>
  import * as uuid from "uuid";
  import {saveFormCampaignFB} from "../../thunks/creatorForm";
  import {doesCampaignExists} from "../../helpers/campaignsHelpers";

  export default {
    name: "FormCampaign",
    data() {
      return {
        newCampaignName: null,
        newCampaignAlreadyExists: false,
        searchQuery: "",
      }
    },

    methods: {
      getCampaignPath(campaign) {
        return "monitor/campaign/".concat(campaign.id);
      },

      navigate(campaign) {
        this.$router.push(this.getCampaignPath(campaign))
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


    },

    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },

      campaignAsArray() {
        return Object.keys(this.formCampaigns).map(key => this.formCampaigns[key]);
      },

      searchedCampaign() {
        return this.campaignAsArray.filter(f =>
          this.searchTokens.every(t =>
            f.name.toLowerCase().includes(t.toLowerCase())
          ));
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },
    },

    created() {
      this.$store.dispatch('setPublishedForms');
      this.$store.dispatch('setFormCampaigns');
    },
  }
</script>

<style scoped>
  .form-campaigns{
    margin-left: 20%;
    margin-right: 20%;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .campaigns-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .input-wrapper {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: normal;
    align-items: center;
  }

  .input {
    width: auto;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1em;
    color: #2c3e50;
    margin: 0 2px 0 2px;
  }

  .input:focus {
    outline: none;
  }

  .input::placeholder {
    font-size: 0.9em;
  }

  .campaigns-button {
    cursor: pointer;
    color: #00000070;
  }

  .campaigns-button :hover {
    cursor: pointer;
    color: #000000aa;
  }

  .campaigns-grid {
    width: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
    grid-auto-rows: 1fr;
  }

  .campaigns-grid > *:hover {
    cursor: pointer;
    transform: scale(1.075);
  }

  .campaign-grid-entry {
    margin: 5px;
    padding: 2px;
    background: #f6f6f6;
    transition: transform .2s;
    border-radius: 6px;
  }

  .campaign-content {
    margin: 5px;
    background: #f6f6f6;
    transition: transform .2s;
    border-radius: 6px;
    padding: 2px;
  }

  .campaign-grid-title {
    margin-left: 5px;
    margin-right: 10px;
    font-weight: bold;
  }

  .campaign-form-number {

  }

  hr {
    width: 80%;
    margin-left: 10%;
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    padding: 0;
  }

  @media screen and (max-width: 720px) {
    .campaigns-header {
      display: inline-block;
    }
  }


</style>
