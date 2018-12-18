<template>
  <div class="signIn">
    <h1>Connexion</h1>

    <form>
      <span><input class="loginInput" type="email" placeholder="Identifiant" v-model="login"/></span>
      <label><input class="passwordInput" type="password" placeholder="Mot de passe" v-model="password"/></label>
    </form>

    <button @click="signIn">Se connecter</button>

    <span>
        Pas de compte ?
        <router-link to="/sign-up">M'inscrire</router-link>
    </span>

  </div>
</template>

<script>
  import Firebase from 'firebase';
  import {handleError} from "@/helpers/loginErrorHandlingHelpers";

  export default {
    name: "SignIn",
    data() {
      return {
        login: null,
        password: null
      }
    },
    methods: {
      signIn() {
        const router = this.$router;
        Firebase.auth().signInWithEmailAndPassword(this.login, this.password).then(
          (user) => {
            this.$router.replace("/home");
          },
          function (err) {
            alert(handleError(err));
          }
        );
      }
    }
  }
</script>

<style scoped>
  .signIn {
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
