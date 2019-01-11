<template>
  <div>

    <div v-if="createdForms.length > 0">

      <h3>Formulaires créés :</h3>

        <p v-for="form in createdForms">
          <router-link :to=getFormPath(form)>{{form.title}} ({{form.questionNumber}} questions)</router-link>
        </p>

    </div>

    <div v-else>
      <h1>Aucun formulaire créé</h1>
    </div>

    <button type="button" @click="createNewForm">Créer un formulaire</button>
  </div>
</template>

<script>
  import * as uuid from "uuid";
  import * as Firebase from "firebase";
  import {getCreatedForms} from "@/helpers/firebaseHelpers";

  export default {
    name: "CreatorHome",
    computed: {
      createdForms() {
        return this.$store.getters.createdForms || [];
      },
    },
    methods: {
      getFormPath({id}) {
        return "/create/".concat(id);
      },
      createNewForm() {
        this.$router.replace(this.getFormPath({id: uuid.v4()}));
      },
    },
    created() {
      this.$store.dispatch('setCreatorID', {formID: null})
    }
  }
</script>

<style scoped>

</style>
