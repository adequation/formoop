<template>
  <div>

    <h1 class="share-form-title">
      <span v-if="isPublished" class="published-form-title">
        Votre Formoop est déjà en ligne !
      </span>

      <span v-else class="not-published-form-title">
        Prêt à mettre en ligne votre Formoop ?
      </span>
    </h1>

    <div class="sharing-wrapper" v-if="isPublished" >

      <div class="entry-points-wrapper">

        <div class="entry-points-table-wrapper">
          <div class="entry-points-table-wrapper-content">
            <h2>Points d'entrée déjà en train de travailler</h2>

            <table class="entry-points-table" v-if="entryPoints.length >0">
              <tr v-for="entryPoint in entryPoints"
                  :title="entryPoint.name">
                <td>
                  <div class="entry-point-icon"><i class="material-icons md-36">face</i></div>
                </td>
                <td class="entry-point-name">{{clip(entryPoint.name, 20, true)}}</td>
                <td class="entry-point-email">({{clip(entryPoint.email, 20, true)}})</td>
                <td>
                  <button type="button"
                          class="delete-entry-point-button"
                          title="Retirer le point d'entrée">
                    <i class="material-icons md-16">close</i>
                  </button>
                </td>

              </tr>
            </table>

            <h3 v-else>Aucun point d'entrée !</h3>
          </div>

        </div>

        <div class="sharing-mail">
          <MailSender :before-body="invitationContent"
                      :call-back="inviteEntry"
                      :is-entry-point="true"
                      :sender="{name: user.displayName ,email: user.email}"
                      :formID="formID"/>
        </div>
      </div>


      <div class="sharing-link">
        <p>Partages le à l'aide du lien suivant :</p>
        <CopyToClipboardInput :text-to-copy="formURL"/>
      </div>
    </div>


  </div>
</template>

<script>
  import {publishCreatorFormFB, saveAndFilterCampaignsFB} from "@/thunks/creatorForm";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";
  import {inviteEntryPoint, inviteUser} from "@/thunks/userAccountThunks";
  import CopyToClipboardInput from "@/components/general/CopyToClipboardInput";
  import MailSender from "@/components/general/MailSender";
  import {getFormURL} from "@/helpers/rooterHelpers";
  import {getInvitationEntryPointText} from "@/helpers/mailHelpers";
  import {clipText} from "@/helpers/generalHelpers";

  export default {
    name: "CreatorFormShareTab",
    components: {CopyToClipboardInput, MailSender},
    data() {
      return {
        justCopied: false,
        showCSVImportModal: false,
        showEntryPointModal: false,
      }
    },
    props: {
      formEntries: {
        type: Array,
        required: true
      },
      isPublished: {
        type: Boolean,
        required: true
      },
      entryPoints: {
        type: Array,
        required: true,
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
      user() {
        return nativeFbFunctions.getCurrentUser();
      },
      formURL() {
        return getFormURL(this.formID, window);
      },
      invitationContent() {
        return getInvitationEntryPointText(this.formTitle, this.user.displayName, this.formURL)
      }
    },
    methods: {
      getShortName(name) {
        const shortName = name.substring(0, name.lastIndexOf(' '));
        return shortName || name;
      },

      clip(text, size, dots = false) {
        return clipText(text, size, dots);
      },

      inviteEntry({userID, formID, metadata}) {
        inviteUser(userID, formID, metadata);
        inviteEntryPoint(userID, formID, metadata);
      },

      publishForm() {
        this.saveForm();
        if (this.formContainsGenericQuestion()) {
          this.showCSVImportModal = true;
        }
        else {
          this.directPublishForm();

          //remove the form where we don't want it to be
          //and add it where it is not
          saveAndFilterCampaignsFB({
            id: this.formID,
            title: this.formTitle
          }, this.formCampaigns, this.publishingCampaigns);

          this.showEntryPointModal = true;

        }
      },

      directPublishForm() {
        publishCreatorFormFB(this.creatorID, this.formID);
        //Ajoute l'admin en user
        const userID = getUserIdFromEmail(this.user.email);
        inviteUser(userID, this.formID, {
          email: this.user.email,
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
  .entry-points-wrapper {
    overflow: hidden;
    max-height: 500px;
    min-width: 300px;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
  }

  .entry-points-table-wrapper-content {
    margin: 1em;

    width: auto;

    height: 90%;

    overflow: scroll;
  }

  .entry-points-table-wrapper-content::-webkit-scrollbar {
    display: none;
  }

  .entry-points-table-wrapper {

    cursor: default;
    width: 500px;
    min-width: 400px;
    min-height: 400px;
    height: 500px;
    text-align: center;

    background: rgba(0, 0, 0, 0) linear-gradient(#6aa3ff, #3462ad);

    border: none;
    border-radius: 16px 16px 16px 16px;
  }



  .entry-points-table-wrapper h2 {
    margin: auto;

    width: fit-content;

    text-align: center;
    padding: 0.1em 0.5em 0.1em 0.5em;
    font-weight: bold;
    background: rgba(11, 86, 139, 0.25);
    border-radius: 6px;
    color: white;
  }

  .entry-points-table td {
    border-bottom: 1px solid #00000033;
    padding-left: 5px;
    padding-top: 0.25em;
    padding-bottom: 0.25em;

    color: white;

  }

  .entry-point-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: white;

  }

  .entry-point-name {
    font-weight: bold;

  }

  .entry-point-email {

  }

  .entry-points-table {
    border-collapse: collapse;
    margin: 0 auto;
    overflow: scroll;
    text-align: left;

    width: auto;
  }

  .sharing-mail {
    max-width: 200px;
    width: auto;
    float: right;
  }

  @media screen and (max-width: 600px) {
    .entry-points-wrapper {
      float: none;
      margin-right: 0;

    }
  }

  .delete-entry-point-button {
    background: none;
    border: none;
    color: #ffffff;

  }

  .delete-entry-point-button:hover {
    color: tomato;
  }

  .sharing-link{
    width: auto;
    margin:0 auto;
  }
</style>
