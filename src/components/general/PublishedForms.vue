<template>

  <div>

    <div v-if="publishedForms.length > 0">

      <p v-for="form in publishedForms">
        <router-link :to=getPublishedFormPath(form)>{{form.title}} ({{form.questionNumber}} questions)</router-link>
      </p>

    </div>

    <div v-else>
      <h1>Il n'y a aucun sondage en cours pour l'instant</h1>
    </div>

  </div>

</template>

<script>
    export default {
        name: "PublishedForms",
      methods:{
        getPublishedFormPath({id}) {
          return "/answer/".concat(id);
        },
      },
      computed:{
          publishedForms(){
            return this.$store.getters.publishedForms;
          }
      },
      created(){
        this.$store.dispatch('setPublishedForms');

      }
    }
</script>

<style scoped>

</style>
