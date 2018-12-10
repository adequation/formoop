<template>
  <div class="signUp">
    <h1>Inscription</h1>

    <form>
      <span><input class="loginInput" type="text" placeholder="Identifiant" v-model="login"/></span>
      <label><input class="passwordInput" type="password" placeholder="Mot de passe" v-model="password"/></label>
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

  export default {
    name: "SignUp",
    data() {
      return {
        login: null,
        password: null
      }
    },
    methods: {
      signUp() {
        const router = this.$router;
        Firebase.auth().createUserWithEmailAndPassword(this.login, this.password).then(
          (user) => {
            this.$router.replace("/home");
          },
          function (err) {
            alert(err.message);
          }
        );
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
