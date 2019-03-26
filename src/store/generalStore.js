import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {campaignPath, publishingPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: [],
    formCampaigns: [],
    currentCampaign: null,
    campaignFullForms: []
  },
  getters: {
    publishedForms:   state => state.publishedForms,
    formCampaigns:    state => state.formCampaigns,
    currentCampaign:  state => state.currentCampaign,
    campaignFullForms: state => state.campaignFullForms
  },
  mutations: {
    setPublishedForms: (state) => {
      Firebase.database().ref(publishingPath)
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.publishedForms = Object.keys(value).map(k => ({
              title: value[k].title,
              id: value[k].id,
              questionNumber: value[k].entries ? Object.keys(value[k].entries).length : 0
            }));
          } else {
            state.publishedForms = [];
          }
        })
    },

    setFormCampaigns: (state) => {
      Firebase.database().ref(campaignPath)
        .on('value', (snapshot) => {
          const value = snapshot.val();
          state.formCampaigns = value || {};

        })
    },

    setCampaignFullForms: (state) => {
      if(!state.currentCampaign) {
        state.campaignFullForms = [];
        return;
      }

      if(!state.currentCampaign.forms) {
        state.campaignFullForms = [];
        return;
      }

      if(state.currentCampaign.forms){
        Firebase.database().ref(publishingPath)
          .on('value', function (snapshot) {
            const value = snapshot.val();
            if (value) {
              state.campaignFullForms = state.currentCampaign.forms.map(cf => value[cf.id]);
            }
            else state.campaignFullForms = [];
          })
      }

    },

    setCurrentCampaign: (state, {campaignID}) => {
      Firebase.database().ref(campaignPath.concat(campaignID))
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.currentCampaign = value;
          } else {
            state.currentCampaign = null;
          }
        })
    },

  },
  actions: {
    setPublishedForms: (context) => {
      context.commit('setPublishedForms');
    },
    setFormCampaigns: (context) => {
      context.commit('setPublishedForms');
      context.commit('setFormCampaigns');
    },
    setCurrentCampaign: (context, {campaignID}) => {
      context.commit('setCurrentCampaign', {campaignID});
      context.commit('setFormCampaigns');
      context.commit('setCampaignFullForms');
    },

    setCampaignFullForms: (context) => {
      context.commit('setCampaignFullForms');
    }
  }
}




