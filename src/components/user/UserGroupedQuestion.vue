<template>
  <div class="user-grouped-question">
    <Collapse class="user-grouped-question-container" :initialy-opened="false" :showArrow="true">

      <div slot="header">
        <h3>{{group.question}}</h3>
      </div>

      <div slot="body" class="user-group-entries">

        <UserFormEntry v-for="entry in group.entries"
                       :entry="entry"
                       :key="entry.id"
                       class="user-group-entry"
                       :userAnswers="userAnswers"
                       :small="true"/>

      </div>
    </Collapse>
  </div>
</template>

<script>
  import Collapse from "@/components/containers/Collapse";
  import UserFormEntry from "@/components/user/UserFormEntry";

  export default {
    name: "UserGroupedQuestion",
    components: {Collapse , UserFormEntry},
    props: {
      group: {
        type: Object,
        required: true
      },
      userAnswers: {
        type: Object,
        required: true
      },
    }
  }
</script>

<style scoped>

  .user-grouped-question{
    margin: 0.5em;
  }

  .user-group-entry{
    margin: 0.2em auto !important;
    width:auto !important;
  }

  .user-grouped-question-container{
    width:75%;
    margin: auto;
  }

</style>
