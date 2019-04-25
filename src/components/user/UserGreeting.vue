<template>
  <div class="user-greeting">
    <Modal class="user-greeting-modal" v-if="showGreetingsModal" @close="closeModal" :show-close-button="false">

      <div slot="header">

      </div>

      <div slot="body">

        <span class="greeting hand-written">{{getGreeting()}}</span>

        <div class="begin-button pulse" @click="closeModal">
          Commencer !
        </div>

        <div class="user-help-message">
          Et si tu as besoin d'un coup de main pour commencer, c'est <span class="user-help-link" @click="">par ici</span> !
        </div>

      </div>
    </Modal>
  </div>
</template>

<script>
  import {getRandomGreeting, parseSentence} from "@/helpers/greetingsHelpers";
  import {getFormattedHourMinutes, getFormattedToday} from "@/helpers/timeHelpers";
  import Modal from "@/components/containers/Modal";


  export default {
    name: "UserGreeting",
    components: {Modal},

    data() {
      return {
      }
    },

    props: {
      showGreetingsModal: {
        type: Boolean,
        required: false,
      },
      percentage: {
        type: Number,
        required: true
      },
    },

    computed: {
      //current variables : NOM, ENTREPRISE, HEURE, DATE, TITRE, NBINVITES, POURCENTAGE_ACTUEL, POURCENTAGE_RESTANT
      parsingVariables() {
        return {
          NOM: this.user.name,
          ENTREPRISE: this.user.company,
          HEURE: getFormattedHourMinutes(),
          DATE: getFormattedToday(),
          TITRE: this.formTitle,
          NBINVITES: (this.invitedUsers ? Object.keys(this.invitedUsers) : []).length,
          POURCENTAGE_ACTUEL: this.percentage,
          POURCENTAGE_RESTANT: 100 - this.percentage
        }
      },

      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },

      formID() {
        return this.$store.getters.getFormID;
      },

      formTitle() {
        return this.$store.getters.getFormTitle;
      },

      user() {
        return this.$store.getters.user;
      },

    },

    methods: {
      closeModal() {
        this.$parent.$emit('close-greetings-modal');
      },

      getGreeting() {

        const rawGreeting = getRandomGreeting();
        //we use
        return parseSentence(rawGreeting, this.parsingVariables);
      }
    },
  }
</script>

<style scoped>
  @import url('../../style/animations.css');

  .greeting{
    color : black;
    font-weight: bold;
    width: auto;
    margin: auto;
    font-size: xx-large;

    text-align: center;
  }

  .begin-button {
    color: white;
    background: #4286f4;

    box-shadow: 0 0 0 0 #4286f4;

    padding: .5rem 1rem;
    font-size: 2rem;
    line-height: 1.5;
    text-align: center;

    width: fit-content;

    cursor: pointer;
    border: none;
    border-radius: 16px 16px 16px 16px;

    margin: 2em auto;

  }

  .user-help-link {
    font-weight: bold;
    color: #4286f4;
    font-size: 1rem;
    cursor: pointer;
  }

  .user-help-link:hover{
    text-decoration: underline;
  }

</style>
