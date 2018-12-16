<template>
  <div>
    <h1>Formoop</h1>

    <Profile/>

    <p><router-link to="/create">Formulaires créés</router-link></p>
    <p><router-link to="/published">Formulaire en cours</router-link></p>

    <button @click="signOut">Deconnexion</button>
  </div>
</template>

<script>
  import Firebase from 'firebase';
  import Profile from "@/components/general/Profile";

  export default {
    name: "Main",
    components: {Profile},
    data(){
      return {

      }
    },
    methods: {
      signOut() {
        Firebase.auth().signOut().then(
          () => this.$router.replace('/sign-in')
        );
      },
      getUser(){
        return Firebase.auth().currentUser;
      }
    }
  }

</script>

<style scoped>

</style>
