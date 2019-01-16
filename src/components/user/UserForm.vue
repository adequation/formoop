<template>
  <div class="form" v-if="formEntries" >
    <h1>{{formTitle}}</h1>

    <UserGroupedQuestion v-for="group in groupedEntries"
                   :key="group.id"
                   :group="group"/>

    <UserFormEntry v-for="entry in singleEntries"
                   :key="entry.id"
                   :entry="entry"
                   :userAnswers="userAnswers || {}"/>

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
  import UserGroupedQuestion from "@/components/user/UserGroupedQuestion";
  export default {
    name: 'UserForm',
    components: {UserGroupedQuestion, InviteModal, UserFormEntry},
    data () {
      return {
        showModal: false,
        selectedAnswers: {}
      }
    },
    computed: {
      singleEntries(){
        return this.formEntries.filter(fe => !fe.grouped);
      },

      groupedEntries(){
        const groups = {};

        this.formEntries.forEach(fe => {
          if(fe.grouped) {
            if(groups[fe.group]) groups[fe.group].entries.push(fe);

            else groups[fe.group] = {entries : [fe], question: fe.groupQuestion, id: fe.group};
          }
        });

        return Object.keys(groups).map(key => {
          groups[key].entries.sort((a,b) => a.question.title.localeCompare(b.question.title));

          return groups[key];
        });
      },

      formEntries () {
        return this.$store.getters.getFormEntries
      },

      formID () {
        return this.$store.getters.getUserFormID
      },

      formTitle () {
        return this.$store.getters.getUserFormTitle
      },

      userAnswers () {
        return this.$store.getters.userAnswers
      }
    },
    created: function () {

      this.$root.$on('set-selected-answers', (id, answers) => {
        this.setSelectedAnswers(id, answers)
      });

      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setFormCampaigns');

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
          setSelectedAnswersFB(this.formID, this.selectedAnswers, user.uid);

        else alert("Vous n'êtes pas connecté !");
      }
    },
    watch: {
      '$route' (to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID})
      }
    }
  }
</script>

<style scoped>
  .errorMessage {}
</style>
