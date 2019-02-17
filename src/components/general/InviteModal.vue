<template>
  <div class="invite-modal">
    <button id="show-modal" class="invite-modal-show-button" @click="showModal = true">
      <i class="material-icons md-36">person</i>
    </button>

    <Modal v-if="showModal" @close="showModal = false">

      <div slot="body">

        <div class="invite-wrapper">

          <div class="invited-user-table-wrapper">

          <table class="invited-user-table">
            <caption>Utilisateurs invités</caption>
            <tr v-for="user in invitedUsers"
                :title="'Envoyer un message à ' + getShortName(user.name)"
                @click="selectUser(user)"
            :class="selectedUser === user ? 'selected-user-from-list' : ''" >

              <td><div class="invited-user-icon"> <i class="material-icons md-36">account_circle</i> </div></td>
              <td class="invited-user-name">{{user.name}}</td>
              <td class="invited-user-email">({{user.email}})</td>

            </tr>
          </table>

          </div>

          <MailSender
            class='mail-sender'
                      :before-body="getInvitationContent()" :after-body="user.email"
                      :formID="formID"
                      :sender="user"
                      :selectedUser="selectedUser"
                      :call-back="inviteUsers"/>

        </div>

      </div>

    </Modal>

  </div>
</template>

<script>
  import MailSender from "@/components/general/MailSender";
  import Modal from "@/components/containers/Modal";
  import {getInvitationText, sendMailWithSocket} from "@/helpers/mailHelpers";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {inviteUser} from "../../thunks/userAccountThunks";

  export default {
    name: "InviteModal",
    components: {MailSender, Modal},
    data() {
      return {
        showModal: false,
        selectedUser: null
      }
    },
    computed: {
      formTitle() {
        return this.$store.getters.getFormTitle
      },
      formID() {
        return this.$store.getters.getFormID
      },
      user() {
        return this.$store.getters.user;
      },
      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },
      route(){
        return this.$router.currentRoute
      }
    },
    methods: {
      inviteUsers({userID, formID, metadata}){
        inviteUser(userID, formID, metadata);
      },
      getInvitationContent() {
        return getInvitationText(this.formTitle, this.user.name)
      },

      getShortName(name){
        const shortName = name.substring(0, name.lastIndexOf(' '));
        return shortName || name;
      },

      selectUser(user){
        this.selectedUser = this.selectedUser === user ? null : user;
      },
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

  .invite-wrapper {


    overflow: hidden;

    max-height: 500px;
  }

  .mail-sender {

  }

  .invited-user-table-wrapper {
    overflow-y: scroll;
    max-width: 50%;
    max-height: 500px;

    margin-left: 0;

    text-align: left;

    float: left;
  }

  .invited-user-table caption {
    font-weight: bold;
    font-size: large;
  }

  .invited-user-table td {
    border-bottom: 1px solid #00000033;
    padding-left: 5px;
    padding-top: 0.25em;
    padding-bottom:0.25em;
  }

  .invited-user-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .invited-user-name {
    font-weight: bold;
  }

  .invited-user-table{
    border-collapse: collapse;
  }

  .selected-user-from-list{
    background-color: steelblue;

    color: white;
  }

  .selected-user-from-list:hover{
    background-color: #386ea7 !important;
  }

  .invited-user-table tr:hover {
    background-color: #eeeeee;

    overflow: auto;
  }


</style>
