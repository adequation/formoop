<template>
  <div class="invite-modal">
    <button id="show-modal" @click="showModal = true">Inviter des collaborateurs</button>

    <Modal v-if="showModal" @close="showModal = false">

      <h3 slot="header">Invitations au formulaire {{formTitle}}</h3>

      <div slot="body"> <MailSender :before-body="getInvitationContent()" :after-body="user.email"/> </div>

    </Modal>

  </div>
</template>

<script>
  import MailSender from "@/components/general/MailSender";
  import Modal from "@/components/containers/Modal";
  import {getFormURL} from "@/helpers/rooterHelpers";
  import {getInvitationText} from "@/helpers/mailHelpers";
  import * as Firebase from "firebase";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";

  export default {
    name: "InviteModal",
    components: {MailSender, Modal},
    data() {
      return {
        showModal: false,
        route: this.$router.currentRoute
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
    methods:{
      getInvitationContent(){
        return getInvitationText(this.formTitle, this.user.displayName, this.formURL)
      }
    }
  }
</script>

<style scoped>

</style>
