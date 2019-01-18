<template>
  <div :class="hasAnswered ? 'user-form-entry-answered' : 'user-form-entry'">

    <div :class="showAnswers || Object.keys(otherUserAnswers).length <= 0 ? 'answered-by-opened' : 'answered-by'">
      <button type="button" class="user-form-entry-answer-counter" @click="switchAnswersView" title="Voir les réponses">
        {{currentEntryAnswers ? Object.keys(currentEntryAnswers).length : ''}} ☻
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

      hasAnswered(){
        return !!this.currentUserAnswers;
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

  /**/
</script>

<style scoped>
  .user-form-entry {
    background-color: #f6f6f6;
    margin: 0.5em auto;
    padding: 0.5em;

    width: 75%;

    border-left: 7px solid #aaaaaa;
  }

  .user-form-entry-answered{
    background-color: #e1f5eb;

    margin: 0.5em auto;
    padding: 0.5em;
    width: 75%;

    border-left: 7px solid #42b983;
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
    margin-left: 1em;
    text-align: left;
  }

  .answered-by button {
    color: #fff;

    font-size: large;
    background: #42b983;
    border: none;

    border-radius: 10px;
  }

  .answered-by button:hover {
    background: #2d8246;
  }

  .answered-by-opened button {
    color: #fff;
    font-size: large;
    background: #fa7d32;
    border: none;

    border-radius: 10px;
  }

  .answered-by-opened button:hover {
    background: #c86428;
  }

</style>
