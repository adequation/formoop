<template>
  <div>
    <h2 id="title">{{question.title}}</h2>
  </div>
</template>

<script>
  export default {
    name: 'QuestionTitle',
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
