<template>
  <div>


    <DockingMenu class="home-top-menu"
                 ref="home-top-menu"
                 top>
      <div slot="body">
        <div class="home-top-menu-content-wrapper">
          <div class="formoop-title">
            Formoop
          </div>
          <div class="home-top-menu-content-account">
            <span class="account-name" :title="user.email">{{userName}}</span>
            <button type="button" @click="signOut" class="signout-button">Déconnexion</button>
          </div>
        </div>

      </div>
    </DockingMenu>

    <div class="header-space">

    </div>


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


  </div>
</template>

<script>
  import Profile from "@/components/general/Profile";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import DockingMenu from "@/components/containers/DockingMenu";
  import {getNameFromEmail} from "@/helpers/accountHelpers";

  export default {
    name: "Main",
    components: {DockingMenu, Profile},
    data() {
      return {}
    },
    computed: {
      user() {
        return nativeFbFunctions.getCurrentUser();
      },

      userName() {
        return this.user ? getNameFromEmail(this.user.email) : 'Non connecté';
      }
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

    .account-name {
      font-size: 1rem;
      color: white;
      font-weight: bold;
      margin-right: 3px;
    }

    .signout-button {
      color: #4286f4;
      background: white;
      border: none;
      padding: 6px;
      border-radius: 5px;
      font-weight: bold;
      font-size: 1rem;

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

  .grid-icon {
    margin: auto;
    width: 50%;
    padding: 10px;
    text-align: center;
    vertical-align: center;
  }

  .home-top-menu {
    background-color: #4286f4 !important;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .header-space {
    margin: 7em;
  }

  .home-top-menu-content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .home-top-menu-content-account {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-right: 5px;
  }



  .account-name {
    font-size: 1.3rem;
    color: white;
    font-weight: bold;
    margin-right: 15px;
  }

  .signout-button {
    color: #4286f4;
    background: white;
    border: none;
    padding: 5px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 1.2rem;
  }

  .signout-button:hover {
    cursor: pointer;
  }
</style>
