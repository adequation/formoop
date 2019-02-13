<template>
  <div class="mail-sender">

    <form class="mail-form" v-if="!selectedUser">

      <span>
        <input class="mail-addresses-input"
               type="email"
               placeholder="Adresses email"
               v-model="currentMailAdress"/>
        <button @click="addAdressToPool"> + </button>
      </span>

      <div v-for="(a,i) in mailAddresses">
        <span>
          <p>{{a}}
          <button @click="deleteAdress(i)"> x </button>
          </p>
        </span>
      </div>

      <div>
        <input class="mail-subject-input" type="text" placeholder="Sujet du mail"
               v-model="mailSubject"/>
      </div>

      <div>
        <textarea class="mail-content-textarea"
                  title=""
                  placeholder="Contenu du mail (facultatif)"
                  v-model="mailContent"
                  rows="5"
                  cols="25"></textarea>

        <button @click="sendMail" class="send-mail-button" title="Envoyer !">
          <i class="material-icons md-36">send</i>
        </button>

      </div>


    </form>

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


  </div>
</template>

<script>
  import io from 'socket.io-client';
  import {getFormUrlWithInvite, getFormUrlWithToken, sendMailWithSocket} from "@/helpers/mailHelpers";
  import {inviteUser} from "@/thunks/userAccountThunks";
  import {getDomainFromEmail, getNameFromEmail, getUserIdFromEmail} from "@/helpers/accountHelpers";

  export default {
    name: "MailSender",
    data() {
      return {
        currentMailAdress: '',
        mailAddresses: [],
        mailSubject: '',
        mailContent: '',

        mailerURL: 'localhost:3000',
        socket: null
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
      }
    },
    methods: {

      addAdressToPool() {
        if (!this.mailAddresses.find(a => a === this.currentMailAdress)
          && this.isValidAdress(this.currentMailAdress))
          this.mailAddresses.push(this.currentMailAdress);
        this.currentMailAdress  = '';
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
          inviteUser(userID, this.formID, {
            email : emailAdress,
            id: userID,
            name: getNameFromEmail(emailAdress),
            company: getDomainFromEmail(emailAdress)
          });

          sendMailWithSocket(this.socket, {
            from: 'formoop@gmail.com',
            to: emailAdress,
            html: (this.beforeBody || '')
              + '<br/><br/>'
              + (this.mailContent || '')
              + '<br/><br/>'
              + getFormUrlWithInvite(emailAdress, this.formID, window),
            subject: this.mailSubject
          });
        });

        this.currentMailAdress  = '';
        this.mailAddresses      = [];
        this.mailSubject        = '';
        this.mailContent        = '';
      },

      sendMailToUser() {
        console.log(this.selectedUser)
        console.log(this.sender)
          sendMailWithSocket(this.socket, {
            from: 'formoop@gmail.com',
            to: this.selectedUser.email,
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
          });

        this.currentMailAdress  = '';
        this.mailAddresses      = [];
        this.mailSubject        = '';
        this.mailContent        = '';
      }
    },
    created() {
      this.socket = io(this.mailerURL);
    },
    mounted() {
      this.socket.on('mailer', (data) => {
        console.log(data.message);
      });
    }
  }
</script>

<style scoped>
  div {
    margin: 1em;
  }

  textarea {
    border: 1px solid #00000033;
    border-radius: 5px;
  }

  .send-mail-button {
    padding: 0.5em;
    color: #4286f4;
    background: none;

    cursor: pointer;
    font-size: large;

    border: none;
  }


  .send-mail-button:hover {
    color: #3462ad;
  }
</style>
