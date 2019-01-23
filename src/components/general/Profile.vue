<template>
  <div>
    <div v-if="!saving">
      <div v-if="!edit">
        <p class="displayName">{{userMetaData.firstName}} {{userMetaData.lastName}}</p>
        <p class="displayCompany">Entreprise {{userMetaData.company }} </p>
        <p class="mail">Email {{userMetaData.email}}</p>

        <button @click="editProfile">Modifier</button>
      </div>
      <div v-else>

        <p>Prénom <input class="firstNameInput" type="text" placeholder="Prénom" v-model="userMetaData.firstName" v-on:keydown="keyHandler"/></p>
        <p>Nom <input class="lastNameInput" type="text" placeholder="Nom" v-model="userMetaData.lastName" v-on:keydown="keyHandler"/></p>
        <p>Entreprise<input class="companyInput" type="text" placeholder="Entreprise" v-model="userMetaData.company" ></p>

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
  import {updateUserProfileDisplayName, getUserMetaData, updateUserProfileMetaData} from "@/thunks/userAccountThunks";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Profile",
    data() {
      return {
        userMetaData:{},

        saving: false,
        edit: false
      }
    },
    created: function () {
      getUserMetaData(nativeFbFunctions.getCurrentUser()).then( (data) => {
        this.userMetaData = {...data.val()}
      });
    },
    computed: {
      user(){

        return nativeFbFunctions.getCurrentUser();
      }
    },
    methods: {

      updateProfile() {

        updateUserProfileMetaData(
          this.user,
          this.userMetaData)
        .then(() => {
            getUserMetaData(nativeFbFunctions.getCurrentUser()).then( (data) => {
              this.userMetaData = {...data.val()}
            });
          this.editProfile();

          this.saving = false;

        }).catch((err) => console.log(err));

        this.saving = true;

      },

      editProfile() {
        if (this.edit)
          getUserMetaData(nativeFbFunctions.getCurrentUser()).then( (data) => {
            this.userMetaData = {...data.val()}});
        this.edit = !this.edit;
      },

      keyHandler(event){
        if(event.key === ' ') event.preventDefault();
      }
    }
  }
</script>

<style scoped>

</style>
