import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getCreatedForms, nativeFbFunctions} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formID: '',
    createdForms: [],
    creatorID:''
  },
  getters: {
    getCreatorFormID: state => {
      return state.formID
    },
    createdForms: state => {
      return state.createdForms
    },
    creatorID: state => state.creatorID
  },
  mutations: {
    setFormID: (state, {formID}) => {
      state.formID = formID
    },

    setCreatedForms: (state) => {
      if(state.creatorID)
        Firebase.database().ref(getCreatedForms(state.creatorID))
          .on('value', (snapshot) => {
            const value = snapshot.val();
            if(value){
              state.createdForms = Object.keys(value).map(k => ({title:value[k].title,
                id:value[k].id,
                questionNumber: value[k].entries ? Object.keys(value[k].entries).length : 0}));
            }else{
              state.createdForms = [];
            }
          })
    },

    setCreatorID: state => {
      state.creatorID = nativeFbFunctions.getCurrentUser().uid;
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
    }
  }
}
