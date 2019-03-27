<template>

  <div>
    <div class="user-form-close-button-wrapper">
      <button type="button"
              title="Fermer le formulaire"
              :class="['user-close-form-button', hovered ? 'shake' : '']"
              @click="showModal = true;"
              @mouseover="hovered = true"
              @mouseleave="hovered = false">
        <i class="material-icons md-36 user-close-form-button-content">{{hovered ? 'lock' : 'lock_open'}}</i>
      </button>
    </div>


    <Modal v-if="showModal" @close="showModal = false">

      <div slot="body">

        <div v-if="isAllAnswered">
          <h3>Attention vous allez fermer le formulaire, il sera impossible de modifier ou ajouter des réponses après cette action.</h3>
          <h3>Êtes vous sûr de vouloir clore le formulaire ?</h3>

          <span>
            <button class="button-refuse-close" type="button" @click="showModal = false">NON</button>
            <button class="button-accept-close" type="button" @click="this.closeForm">OUI</button>
          </span>
        </div>

        <div v-else>
          <div v-if="!secondVerif">
            <h2>Attention vous allez fermer le formulaire, il sera impossible de modifier ou ajouter des réponses après cette action.</h2>
            <h3>Etes vous sûr de vouloir clore le formulaire ?</h3>

            <span>
              <button class="button-refuse-close" type="button" @click="showModal = false">NON</button>
              <button class="button-accept-close" type="button" @click="secondVerif = true">OUI</button>
            </span>
          </div>

          <div v-else>
            <h2>Il reste des réponses importantes auxquelles vous n'avez pas encore répondu</h2>
            <h3>Il sera impossible de modifier ou ajouter des réponses après cette action.</h3>
            <h3>Etes vous vraiment sûr de vouloir clore le formulaire ?</h3>

            <span>
              <button class="button-refuse-close" type="button" @click="showModal = false">NON</button>
              <button class="button-accept-close" type="button" @click="closeForm">OUI</button>
            </span>

          </div>
        </div>
      </div>

    </Modal>
    </div>

</template>

<script>
    import Modal from "../containers/Modal";
    import {closePublishedForm} from "../../thunks/closingFormThunks";
    export default {
      name: "UserCloseForm",
      components: {Modal},
      data(){
        return {
          showModal: false,
          secondVerif: false,
          hovered: false,
          animated: false
        }
      },
      computed:{
        formID(){
          return this.$store.getters.getFormID;
        },

        isAllAnswered(){
          let requiredEntries = this.$store.getters.getFormEntries.filter(entry => entry.required);
          return requiredEntries.every(entry => Object.keys(this.$store.getters.userAnswers).includes(entry.id));
        }
      },
      methods: {
        redirect(path){
          this.$router.replace(path);
        },
        closeForm() {
          closePublishedForm(this.formID);
          this.redirect('/closedForm')
        },
      }
    }
</script>

<style scoped>

  .user-close-form-button{
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: tomato;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-close-form-button:hover {
    background: #e24536;
  }

  .user-form-close-button-wrapper{
    top:5px;
    right: 0;
    position: fixed;
  }

</style>
