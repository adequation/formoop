<template>
  <div>
    <div class="multiselect">
      <p>{{formPublishingCampaign.map(id=> campaignsFB[id].name).join(' | ')}}</p>

      <div class="selectBox" @click="showCampaignList">
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
        <span class="add-new-campaign">
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
  import {doesCampaignExists, getFormCampaign} from "../../helpers/campaignsHelpers";

  export default {
    name: "CreatorPublishingCampaignSelector",
    data() {
      return {
        showList: false,
        formPublishingCampaign: this.formCampaign || [],
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
          this.formPublishingCampaign.includes(c.target.id) ?
            this.formPublishingCampaign =
              this.formPublishingCampaign.filter(cc => cc !== c.target.id)
            : this.formPublishingCampaign.push(c.target.id);
        }
        this.setPublishingCampaigns(this.formPublishingCampaign);
      },

      setPublishingCampaigns(publishingCampaigns) {
        this.$parent.$emit('set-publishing-campaign', publishingCampaigns);
      },

      addCampaign() {
        if (this.newCampaignName) {
          // Check if campaign already exists
          if (!doesCampaignExists(this.campaignsFB, this.newCampaignName)) {

            const newCampaignID = uuid.v4();

            saveFormCampaignFB(newCampaignID, {id: newCampaignID, name: this.newCampaignName})
          } else alert("La campagne existe déjà !");
        }
        this.newCampaignName = null;
      },

    },
    computed: {
      formID() {
        return this.$store.getters.getCreatorFormID
      },
      campaignsFB() {
        return this.$store.getters.formCampaigns;
      },
      formCampaign() {
        return getFormCampaign(this.campaignsFB, this.formID)
      }
    },
    watch: {
      formCampaign: function (newValue) {
        this.formPublishingCampaign = newValue
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
    text-align: left;
  }

  #campaigns-list label:hover {
    background-color: #b45a23;
  }

</style>
