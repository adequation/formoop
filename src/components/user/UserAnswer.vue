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
                         :entryID="entryID"
                         :currentUserAnswers="currentUserAnswers"
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

        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.id] : null;
      },

      selectedUserAnswers(){
        return this.selectedAnswers[this.entryID];
      },
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
  }
</script>

<style scoped>

  .user-answer {
    display: inline;
  }

</style>
