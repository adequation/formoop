<template>
  <div>
    <div class="share-tab-header"></div>

    <h1 class="share-form-title">
      <span v-if="isPublished" class="published-form-title">
        Votre Formoop est déjà en ligne !
      </span>

      <span v-else class="not-published-form-title">
        Prêt à mettre en ligne votre Formoop ?
      </span>
    </h1>

    <CSVImportModal :show-modal="showCSVImportModal"
                    :form-entries="this.formEntries"
                    :save-form="this.saveForm"
                    :publishing-campaigns="publishingCampaigns"
                    @close="closeCSVImportModal"
                    :override="this.overrideCSVForm"/>

    <div class="greeting-mode-wrapper">

      <table class="greeting-mode-table">
        <tr @click="selectGreetingMode(true)" :class="{notSelectedGreetingMode: !randomGreeting}">
          <td><i class="material-icons md-26"> {{randomGreeting ? 'check_box' : 'check_box_outline_blank'}}</i></td>
          <td>Phrase d'acceuil au hasard</td>
          <td></td>
        </tr>
        <tr @click="selectGreetingMode(false)" :class="{notSelectedGreetingMode: randomGreeting}">
          <td><i class="material-icons md-26"> {{!randomGreeting ? 'check_box' : 'check_box_outline_blank'}}</i></td>
          <td>Phrase d'acceuil personalisée : </td>
          <td><input type="text" placeholder="Phrase d'acceuil"
                     :value="greeting"
                     @change="changeCustomGreetingSentence($event)"/></td>
        </tr>
      </table>
    </div>

    <div class="publish-wrapper">
      <div class="smooth publish-button good-publish-button"
           @click="publishForm(true)"
           v-if="!isPublished">
        Publier le Formoop !
      </div>

      <div class="already-published-buttons-wrapper" v-else>

        <div
          class="smooth publish-button bad-publish-button"
          @click="publishForm(true)">
          Écraser le Formoop
        </div>

        <div class="smooth publish-button good-publish-button"
             @click="publishForm(false)">
          Mettre a jour le Formoop
        </div>
      </div>
    </div>

    <div class="sharing-wrapper" v-if="isPublished">

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

    <div class="share-tab-footer">

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
  import CSVImportModal from "@/components/creator/CsvImportModal";
  import {getFormURL} from "@/helpers/rooterHelpers";
  import {getInvitationEntryPointText} from "@/helpers/mailHelpers";
  import {clipText} from "@/helpers/generalHelpers";

  export default {
    name: "CreatorFormShareTab",
    components: {CopyToClipboardInput, MailSender, CSVImportModal},
    data() {
      return {
        justCopied: false,
        showCSVImportModal: false,
        showEntryPointModal: false,
        overrideCSVForm: false,
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
      },
      greeting: {
        type: String,
        required: true
      },
      randomGreeting: {
        type: Boolean,
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
      },
      containsGenericQuestion() {
        let containsGenericQuestion = false;

        this.formEntries.forEach(fe => {
          if (fe.generic) containsGenericQuestion = true;
        });

        return containsGenericQuestion;
      },

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

      async publishForm(override = false) {
        await this.saveForm();


        if (this.containsGenericQuestion) {
          this.overrideCSVForm = override;
          this.showCSVImportModal = true;
        }
        else {
          this.directPublishForm(override);

          //remove the form where we don't want it to be
          //and add it where it is not
          saveAndFilterCampaignsFB({
            id: this.formID,
            title: this.formTitle
          }, this.formCampaigns, this.publishingCampaigns);

        }
      },

      async directPublishForm(override = false) {

        await publishCreatorFormFB(this.creatorID, this.formID, override);

        //add admin as an user
        const userID = getUserIdFromEmail(this.user.email);
        inviteUser(userID, this.formID, {
          email: this.user.email,
          id: userID,
          name: getNameFromEmail(this.user.email),
          company: getDomainFromEmail(this.user.email)
        });
      },


      closeCSVImportModal() {
        this.showCSVImportModal = false;
      },

      selectGreetingMode(isRandom) {
        this.$parent.$emit('greeting-mode', isRandom);
      },

      changeCustomGreetingSentence(e){
        this.$parent.$emit('custom-greeting-sentence', e.target.value);
      }
    },

  }
</script>

<style scoped>
  .entry-points-wrapper {

    width: 85%;

    margin: 0 auto;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .entry-points-table-wrapper-content {
    margin: 1em;

    width: auto;

    height: 90%;

    overflow: auto;
  }

  .entry-points-table-wrapper-content::-webkit-scrollbar {
    display: none;
  }

  .entry-points-table-wrapper {

    cursor: default;
    width: 500px;
    min-height: 300px;
    height: 500px;
    text-align: center;

    background: rgba(0, 0, 0, 0) linear-gradient(#6aa3ff, #3462ad);

    border: none;
    border-radius: 16px 16px 16px 16px;
    margin-right: 10px;

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

  .sharing-wrapper {
    height: fit-content;
  }

  @media screen and (max-width: 800px) {
    .entry-points-wrapper {
      overflow: hidden;

      display: block;

      margin: 0 auto;

    }

    .entry-points-table-wrapper {

      cursor: default;
      width: 100%;
      height: 300px;
      text-align: center;

      background: rgba(0, 0, 0, 0) linear-gradient(#6aa3ff, #3462ad);

      border: none;
      border-radius: 16px 16px 16px 16px;

      margin-bottom: 10px;
    }

  }

  .delete-entry-point-button {
    background: none;
    border: none;
    color: #ffffff;

  }

  .delete-entry-point-button:hover {
    cursor: pointer;
    color: tomato;
  }

  .sharing-link {
    width: auto;
    margin: 0 auto;
  }

  .publish-button {
    color: white;
    padding: .5rem 1rem;
    font-size: 1.5625rem;
    line-height: 1.5;
    text-align: center;

    width: fit-content;

    cursor: pointer;
    border: none;
    border-radius: 16px 16px 16px 16px;

    margin-right: 0.5em;
    margin-left: 0.5em;
  }

  .good-publish-button {
    background: #42b983;
  }

  .good-publish-button:hover {
    background: #2f883f;
  }

  .bad-publish-button {
    background: tomato;
  }

  .bad-publish-button:hover {
    background: #dc472f;
  }

  .publish-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin: 2em;
  }

  .already-published-buttons-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin: 3em;
  }

  .share-tab-footer {
    margin-bottom: 9em;
  }

  .share-tab-header {
    margin-bottom: 6.5em;
  }

  .greeting-mode-wrapper {

  }

  .greeting-mode-table {
    border-collapse: collapse;
    text-align: left;
    margin: auto;
  }

  .greeting-mode-table tr:hover {
    background: #eeeeee;
    cursor: pointer;
  }

  .notSelectedGreetingMode {
    color : #00000090
  }

  .notSelectedGreetingMode input[type=text]{
    color : #00000090
  }

</style>
