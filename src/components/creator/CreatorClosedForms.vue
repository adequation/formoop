<template>
  <div class="closed-forms">

      <h3>Formulaires terminés</h3>

      <div class="space-header"></div>

      <div class="closed-forms-header">

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

      <div v-if="finishedForms.length > 0">

        <div v-if="searchedForm.length > 0 ">

          <div class="forms-grid">

            <a v-for="form in searchedForm"
                 :key="form.id"
                 class="form-grid-entry"
                 @click="download(form)"
                 :title="form.title"
                 :href="JsonConvert(form)" :download="form.title + '.json'"
            >
              <div class="form-content">
                  <div class="form-grid-title">
                    {{ form.title }}
                  </div>

                <hr/>

                  <div class="form-question-number">
                    {{Object.keys(form.entries).length}} question{{Object.keys(form.entries).length > 1 ? 's' : ''}}
                  </div>
              </div>
            </a>
          </div>
        </div>

        <div v-else>
          <h3>Aucun formulaire correspondant à la recherche trouvé</h3>
        </div>
      </div>

      <div v-else>
        <h1>Aucun formoop terminé</h1>
      </div>

  </div>
</template>

<script>
  import  {parseForm } from '@/helpers/jsonExportHelpers'

    export default {
      name: "CreatorClosedForms",
      data() {
        return {
          searchQuery: ''
        }
      },
      computed:{
        finishedForms(){
          return this.$store.getters.finishedForms;
        },

        searchedForm() {
          return this.finishedForms.filter(f =>
            this.searchTokens.every(t =>
              f.title.toLowerCase().includes(t.toLowerCase())
            ));
        },

        searchTokens() {
          return this.searchQuery.split(' ');
        },
      },
      methods: {

        /**  @return {string} */
        JsonConvert(form){
          return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.JsonParsing(form), null, 2));
        },

        JsonParsing(BrutForm){
          return parseForm(BrutForm);
        }
      },
      created() {
        this.$store.dispatch('setCreatorID', {formID: null})
      },
    }
</script>

<style scoped>
  .closed-forms{
    margin-left: 20%;
    margin-right: 20%;
  }

  .space-header {
    margin-bottom: 5em;
  }

  .closed-forms-header {
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

  .clean-search-button {
    cursor: pointer;
    color: #00000070;
  }

  .clean-search-button :hover {
    cursor: pointer;
    color: #000000aa;
  }

  .forms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 10rem));
    grid-auto-rows: 1fr;
    width: auto;
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

  .form-grid-entry {
    margin: 5px;
    padding: 2px;
    color: #2c3e50;
    text-decoration: none;
    background: #f6f6f6;
    transition: transform .2s;
    border-radius: 6px;
    outline: none;
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
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: 1em;
    font-weight: normal;
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

</style>
