import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getAnsweringPath, getPublishedFormFromID, publishedFormsPath} from "@/helpers/firebaseHelpers";
import {getInvitationsPath} from "../helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: '',
    userAnswers: {},
    invitedUsers: [],
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
    getInvitedUsers: state => {
      return state.invitedUsers
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

    setInvitedUsers: (state) => {
      Firebase.database().ref(getInvitationsPath(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) {
            snapshot.val().forEach( function(email, index) {
              Firebase.database().ref().child('users').orderByChild('metaData/email').equalTo(email)
                .on('value', function(snapshot) {
                  if(snapshot.val()){
                    const value = Object.values(snapshot.val());
                    console.log(value[0]["metaData"]);
                    state.invitedUsers[index] = value[0]["metaData"];
                  }
                  else{
                    state.invitedUsers[index] = {email: email}
                  }
              })
            })
          }
          else state.invitedUsers = [];
        });

      /*Firebase.database().ref('users').on('value', function(snapshot){
        const users = Object.values(snapshot.val());
        Firebase.database().ref(getInvitationsPath(state.formID))
          .on('value', function (snapshot) {
            const value = snapshot.val();
            if (value) {
              state.invitedUsers = users.filter(function(val){
                return(value.includes(val["metaData"]["email"]) )
              });
            }
            else state.invitedUsers = [];
          })
      })*/

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
      context.commit('setInvitedUsers');
    },
    setFormTitle: (context) => {
      context.commit('setFormTitle')
    },
    setUserAnswers: (context) => {
      context.commit('setUserAnswers')
    },
  }

}
