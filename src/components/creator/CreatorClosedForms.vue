<template>
  <div>
    <div v-if="finishedForms.length > 0">
      <h3>Formulaires finis :</h3>

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
    export default {
      name: "CreatorClosedForms",
      computed:{
        finishedForms(){
          return this.$store.getters.finishedForms;
        },
      },
      methods: {
        /**
         * @return {string}
         */
        JsonConvert(form){
          return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(form));
        }
      },
      created() {
        this.$store.dispatch('setCreatorID', {formID: null})
      },
    }
</script>

<style scoped>

</style>
