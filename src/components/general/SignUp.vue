<template>
  <div class="signUp">
    <h1>Inscription</h1>

    <form>
      <span><input class="firstNameInput" type="text" placeholder="Prénom" v-model="userMetadata.firstName" v-on:keydown="keyHandler"/></span>
      <span><input class="lastNameInput" type="text" placeholder="Nom" v-model="userMetadata.lastName" v-on:keydown="keyHandler"/></span>

      <span><input class="companyName" type="text" placeholder="Entreprise" v-model="userMetadata.company"></span>

      <span><input class="loginInput" type="text" placeholder="Adresse email" v-model="userMetadata.email"/></span>
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
  import { updateUserProfileDisplayName, updateUserProfileMetadata } from '@/thunks/userAccountThunks'
  import {handleError} from "@/helpers/loginErrorHandlingHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "SignUp",
    data() {
      return {
        password: null,

        userMetadata: {
          email: null,
          firstName: null,
          lastName: null,
          company: null,
        },
      }
    },
    methods: {
      signUp() {
        const router = this.$router;
        nativeFbFunctions.createUserWithEmailAndPassword(this.userMetadata.email, this.password).then(
          (user) => {
                updateUserProfileMetadata(nativeFbFunctions.getCurrentUser(), this.userMetadata)
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

  @media screen and (max-width: 800px) {
    input{
      width: 200px;
    }

    button {
      width: 150px;
      padding: 0.5em;
    }
  }
</style>
