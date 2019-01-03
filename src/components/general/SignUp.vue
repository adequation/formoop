<template>
  <div class="signUp">
    <h1>Inscription</h1>

    <form>
      <span><input class="firstNameInput" type="text" placeholder="Prénom" v-model="firstName" v-on:keydown="keyHandler"/></span>
      <span><input class="lastNameInput" type="text" placeholder="Nom" v-model="lastName" v-on:keydown="keyHandler"/></span>

      <span><input class="loginInput" type="text" placeholder="Adresse email" v-model="login"/></span>
      <span><input class="passwordInput" type="password" placeholder="Mot de passe" v-model="password"/></span>
    </form>

    <button @click="signUp">S'inscrire</button>

    <span>
      Déjà inscrit?
      <router-link to="/sign-in">Me connecter</router-link>
    </span>

  </div>
</template>

<script>
  import Firebase from 'firebase';
  import { updateUserProfileDisplayName } from '@/thunks/userAccountThunks'
  import {handleError} from "@/helpers/loginErrorHandlingHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "SignUp",
    data() {
      return {
        login: null,
        firstName: null,
        lastName: null,
        password: null
      }
    },
    methods: {
      signUp() {
        const router = this.$router;
        nativeFbFunctions.createUserWithEmailAndPassword(this.login, this.password).then(
          (user) => {
            updateUserProfileDisplayName(nativeFbFunctions.getCurrentUser(), this.firstName, this.lastName )
              .then(() => {
                this.$router.replace("/home");
              })
              .catch(e=>{
                console.log(e);
                this.$router.replace("/home");
              })

          },
          function (err) {
            alert(handleError(err));

          }
        );
      },

      keyHandler(event){
        if(event.key === ' ') event.preventDefault();
      }
    }
  }
</script>

<style scoped>
  .signUp {
    margin-top: 2em;
  }

  input {
    margin: 0.5em;
    width: 20%;
    padding: 0.75em;
  }

  button {
    margin: 0.25em;
    width: 15%;
    cursor: pointer;
  }

  span {
    display: block;
    margin-top: 1em;
  }
</style>
