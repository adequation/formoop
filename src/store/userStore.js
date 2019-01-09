import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getPublishedFormFromID, publishedFormsPath, publishingPath, publishingCampaignPath} from "@/helpers/firebaseHelpers";
import {findFormPath} from "../helpers/findingFormHelper";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: [],
    publishedCampaign: [],
    formEntries: [],
    formID: '',
    formTitle: '',
    formPath: '',
  },
  getters: {
    getFormEntries: state => {
      return state.formEntries ?
        state.formEntries.map(fe => ({...fe, usersAnswers: fe.usersAnswers || {}}))
        : state.formEntries;
    },
    getUserFormID: state => {
      return state.formID
    },
    getUserFormTitle: state => {
      return state.formTitle
    },
    publishedForms: state => {
      return state.publishedForms
    },
    publishedCampaign: state => {
      return state.publishedCampaign
    },
    getUserFormPath: state => {
      return state.formPath
    }
  },
  mutations: {
    setFormEntries: (state) => {
      Firebase.database().ref(state.formPath.concat('/entries'))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) {
            const entries = Object.keys(value).map(formEntryKey => value[formEntryKey]);
            state.formEntries = entries.sort((a, b) => a.index - b.index);
          }
          else state.formEntries = null;
        })
    },
    setFormID: (state, {formID}) => {
      state.formID = formID
    },
    setFormTitle: (state) => {
      Firebase.database().ref(state.formPath)
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) state.formTitle = value.title;
          else state.formTitle = null
        })
    },
    setPublishedForms: (state) => {
      Firebase.database().ref(publishingPath)
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if(value){
            state.publishedForms = Object.keys(value).map(k => (
              {title:value[k].title,
                id:value[k].id,
                questionNumber: value[k].entries ? Object.keys(value[k].entries).length : 0}
            ));
          }else{
            state.publishedForms = [];
          }
        })
    },
    setPublishedCampaign: state => {
      Firebase.database().ref(publishingCampaignPath)
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if(value) {
            state.publishedCampaign = Object.keys(value).map(c => (
              { campaignName: c,
                forms: Object.keys(value[c]).map(f =>(
                  {title:value[c][f].title,
                    id:value[c][f].id,
                    questionNumber: value[c][f].entries ? Object.keys(value[c][f].entries).length : 0}
                ))
              }
            ));
          }
          else{
            state.publishedCampaign = [];
          }
        })
    },
    setFormPath: state => {
      state.formPath = findFormPath(state.publishedForms, state.publishedCampaign, state.formID);
    }
  },
  actions: {
    setFormEntries: (context) => {
      context.commit('setFormEntries')
    },
    setFormID: (context, {formID}) => {
      context.commit('setFormID', {formID});
      context.commit('setPublishedForms');
      context.commit('setPublishedCampaign');
    },
    setFormTitle: (context) => {
      context.commit('setFormTitle')
    },
    setPublishedForms: (context) => {
      context.commit('setPublishedForms');
      context.commit('setFormTitle');
    },
    setPublishedCampaign: (context) => {
      context.commit('setPublishedCampaign');
      context.commit('setFormEntries');
      context.commit('setFormTitle');
    },
    setFormPath: (context) => {
      context.commit('setFormPath');
    }
  }

}
