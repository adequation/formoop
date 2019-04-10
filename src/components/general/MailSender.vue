<template>

  <div class="mail-form" v-if="!selectedUser">

    <div class="mail-form-content">
      <div class="mail-address-input-wrapper">
        <input class="mail-addresses-input"
               type="email"
               placeholder="Adresse email"
               v-model="currentMailAdress"
               @keyup.enter="addAdressToPool"/>
        <button type="button" class="mail-adresses-button" @click="addAdressToPool">
          <i class="material-icons md-16">add</i>
        </button>
      </div>


      <div class="mail-addresses-input-wrapper">
        <table class="mail-adress-table">
          <tr v-for="(a,i) in mailAddresses">
            <td>{{clip(a, 20, true)}}</td>
            <td>
              <div class="mail-adress-remove-button"
                   title="retirer l'adresse mail"
                   @click="deleteAdress(i)">
                <i class="material-icons md-18">close</i>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <div class="mail-body-wrapper">
        <div class="mail-subject-wrapper">
          <input class="mail-subject-input"
                 type="text"
                 placeholder="Sujet du mail"
                 v-model="mailSubject"/>
        </div>

        <textarea class="mail-body-input"
                  title=""
                  placeholder="Contenu du mail (facultatif)"
                  v-model="mailContent"
                  rows="5"
                  cols="25"></textarea>

        <button type="button" @click="sendMail" class="send-mail-button" title="Envoyer !">
          <i class="material-icons md-36">send</i>
        </button>

      </div>
    </div>


  </div>

  <div v-else>
    <h2>Envoyer un message à {{selectedUser.name}}</h2>

    <textarea class="mail-content-textarea"
              title=""
              placeholder="Contenu du mail (facultatif)"
              v-model="mailContent"
              rows="5"
              cols="25"></textarea>

    <button @click="sendMailToUser" class="send-mail-button smooth" title="Envoyer !">
      <i class="material-icons md-36">send</i>
    </button>

  </div>


</template>

<script>
  import io from 'socket.io-client';
  import {getFormUrlWithInvite, getFormUrlWithToken, sendMailToBack , isValidAddress} from "@/helpers/mailHelpers";
  import {inviteUser, inviteEntryPoint} from "@/thunks/userAccountThunks";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";
  import {clipText} from "@/helpers/generalHelpers";

  export default {
    name: "MailSender",
    data() {
      return {
        currentMailAdress: '',
        mailAddresses: [],
        mailSubject: 'Invitation Formoop',
        mailContent: '',

      }
    },
    props: {
      beforeBody: {
        type: String,
        required: false
      },
      afterBody: {
        type: String,
        required: false
      },
      formID: {
        type: String,
        required: true
      },
      selectedUser: {
        type: Object,
        required: false
      },
      sender: {
        type: Object,
        required: true
      },
      callBack: {
        type: Function,
        required: false,
      }
    },
    methods: {

      clip(text, size, dots = false) {
        return clipText(text, size, dots);
      },

      addAdressToPool() {
        if (!this.mailAddresses.find(a => a === this.currentMailAdress)
          && isValidAddress(this.currentMailAdress))
          this.mailAddresses.push(this.currentMailAdress);
        this.currentMailAdress = '';
      },

      deleteAdress(index) {
        this.mailAddresses.splice(index, 1);
      },


      sendMail() {

        this.mailAddresses.forEach(emailAdress => {

          const userID = getUserIdFromEmail(emailAdress);
          this.callBack({
            userID, formID: this.formID, metadata: {
              email: emailAdress,
              id: userID,
              name: getNameFromEmail(emailAdress),
              company: getDomainFromEmail(emailAdress)
            }
          });

          sendMailToBack({
            recipient: emailAdress,
            message: {
              html: (this.beforeBody || '')
                + '<br/><br/>'
                + (this.mailContent || '')
                + '<br/><br/>'
                + getFormUrlWithInvite(emailAdress, this.formID, window),
              subject: this.mailSubject
            }
          });
        });

        this.currentMailAdress = '';
        this.mailAddresses = [];
        this.mailSubject = '';
        this.mailContent = '';
      },

      sendMailToUser() {
        sendMailToBack({
          recipient: this.selectedUser.email,
          message: {
            html: `<strong>${this.sender.name} (${this.sender.email})</strong> vous à envoyé un message à travers Formoop !`
              + '<br/><br/>'
              + '<div style="background: lightgray;">'
              + '<br/>'
              + this.mailContent
              + '<br/><br/>'
              + '</div>'
              + '<br/><br/>'
              + 'Ca se passe par ici : '
              + getFormUrlWithInvite(this.selectedUser.email, this.formID, window),
            subject: `Message de ${this.sender.name}`
          }
        });

        this.currentMailAdress = '';
        this.mailAddresses = [];
        this.mailSubject = '';
        this.mailContent = '';
      }
    },
    created() {
    },
    mounted() {

    }
  }
</script>

<style scoped>

  .send-mail-button {
    padding: 0.5em;
    color: white;
    background: none;

    cursor: pointer;
    font-size: large;

    border: none;
  }

  .send-mail-button:hover {
    color: white;
    transform: scale(1.1);
  }

  .mail-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    width: 300px;
    min-width: 250px;
    height: fit-content;
    text-align: center;

    background: rgba(0, 0, 0, 0) linear-gradient(#6aa3ff, #3462ad);

    border: 0 none rgb(23, 43, 77);
    border-radius: 16px 16px 16px 16px;

    overflow-y: hidden;
    overflow-x: hidden;

    margin: 0 auto;
  }

  .mail-form-content {
    margin: 1em;

    width: auto;

    height: 90%;

    overflow: scroll;
  }

  .mail-form-content::-webkit-scrollbar {
    display: none;
  }

  .mail-form::-webkit-scrollbar {
    display: none;
  }

  .mail-address-input-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-bottom: 0.5em;
    width: auto;
  }

  .mail-addresses-input-wrapper {

    margin: 0 auto;
    max-height: 100px;
    overflow-y: scroll;

    width: auto;
  }

  .mail-addresses-input-wrapper::-webkit-scrollbar {
    display: none;
  }

  .mail-adress-table {
    overflow-y: scroll;
    max-width: 60%;
    max-height: 500px;

    margin: 0 auto;

    text-align: left;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .mail-adress-table td {
    padding-left: 5px;
    padding-top: 0.25em;
    padding-bottom: 0.25em;

    width: 200px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: white;

  }

  .mail-subject-input {
    width: 100%;
    border: none;

    height: 20px;

    background: #eeeeee;
    padding: 5px;
    border-radius: 6px;
  }

  .mail-body-input {
    margin-top: 5px;
    width: 90%;
    border: none;
    padding: 5px;

    background: #eeeeee;
    border-radius: 6px;

    resize:none;
  }

  .mail-body-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-top: 5px;
  }

  .mail-subject-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: auto;
    margin: 0;
  }

  .mail-adress-table button {
    background: none;
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border-radius: 0 10px 10px 0;
  }

  .mail-addresses-input {
    width: 80%;
    height: 30px;
    border: none;
    padding: 0;
    margin: 0;

    background: #eeeeee;
    border-radius: 10px 0 0 10px;

    text-align: center;
  }

  .mail-adresses-button {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 30px;

    min-width: 50px;
    min-height: 30px;

    border-radius: 0 10px 10px 0;

    padding: 0;
    margin: 0;

    color: white;

    background: #4286f4;
    border: none;

    outline: none;

    cursor: pointer;
  }

  .mail-adress-remove-button {
    color: white;
  }

  .mail-adress-remove-button:hover {
    transform: scale(1.1);
    color: tomato;
    cursor: pointer;
  }


</style>
