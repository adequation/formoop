<template>
  <div
      :class="[
      'user-form-entry',
      justConflicted ? 'shake' : '',
      inConflict && user ? 'user-form-entry-conflicted' :
      hasAnswers && user ? 'user-form-entry-answered' :
      'user-form-entry-default'
    ]">

    <div class="answered-by-wrapper">

      <button :class="['answered-by-users',
       inConflict && user ? 'answered-by-users-conflict' :
       hasAnswers && user ? 'answered-by-users-ok' :
       'answered-by-users-disabled'
       ]"
      type="button" @click="switchAnswersView" title="Voir les réponses" :disabled="!user">

        <div class="answered-by-content" > {{!showAnswers && currentEntryAnswers ?
          Object.keys(currentEntryAnswers).length : ''}} <i class="material-icons md-18">{{!showAnswers ? 'face' : 'close'}}</i></div>
      </button>

      <div class="user-answer-tools">

        <button v-if="!!currentUserAnswers"
                class="delete-answer-button" type="button" title="Supprimer ma réponse"
                @click="deleteAnswer"><i class="material-icons">delete</i>
        </button>

        <button v-if="isUpdated" class="save-answer-button-updated" type="button" title="Enregistrer ma réponse"
                @click="saveAnswer"><i class="material-icons">save</i>
        </button>

      </div>

    </div>

    <UserQuestionTitle :question="entry.question"/>

    <div v-if="showAnswers && hasAnswers">
      <UserEntryAnswersDetails
        :entry="entry"
        :userAnswers="userAnswers"></UserEntryAnswersDetails>
    </div>

    <div v-else>
      <UserAnswer :answer="entry.answer" :entryID="entry.id" :userAnswers="userAnswers"
                  :selectedAnswers="selectedAnswers"
                  display="small"/>
    </div>

  </div>
</template>

<script>
  import UserQuestionTitle from '@/components/user/UserQuestionTitle'
  import UserAnswer from '@/components/user/UserAnswer'
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import UserEntryAnswersDetails from "@/components/user/UserEntryAnswersDetails";
  import {isEntryInConflict} from "@/helpers/userAnswersHelpers";
  import {deleteUserAnswerFB, setSelectedAnswerFB} from "@/thunks/userFormEntriesThunks";

  export default {
    name: 'FormEntry',
    components: {UserEntryAnswersDetails, UserAnswer, UserQuestionTitle},
    data() {
      return {
        showAnswers: false,

        justConflicted: false
      }
    },
    props: {
      entry: {
        type: Object,
        required: true
      },
      userAnswers: {
        type: Object,
        required: true
      },
      selectedAnswers: {
        type: Object,
        required: true
      },
      display: {
        type: String,
        required: false
      }
    },
    computed: {

      user() {
        return this.$store.getters.user;
      },

      currentEntryAnswers() {
        return this.userAnswers ? this.userAnswers[this.entry.id] || {} : {};
      },

      currentUserAnswers() {
        if (!this.user) return {};

        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.id] : {};
      },

      inConflict() {
        return isEntryInConflict(this.entry.id, this.userAnswers);
      },

      hasAnswers() {
        return Object.keys(this.currentEntryAnswers).length > 0;
      },

      otherUserAnswers() {
        if (!this.user) return {};

        const otherAnswers = {};
        const currentUserID = this.user.id;
        Object.keys(this.currentEntryAnswers).map(userID => {
          if (userID !== currentUserID) otherAnswers[userID] = this.currentEntryAnswers[userID]
        });

        return otherAnswers;
      },

      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },

      selectedUserAnswers(){
        return this.selectedAnswers[this.entry.id];
      },

      isUpdated(){
        const userA = this.currentUserAnswers || null;

        if(this.selectedUserAnswers === undefined) return false;

        if(Array.isArray(this.selectedUserAnswers)){
          if(!Array.isArray(userA)) return this.selectedUserAnswers.length > 0;
          return userA.length !== this.selectedUserAnswers.length
            || !this.selectedUserAnswers.every(a => userA.includes(a));
        }
        return userA !== this.selectedUserAnswers;;
      }
    },
    methods: {

      switchAnswersView() {
        if (this.hasAnswers)
          this.showAnswers = !this.showAnswers;
      },

      answerText(userAnswer) {
        const answers = this.entry.answer.answers;

        const answerType = this.entry.answer.type;

        switch (answerType) {
          case 'text' :
          case 'textarea' :
            return userAnswer;
          case 'radio' :
          case 'select':
            const answer = answers.find(ea => ea.id === userAnswer);
            return answer ? answer.text : '';
          case 'checkbox' :
            return userAnswer.map(ua => {
              const answer = answers.find(ea => ea.id === ua);
              return answer ? answer.text : '';
            }).join(', ');
        }

        return '';
      },

      deleteAnswer() {
        deleteUserAnswerFB(this.$store.getters.getFormID, this.entry.id, this.user.id);
      },

      saveAnswer() {
        if (this.user){
          setSelectedAnswerFB(this.$store.getters.getFormID, this.entry.id, this.selectedAnswers, this.user.id);
        }

        else alert("Vous n'êtes pas connecté !");
      },
    },
    watch : {
      inConflict(){
        this.justConflicted = this.inConflict;
        setTimeout(() => { this.justConflicted = false; }, 500);
      }
    }
  }

  /**/
</script>

<style scoped>
  .user-form-entry {
    position:relative;
    background-color: #f6f6f6;
    margin: 0.5em auto;
    padding: 0.3em;

    width: 75%;

    border-left: 7px solid #aaaaaa;
  }

  .user-form-entry:hover {

  }

  .user-form-entry-answered {
    border-left: 7px solid #42b983;
  }

  .user-form-entry-conflicted {
    border-left: 7px solid tomato;
  }

  .answered-by-wrapper{
    top: 0;
    left: 0;
    position: absolute;

    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .answered-by-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .answered-by-users {
    color: #fff;

    margin: 0.5em;

    cursor: pointer;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: grey;
    border: none;

    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;
  }

  .answered-by-users-ok {
    background: #42b983 ;
  }

  .answered-by-users-ok:hover {
    background: #2d8246;
  }

  .answered-by-users-conflict {
    background: tomato;
  }

  .answered-by-users-conflict:hover {
    background: #e24536;
  }

  .answered-by-users-disabled {
    background: #aaaaaa;
  }

  .answered-by-users-disabled:hover {
    background: #969696;
  }

  .user-answer-tools {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    margin: 0.5em;
  }

  .delete-answer-button {
    padding: 0.4em;
    color: #fff;
    cursor: pointer;

    margin-left: 0.1em;
    margin-right: 0.1em;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #00000055;
    border: none;

    border-radius: 10px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;
  }

  .delete-answer-button:hover {
    background-color: tomato;
  }

  .save-answer-button-updated {

    margin-left: 0.1em;
    margin-right: 0.1em;
    cursor: pointer;

    padding: 0.4em;
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #00000055;
    border: none;

    border-radius: 10px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;
  }

  .save-answer-button-updated:hover {
    background-color: #42b983;
  }

</style>
