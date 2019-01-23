<template>
  <div v-if="filterEntries().length > 0">
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

    computed: {
      userAnswers() {
        return this.$store.getters.userAnswers;
      }
    },

    methods: {

      filterEntries() {
        switch (this.filterType) {
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

</style>
