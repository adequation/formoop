<template>
  <Modal v-if="showModal" @close="closeModal">
    <h3 slot="header">Inviter le Point d'entré</h3>

    <div slot="body">
      <MailSender :before-body="getInvitationContent()" :after-body="user.email" :formID="formID" :entry-point="true"/>
    </div>

  </Modal>
</template>

<script>
  import {getInvitationEntryPointText} from "@/helpers/mailHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {getFormURL} from "@/helpers/rooterHelpers";
  import MailSender from "../general/MailSender";
  import Modal from "../containers/Modal";

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
          return this.$store.getters.getUserFormTitle
        },
        formID() {
          return this.$store.getters.getUserFormID
        },
        formURL() {
          return getFormURL(this.formID, window);
        },
        user(){
          return nativeFbFunctions.getCurrentUser();
        }
      },
      methods: {
        publish(){
          this.$emit('publish')
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
