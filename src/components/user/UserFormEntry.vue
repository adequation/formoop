<template>
  <div class="userFormEntry">

    <div :class="showAnswers || Object.keys(otherUserAnswers).length <= 0 ? 'answered-by-opened' : 'answered-by'">
      <button type="button" @click="switchAnswersView" title="Voir les réponses">
        {{currentEntryAnswers ? Object.keys(currentEntryAnswers).length : ''}}☻
      </button>
    </div>

    <UserQuestionTitle :question="entry.question" :small="small"/>

    <div class="answered-by-list" v-if="showAnswers">
      <p v-for="userID in Object.keys(otherUserAnswers)">{{userID}} : {{answerText(otherUserAnswers[userID])}}</p>
    </div>

    <UserAnswer :answer="entry.answer" :entryID="entry.id" :userAnswers="userAnswers" :small="small"/>
  </div>
</template>

<script>
  import UserQuestionTitle from '@/components/user/UserQuestionTitle'
  import UserAnswer from '@/components/user/UserAnswer'
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: 'FormEntry',
    components: {UserAnswer, UserQuestionTitle},
    data() {
      return {
        showAnswers: false
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
      small: {
        type: Boolean,
        required: false
      }
    },
    computed: {
      user() {
        return nativeFbFunctions.getCurrentUser();
      },

      currentEntryAnswers() {
        return this.userAnswers[this.entry.id] || {};
      },

      currentUserAnswers() {
        if (!this.user) return {};


        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.uid] : {};
      },

      otherUserAnswers() {
        if (!this.user) return {};

        const otherAnswers = {};
        const currentUserID = this.user.uid;
        Object.keys(this.currentEntryAnswers).map(userID => {
          if (userID !== currentUserID) otherAnswers[userID] = this.currentEntryAnswers[userID]
        });

        return otherAnswers;
      }
    },
    methods: {
      switchAnswersView() {
        if (Object.keys(this.otherUserAnswers).length > 0)
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
      }
    }
  }
</script>

<style scoped>
  .userFormEntry {
    background-color: #f6f6f6;
    margin: 1em auto;
    border: 1px solid #00000020;
    width: 75%;

    border-radius: 5px;
  }

  .answered-by {
    float: left;
    margin: 1em;
    position: absolute;
  }

  .answered-by-opened {
    float: left;
    margin: 1em;
    position: absolute;
  }

  .answered-by-list {
    margin: auto;

    background-color: #e6e6e6;
    border: 1px solid #00000020;
    width: 50%;
  }

  .answered-by button {
    color: #42b983;
    font-size: large;
    background: none;
    border: none;
  }

  .answered-by button:hover {
    color: #329650;
    background: none;
    border: none;
  }

  .answered-by-opened button {
    color: #fa7d32;
    font-size: large;
    background: none;
    border: none;
  }
</style>
