<template>
  <div>
    <div class="multiselect">
      <div class="selectBox" @click="showCampaignList()">
        <select>
          <option>Campagne(s)</option>
        </select>
        <div class="overSelect"></div>
      </div>
      <div id="campaigns-list" @change="onChange($event)">
        <label>
          <input type="checkbox" id="none" :checked="!formPublishingCampaign.length > 0"/>Aucune</label>
        <label v-for="c in campaignsFB" :key="c.id">
          <input type="checkbox" :id=c.id :checked="formPublishingCampaign.includes(c.id)"/>{{c.name}}</label>
        <span>
          <input type="text" placeholder="Nouvelle campagne" v-model="newCampaignName"/>
          <button type="button" @click="addCampaign">+</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import * as uuid from "uuid";
  import {saveFormCampaignFB} from "../../thunks/creatorForm";
  import {getFormCampaign} from "../../helpers/campaignsHelpers";

  export default {
    name: "CreatorPublishingCampaignDropdown",
    data() {
      return {
        showList: false,
        formPublishingCampaign: [],
        newCampaignName: null
      }
    },
    methods: {
      showCampaignList() {
        const campaignList = document.getElementById("campaigns-list");
        if (!this.showList) {
          campaignList.style.display = "block";
          this.showList = true;
        } else {
          campaignList.style.display = "none";
          this.showList = false;
        }
      },
      onChange: function (c) {
        if (c.target.id === "none") {
          this.formPublishingCampaign = [];
        } else {
          this.formPublishingCampaign.includes(c.target.id) ? this.formPublishingCampaign = this.formPublishingCampaign.filter(cc => cc !== c.target.id) : this.formPublishingCampaign.push(c.target.id);
        }
        this.setPublishingCampaigns(this.formPublishingCampaign);
      },

      setPublishingCampaigns(publishingCampaigns) {
        this.$parent.$emit('set-publishing-campaign', publishingCampaigns);
      },

      addCampaign() {
        if (this.newCampaignName) {
          // Check if campaign already exists
          if (this.campaignsFB.filter(fc => fc.name === this.newCampaignName) > 0) return;

          const newCampaignID = uuid.v4();

          saveFormCampaignFB(newCampaignID, {id: newCampaignID, name: this.newCampaignName})
        }
        this.newCampaignName = null;
      },

      setFormCampaign(campaignsFromFB){
        this.formPublishingCampaign = getFormCampaign(campaignsFromFB, this.formID);
      }

    },
    computed: {
      formID() {
        return this.$store.getters.getCreatorFormID
      },
      campaignsFB() {
        return this.$store.getters.formCampaigns;
      },

    },
    watch : {
      campaignsFB: function(val) {
        this.setFormCampaign(val);
      }
    }
  }
</script>

<style scoped>
  .multiselect {
    width: 200px;
  }

  .selectBox {
    position: relative;
  }

  .selectBox select {
    width: 100%;
    font-weight: bold;
  }

  .overSelect {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }

  #campaigns-list {
    display: none;
    border: 1px #dadada solid;
  }

  #campaigns-list label {
    display: block;
  }

  #campaigns-list label:hover {
    background-color: #1e90ff;
  }
</style>
