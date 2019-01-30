import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {campaignPath, getUser, nativeFbFunctions, publishingPath} from "@/helpers/firebaseHelpers";
import {getUserMetadata} from "@/thunks/userAccountThunks";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: [],
    formCampaigns: [],
    currentCampaign: null,
    userID: '',
    userEmail:'',
    userMetadata: {}
  },
  getters: {
    publishedForms:   state => state.publishedForms,
    formCampaigns:    state => state.formCampaigns,
    currentCampaign:  state => state.currentCampaign,
    user:             state => ({uid: state.userID, email: state.userEmail, ...state.userMetadata}),
    userID:           state => state.userID,
    userEmail:        state => state.userEmail,
    userMetadata:     state => state.userMetadata
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
    },

    setUser: (state) => {
      const user      = nativeFbFunctions.getCurrentUser();
      state.userID    = user.uid;
      state.userEmail = user.email;
    },

    setUserMetadata: (state) => {
      if(state.userID)
      Firebase.database().ref(getUser(state.userID).concat('/metadata'))
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.userMetadata = value;
          } else {
            state.userMetadata = {};
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
    setUser: (context) => {
      context.commit('setUser');
      context.commit('setUserMetadata')
    },

    setUserMetadata: (context) => {
      context.commit('setUserMetadata')
    }
  }
}




