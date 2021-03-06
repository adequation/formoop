import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {
  getAnsweringPath,
  getPublishedFormEntryPointPath,
  getPublishedFormFromID,
  getPublishedFormUserPath,
  getPublishedFormUsersPath,
  publishedFormsPath
} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: '',
    userAnswers: {},
    formSections: [],
    invitedUsers: {},
    entryPoints: [],
    user: null,
    isRandomGreetingMode : true,
    greeting : ''
  },
  getters: {
    getFormEntries: state => {
      return state.formEntries ?
        state.formEntries.map(fe => ({...fe, usersAnswers: fe.usersAnswers || {}}))
        : state.formEntries;
    },

    getFormID: state => {
      return state.formID;
    },

    getFormTitle: state => {
      return state.formTitle;
    },

    invitedUsers: state => {
      return state.invitedUsers;
    },

    userAnswers : state => {
      return state.userAnswers;
    },

    entryPoints : state => {
      return state.entryPoints;
    },

    user : state => state.user,

    formSections : state => state.formSections,

    isRandomGreetingMode : state => state.isRandomGreetingMode,
    greeting : state => state.greeting,

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

    setFormSections: (state) => {
      Firebase.database().ref(getPublishedFormFromID(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) state.formSections = value.sections || [];
          else state.formSections = []
        })
    },

    setUserAnswers: (state) => {
      Firebase.database().ref(getAnsweringPath(state.formID))
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.userAnswers = value;
          }
          else state.userAnswers = {}
        });
    },

    setInvitedUsers: (state) => {
      Firebase.database().ref(getPublishedFormUsersPath(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();

          if (value) {
            state.invitedUsers = value;
          }

          else state.invitedUsers = {};

        });
    },

    setGreeting: (state) => {
      Firebase.database().ref(getPublishedFormFromID(state.formID))
        .on('value', function (snapshot) {
          const value = snapshot.val();
          if (value) {
            state.isRandomGreetingMode = value.isRandomGreetingMode || false;
            state.greeting = value.greeting || '';
          }
          else {
            state.isRandomGreetingMode = true;
            state.greeting = '';
          }
        });
    },

    setUser: (state, {userID}) => {
      state.userID = userID;
      Firebase.database().ref(getPublishedFormUserPath(state.formID, state.userID))
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.user = value;
          } else {
            state.user = null;
          }
        })
    },

    setEntryPoint: (state) => {
      Firebase.database().ref(getPublishedFormEntryPointPath(state.formID))
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if(value){
            state.entryPoints = Object.keys(value).map(entrypoint => value[entrypoint]);
          }
          else{
            state.entryPoint = null;
          }
        })
    }
  },
    actions: {
      setFormEntries: (context) => {
        context.commit('setFormEntries')
      },

      setFormSections: (context) => {
        context.commit('setFormSections')
      },

      setFormID: (context, {formID}) => {
        context.commit('setFormID', {formID});
        context.commit('setFormEntries');
        context.commit('setFormTitle');
        context.commit('setFormSections');
        context.commit('setUserAnswers');
        context.commit('setInvitedUsers');
        context.commit('setEntryPoint');
        context.commit('setGreeting');
      },

      setFormTitle: (context) => {
        context.commit('setFormTitle')
      },

      setUserAnswers: (context) => {
        context.commit('setUserAnswers');
        context.commit('setInvitedUsers');
      },

      setInvitedUsers: (context) => {
        context.commit('setInvitedUsers');
      },

      setUser: (context, {userID}) => {
        context.commit('setUser', {userID});
      },

      setGreeting: (context) => {
        context.commit('setGreeting');
      },

    }
}
