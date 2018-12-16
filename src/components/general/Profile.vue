<template>
  <div>
    <div v-if="!saving">
      <div v-if="!edit">
        <p class="displayName">{{getUser().displayName}}</p>
        <p class="mail">{{getUser().email}}</p>
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
  import Firebase from 'firebase';
  import {updateUserProfileDisplayName} from "@/thunks/userAccountThunks";
  import {firebaseConfig} from "@/firebaseConfig";

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
    methods: {
      getUser() {

        /////test debug, remove when a cleaner solution is found...
        if (!Firebase.apps.length) {
          //Firebase.initializeApp(firebaseConfig);
          return {displayName:'a a', email:'a@a.fr'};
        }////test debug, remove when a cleaner solution is found...

        return Firebase.auth().currentUser;
      },

      updateProfile() {


        updateUserProfileDisplayName(this.getUser(),
          this.firstName,
          this.lastName).then(() => {

          this.setNamesData(this.getUser().displayName);
          this.editProfile();



          this.saving = false;

        }).catch((err) => console.log(err));

        this.saving = true;

      },

      editProfile() {
        this.edit = !this.edit;
        if(this.edit) this.setNamesData(this.getUser().displayName);
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
