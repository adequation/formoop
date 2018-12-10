<template>
  <div>
    <h1 id="title">{{question.title}}</h1>
  </div>

</template>

<script>
    export default {
      name: 'SupervisorQuestionTitle',
      props: {
        question: {
          type: Object,
          required: true
        }
      }
    }
</script>

<style scoped>

</style>
