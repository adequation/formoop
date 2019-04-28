<template>
  <div>
    <h1>Formoop</h1>

    <Profile/>

    <div class="navigation-grid-wrapper">
      <div class="navigation-grid">
        <div
          @click="goTo('create')"
          class="grid-element create-grid-element">
          <div>Formulaires créés</div>
          <div class="grid-icon">
            <i class="material-icons md-60">note_add</i>
          </div>
        </div>

        <div
          @click="goTo('published')"
          class="grid-element published-grid-element">
          <div>Formulaires en cours</div>
          <div class="grid-icon">
            <i class="material-icons md-60">description</i>
          </div>
        </div>

        <div @click="goTo('campaigns')"
             class="grid-element campaigns-grid-element">
          <div>Campagnes de formulaires</div>
          <div class="grid-icon">
            <i class="material-icons md-60">folder</i>
          </div>
        </div>

        <div @click="goTo('closed')"
             class="grid-element closed-grid-element">
          <div>Formulaires terminés</div>
          <div class="grid-icon">
            <i class="material-icons md-60">lock</i>
          </div>
        </div>
      </div>

    </div>


    <button @click="signOut">Déconnexion</button>
  </div>
</template>

<script>
  import Profile from "@/components/general/Profile";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Main",
    components: {Profile},
    data() {
      return {}
    },
    methods: {
      signOut() {
        nativeFbFunctions.signOut().then(
          () => this.$router.replace('/sign-in')
        );
      },

      goTo(path) {
        this.$router.push(`/${path}`);
      }
    }
  }

</script>

<style scoped>

  .navigation-grid-wrapper {
    width: auto;
    margin: auto;
  }

  .navigation-grid {
    display: inline-grid;
    margin: auto;
    grid-template-columns: repeat(4, minmax(200px, 200px));
    grid-auto-rows: 200px;
  }

  @media screen and (max-width: 800px) {
    .navigation-grid {
      display: inline-grid;
      margin: auto;
      grid-template-columns: repeat(2, minmax(200px, 200px));
      grid-auto-rows: 200px;
    }
  }

  .grid-element {
    margin: 5px;
    padding: 5px;
    background: #f6f6f6;

    border-radius: 6px;
    transition: transform .2s;
    font-weight: bold;

    font-size: 1.5rem;
  }

  .grid-element:hover {
    cursor: pointer;
    transform: scale(1.075);
  }

  .create-grid-element {
    background: #42b983;
    background: linear-gradient(#5cd167, #3f9f7a);
    color: white;
  }

  .published-grid-element {
    background: linear-gradient(#3EB9DE, #387bd6);
    color: white;
  }

  .campaigns-grid-element {
    background: linear-gradient(#7f77a3, #42548E);
    color: white;
  }

  .closed-grid-element {
    background: linear-gradient(#fab74b, #e8742e);
    color: white;
  }

  .grid-icon{
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: center;
    vertical-align: center;
  }
</style>
