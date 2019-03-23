<template>
  <Modal v-if="showModal" @close="closeModal">
    <h3 slot="header">Inviter le Point d'entrée</h3>

    <div slot="body">
      <MailSender :before-body="getInvitationContent()" :call-back="inviteEntry" :is-entry-point="true" :sender="{name: user.displayName ,email: user.email}" :formID="formID"/>
    </div>

  </Modal>
</template>

<script>
  import {getInvitationEntryPointText} from "@/helpers/mailHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {getFormURL} from "@/helpers/rooterHelpers";
  import MailSender from "../general/MailSender";
  import Modal from "../containers/Modal";
  import {inviteEntryPoint, inviteUser} from "../../thunks/userAccountThunks";

    export default {
      name: "EntryPointModal",
      components: {Modal, MailSender},
      props: {
        showModal:{
          type: Boolean,
          required: true
        }
      },
      computed: {
        formTitle() {
          return this.$store.getters.getFormTitle
        },
        formID() {
          return this.$store.getters.getFormID
        },
        formURL() {
          return getFormURL(this.formID, window);
        },
        user(){
          return nativeFbFunctions.getCurrentUser();
        }
      },
      methods: {
        inviteEntry({userID, formID, metadata}){
          inviteUser(userID, formID, metadata);
          inviteEntryPoint(userID, formID, metadata);
        },
        closeModal(){
          this.$emit('close');
        },
        getInvitationContent() {
          return getInvitationEntryPointText(this.formTitle, this.user.displayName, this.formURL)
        }
      }
    }
</script>

<style scoped>

</style>
