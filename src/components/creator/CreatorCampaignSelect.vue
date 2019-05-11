<template>
  <div class="campaign-select">

    <div class="multi-select-campaign">

      <div class="campaign-select-box">
        <p>Campagnes disponibles</p>
        <CreatorCampaignSelectBox :campaigns="notSelectedCampaigns" ref="addinto"/>
      </div>

      <div class="button-wrapper">
        <button type="button"
                class="add-selected-button"
                @click="addSelectedCampaigns()"
        >
          <i class="material-icons md-24">arrow_forward</i>
        </button>
        <button type="button"
                class="remove-selected-button"
                @click="removeSelectedCampaigns()"
        >
          <i class="material-icons md-24">arrow_back</i>
        </button>
      </div>

      <div class="campaign-select-box">
        <p>Campagnes sélectionnées</p>
        <CreatorCampaignSelectBox :campaigns="getFullCampaigns(selectedCampaigns)" ref="removefrom"/>
      </div>

    </div>


    <div class="add-new-campaign-wrapper">
      <div class="add-new-campaign">
        <input class="new-campaign-box"
               type="text"
               placeholder="Ajouter une campagne"
               v-model="newCampaignName"
               @keydown.enter="createNewCampaign"
        />
        <i v-if="newCampaignName" class="material-icons md-18" role="button" @click.stop=""
           @click="createNewCampaign">add</i>
      </div>
      <p v-if="newCampaignAlreadyExists">Cette campagne existe déjà</p>
    </div>


  </div>
</template>
<script>
  import * as uuid from "uuid";
  import {saveFormCampaignFB} from "../../thunks/creatorForm";
  import {doesCampaignExists, getFormCampaign} from "../../helpers/campaignsHelpers";
  import CreatorCampaignSelectBox from "@/components/creator/CreatorCampaignSelectBox";

  export default {
    name: "CreatorCampaignSelect",
    components: {CreatorCampaignSelectBox},
    data() {
      return {
        showList: false,
        selectedCampaigns: (this.formCampaign || []).slice(),
        newCampaignName: null,
        searchQuery: '',
        newCampaignAlreadyExists: false,
      }
    },
    methods: {
      setPublishingCampaigns(publishingCampaigns) {
        this.$parent.$emit('set-publishing-campaign', publishingCampaigns);
      },

      createNewCampaign() {
        this.newCampaignAlreadyExists = false;
        if (this.newCampaignName) {
          // Check if campaign already exists
          if (!doesCampaignExists(this.campaignsFB, this.newCampaignName)) {
            const newCampaignID = uuid.v4();
            saveFormCampaignFB(newCampaignID, {id: newCampaignID, name: this.newCampaignName});
            this.addSelected(newCampaignID);
          } else this.newCampaignAlreadyExists = true;
        }
        this.newCampaignName = null;
      },

      removeSelected(campaignID) {
        this.newCampaignAlreadyExists = false;
        const index = this.selectedCampaigns.findIndex(c => c === campaignID);
        if (index >= 0) {
          this.selectedCampaigns.splice(index, 1);
          this.setPublishingCampaigns(this.selectedCampaigns);
        }
      },

      addSelected(campaignID) {
        this.newCampaignAlreadyExists = false;
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

      addSelectedCampaigns() {
        this.$refs.addinto.addToCampaignsSelectedByUser()
      },

      removeSelectedCampaigns() {
        this.$refs.removefrom.removeFromCampaignsSelectedByUser()
      },

      add(data) {
        data.forEach(sc => {
          this.addSelected(sc)
        });
      },

      remove(data) {
        data.forEach(sc => {
          this.removeSelected(sc)
        });
      }

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
      formCampaign() {
        return getFormCampaign(this.campaignsFB, this.formID)
      },
      searchTokens() {
        return this.searchQuery.split(' ');
      },
    },
    watch: {
      formCampaign: function (newValue) {
        if (![...this.selectedCampaigns].length > 0)
          this.selectedCampaigns = newValue ? newValue.slice() : [];
      }
    },
    created: function () {
      this.$root.$on('add-to-selected-by-user', (data) => {
        this.add(data);
      });

      this.$root.$on('remove-from-selected-by-user', (data) => {
        this.remove(data);
      });

      this.selectedCampaigns = this.formCampaign.slice();
      this.setPublishingCampaigns(this.selectedCampaigns);

    }
  }
</script>
<style scoped>
  .campaign-select {
    width: 100%;
  }

  .new-campaign-box {
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid rgb(217, 217, 217);
    font-size: 1em;
    color: #2c3e50;
  }

  .new-campaign-box:focus {
    outline: none;
  }

  .add-new-campaign {
    width: 150px;
    font-size: 0.9em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 2px 10px 2px 10px;
    padding: 2px;
  }

  .add-selected-button {
    background: none;
    color: rgba(0, 0, 0, 0.7);
    font-size: large;
    border: none;
    outline-style: none;
    box-shadow: none;
    display: block;
    margin-bottom: 0.1em;
  }

  .remove-selected-button {
    background: none;
    color: rgba(0, 0, 0, 0.7);
    border: none;
    font-size: large;
    outline-style: none;
    box-shadow: none;
    display: block;
  }

  .remove-selected-button:hover {
    cursor: pointer;
  }

  .add-selected-button:hover {
    cursor: pointer;
  }

  .multi-select-campaign {

    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .material-icons:hover {
    cursor: pointer;
  }

  .campaign-select-box {
    width: 30%;
  }

  .add-new-campaign-wrapper{
    margin-top: 2em;
    display: flex;
    justify-content: center;
  }

  .button-wrapper{
    align-self: center;
  }

  @media screen and (max-width: 650px) {
    .campaign-select-box{
      width: auto;
    }

    .multi-select-campaign {

      display: block;
      flex-direction: row;
      justify-content: center;
    }

    .button-wrapper{
      margin-top: 1em;
      width: fit-content;
      display: inline-block;
    }

    .add-selected-button{
      display: inline-block;
      transform: rotate(90deg);
    }

    .add-selected-button i{
      font-size: 36px;
    }

    .remove-selected-button{
      display: inline-block;
      transform: rotate(90deg);
    }

    .remove-selected-button i{
      font-size: 36px;
    }
  }
</style>
