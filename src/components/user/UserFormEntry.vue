<template>
  <div :class="hasAnswered ? 'user-form-entry-answered' : 'user-form-entry'">

    <div :class="showAnswers || Object.keys(otherUserAnswers).length <= 0 ? 'answered-by-opened' : 'answered-by'">
      <button type="button" @click="switchAnswersView" title="Voir les réponses">
        {{currentEntryAnswers ? Object.keys(currentEntryAnswers).length : ''}} <i class="material-icons md-18">face</i>
      </button>
    </div>

    <UserQuestionTitle :question="entry.question" display="small"/>

    <div class="answered-by-list-wrapper" v-if="showAnswers">
      <div class="answered-by-list" v-if="showAnswers">

        <div class="answered-by-list-item" v-for="(userID,i) in Object.keys(otherUserAnswers)">

          <p>
            <span class="user-name-text">{{getUserName(userID)}}</span>
            :
            <span class="user-answer-text">{{answerText(otherUserAnswers[userID])}}</span>
          </p>

          <hr v-if="i < Object.keys(otherUserAnswers).length-1" class="user-answer-text-separator"/>
        </div>

      </div>
    </div>

    <UserAnswer :answer="entry.answer" :entryID="entry.id" :userAnswers="userAnswers" display="small"/>
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
      display: {
        type: String,
        required: false
      }
    },
    computed: {
      user() {
        return nativeFbFunctions.getCurrentUser();
      },

      currentEntryAnswers() {
        return this.userAnswers ? this.userAnswers[this.entry.id] || {} : {};
      },

      currentUserAnswers() {
        if (!this.user) return {};


        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.uid] : {};
      },

      hasAnswered() {
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
      },

      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },
    },
    methods: {

      getUserName(userID){
        const user = this.invitedUsers[userID];
      if(!user) return 'Anonyme';

      const metadata = user.metadata;

      if(!metadata) return 'Anonyme';

      return metadata.firstName.concat(' ').concat(metadata.lastName);

      },

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

  .user-form-entry-answered {
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
    background: #fa7d32;
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
    border-bottom-color: #fa7d32;
    border-top: 0;
    margin-left: -13px;
    margin-top: -13px;
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
  }

  .answered-by button:hover {
    background: #2d8246;
  }

  .answered-by-opened button {
    color: #fff;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    font-size: large;
    background: #fa7d32;
    border: none;

    border-radius: 15px;
  }

  .answered-by-opened button:hover {
    background: #c86428;
  }

</style>
