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
      }
    }
  }
</script>

<style scoped>

  .user-group-entry{
    background-color: #f6f6f6;
    margin: 0.2em auto;
    border: 1px solid #00000020;
    width:100%;
  }

  .user-grouped-question-container{
    width:75%;
    margin: auto;
  }

</style>
