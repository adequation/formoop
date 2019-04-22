<template>
  <div>
    <h1>Campagnes</h1>

    <div class="space-header"></div>

    <div class="campaigns-header">

      <div class="search-campaign">
        <input class="search-box"
               type="text"
               placeholder="Rechercher une campagne"
               v-model="searchQuery"
               @click.stop=""/>
        <div class="clean-search-button">
          <i v-if="searchQuery" class="material-icons md-18" role="button" @click.stop=""
             @click="searchQuery = ''">clear</i>
        </div>
      </div>

        <div class="create-campaign">
          <input class="create-campaign-box"
                 type="text"
                 placeholder="Ajouter une campagne"
                 v-model="newCampaignName"
                 @keydown.enter="createNewCampaign"
          />
          <div @click="createNewCampaign"><i class="material-icons md-24"
                                             title="Créer une campagne">add_circle</i></div>
        </div>

    </div>

    <div v-if="campaignAsArray.length > 0">

      <div class="campaigns-grid">

        <div v-for="campaign in searchedCampaign"
             :key="campaign.id"
             class="user-grid-entry"
             @click="navigate(campaign)"
             :title="campaign.name"
        >
          <div class="campaign-content">
            <div class="campaign-grid-header">
              <div class="campaign-grid-title">
                {{campaign.name}}
              </div>
            </div>

            <hr/>

            <div class="campaign-grid-description">
              <div class="campaign-form-number">
                {{(campaign.forms || []).length}} Formoop{{(campaign.forms || []).length >1 ? 's' : ''}}
              </div>
            </div>
          </div>
        </div>
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
        this.$router.replace(this.getCampaignPath(campaign))
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

  .campaigns-header {
    margin-left: 20%;
    margin-right: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .search-campaign {
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: normal;
    align-items: center;
  }

  .search-box {
    width: 175px;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1em;
    color: #2c3e50;
    margin: 0 2 0 2;
  }

  .search-box:focus {
    outline: none;
  }

  .search-box::placeholder {
    font-size: 0.9em;
  }

  .campaigns-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
    grid-auto-rows: 1fr;
    width: auto;
    margin-left: 20%;
    margin-right: 20%;
  }

  .campaigns-grid > *:hover {
    cursor: pointer;
    transform: scale(1.075);
  }

  .campaign-content {
    margin: 5px;
    background: #f6f6f6;

    transition: transform .2s;

    border-radius: 6px;
    padding: 2px;
  }

  .user-grid-entry {
    margin: 5px;
    background: #f6f6f6;

    transition: transform .2s;

    border-radius: 6px;
    padding: 2px;
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

  .campaign-grid-header {
    font-weight: bold;
  }

  .campaign-grid-title {
    margin-left: 5px;
    margin-right: 10px;
  }

  .campaign-grid-description {
  }

  .campaign-form-number {

  }

  .create-campaign > div {
    cursor: pointer;
    color: #00000070;
  }

  .create-campaign > div :hover {
    cursor: pointer;
    color: #000000aa;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .clean-search-button :hover {
    cursor: pointer;
  }

  .campaign-footer {
    margin-left: 20%;
    margin-right: 20%;
    align-items: center;
    display: inline-block;
  }

  .create-campaign {
    margin-top: 1em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .create-campaign-box{
    width: 175px;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1em;
    color: #2c3e50;
    outline: none;
  }

  .create-campaign i:hover {
    cursor: pointer;
  }
</style>
