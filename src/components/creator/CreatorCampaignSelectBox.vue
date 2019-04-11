<template>
  <div class="campaign-select-box">

    <div class="search-campaign">
      <input class="search-box"
             type="text"
             placeholder="Rechercher une campagne"
             v-model="searchQuery"
             @click.stop=""/>
      <i v-if="searchQuery" class="material-icons md-18" role="button" @click.stop=""
         @click="searchQuery = ''">clear</i>
    </div>

    <div class="campaign-list">
      <p v-if="searchedCampaigns.length > 0" v-for="(c,i) in searchedCampaigns"
         @click="addToSelectedCampaigns(c.id, i)"
         ref="campaignsToSelect"
         class="campaign-to-add"
      >
        {{c.name}} ({{(c.forms || []).length}} formoops)
      </p>

      <p v-if="searchedCampaigns.length === 0">Aucune campagne</p>
    </div>

  </div>
</template>

<script>
  export default {
    name: "CreatorCampaignSelectBox",
    data() {
      return {
        searchQuery: '',
        selectedCampaigns: []
      }
    },
    props: {
      campaigns: {
        type: Array,
        required: true
      },
    },
    methods: {

      addToSelectedCampaigns(campaignID, i) {
        if (this.selectedCampaigns.includes(campaignID)) {
          const index = this.selectedCampaigns.findIndex(c => c === campaignID);
          if (index >= 0) {
            this.selectedCampaigns.splice(index, 1);
            this.$refs.campaignsToSelect[i].style.background = "";
            this.$refs.campaignsToSelect[i].style.color = "#2c3e50";
          }
        } else {
          this.selectedCampaigns.push(campaignID);
          this.$refs.campaignsToSelect[i].style.background = "#4286f4";
          this.$refs.campaignsToSelect[i].style.color = "#ffffff";
        }
      },

      addToCampaignsSelectedByUser() {
        this.$root.$emit('add-to-selected-by-user', this.selectedCampaigns);
        this.selectedCampaigns = [];
        this.$refs.campaignsToSelect.forEach(ca => {
          ca.style.background = "";
          ca.style.color = "#2c3e50";
        })
      },

      removeFromCampaignsSelectedByUser() {
        this.$root.$emit('remove-from-selected-by-user', this.selectedCampaigns);
        this.selectedCampaigns = [];
        this.$refs.campaignsToSelect.forEach(ca => {
          ca.style.background = "";
          ca.style.color = "#2c3e50";
        })
      }

    },

    computed: {
      searchedCampaigns() {
        return this.campaigns.filter(c =>
          this.searchTokens.every(t =>
            c.name.toLowerCase().includes(t.toLowerCase())
          ));
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },
    }
  }
</script>

<style scoped>

  .search-campaign {
    width: 100%;
    height: 10%;
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

  .campaign-select-box {
    width: 100%;
    height: 300px;
    border: 2px solid #2c3e50;
    border-radius: 4px;
  }

  .campaign-to-add:hover {
    cursor: pointer;
    background: rgb(217, 217, 217);
  }

  .campaign-to-add {
    margin: 3px;
    border-bottom: 1px solid rgb(217, 217, 217);
  }

  .material-icons:hover {
    cursor: pointer;
  }

  .campaign-list{
    height: 90%;
    overflow-y: auto;
  }
</style>
