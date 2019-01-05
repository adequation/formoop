<template>
  <div>
    <div v-if="!saving">
      <div v-if="!edit">
        <p class="displayName">{{user.displayName}}</p>
        <p class="mail">{{user.email}}</p>
        <button @click="editProfile">Modifier</button>
      </div>
      <div v-else>
        <input class="firstNameInput" type="text" placeholder="Prénom" v-model="firstName" v-on:keydown="keyHandler"/>
        <input class="lastNameInput" type="text" placeholder="Nom" v-model="lastName" v-on:keydown="keyHandler"/>
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
  import {updateUserProfileDisplayName} from "@/thunks/userAccountThunks";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "Profile",
    data() {
      return {
        firstName: '',
        lastName: '',

        saving: false,
        edit: false
      }
    },
    computed: {
      user(){
        return nativeFbFunctions.getCurrentUser();
      }
    },
    methods: {

      updateProfile() {

        updateUserProfileDisplayName(this.user,
          this.firstName,
          this.lastName).then(() => {

          this.setNamesData(this.user.displayName);
          this.editProfile();

          this.saving = false;

        }).catch((err) => console.log(err));

        this.saving = true;

      },

      editProfile() {
        this.edit = !this.edit;
        if(this.edit) this.setNamesData(this.user.displayName);
      },

      getNamesFromDisplayName(displayName) {
        const namesArray = displayName.split(' ');
        return {
          firstName: namesArray[0],
          lastName: namesArray[1]
        };
      },

      setNamesData(displayName) {
        const names = this.getNamesFromDisplayName(displayName);

        this.firstName = names.firstName;
        this.lastName = names.lastName;
      },

      keyHandler(event){
        if(event.key === ' ') event.preventDefault();
      }
    }
  }
</script>

<style scoped>

</style>
