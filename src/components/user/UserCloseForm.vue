<template>

  <div>
    <button type="button" class="user-close-form-button"
            @click="showModal = true"><i class="material-icons md-36">close</i></button>

    <Modal v-if="showModal" @close="showModal = false">

      <div slot="body">

        <div v-if="isAllAnswered">
          <h3>Attention vous allez fermer le sondage, il sera impossible de modifier ou ajouter des réponses après cette action.</h3>
          <h3>Etes vous sûr de vouloir clore le sondage ?</h3>

          <span><button class="button-refuse-close" type="button" @click="showModal = false">NON</button><button class="button-accept-close" type="button" @click="closeForm">OUI</button></span>
        </div>

        <div v-else>
          <div v-if="!seccondVerif">
            <h2>Il reste des réponses importantes auxquelles vous n'avez pas encore répondu</h2>
            <h3>Etes vous sûr de vouloir clore le sondage ?</h3>

            <span><button class="button-refuse-close" type="button" @click="showModal = false">NON</button><button class="button-accept-close" type="button" @click="seccondVerif = true">OUI</button></span>

          </div>
          <div v-else>
            <h2>Il reste des réponses importantes auxquelles vous n'avez pas encore répondu</h2>
            <h3>Il sera impossible de modifier ou ajouter des réponses après cette action.</h3>
            <h3>Etes vous vraiment sûr de vouloir clore le sondage ?</h3>

            <span><button class="button-refuse-close" type="button" @click="showModal = false">NON</button><button class="button-accept-close" type="button" @click="closeForm">OUI</button></span>

          </div>

        </div>

      </div>

    </Modal>


  </div>

</template>

<script>
    import Modal from "../containers/Modal";
    export default {
      name: "UserCloseForm",
      components: {Modal},
      data(){
        return {
          showModal: false,
          seccondVerif: false,
        }
      },
      computed:{
        isAllAnswered(){
          let requiredEntries = this.$store.getters.getFormEntries.filter(entry => entry.required !== true);
          return requiredEntries.every(entry => Object.keys(this.$store.getters.userAnswers).includes(entry.id));
        }
      },
      methods: {
        closeForm() {

        },
      }
    }
</script>

<style scoped>

</style>
