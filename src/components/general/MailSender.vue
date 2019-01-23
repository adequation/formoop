<template>
  <div class="mail-sender">

    <form class="mail-form">

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
                  v-model="mailContent"></textarea>
      </div>

    </form>

    <button @click="sendMail">Envoyer</button>

  </div>
</template>

<script>
  import io from 'socket.io-client';
  import {sendMailWithSocket} from "@/helpers/mailHelpers";
  import {saveFormInvitationsFB} from "@/thunks/invitationsThunks";

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
      }
    },
    computed: {
      invitedUsers () {
        return this.$store.getters.getInvitedUsers;
      },
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
      saveInvitations() {
        saveFormInvitationsFB(this.formID, [...this.invitedUsers, ...this.mailAddresses])
      },
      sendMail() {
        // Save invitations on db before sending mails
        this.saveInvitations();
        sendMailWithSocket(this.socket, {
          from: 'formoop@gmail.com',
          to: this.mailAddresses,
          html: (this.beforeBody || '') + '<br/><br/>' + (this.mailContent || '') + '<br/><br/>' + (this.afterBody || ''),
          subject: this.mailSubject
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
    font-size: .8rem;
    letter-spacing: 1px;
  }
  textarea {
    padding: 10px;
    line-height: 1.5;
    border-radius: 5px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 1px #999;
  }
</style>
