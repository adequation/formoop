<template>
  <div class="form" v-if="formEntries" >
    <h1 class="FormTitle" >{{formTitle}}</h1>
    <SupervisorFormEntry v-for="entry in formEntries"
                   :key="entry.id"
                   :entry="entry"></SupervisorFormEntry>
  </div>
  <div v-else>
    <h1 class="errorMessage">Formulaire inconnu !</h1>
  </div>
</template>

<script>
  import SupervisorFormEntry from '@/components/supervisor/SupervisorFormEntry'
  export default {
    name: 'SupervisorForm',
    components: {SupervisorFormEntry},
    computed: {
      formEntries() {
        return this.$store.getters.getSupervisorFormEntries
      },
      formID() {
        return this.$store.getters.getSupervisorFormID
      },
      formTitle () {
        return this.$store.getters.getSupervisorFormTitle
      }
    },
    created: function () {
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setUser')
    },
    watch: {
      '$route' (to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID})
      }
    }
  }
</script>

<style scoped>

</style>
