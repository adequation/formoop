<template>
  <div>
    <h1>{{formTitle}}</h1>

    <div v-if="formEntries">
      <SupervisorBasicFormInfo :formEntries="formEntries"/>

      <div class="entry-list">
        <span><SupervisorFormEntryList :formEntries="formEntries" filterType="answered"/></span>
        <span><SupervisorFormEntryList :formEntries="formEntries" filterType="notAnswered"/></span>
        <span><SupervisorFormEntryList :formEntries="formEntries" filterType="conflict"/></span>
      </div>
    </div>
  </div>
</template>

<script>
  import SupervisorBasicFormInfo from '@/components/supervisor/SupervisorBasicFormInfo'
  import SupervisorFormEntryList from '@/components/supervisor/SupervisorFormEntryList'
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";

  export default {
    name: "SupervisorDashboard",
    components: {SupervisorProgressChart, SupervisorBasicFormInfo, SupervisorFormEntryList},
    computed: {
      formEntries() {
        return this.$store.getters.getSupervisorFormEntries
      },
      formID() {
        return this.$store.getters.getSupervisorFormID
      },
      formTitle() {
        return this.$store.getters.getSupervisorFormTitle
      }
    },
    created: function () {
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID})
    },
    watch: {
      '$route'(to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID})
      }
    }
  }
</script>

<style scoped>

</style>
