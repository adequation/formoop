<template>
  <div class="answer">
    <div v-if="Answered" class="AnsweredDiv">
      <SupervisorAnswerInfo :answer="answer" />
    </div>
    <div v-else class="NotAnswered">
      <h3>Cette question n'a aucune réponse</h3>
    </div>
  </div>
</template>

<script>
  import SupervisorAnswerInfo from "@/components/supervisor/SupervisorAnswerInfo"
  export default {
    name: "SupervisorAnswer",
    components: {SupervisorAnswerInfo},
    props:{
      answer:{
        type: Object,
        required: true
      },
      Answered:{
        type: Boolean,
        required: true
      }
    }
  }

</script>

<style scoped>
  .AnsweredDiv {
    color: #42b983;
  }
</style>
