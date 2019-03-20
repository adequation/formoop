<template>
  <div>
    <div v-if="finishedForms.length > 0">
      <h3>Formulaires terminés :</h3>

      <p v-for="form in finishedForms">
        <a :href="JsonConvert(form)" :download="form.title + '.json'"> {{ form.title }}</a>
      </p>
    </div>

    <div v-else>
      <h1>Aucun formulaire terminé</h1>
    </div>
  </div>
</template>

<script>
  import  {parseForm } from '@/helpers/jsonExportHelpers'

    export default {
      name: "CreatorClosedForms",
      computed:{
        finishedForms(){
          return this.$store.getters.finishedForms;
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

</style>
