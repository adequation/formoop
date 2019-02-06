<template>
  <div class="invite-modal">
    <button id="show-modal" class="invite-modal-show-button" @click="showModal = true">
      <i class="material-icons md-36">mail</i>
    </button>

    <Modal v-if="showModal" @close="showModal = false">

      <h3 slot="header">Invitations au formulaire {{formTitle}}</h3>

      <div slot="body">
        <MailSender :before-body="getInvitationContent()" :after-body="user.email" :formID="formID"/>
      </div>

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
  import UserInvitedUsers from "../user/UserInvitedUsers";

  export default {
    name: "InviteModal",
    components: {UserInvitedUsers, MailSender, Modal},
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

  .invite-modal-show-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #2d8246;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .invite-modal-show-button:hover {
    background: #276a35;
  }

</style>
