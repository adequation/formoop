<template>
  <div>

    <button type="button" class="creator-form-save-button"
            @click="publishForm"><i class="material-icons md-36">send</i></button>

    <JsonImportModal :show-modal="showJsonImportModal" :form-entries="this.formEntries" :save-form="this.saveForm" @close="closeJsonImportModal"/>
    <EntryPointModal :show-modal="showEntryPointModal" @close="closeEntryPointModal"/>

  </div>

</template>

<script>
  import EntryPointModal from "./EntryPointModal";
  import {nativeFbFunctions} from "../../helpers/firebaseHelpers";
  import JsonImportModal from "./JsonImportModal";
  import {publishCreatorFormFB} from "../../thunks/creatorForm";
  import {inviteUser} from "../../thunks/userAccountThunks";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "../../helpers/accountHelpers";

  export default {
    name: "CreatorPublication",
    components: {JsonImportModal, EntryPointModal},
    data() {
      return {
        showJsonImportModal: false,
        showEntryPointModal: false,
      }
    },
    props: {
      formEntries: {
        type: Array,
        required: true
      },
      saveForm: {
        type: Function,
        required: true
      },
    },
    computed: {
      formCampaigns() {
        return this.$store.getters.formCampaigns;
      },
      formID() {
        return this.$store.getters.getCreatorFormID
      },
      creatorID() {
        return this.$store.getters.creatorID;
      },
      user(){
        return nativeFbFunctions.getCurrentUser();
      }
    },
    methods: {
      publishForm(){
        this.saveForm();
        if(this.formContainsGenericQuestion()){
          this.showJsonImportModal = true;
        }
        else{
          this.directPublishForm();
          this.showEntryPointModal = true;
        }
      },
      directPublishForm(){
        console.log("publi");
        publishCreatorFormFB(this.creatorID, this.formID);
        //Ajoute l'admin en user
        const userID = getUserIdFromEmail(this.user.email);
        inviteUser(userID, this.formID, {
          email : this.user.email,
          id: userID,
          name: getNameFromEmail(this.user.email),
          company: getDomainFromEmail(this.user.email)
        });
      },
      formContainsGenericQuestion() {
        let containsGenericQuestion = false;

        this.formEntries.forEach(fe => {
          if (fe.generic) containsGenericQuestion = true;
        });

        return containsGenericQuestion;
      },
      closeEntryPointModal() {
        this.showEntryPointModal = false;
      },
      closeJsonImportModal() {
        this.showJsonImportModal = false;
      },
    },

  }
</script>

<style scoped>
  .creator-form-save-button {
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
</style>
