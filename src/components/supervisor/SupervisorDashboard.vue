<template>
  <div>
    <h1>{{formTitle}}</h1>

    <div v-if="formEntries">
      <SupervisorBasicFormInfo :formEntries="formEntries"/>

      <div class="supervisor-entry-list-container">

        <Collapse class="supervisor-entry-list-not-answered" :initialy-opened="false" :showArrow="true">

          <div slot="header">
            <h3>Questions sans réponses</h3>
          </div>

          <SupervisorFormEntryList slot="body" :formEntries="formEntries" filterType="notAnswered"/>

        </Collapse>

        <Collapse class="supervisor-entry-list-answered" :initialy-opened="false" :showArrow="true">

          <div slot="header">
            <h3>Questions avec réponses</h3>
          </div>

          <SupervisorFormEntryList slot="body" :formEntries="formEntries" filterType="answered"/>

        </Collapse>

      </div>
    </div>
  </div>
</template>

<script>
  import SupervisorBasicFormInfo from '@/components/supervisor/SupervisorBasicFormInfo'
  import SupervisorFormEntryList from '@/components/supervisor/SupervisorFormEntryList'
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";
  import Collapse from "@/components/containers/Collapse";

  export default {
    name: "SupervisorDashboard",
    components: {SupervisorProgressChart, SupervisorBasicFormInfo, SupervisorFormEntryList, Collapse},
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
  .supervisor-entry-list-container {
    display: flex;
  }

  .supervisor-entry-list-answered{
    margin:1%;
    flex: 1;
  }

  .supervisor-entry-list-answered .collapse-header h3 {
    color: #42b983;
  }

  .supervisor-entry-list-not-answered{
    margin:1%;
    flex: 0 0 48%;
  }

  .supervisor-entry-list-not-answered .collapse-header h3 {
    color: #b93232;
  }


</style>
