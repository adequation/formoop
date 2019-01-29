<template>
  <div>
    <SupervisorProgressChart :percentage="getPercentageValue('answered', this.formEntries, this.userAnswers)"/>

    <SupervisorForceDirectedGraph :userAnswers="userAnswers" :formEntries="formEntries" :users="invitedUsers"/>

    <SupervisorCirclePacking :userAnswers="userAnswers" :formEntries="formEntries" :users="invitedUsers"/>


    <p><span class="answer-percentage">{{Number(getPercentageValue("answered", this.formEntries, this.userAnswers)).toFixed(2)}}%</span>
      des questions ont une réponse</p>
    <p><span class="not-answered-percentage">{{Number(getPercentageValue("notAnswered", this.formEntries, this.userAnswers)).toFixed(2)}}%</span>
      des questions n'ont pas de réponse</p>
  </div>
</template>

<script>
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart"
  import SupervisorForceDirectedGraph from "@/components/supervisor/SupervisorForceDirectedGraph";
  import SupervisorCirclePacking from "@/components/supervisor/SupervisorCirclePacking";
  import {getPercentage, isAnswered} from "@/helpers/userAnswersHelpers";

  export default {
    name: "SupervisorBasicFormInfo",
    components:{SupervisorForceDirectedGraph, SupervisorProgressChart, SupervisorCirclePacking},
    props: {
      formEntries: {
        type: Array,
        required: true
      }
    },
    created(){
      this.$store.dispatch("setInvitedUsers")
    },
    computed: {
      userAnswers() {
        return this.$store.getters.userAnswers;
      },

      invitedUsers() {
        return this.$store.getters.invitedUsers;
      }
    },
    methods: {
      getPercentageValue(filterType, entries, answers){
        return getPercentage(filterType, entries, answers);
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
