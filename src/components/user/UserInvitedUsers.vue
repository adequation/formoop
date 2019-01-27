<template>
    <Collapse>

      <p slot="header" :showArrow="true">Personnes Invitées</p>
      <div slot="body">
        <p v-for="user in invitedUsers">{{ user }}</p>
      </div>

    </Collapse>
</template>

<script>
    import Collapse from "../containers/Collapse";
    export default {
      name: "UserInvitedUsers",
      components: {Collapse},
      data () {
        return {
          invitedUser: [],
        };
      },
      created (){
        this.invitedUser = this.$store.getters.getInvitedUsers;
      },
      computed: {
        invitedUsers () {
          return this.$store.getters.getInvitedUsers;
        },
      },
    }
</script>

<style scoped>

</style>
