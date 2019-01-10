import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getPublishedFormFromID, publishedFormsPath, publishingPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: '',
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
  },
  mutations: {
    setFormEntries: (state) => {
      Firebase.database().ref(getPublishedFormFromID(state.formID).concat('/entries'))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) {
            const entries = Object.keys(value).map(formEntryKey => value[formEntryKey]);
            state.formEntries = entries.sort((a, b) => a.index - b.index);
          }
          else state.formEntries = null
        })
    },
    setFormID: (state, {formID}) => {
      state.formID = formID;
    },
    setFormTitle: (state) => {
      Firebase.database().ref(getPublishedFormFromID(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) state.formTitle = value.title;
          else state.formTitle = null
        })
    },
  },
  actions: {
    setFormEntries: (context) => {
      context.commit('setFormEntries')
    },
    setFormID: (context, {formID}) => {
      context.commit('setFormID', {formID});
      context.commit('setFormEntries');
      context.commit('setFormTitle');

    },
    setFormTitle: (context) => {
      context.commit('setFormTitle')
    },
  }

}
