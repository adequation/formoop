<template>
  <div>
    <p v-if="user">Connecté en tant qu'admin ({{user.email}})</p>
  </div>
</template>

<script>
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Profile",
    data() {
      return {
      }
    },
    computed: {
      user() {
        return nativeFbFunctions.getCurrentUser();
      },
    }
  }
</script>

<style scoped>

</style>
