<template>
    <div>
      <!-- && invited !-->
      <div class="user-answer" v-if="answer.type === 'textarea'">
        <UserAnswerTextarea :entryID="entryID"
                            :currentUserAnswers="currentUserAnswers"
                            :currentSelectedAnswers="selectedUserAnswers"/>
      </div>
      <div class="user-answer" v-if="answer.type === 'text'">
        <UserAnswerText :entryID="entryID"
                        :currentUserAnswers="currentUserAnswers"
                        :currentSelectedAnswers="selectedUserAnswers"/>
      </div>
      <div class="user-answer" v-if="answer.type === 'radio'">
        <UserAnswerRadio :answers="answer.answers"
                         :entryID="entryID" :currentUserAnswers="currentUserAnswers"
                         :currentSelectedAnswers="selectedUserAnswers"/>
      </div>
      <div class="user-answer" v-if="answer.type === 'checkbox'">
        <UserAnswerCheckbox :answers="answer.answers"
                            :entryID="entryID"
                            :currentUserAnswers="currentUserAnswers"
                            :currentSelectedAnswers="selectedUserAnswers"/>
      </div>
      <div class="user-answer" v-if="answer.type === 'select'">
        <UserAnswerSelect :answers="answer.answers"
                          :entryID="entryID"
                          :currentUserAnswers="currentUserAnswers"
                          :currentSelectedAnswers="selectedUserAnswers"/>
      </div>

  </div>

</template>

<script>
  import UserAnswerTextarea from './UserAnswerTextarea'
  import UserAnswerText from './UserAnswerText'
  import UserAnswerRadio from './UserAnswerRadio'
  import UserAnswerCheckbox from './UserAnswerCheckbox'
  import UserAnswerSelect from './UserAnswerSelect'
  import {deleteUserAnswerFB, setSelectedAnswerFB} from "@/thunks/userFormEntriesThunks";

  export default {
    name: 'UserAnswer',
    components: {UserAnswerText, UserAnswerTextarea, UserAnswerRadio, UserAnswerCheckbox, UserAnswerSelect},
    computed: {
      user() {
        return this.$store.getters.user;
      },
      formID() {
        return this.$store.getters.getFormID
      },
      currentEntryAnswers() {
        return this.userAnswers[this.entryID] || {};
      },

      currentUserAnswers() {
        if (!this.user) return null;

        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.id] : {};
      },

      selectedUserAnswers(){
        return this.selectedAnswers[this.entryID];
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
    props: {
      answer: {
        type: Object,
        required: true
      },
      entryID: {
        type: String,
        required: true
      },
      userAnswers: {
        type: Object,
        required: false
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
    methods: {

    }
  }
</script>

<style scoped>

  .user-answer {
    display: inline;
  }

  .already-answered {
    color: #42b983;
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
