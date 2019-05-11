import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getCreatedForms, nativeFbFunctions} from "@/helpers/firebaseHelpers";
import {closedPath} from "../helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formID: '',
    createdForms: [],
    finishedForms: [],
    creatorID: ''
  },
  getters: {
    getCreatorFormID: state => {
      return state.formID
    },
    createdForms: state => {
      return state.createdForms
    },
    finishedForms: state => {
      return state.finishedForms
    },
    creatorID: state => state.creatorID
  },
  mutations: {
    setFormID: (state, {formID}) => {
      state.formID = formID
    },

    setCreatedForms: (state) => {
      if (state.creatorID)
        Firebase.database().ref(getCreatedForms(state.creatorID))
          .on('value', (snapshot) => {
            const value = snapshot.val();
            if (value) {
              state.createdForms = Object.keys(value).map(k => (
                {
                  title: value[k].title,
                  entries: value[k].entries,
                  id: value[k].id,
                  sections: value.sections || [],
                  questionNumber: value[k].entries ? Object.keys(value[k].entries).length : 0,
                  greeting: value[k].greeting || '',
                  isRandomGreetingMode: !!value[k].isRandomGreetingMode
                }));
            } else {
              state.createdForms = [];
            }
          })
    },

    setCreatorID: state => {
      state.creatorID = nativeFbFunctions.getCurrentUser().uid;
    },

    setFinishedForms: (state) => {
      if (state.creatorID) {
        Firebase.database().ref(closedPath)
          .on('value', (snapshot) => {
            const value = snapshot.val();
            if (value) {
              const closedforms = Object.keys(value).map(form => value[form]);
              state.finishedForms = closedforms.filter(form => !!state.createdForms.find(Cform => Cform.id === form.id))
            }
          })
      }
    }
  },
  actions: {
    setFormID: (context, {formID}) => {
      context.commit('setFormID', {formID});
    },
    setCreatedForms: (context) => {
      context.commit('setCreatedForms');
    },
    setCreatorID: (context) => {
      context.commit('setCreatorID');
      context.commit('setCreatedForms');
      context.commit('setFinishedForms');
    }
  }
}
