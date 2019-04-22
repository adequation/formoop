<template>
  <div class="indentification-modal">
    Pour t'authentifier, il faut utiliser ton lien personnel !
    <button id="show-identification-modal" class="identification-modal-show-button"
            @click="showIdentificationModal = true" title="Obtenir le lien du formulaire" type="button">
      Obtenir mon lien
    </button>

    <Modal v-if="showIdentificationModal || showGetLinkModal" @close="closeModal">
      <div slot="body" >

        <h1>Tu n'es pas connecté &#x1F625</h1>

        <div v-if="!mailSend">
          <p>Donne moi ton adresse email pour recevoir ton lien (Tu dois être invité au formoop pour y participer)</p>
          <input
            class="mail-input"
            @keydown.enter="verifyEmail"
            type="text"
            v-model="mailAddress"
            placeholder="Adresse mail"
          >

          <button type="button" @click="verifyEmail" title="Envoyer le lien" class="send-mail-button">
            <i class="material-icons md-22">send</i>
          </button>

          <div class="mail-address-error-message">
            <div v-if="invalidAddress">
              Cette adresse email est invalide
            </div>

            <div v-if="notInvited">
              Aucun utilisateur n'est invité avec cette adresse email
            </div>
          </div>
        </div>

        <div v-else>
          <p>Ton lien d'accès au formoop a été envoyé sur ton adresse email</p>
          <button type="button" @click="closeModal">
            Ok
          </button>
        </div>

      </div>
    </Modal>

  </div>
</template>

<script>
  import Modal from "@/components/containers/Modal";
  import {sendMailToBack, getFormUrlWithInvite, isValidAddress, isInvitedMailAddress} from "../../helpers/mailHelpers";

  export default {
    name: "UserGetFormLinkModal",
    components: {Modal},
    data() {
      return {
        showIdentificationModal: true,
        mailAddress: "",
        invalidAddress: false,
        notInvited: false,
        mailSend: false
      }
    },
    props: {
      showGetLinkModal: {
        type: Boolean,
        required: false,
        default: false
      },
    },
    methods: {
      verifyEmail() {
        this.invalidAddress = false;
        this.notInvited = false;

        if (isValidAddress(this.mailAddress)) {
          if (isInvitedMailAddress(this.mailAddress, this.invitedUsers)) {
            this.sendMailToUser();
            this.mailSend = true;
          } else {
            this.notInvited = true;
          }
        } else {
          this.invalidAddress = true;
        }
        this.mailAddress = '';
      },

      sendMailToUser() {
        sendMailToBack({
          recipient: this.mailAddress,
          message: {
            html: `Comme tu l'as demandé, voici ton lien d'invitation au sondage ${this.formTitle}!`
              + '<br/><br/>'
              + 'Ca se passe par ici : '
              + getFormUrlWithInvite(this.mailAddress, this.formID, window),
            subject: `Lien d'invitation au sondage ${this.formTitle}`
          }
        });
        this.mailAddress = '';
      },

      closeModal() {
        this.$parent.$emit('close-get-link-modal');
        this.showIdentificationModal = false;
        this.mailSend = false;
      }
    },
    computed: {
      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },

      formID() {
        return this.$store.getters.getFormID;
      },

      formTitle() {
        return this.$store.getters.getFormTitle;
      },
      user() {
        return this.$store.getters.user;
      },

    },
    watch: {
      user(){
        if(user) this.showIdentificationModal = false
      }
  }
  }
</script>

<style scoped>

  input[type=text] {
    background: none;
    border: none;
    border-bottom: 1px solid lightgrey;
    font-size: medium;
  }

  .mail-input {
    outline: none;
    width: 20%;
  }

  .send-mail-button {
    padding: 0.5em;
    color: #4286f4;
    background: none;

    cursor: pointer;
    font-size: large;

    border: none;
  }

  .mail-address-error-message{
    font-size: 14px;
  }

</style>
