<template>
  <div class="campaign-select">

    <div class="select-box" @click="showList = !showList" title="Campagnes du formulaire">
      <div class="selected-campaign-list">
        <div class="selected-campaign" v-for="c in getFullCampaigns(selectedCampaigns)"
             @click="removeSelected(c.id)"
             @click.stop="">

          <div class="selected-campaign-content">

            <span>{{c.name}} </span><i class="material-icons md-18">close</i>

          </div>

        </div>

        <div class="search-campaign">
          <input class="search-box"
                 type="text"
                 placeholder="Nom de la campagne..."
                 v-if="showList"
                 v-model="searchQuery"
                 @click.stop=""/>
          <i v-if="searchQuery && showList" class="material-icons md-18" role="button" @click.stop=""
             @click="searchQuery = ''">clear</i>
        </div>
      </div>

      <i class="material-icons" @click.stop="" @click="showList = !showList">keyboard_arrow_down</i>

    </div>


    <transition name="accordion-fade-slide" mode="out-in">
      <div class="campaigns-list" v-if="showList">
        <div class="no-campaign-found" v-if="searchedCampaigns.length <= 0">Aucune campagne</div>

        <div v-else class="campaign-to-select"
             v-for="c in searchedCampaigns"
             @click="addSelected(c.id)">

          {{c.name}} ({{(c.forms || []).length}} formulaires)

        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import * as uuid from "uuid";
  import {saveFormCampaignFB} from "../../thunks/creatorForm";
  import {doesCampaignExists, getFormCampaign} from "../../helpers/campaignsHelpers";
  import {sameAnswersArray} from "../../helpers/userAnswersHelpers";

  export default {
    name: "CreatorCampaignSelect",
    data() {
      return {
        showList: false,
        selectedCampaigns: (this.formCampaign || []).slice(),
        newCampaignName: null,
        searchQuery: ''
      }
    },
    methods: {

      setPublishingCampaigns(publishingCampaigns) {
        this.$parent.$emit('set-publishing-campaign', publishingCampaigns);
      },

      addCampaign() {
        if (this.newCampaignName) {
          // Check if campaign already exists
          if (!doesCampaignExists(this.campaignsFB, this.newCampaignName)) {
            const newCampaignID = uuid.v4();
            saveFormCampaignFB(newCampaignID, {id: newCampaignID, name: this.newCampaignName});
            this.addSelected(newCampaignID);
          } else alert("La campagne existe déjà !");
        }
        this.newCampaignName = null;
      },

      removeSelected(campaignID) {
        const index = this.selectedCampaigns.findIndex(c => c === campaignID);

        if (index >= 0) {
          this.selectedCampaigns.splice(index, 1);
          this.setPublishingCampaigns(this.selectedCampaigns);
        }
      },

      addSelected(campaignID) {

        if (!this.selectedCampaigns.find(c => c === campaignID)) {
          this.selectedCampaigns.push(campaignID);
          this.setPublishingCampaigns(this.selectedCampaigns);
        }

      },

      getFullCampaign(campaignID) {
        return this.campaignsFB[campaignID] || {id: campaignID, name: '...'};
      },

      getFullCampaigns(campaignsIDs) {
        return campaignsIDs.map(id => this.getFullCampaign(id))
          .sort((a, b) => a.name.localeCompare(b.name));
      },

    },

    computed: {
      formID() {
        return this.$store.getters.getCreatorFormID
      },

      campaignsFB() {
        return this.$store.getters.formCampaigns;
      },

      campaignsFBArray() {
        return Object.keys(this.campaignsFB).map(id => this.campaignsFB[id])
      },

      notSelectedCampaigns() {
        return this.campaignsFBArray.filter(c => !this.selectedCampaigns.includes(c.id))
          .sort((a, b) => a.name.localeCompare(b.name))
      },

      searchedCampaigns() {

        return this.notSelectedCampaigns.filter(c =>
          this.searchTokens.every(t =>
            c.name.toLowerCase().includes(t.toLowerCase())
          ));
      },

      formCampaign() {
        return getFormCampaign(this.campaignsFB, this.formID)
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },
    },

    watch: {
      formCampaign: function (newValue) {
        if(!sameAnswersArray(newValue,[...this.selectedCampaigns]))
          this.selectedCampaigns = newValue ? newValue.slice() : [];
      }
    }
  }
</script>

<style scoped>
  .campaign-select {
    position: fixed;
    top: 5px;
    left: 5px;

    width: 300px;
  }

  .selected-campaign-list {
    float: left;
    width: 100%;
    padding: 5px;
  }


  .search-campaign {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .search-box {
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid rgb(217, 217, 217);

    font-size: 1em;
    color: #2c3e50;
  }

  .search-box:focus {
    outline: none;
  }

  .select-box {
    width: 100%;

    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    background: white;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;
  }

  .selected-campaign {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    text-decoration: none solid rgba(0, 0, 0, 0.65);
    background: rgb(250, 250, 250);
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    margin: 0 10px 10px 0;
    padding: 0 7px;

    cursor: pointer;
  }

  .selected-campaign-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .campaigns-list {
    width: 100%;
    border: 1px solid rgb(217, 217, 217);
    border-radius: 4px 4px 4px 4px;
    background: white;

    max-height: 155px;
    overflow-y: auto;
  }

  .campaigns-list:hover {
    cursor: pointer;
  }

  .campaign-to-select {
    text-align: left;

    margin: 2px 10px 2px 10px;
    padding: 2px;
    border-bottom: 1px solid rgb(217, 217, 217);
  }

  .campaign-to-select:hover {
    background: #00000033;

    cursor: pointer;
  }

  .no-campaign-found {
    margin: 5px;
  }

  .accordion-fade-slide-enter-active, .accordion-fade-slide-leave-active {
    transition: all 0.25s;
  }

  .accordion-fade-slide-enter {
    transform: translateY(-10px);
    opacity: 0;
  }

  .accordion-fade-slide-leave-to {
    transform: translateY(-10px);
    opacity: 0;
  }

</style>
