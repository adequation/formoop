<template>
  <div>
    <SupervisorProgressChart :percentage="getPercentage('answered')"/>

    <SupervisorForceDirectedGraph :userAnswers="userAnswers" :formEntries="formEntries"/>

    <SupervisorCirclePacking :userAnswers="userAnswers" :formEntries="formEntries"/>


    <p><span class="answer-percentage">{{Number(getPercentage("answered", this.formEntries, this.userAnswers)).toFixed(2)}}%</span>
      des questions ont une réponse</p>
    <p><span class="not-answered-percentage">{{Number(getPercentage("notAnswered", this.formEntries, this.userAnswers)).toFixed(2)}}%</span>
      des questions n'ont pas de réponse</p>
  </div>
</template>

<script>
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart"
  import SupervisorForceDirectedGraph from "@/components/supervisor/SupervisorForceDirectedGraph";
  import SupervisorCirclePacking from "@/components/supervisor/SupervisorCirclePacking";
  import {filterEntries, isAnswered} from "@/helpers/userAnswersHelpers";

  export default {
    name: "SupervisorBasicFormInfo",
    components:{SupervisorForceDirectedGraph, SupervisorProgressChart, SupervisorCirclePacking},
    props: {
      formEntries: {
        type: Array,
        required: true
      }
    },
    computed: {
      userAnswers() {
        return this.$store.getters.userAnswers;
      }
    }
  }
</script>

<style scoped>
  .answer-percentage {
    font-size: large;
    color: #42b983;
  }

  .not-answered-percentage{
    font-size: large;
    color: #b93232;
  }
</style>
