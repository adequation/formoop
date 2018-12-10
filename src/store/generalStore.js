import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {publishingPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    publishedForms: []
  },
  getters: {
    publishedForms: state => {
      return state.publishedForms
    }
  },
  mutations: {
    setPublishedForms: (state) => {
        Firebase.database().ref(publishingPath)
          .on('value', (snapshot) => {
            const value = snapshot.val();
            if(value){
              state.publishedForms = Object.keys(value).map(k => ({title:value[k].title,
                id:value[k].id,
                questionNumber: value[k].entries ? Object.keys(value[k].entries).length : 0}));
            }else{
              state.publishedForms = [];
            }
          })
    },
  },
  actions: {
    setPublishedForms: (context) => {
      context.commit('setPublishedForms');
    },
  }
}




