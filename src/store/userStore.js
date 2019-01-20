import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getAnsweringPath, getPublishedFormFromID, publishedFormsPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: '',
    userAnswers: {}
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

    userAnswers: state => state.userAnswers
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

    setUserAnswers: (state) => {
      Firebase.database().ref(getAnsweringPath(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) {
            state.userAnswers = value;
          }
          else state.userAnswers = {}
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
      context.commit('setUserAnswers');
    },
    setFormTitle: (context) => {
      context.commit('setFormTitle')
    },
    setUserAnswers: (context) => {
      context.commit('setUserAnswers')
    },
  }

}
