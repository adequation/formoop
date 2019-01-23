<template>
  <div class="creator-campaign-wrapper">
    <input type="text" v-model="name" title="" placeholder="Nom de la campagne"/>

    <div
      v-for="(f, i) in filteredForms"
      :key="f.id"
      @click="addFormToCampaign({id:f.id, title:f.title})"
      class="creator-campaign-form-wrapper">

      <div class="creator-campaign-form">
        <div class="creator-campaign-content">
          {{f.title}}
        </div>
      </div>
    </div>

    <div
      v-for="(f, i) in selectedForms"
      :key="f.id"
      class="creator-campaign-form-wrapper">

      <div class="creator-campaign-form-selected" @click="removeFormToCampaign(f)">
        <div class="creator-campaign-content">
          {{f.title}}
        </div>
      </div>

    </div>

    <button type="button" @click="saveCampaign">Enregistrer la campagne</button>
  </div>
</template>

<script>
  import {saveFormCampaignFB} from "@/thunks/creatorForm";

  export default {
    name: "CreatorCampaign",
    data() {
      return {
        name: this.campaignName || 'Campagne sans nom',
        selectedForms: this.campaignForms || []
      }
    },
    methods: {
      saveCampaign() {
        saveFormCampaignFB(this.campaignID, {
          ...this.campaign,
          id: this.campaignID,
          name: this.name,
          forms: this.selectedForms
        }).then((e) => {

          this.$store.dispatch('setCurrentCampaign', {campaignID: this.$route.params.campaignID});

        }).catch((e) => {
          console.log(e);
        });
      },

      setCampaign() {
        this.name = this.campaignName || '';
        this.selectedForms = this.campaignForms || [];
      },

      addFormToCampaign(form) {
        this.selectedForms.push(form);
      },

      removeFormToCampaign(form) {
        const tmp = [...this.selectedForms];
        const formToDeleteIndex = tmp.findIndex(f => f.id === form.id);
        if (formToDeleteIndex >= 0) {
          tmp.splice(formToDeleteIndex, 1);
          this.selectedForms = tmp;
        }
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
        return this.campaign ? this.campaign.forms : []
      },
      campaignName() {
        return this.campaign ? this.campaign.name : ''
      },
      campaignID() {
        return this.campaign ? this.campaign.id : this.$route.params.campaignID;
      },

      filteredForms() {
        return this.publishedForms.filter(pf => !this.selectedForms.find(cf => pf.id === cf.id))
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

      campaign: function () {
        this.setCampaign();
      }
    }
  }
</script>

<style scoped>
  .creator-campaign-wrapper {
    display: inline-block;
  }

  .creator-campaign-form {
    margin: 1em;

    cursor: pointer;
    font-size: large;
    background: #f5f5f5;
    border: 1px solid #00000055;
    padding: 0.2em 0.5em 0.1em 0.5em;

    width: auto;
    overflow: hidden;

    border-radius: 15px;
  }

  .creator-campaign-form:hover {
    background: #00000022;

  }

  .creator-campaign-form-selected {

    margin: 1em;

    cursor: pointer;
    font-size: large;
    color: white;
    background: #4286f4;
    border: 1px solid #00000055;
    padding: 0.2em 0.5em 0.1em 0.5em;

    font-weight: 600;

    width: auto;
    overflow: hidden;

    border-radius: 15px;
  }

  .creator-campaign-form-selected:hover {
    background: #3462ad;
  }

  .creator-campaign-content {
    width: auto;
  }

  .creator-campaign-content i {
    margin-right: 0.2em;
  }

  .creator-campaign-form-wrapper {
    margin: auto;
  }

</style>
