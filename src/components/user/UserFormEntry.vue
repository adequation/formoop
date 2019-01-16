<template>
  <div class="userFormEntry">
    <UserQuestionTitle :question="entry.question" :small="small"/>
    <UserAnswer :answer="entry.answer" :entryID="entry.id" :usersAnswers="userAnswers" :small="small"/>
  </div>
</template>

<script>
  import UserQuestionTitle from '@/components/user/UserQuestionTitle'
  import UserAnswer from '@/components/user/UserAnswer'
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
</style>
