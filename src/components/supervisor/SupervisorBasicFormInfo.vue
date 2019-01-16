<template>
  <div>
    <SupervisorProgressChart :percentage="getPercentage('answered')"/>

    <p><span class="answer-percentage">{{Number(getPercentage("answered")).toFixed(2)}}%</span>
      des questions ont une réponse</p>
    <p><span class="not-answered-percentage">{{Number(getPercentage("notAnswered")).toFixed(2)}}%</span>
      des questions n'ont pas de réponse</p>
  </div>
</template>

<script>
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart"
  export default {
    name: "SupervisorBasicFormInfo",
    components:{SupervisorProgressChart},
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
    },
    methods: {
      getPercentage(filterType){
        return (this.filterEntries(filterType).length / this.formEntries.length) * 100;
      },

      filterEntries(filterType) {
        switch (filterType) {
          case "answered":
            return this.formEntries.filter(e => this.isAnswered(e));
          case "notAnswered":
            return this.formEntries.filter(e => !this.isAnswered(e));
          case "default":
            return this.formEntries;
        }
      },

      isAnswered(formEntry){
        return this.userAnswers ? !!this.userAnswers[formEntry.id] : false;
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
