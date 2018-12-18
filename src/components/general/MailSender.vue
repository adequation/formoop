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
        <textarea class="mail-content-textarea" title="" v-model="mailContent"></textarea>
      </div>

    </form>

    <button @click="sendMail">Envoyer</button>

  </div>
</template>

<script>
  import io from 'socket.io-client';

  export default {
    name: "MailSender",
    data() {
      return {
        currentMailAdress: '',
        mailAddresses: [],
        mailSubject: '',
        mailContent: '',

        mailerURL: 'localhost:3000',
        socket: null,
        messages: []
      }
    },
    methods: {
      addAdressToPool() {
        if (!this.mailAddresses.find(a => a === this.currentMailAdress)
          && this.isValidAdress(this.currentMailAdress))
          this.mailAddresses.push(this.currentMailAdress)
      },
      deleteAdress(index) {
        this.mailAddresses.splice(index, 1);
      },
      isValidAdress(adress) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(adress);
      },
      sendMail() {
        this.socket.emit('sendMail', {
          from: 'stev@gmail.com',
          to: this.mailAddresses,
          html: this.mailContent,
          subject: this.mailSubject
        });
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
</style>
