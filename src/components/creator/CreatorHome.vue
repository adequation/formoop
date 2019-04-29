<template>
  <div class="creator-home">

    <DockingMenu class="created-top-menu"
                 ref="home-top-menu"
                 top>
      <div slot="body">
        <div class="created-menu-content-wrapper">
          <div class="formoop-title" @click="goTo('home')">
            Formoop
          </div>
        </div>

      </div>
    </DockingMenu>

    <div class="header-space">

    </div>

    <h1>Formoops créés</h1>

    <div class="space-header"></div>

    <div class="creator-home-header">

      <div class="search-form">
        <input class="search-box"
               type="text"
               placeholder="Rechercher un formoop"
               v-model="searchQuery"
               @click.stop=""/>
        <div class="creator-home-button">
          <i v-if="searchQuery" class="material-icons md-18" role="button" @click.stop=""
             @click="searchQuery = ''">clear</i>
        </div>
      </div>

      <div>
        <div class="creator-home-button" @click="createNewForm">
          <i class="material-icons md-36"
             title="Créer un formulaire">add_circle</i>
        </div>
      </div>

    </div>

    <div v-if="createdForms.length > 0">

      <div v-if="searchedForm.length > 0 ">

        <div class="forms-grid">

          <div v-for="form in searchedForm"
               :key="form.id"
               class="form-grid-entry"
               @click="navigate(form)"
               :title="form.title">

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

                <div v-if="containsGenericQuestion(form)">
                  Générique
                </div>

                <div v-if="isFormPublished(form)" class="form-is-published">
                  Publié
                </div>
                <div v-else >
                  Non publié
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
      <h1>Aucun formoop créé</h1>
    </div>

  </div>
</template>

<script>
  import * as uuid from "uuid";
  import {getCreatedForms} from "@/helpers/firebaseHelpers";
  import DockingMenu from "@/components/containers/DockingMenu";

  export default {
    name: "CreatorHome",
    components: {DockingMenu},
    data() {
      return {
        searchQuery: ''
      }
    },
    computed: {
      user() {
        return this.$store.getters.creatorID;
      },

      createdForms() {
        return this.$store.getters.createdForms || [];
      },

      publishedForms() {
        return this.$store.getters.publishedForms || [];
      },

      searchedForm() {
        return this.createdForms.filter(f =>
          this.searchTokens.every(t =>
            f.title.toLowerCase().includes(t.toLowerCase())
          ));
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },

    },
    methods: {
      getFormPath({id}) {
        return "/create/".concat(id);
      },
      createNewForm() {
        this.$router.replace(this.getFormPath({id: uuid.v4()}));
      },

      navigate(form) {
        this.$router.push(this.getFormPath(form));
      },

      isFormPublished(form) {
        return !!this.$store.getters.publishedForms.find(pe => pe.id === form.id) || this.isPublishedGenericForms(form);
      },

      isPublishedGenericForms(form) {
        return !!this.$store.getters.publishedForms.find(pe => pe.id.includes(form.id));
      },

      containsGenericQuestion(form) {
        let containsGenericQuestion = false;

        form.entries.forEach(fe => {
          if (fe.generic) containsGenericQuestion = true;
        });

        return containsGenericQuestion;
      },

      goTo(path) {
        this.$router.push(`/${path}`);
      }
    },

    created() {
      this.$store.dispatch('setCreatorID', {formID: null});
      this.$store.dispatch('setFormCampaigns');
    }
  }
</script>

<style scoped>
  .creator-home{
    margin-left: 20%;
    margin-right: 20%;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .creator-home-header {
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

  .creator-home-button {
    cursor: pointer;
    color: #00000070;
  }

  .creator-home-button :hover {
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
    margin-right: 5px;
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

  .form-is-published {
    color: #4286f4;
  }

  @media screen and (max-width: 370px) {
    .search-box {
      width: 150px;
    }
  }

  .created-top-menu {
    background-color: #4286f4 !important;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .created-menu-content-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .header-space {
    margin: 7em;
  }
</style>
