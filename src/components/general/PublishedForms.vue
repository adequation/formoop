<template>

  <div>

    <h1>Formoops en cours</h1>

    <div class="space-header"></div>

    <div class="published-forms-header">

      <div class="search-form">
        <input class="search-box"
               type="text"
               placeholder="Rechercher un formoop"
               v-model="searchQuery"
               @click.stop=""/>
        <div class="clean-search-button">
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
               class="user-grid-entry"
               @click="navigate(form)"
               :title="form.title"
          >
            <div class="form-content">
              <div class="form-grid-header">
                <div class="form-grid-title">
                  {{form.title}}
                </div>
              </div>

              <hr/>

              <div class="form-grid-description">
                <div class="form-question-number">
                  {{form.questionNumber}} question{{form.questionNumber > 1 ? 's' : ''}}
                </div>

                <hr/>

                <div class="form-grid-description-tags">

                  <div v-if="isUserInvited(form)" class="form-publication-state-published">
                    Invité
                  </div>
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

  export default {
    name: "PublishedForms",
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
        return isUserInvitedToForm(form.id, getUserIdFromEmail(this.user.email), this.publishedForms);
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
  .published-forms-header {
    margin-left: 20%;
    margin-right: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .search-form {
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: normal;
    align-items: center;
  }

  .search-box {
    width: 150px;
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

  .forms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
    grid-auto-rows: 1fr;
    width: auto;
    margin-left: 20%;
    margin-right: 20%;
  }

  .forms-grid > *:hover {
    cursor: pointer;
    transform: scale(1.075);

  }

  .form-content {
    height: 100%;
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    font-weight: bold;
    margin-bottom: 10px;
  }

  .user-grid-entry {
    margin: 5px;
    background: #f6f6f6;

    transition: transform .2s;

    border-radius: 6px;
    padding: 2px;
  }

  hr {
    width: 80%;
    margin-left: 10%;
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #ccc;
    padding: 0;
  }

  .form-grid-header {

  }

  .form-grid-title {
    margin-left: 5px;
    margin-right: 10px;

    font-weight: bold;
  }

  .form-grid-description {

  }

  .form-grid-description-tags {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: baseline;
    margin-top: 10px;
    margin-bottom: 5px;
    font-weight: lighter;

  }

  .form-question-number {
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 1em;
    font-weight: normal;

  }

  .form-publication-state-published {
    font-size: 0.8em;
    color: #4286f4;
  }

  .create-form > div {
    cursor: pointer;
    color: #00000070;
  }

  .create-form > div :hover {
    cursor: pointer;
    color: #000000aa;
  }


  .clean-search-button :hover {
    cursor: pointer;
  }

  .search-box {
    width: auto;
  }
</style>
