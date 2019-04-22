<template>
  <div>

    <h3>Formoops créés :</h3>

    <div class="space-header"></div>

    <div class="creator-home-header">

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

      <div class="create-form">
        <div @click="createNewForm"><i class="material-icons md-36" title="Créer un formulaire">add_circle</i></div>
      </div>

    </div>

    <div v-if="createdForms.length > 0">

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
                {{form.questionNumber}} question(s)
              </div>

              <div v-if="containsGenericQuestion(form)" class="form-is-generic">
                Générique
              </div>

              <div class="space-form-publication-state"></div>

              <div v-if="isFormPublished(form)" class="form-publication-state-published">
                Publié
              </div>
              <div v-else class="form-publication-state-not-published">
                Non publié
              </div>

            </div>

          </div>

        </div>

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

  export default {
    name: "CreatorHome",
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

      publishedForms(){
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
    },

    created() {
      this.$store.dispatch('setCreatorID', {formID: null});
      this.$store.dispatch('setFormCampaigns');
    }
  }
</script>

<style scoped>
  .creator-home-header {
    margin-left: 20%;
    margin-right: 20%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1em;
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
    margin: 0px 2px 0px 2px;
  }

  .search-box:focus {
    outline: none;
  }

  .search-box::placeholder {
    font-size: 0.9em;
  }

  .forms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    grid-auto-rows: 1fr;
    width: auto;
    margin-left: 20%;
    margin-right: 20%;
  }

  .forms-grid > *:hover {
    cursor: pointer;
    transform: scale(1.05);

    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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
    margin: 2px;
    background: #f6f6f6;

    transition: transform .2s;
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
  }

  .form-grid-description {
  }

  .form-question-number {

  }

  .form-is-generic {
    color: rgba(0, 0, 0, 0.6);
    font-size: 0.8em;
    position: absolute;
    margin-right: 10px;
    bottom: 15px;
    right: 0;
  }

  .form-publication-state-published {
    font-size: 0.8em;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 10px;
    color: #4286f4;
  }

  .form-publication-state-not-published {
    font-size: 0.8em;
    position: absolute;
    bottom: 0;
    right: 0;
    margin-right: 10px;
  }

  .space-form-publication-state {
    padding: 1em;
  }

  .create-form > div {
    cursor: pointer;
    color: #00000070;
  }

  .create-form > div :hover {
    cursor: pointer;
    color: #000000aa;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .clean-search-button :hover{
    cursor: pointer;
  }


</style>
