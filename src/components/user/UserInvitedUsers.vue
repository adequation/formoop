<template>
    <Collapse>

      <p slot="header" :showArrow="true" @click="updateInvited">Personnes Invitées</p>
      <div slot="body">
        <div v-for="user in invitedUser">
          <p v-if="user.firstName && user.lastName">{{ user.firstName }} {{ user.lastName }}</p>
          <p v-else> {{ user.email }}</p>
        </div>
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
      methods:{
        updateInvited(){
          this.invitedUser = this.invitedUsers;
        }
      }
    }
</script>

<style scoped>

</style>
