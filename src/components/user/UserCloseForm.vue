<template>

  <div>
    <button type="button" class="user-close-form-button"
            @click="showModal = true"><i class="material-icons md-36">close</i></button>

    <Modal v-if="showModal" @close="showModal = false">

      <div slot="body">

        <div>
          <h3>Attention vous allez fermer le sondage, il sera impossible de modifier ou ajouter des réponses après cette action.</h3>
          <h3>Etes vous sûr de vouloir clore le sondage ?</h3>

          <span><button class="button-refuse-close" type="button" @click="showModal = false">NON</button><button class="button-accept-close" type="button" @click="closeForm">OUI</button></span>
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
        }
      },
      computed:{

      },
      methods: {
        closeForm() {

        },
      }
    }
</script>

<style scoped>

</style>
