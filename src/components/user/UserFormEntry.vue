<template>
  <div class="userFormEntry">

    <h2 class="answered-by">
      {{currentEntryAnswers ? Object.keys(currentEntryAnswers).length : ''}}☻
    </h2>

    <UserQuestionTitle :question="entry.question" :small="small"/>
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
    computed:{
      user(){
        return nativeFbFunctions.getCurrentUser();
      },

      currentEntryAnswers() {
        return this.userAnswers[this.entry.id] || {};
      },

      currentUserAnswers() {
        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.uid] : {};
      }
    }
  }
</script>

<style scoped>
  .userFormEntry{
    background-color: #f6f6f6;
    margin: 1em auto;
    border: 1px solid #00000020;
    width:75%;
  }


  .answered-by {
    color: #42b983;

    float: left;
    margin: 1em;
    position:absolute;
  }
</style>
