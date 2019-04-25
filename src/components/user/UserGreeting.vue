<template>
  <div class="user-greeting">
    <Modal v-if="showGreetingsModal" @close="closeModal">
      <div slot="body">

        <h1>{{getGreeting()}}</h1>

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
          NBINVITES: this.invitedUsers.length,
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

</style>
