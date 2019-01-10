import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {campaignPath, publishingPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: [],
    formCampaigns: [],
    currentCampaign: null
  },
  getters: {
    publishedForms: state => state.publishedForms,

    formCampaigns: state => state.formCampaigns,
    currentCampaign: state => state.currentCampaign,
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
          if (value) {
            state.formCampaigns = Object.keys(value).map(k => (
                {
                  name: value[k].name,
                  id: value[k].id,
                  formNumber: value[k].forms ? value[k].forms.length : 0,
                  forms: value[k].forms ? value[k].forms.map(cf => {
                    const fullForm = state.publishedForms.find(pf => pf.id === cf);
                    return {id: cf, name: fullForm ? fullForm.name : ''};
                  }) : []
                }
              )
            );
          } else {
            state.formCampaigns = [];
          }
        })
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
    }
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
    },
  }
}




