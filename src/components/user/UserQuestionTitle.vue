<template>
  <div>
    <h4 class="user-question-title" v-if="small">{{question.title}}</h4>
    <h2 class="user-question-title" v-else>{{question.title}}</h2>
  </div>
</template>

<script>
  export default {
    name: 'QuestionTitle',
    props: {
      question: {
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
  .user-question-title{

  }
</style>
