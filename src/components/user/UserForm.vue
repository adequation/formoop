<template>
  <div class="form" v-if="formEntries" >
    <h1>{{formTitle}}</h1>
    <UserFormEntry v-for="entry in formEntries"
                   :key="entry.id"
                   :entry="entry"/>
    <button @click="saveAnswers">Enregistrer</button>

    <InviteModal/>

  </div>
  <div v-else>
    <h1 class="errorMessage">Formulaire inconnu !</h1>
  </div>
</template>

<script>
  import UserFormEntry from '@/components/user/UserFormEntry'
  import {setSelectedAnswersFB} from '@/thunks/userFormEntriesThunks'
  import InviteModal from "@/components/general/InviteModal";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  export default {
    name: 'UserForm',
    components: {InviteModal, UserFormEntry},
    data () {
      return {
        showModal: false,
        selectedAnswers: {}
      }
    },
    computed: {
      formEntries () {
        return this.$store.getters.getFormEntries
      },
      formID () {
        return this.$store.getters.getUserFormID
      },
      formTitle () {
        return this.$store.getters.getUserFormTitle
      },
      formPath() {
        return this.$store.getters.getUserFormPath
      }
    },
    created: function () {
      this.$store.dispatch('setFormID', {formID: this.$route.params.formID}).then(this.$store.dispatch('setFormPath'))
        .then(this.$store.dispatch('setFormEntries')).then(this.$store.dispatch('setFormTitle'));
      this.$root.$on('set-selected-answers', (id, answers) => {
        this.setSelectedAnswers(id, answers)
      });
    },
    methods: {
      setSelectedAnswers (id, answers) {
        const tmp = {...this.selectedAnswers};
        tmp[id] = answers;
        this.selectedAnswers = tmp;
      },
      saveAnswers () {
        const user = nativeFbFunctions.getCurrentUser();
        if(user)
          setSelectedAnswersFB(this.formPath, this.selectedAnswers, user.uid);
        else alert("Vous n'êtes pas connecté !");
      }
    },
    watch: {
      '$route' (to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID}).then(this.$store.dispatch('setFormPath'))
          .then(this.$store.dispatch('setFormEntries')).then(this.$store.dispatch('setFormTitle'))
      }
    }
  }
</script>

<style scoped>
  .errorMessage {}
</style>
