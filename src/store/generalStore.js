import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {campaignPath, closedPath, publishingPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: [],
    formCampaigns: [],
    currentCampaign: null,
    campaignFullForms: [],
    campaignClosedForms: []
  },
  getters: {
    publishedForms: state => state.publishedForms,
    formCampaigns: state => state.formCampaigns,
    currentCampaign: state => state.currentCampaign,
    campaignFullForms: state => state.campaignFullForms,
    campaignClosedForms: state => state.campaignClosedForms,
  },
  mutations: {
    setPublishedForms: (state) => {
      Firebase.database().ref(publishingPath)
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.publishedForms = Object.keys(value).map(k => ({
              ...value[k],
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
      if (!state.currentCampaign) {
        state.campaignFullForms = [];
        return;
      }

      if (!state.currentCampaign.forms) {
        state.campaignFullForms = [];
        return;
      }

      if (state.currentCampaign.forms) {
        Firebase.database().ref(publishingPath)
          .on('value', function (snapshot) {
            const value = snapshot.val();

            if (value) {
              const fullForms = [];
              if(state.currentCampaign.forms)
              state.currentCampaign.forms.forEach(cf => {
                if(value[cf.id]) fullForms.push(value[cf.id]);
              });
              state.campaignFullForms = fullForms.slice();
            }
            else state.campaignFullForms = [];
          })
      }

    },

    setCampaignClosedForms: (state) => {
      if (!state.currentCampaign) {
        state.campaignClosedForms = [];
        return;
      }

      if (!state.currentCampaign.forms) {
        state.campaignClosedForms = [];
        return;
      }

      if (state.currentCampaign.forms) {
        Firebase.database().ref(closedPath)
          .on('value', function (snapshot) {
            const value = snapshot.val();
            if (value) {
              const fullForms = [];

              if(state.currentCampaign.forms)
              state.currentCampaign.forms.forEach(cf => {
                if(value[cf.id]) fullForms.push(value[cf.id]);
              });

              state.campaignClosedForms = fullForms.slice();
            }
            else state.campaignClosedForms = [];
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
      context.commit('setCampaignClosedForms');
    },

    setCampaignFullForms: (context) => {
      context.commit('setCampaignFullForms');
    },

    setCampaignClosedForms: (context) => {
      context.commit('setCampaignClosedForms');
    }
  }
}




