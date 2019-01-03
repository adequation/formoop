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
  import Profile from "@/components/general/Profile";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Main",
    components: {Profile},
    data(){
      return {

      }
    },
    methods: {
      signOut() {
        nativeFbFunctions.signOut().then(
          () => this.$router.replace('/sign-in')
        );
      },
    }
  }

</script>

<style scoped>

</style>
