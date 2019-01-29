import Vuex from 'vuex'
import Vue from 'vue'
import Firebase from 'firebase'
import {getAnsweringPath, getPublishedFormFromID, publishedFormsPath, userPath} from "@/helpers/firebaseHelpers";

Vue.use(Vuex);

export default {
  state: {
    formEntries: [],
    formID: '',
    formTitle: '',
    userAnswers: {},
    invitedUsers: {}
  },
  getters: {
    getFormEntries: state => {
      return state.formEntries ?
        state.formEntries.map(fe => ({...fe, usersAnswers: fe.usersAnswers || {}}))
        : state.formEntries;
    },
    getUserFormID: state => {
      return state.formID;
    },
    getUserFormTitle: state => {
      return state.formTitle;
    },

    invitedUsers: state => {
      return state.invitedUsers;
    },

    userAnswers : state => {
      return state.userAnswers;
    }
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
        .on('value', (snapshot) => {
          const value = snapshot.val();
          if (value) {
            state.userAnswers = value;
          }
          else state.userAnswers = {}
        });
    },

    setInvitedUsers: (state) => {
      Firebase.database().ref(userPath)
        .on('value', function (snapshot) {
          const value = snapshot.val();

          if (value) {
            const users = {};

            Object.keys(state.userAnswers).forEach(entryID => {
              const userIDs = state.userAnswers[entryID];

              if (userIDs) Object.keys(userIDs).forEach(id => {
                if(!users[id]) users[id] = value[id];
              });
            });

            state.invitedUsers = {...users};
          }

          else state.invitedUsers = {};

        });
    }
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
        context.commit('setUserAnswers');
        context.commit('setInvitedUsers');
      },

      setInvitedUsers: (context) => {
        context.commit('setInvitedUsers');
      },

    }
}
