<template>
    <div class="creator-campaign">
      <input type="text" v-model="name" title="" placeholder="Nom de la campagne"/>

      <p v-for="(f, i) in filteredForms" :key="f.id" @click="addFormToCampaign({id:f.id, title:f.title})">
        {{f.title}}
      </p>

      <p v-for="(f, i) in selectedForms" :key="f.id" style="color: green">
        {{f.title}} <button type="button" @click="removeFormToCampaign(f)">Supprimer</button>
      </p>

      <button type="button" @click="saveCampaign">Enregistrer la campagne</button>
    </div>
</template>

<script>
    import {saveFormCampaignFB} from "@/thunks/creatorForm";

    export default {
        name: "CreatorCampaign",
      data(){
          return {
            name: this.campaignName || 'Campagne sans nom',
            selectedForms: this.campaignForms || []
          }
      },
      methods:{
        saveCampaign(){
          saveFormCampaignFB(this.campaignID, {...this.campaign, id: this.campaignID, name:this.name, forms: this.selectedForms}).then((e) => {

            this.$store.dispatch('setCurrentCampaign', {campaignID: this.$route.params.campaignID});

          }).catch((e) => {
            console.log(e);
          });
        },

        setCampaign() {
          this.name          = this.campaignName;
          this.selectedForms = this.campaignForms;
        },

        addFormToCampaign(form){
          this.selectedForms.push(form);
        },

        removeFormToCampaign(form){
          const tmp = [...this.selectedForms];
          const formToDeleteIndex = tmp.findIndex(f => f.id === form.id);
          if (formToDeleteIndex >= 0) {
            tmp.splice(formToDeleteIndex, 1);
            this.selectedForms = tmp;
          }
        }
      },
      computed:{
          campaign() {
            return this.$store.getters.currentCampaign;
          },
          publishedForms() {
            return this.$store.getters.publishedForms;
          },
          campaignForms(){
              return this.campaign ? this.campaign.forms : []
          },
          campaignName(){
              return this.campaign ? this.campaign.name : ''
          },
          campaignID(){
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

        campaign: function(){
          this.setCampaign();
        }
      }
    }
</script>

<style scoped>
  .creator-campaign {

  }
</style>
