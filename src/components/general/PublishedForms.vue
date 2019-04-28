<template>
  <div class="published-forms">

    <DockingMenu class="published-top-menu"
                 ref="home-top-menu"
                 top>
      <div slot="body">
        <div class="published-menu-content-wrapper">
          <div class="formoop-title" @click="goTo('home')">
            Formoop
          </div>
        </div>

      </div>
    </DockingMenu>

    <div class="header-space">

    </div>

    <h1>Formoops en cours</h1>

    <div class="space-header"></div>

    <div class="published-forms-header">

      <div class="search-form">
        <input class="search-box"
               type="text"
               placeholder="Rechercher un formoop"
               v-model="searchQuery"
               @click.stop=""/>
        <div class="published-forms-button">
          <i v-if="searchQuery" class="material-icons md-18" role="button" @click.stop=""
             @click="searchQuery = ''">clear</i>
        </div>
      </div>

    </div>

    <div v-if="publishedForms.length > 0">

      <div v-if="searchedForm.length > 0 ">

        <div class="forms-grid">

          <div v-for="form in searchedForm"
               :key="form.id"
               class="form-grid-entry"
               @click="navigate(form)"
               :title="form.title"
          >
            <div class="form-content">
              <div class="form-grid-title">
                {{form.title}}
              </div>

              <hr/>

              <div class="form-question-number">
                {{form.questionNumber}} question{{form.questionNumber > 1 ? 's' : ''}}
              </div>

              <hr/>

              <div class="form-grid-description-tags">

                <div v-if="isUserInvited(form)" class="user-is-invited">
                  Invité
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <h3>Aucun formulaire correspondant à la recherche trouvé</h3>
      </div>
    </div>

    <div v-else>
      <h1>Aucun formoop publié</h1>
    </div>


  </div>

</template>

<script>
  import {getUserIdFromEmail} from "@/helpers/accountHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {isUserInvitedToForm} from "@/helpers/creatorHelpers";
  import DockingMenu from "@/components/containers/DockingMenu";

  export default {
    name: "PublishedForms",
    components: {DockingMenu},
    data() {
      return {
        searchQuery: ''
      }
    },
    methods: {
      getPublishedFormPath({id}) {
        return "/answer/".concat(id);
      },

      navigate(form) {
        this.$router.push(this.getPublishedFormPath(form).concat("/" + getUserIdFromEmail(this.user.email)));
      },

      isUserInvited(form) {
        return isUserInvitedToForm(form.id, this.user, this.publishedForms);
      },

      goTo(path) {
        this.$router.push(`/${path}`);
      }

    },
    computed: {
      publishedForms() {
        return this.$store.getters.publishedForms;
      },

      searchedForm() {
        return this.publishedForms.filter(f =>
          this.searchTokens.every(t =>
            f.title.toLowerCase().includes(t.toLowerCase())
          ));
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },

      user() {
        return nativeFbFunctions.getCurrentUser();
      },
    },
    created() {
      this.$store.dispatch('setPublishedForms');

    }
  }
</script>

<style scoped>
  .published-forms{
    margin-left: 20%;
    margin-right: 20%;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .published-forms-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .search-form {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: normal;
  }

  .search-box {
    width: auto;
    background: none;
    border: none;
    border-bottom: 2px solid rgb(217, 217, 217);
    font-size: 1em;
    color: #2c3e50;
    margin: 0 2px 0 2px;
  }

  .search-box:focus {
    outline: none;
  }

  .search-box::placeholder {
    font-size: 0.9em;
  }

  .published-forms-button {
    cursor: pointer;
    color: #00000070;
  }

  .published-forms-button :hover {
    cursor: pointer;
    color: #000000aa;
  }

  .forms-grid {
    width: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
    grid-auto-rows: 1fr;
  }

  .forms-grid > *:hover {
    cursor: pointer;
    transform: scale(1.075);
  }

  .form-grid-entry {
    margin: 5px;
    padding: 2px;
    background: #f6f6f6;
    transition: transform .2s;
    border-radius: 6px;
  }

  .form-content {
    margin-bottom: 10px;
    height: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .form-grid-title {
    margin-left: 5px;
    margin-right: 10px;
    font-weight: bold;
  }

  .form-question-number {

  }

  hr {
    width: 80%;
    height: 1px;
    margin-left: 10%;
    padding: 0;
    display: block;
    border: 0;
    border-top: 1px solid #ccc;
  }

  .form-grid-description-tags {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: baseline;
    margin-top: 10px;
    margin-bottom: 5px;
    font-size: 0.8em;
  }

  .user-is-invited {
    color: #4286f4;
  }

  .published-top-menu {
    background-color: #3EB9DE !important;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .published-menu-content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .header-space {
    margin: 7em;
  }

</style>
