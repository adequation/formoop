<template>
  <div>
    <div v-if="!saving">
      <div v-if="!edit">
        <p class="displayName">{{user.firstName}} {{user.lastName}}</p>
        <p class="displayCompany">Entreprise {{user.company }} </p>
        <p class="mail">Email {{user.email}}</p>

        <button @click="editProfile">Modifier</button>
      </div>
      <div v-else>

        <p>Prénom <input class="firstNameInput" type="text" placeholder="Prénom" v-model="userMetadata.firstName"
                         v-on:keydown="keyHandler"/></p>
        <p>Nom <input class="lastNameInput" type="text" placeholder="Nom" v-model="userMetadata.lastName"
                      v-on:keydown="keyHandler"/></p>
        <p>Entreprise<input class="companyInput" type="text" placeholder="Entreprise" v-model="userMetadata.company">
        </p>

        <button @click="updateProfile">Sauvegarder</button>
        <button @click="editProfile">Annuler</button>
      </div>
    </div>
    <div v-else class="saving">
      ...
    </div>
  </div>
</template>

<script>
  import {updateUserProfileDisplayName, updateUserProfileMetadata} from "@/thunks/userAccountThunks";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Profile",
    data() {
      return {

        userMetadata: {},

        saving: false,
        edit: false
      }
    },
    created: function () {

    },
    computed: {
      user() {
        return this.$store.getters.user || nativeFbFunctions.getCurrentUser();
      },
    },
    methods: {

      updateProfile() {

        updateUserProfileMetadata(
          this.user,
          this.userMetadata)
          .then(() => {

            this.editProfile();

            this.saving = false;

          }).catch((err) => console.log(err));

        this.saving = true;

      },

      editProfile() {
        if (!this.edit) {
          const Metadata = {...this.user};
          delete Metadata.uid;
          this.userMetadata = Metadata;
        }
        this.edit = !this.edit;
      },

      keyHandler(event) {
        if (event.key === ' ') event.preventDefault();
      }
    },
    watch: {
      '$route'(to, from) {
        this.$store.dispatch("setUser")
      }
    }
  }
</script>

<style scoped>

</style>
