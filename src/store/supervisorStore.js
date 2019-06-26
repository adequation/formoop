import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getPublishedFormFromID} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: ''
  },
  getters: {
    getSupervisorFormEntries: state => {
      return state.formEntries
    },
    getSupervisorFormID: state => {
      return state.formID
    },
    getSupervisorFormTitle: state => {
      return state.formTitle
    },
  },
  mutations: {
    setSupervisorFormEntries: state => {
      Firebase.database().ref(getPublishedFormFromID(state.formID).concat('/entries'))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) state.formEntries = Object.keys(value).map(formEntryKey => value[formEntryKey]);
          else state.formEntries = null
        })
    },

    setFormID: (state, {formID}) => {
      state.formID = formID
    },

    setSupervisorFormTitle: state => {
      Firebase.database().ref(getPublishedFormFromID(state.formID))
        .on('value', function (snapshot){
          const value = snapshot.val();
          if (value) state.formTitle = value.title;
          else state.formTitle = null
        })
    },
  },
  actions: {
    setSupervisorFormEntries: context => {
      context.commit('setSupervisorFormEntries')
    },
    setFormID: (context, {formID}) => {
      context.commit('setFormID', {formID});
      context.commit('setSupervisorFormTitle');
      context.commit('setSupervisorFormEntries')
    },
  }
}
