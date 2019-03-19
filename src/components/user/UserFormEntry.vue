<template>
  <div
      :class="[
      'user-form-entry',
      justConflicted ? 'shake' : '',
      inConflict && user ? 'user-form-entry-conflicted' :
      hasAnswers && user ? 'user-form-entry-answered' :
      'user-form-entry-default'
    ]">

    <div :class="['answered-by-wrapper', inConflict && user ? 'answered-by-conflict' : user && hasAnswers ?
                (showAnswers ? 'answered-by-opened' : 'answered-by') : 'answered-by-disabled' ]">

      <button type="button" @click="switchAnswersView" title="Voir les réponses" :disabled="!user">
        <div class="answered-by-content" > {{!showAnswers && currentEntryAnswers ?
          Object.keys(currentEntryAnswers).length : ''}} <i class="material-icons md-18">{{!showAnswers ? 'face' : 'close'}}</i></div>
      </button>

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

    <div class="user-answer-tools">

      <button v-if="currentUserAnswers ? currentUserAnswers : false" class="delete-answer-button" type="button" title="Supprimer ma réponse"
              @click="deleteAnswer"><i class="material-icons">delete</i>
      </button>
      <button v-if="isUpdated" class="save-answer-button-updated" type="button"  title="Enregistrer ma réponse"
              @click="saveAnswer"><i :class="['material-icons', isUpdated ? '' : '']">save</i>
      </button>

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

        return userA !== this.selectedUserAnswers;
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
        if (this.user)
          setSelectedAnswerFB(this.$store.getters.getFormID, this.entry.id, this.selectedAnswers, this.user.id);

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

  .answered-by-list-wrapper {
    position: absolute;
    color: white;
    font-weight: 600;

    z-index: 11;
  }

  .user-name-text {
    font-size: 14px;
  }

  .user-answer-text-separator {
    border: 0;
    height: 1px;
    background: #ffffff33;
  }

  .answered-by-list-wrapper > div {
    border-radius: 5px;
    background: #2d8246;
    font-size: 12px;
    padding: 20px !important;
    display: inline-block;
    position: relative;
    top: -11px;
    overflow: auto !important;

    max-width: 275px;
  }

  .answered-by-list-wrapper:after {
    content: '';
    position: absolute;
    top: -11px;
    left: 16%;
    width: 0;
    height: 0;
    border: 13px solid transparent;
    border-bottom-color: #2d8246;
    border-top: 0;
    margin-left: -13px;
    margin-top: -13px;
  }

  .answered-by-wrapper {
    float: left;
    margin: 1em;
    position: absolute;
  }

  .answered-by-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .answered-by button {
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #42b983;
    border: none;

    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;

  }

  .answered-by button:hover {
    background: #2d8246;
  }

  .answered-by-conflict button {
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: tomato;
    border: none;

    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;

  }

  .answered-by-conflict button:hover {
    background: #e24536;
  }

  .answered-by-opened button {
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #42b983;
    border: none;

    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;

  }

  .answered-by-opened button:hover {
    background: #2d8246;
  }

  .answered-by-disabled button {
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #aaaaaa;
    border: none;

    border-radius: 15px;

    box-shadow: rgba(0, 0, 0, 0.15) 2px 2px 0px 0px;

  }

  .answered-by-disabled button:hover {
    background: #969696;
  }

  .user-answer-tools {
    float: end;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .delete-answer-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #00000055;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .delete-answer-button:hover {
    background-color: tomato;
  }

  .save-answer-button {
    background: none;
    border: none;
    color: #00000055;
  }

  .save-answer-button-updated {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #00000055;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .save-answer-button-updated:hover {
    background-color: #2d8246;
  }

</style>
