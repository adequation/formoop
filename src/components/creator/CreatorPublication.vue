<template>
  <div>

    <button type="button" class="creator-form-save-button" title="Publier le formulaire"
            @click="publishForm"><i class="material-icons md-36">send</i></button>

    <CSVImportModal :show-modal="showCSVImportModal" :form-entries="this.formEntries" :save-form="this.saveForm" :publishing-campaigns="publishingCampaigns" @close="closeJsonImportModal"/>
    <EntryPointModal :show-modal="showEntryPointModal" @close="closeEntryPointModal" />

  </div>

</template>

<script>
  import EntryPointModal from "./EntryPointModal";
  import {nativeFbFunctions} from "../../helpers/firebaseHelpers";
  import CSVImportModal from "./CSVImportModal";
  import {publishCreatorFormFB} from "../../thunks/creatorForm";
  import {inviteUser} from "../../thunks/userAccountThunks";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "../../helpers/accountHelpers";
  import {saveAndFilterCampaignsFB} from "@/thunks/creatorForm";

  export default {
    name: "CreatorPublication",
    components: {CSVImportModal, EntryPointModal},
    data() {
      return {
        showCSVImportModal: false,
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
      publishingCampaigns: {
        type: Array,
        required: true
      },
      formTitle: {
        type: String,
        required: true
      }
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
          this.showCSVImportModal = true;
        }
        else{
          this.directPublishForm();

          //remove the form where we don't want it to be
          //and add it where it is not
          saveAndFilterCampaignsFB({id: this.formID,title: this.formTitle}, this.formCampaigns, this.publishingCampaigns);

          this.showEntryPointModal = true;

        }
      },
      directPublishForm(){
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
        this.showCSVImportModal = false;
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

  .creator-form-save-button:hover {
    background: #276a35;
  }

</style>
