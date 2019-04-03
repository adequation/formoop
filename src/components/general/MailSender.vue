<template>

  <div class="mail-form" v-if="!selectedUser">

    <div class="mail-addresses-input-wrapper">
      <input class="mail-addresses-input"
             type="email"
             placeholder="Adresse email"
             v-model="currentMailAdress"
             @keyup.enter="addAdressToPool"/>
      <button type="button" @click="addAdressToPool"> +</button>
    </div>


    <div class="mail-addresses-input-wrapper">
      <table class="mail-adress-table">
        <tr v-for="(a,i) in mailAddresses">
          <td>{{a}}</td>
          <td>
            <button type="button" @click="deleteAdress(i)">
              <i class="material-icons md-18">close</i>
            </button>
          </td>
        </tr>
      </table>
    </div>

    <div class="mail-body-wrapper">
      <input class="mail-subject-input"
             type="text"
             placeholder="Sujet du mail"
             v-model="mailSubject"/>
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

  <div v-else>
    <h2>Envoyer un message à {{selectedUser.name}}</h2>

    <textarea class="mail-content-textarea"
              title=""
              placeholder="Contenu du mail (facultatif)"
              v-model="mailContent"
              rows="5"
              cols="25"></textarea>

    <button @click="sendMailToUser" class="send-mail-button" title="Envoyer !">
      <i class="material-icons md-36">send</i>
    </button>

  </div>


</template>

<script>
  import io from 'socket.io-client';
  import {getFormUrlWithInvite, getFormUrlWithToken, sendMailToBack} from "@/helpers/mailHelpers";
  import {inviteUser, inviteEntryPoint} from "@/thunks/userAccountThunks";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";

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

      addAdressToPool() {
        if (!this.mailAddresses.find(a => a === this.currentMailAdress)
          && this.isValidAdress(this.currentMailAdress))
          this.mailAddresses.push(this.currentMailAdress);
        this.currentMailAdress = '';
      },

      deleteAdress(index) {
        this.mailAddresses.splice(index, 1);
      },

      isValidAdress(adress) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(adress);
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
    color: #4286f4;
    background: none;

    cursor: pointer;
    font-size: large;

    border: none;
  }

  .mail-subject-input {
    width: 100%;
    margin-bottom: 0.5em;
  }

  .send-mail-button:hover {
    color: #3462ad;
  }

  .mail-form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    overflow: auto;
    max-height: 500px;
    min-width: 300px;
  }

  .mail-addresses-input-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    margin-bottom: 0.5em;
  }

  .mail-adress-table {
    overflow-y: scroll;
    max-width: 50%;
    max-height: 500px;

    text-align: left;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .mail-adress-table tr:hover {
    background-color: #eeeeee;
  }

  .mail-adress-table caption {
    font-weight: bold;
    font-size: large;
  }

  .mail-adress-table td {
    padding-left: 5px;
    padding-top: 0.25em;
    padding-bottom: 0.25em;

    width: 200px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

  }

  .mail-body-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5em;

  }

  .mail-body-input {
    border: 1px solid #00000033;
    resize: none;
    width: 100%;
  }

  .mail-adress-table button {
    background: none;
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }


</style>
