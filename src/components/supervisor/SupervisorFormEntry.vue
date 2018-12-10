<template>
  <div class="supervisorFormEntry">
    <SupervisorQuestionTitle :question="entry.question"/>
    <SupervisorAnswer :answer="entry.answer" :Answered="entry.alreadyAnswered"/>
  </div>
</template>

<script>
  import SupervisorQuestionTitle from '@/components/supervisor/SupervisorQuestionTitle'
  import SupervisorAnswer from '@/components/supervisor/SupervisorAnswer'
  export default {
    name: "SupervisorFormEntry",
    components: {SupervisorQuestionTitle, SupervisorAnswer},
    props: {
      entry: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>
  .supervisorFormEntry{
    background-color: #f6f6f6;
    margin: 1em;
    border: 1px solid #00000020
  }
</style>
