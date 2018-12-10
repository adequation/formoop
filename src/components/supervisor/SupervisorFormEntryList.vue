<template>
  <div v-if="filterEntries().length > 0">
    <h3>{{getTextFromFilter()}}</h3>
    <p v-for="e in filterEntries()">{{e.question.title}}
    </p>
  </div>
</template>

<script>
  export default {
      name: "SupervisorFormEntryList",
    props: {
      formEntries: {
        type: Array,
        required: true
      },
      filterType: {
        type: String,
        required: true
      }
    },
    methods: {
      getTextFromFilter() {
        switch (this.filterType) {
          case "answered":
            return "Questions avec réponses :";
          case "notAnswered":
            return "Questions sans réponses :";
          case "conflict":
            return "Questions en conflit :";
          case "default":
            return "Questions :";
        }
      },
      filterEntries() {
        if(!this.formEntries) return [];
        switch (this.filterType) {
          case "answered":
            return this.formEntries.filter(e => this.isAnswered(e));
          case "notAnswered":
            return this.formEntries.filter(e => !this.isAnswered(e));
          case "conflict":
            return this.formEntries.filter(e => false);
          case "default":
            return this.formEntries;
        }
      },
      isAnswered(formEntry){
        if(formEntry.usersAnswers)
          return Object.keys(formEntry.usersAnswers).length > 0;
        else return false;
      }
    }
  }
</script>

<style scoped>

</style>
