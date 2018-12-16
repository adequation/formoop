<template>
  <div>
    <h1>Formoop</h1>

    <p>{{getUser().email}}</p>

    <p><router-link to="/create">Formulaires créés</router-link></p>
    <p><router-link to="/published">Formulaire en cours</router-link></p>

    <button @click="signOut">Deconnexion</button>
  </div>
</template>

<script>
  import Firebase from 'firebase';

  export default {
    name: "Main",
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
