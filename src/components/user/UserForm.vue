<template>
  <div class="form" v-if="formEntries">
    <h1>{{formTitle}}</h1>

    <UserGroupedQuestion v-for="group in groupedEntries"
                         :key="group.id"
                         :group="group"/>

    <UserFormEntry v-for="entry in singleEntries"
                   :key="entry.id"
                   :entry="entry"
                   :userAnswers="userAnswers || {}"/>


    <div class="user-form-footer">

    </div>

    <DockingMenu class="user-form-menu">
      <div slot="body">

        <div class="user-form-progress-wrapper">

          <div class="user-form-progress-bar"
               :style="{width: Math.floor(Object.keys(userAnswers).length/formEntries.length * 100) + '%'}">
          </div>


        </div>

        <button @click="saveAnswers">Enregistrer</button>

        <InviteModal v-if="user"/>

      </div>
    </DockingMenu>


  </div>
  <div v-else>
    <h1 class="errorMessage">Formulaire inconnu !</h1>
  </div>
</template>

<script>
  import UserFormEntry from '@/components/user/UserFormEntry'
  import {deleteUserAnswerFB, setSelectedAnswersFB} from '@/thunks/userFormEntriesThunks'
  import InviteModal from "@/components/general/InviteModal";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import UserGroupedQuestion from "@/components/user/UserGroupedQuestion";
  import DockingMenu from "@/components/containers/DockingMenu";

  export default {
    name: 'UserForm',
    components: {DockingMenu, UserGroupedQuestion, InviteModal, UserFormEntry},
    data() {
      return {
        showModal: false,
        selectedAnswers: {}
      }
    },
    computed: {
      singleEntries() {
        return this.formEntries.filter(fe => !fe.grouped);
      },

      user() {
        return nativeFbFunctions.getCurrentUser();
      },

      groupedEntries() {
        const groups = {};

        this.formEntries.forEach(fe => {
          if (fe.grouped) {
            if (groups[fe.group]) groups[fe.group].entries.push(fe);

            else groups[fe.group] = {entries: [fe], question: fe.groupQuestion, id: fe.group};
          }
        });

        return Object.keys(groups).map(key => {
          groups[key].entries.sort((a, b) => a.question.title.localeCompare(b.question.title));

          return groups[key];
        });
      },

      formEntries() {
        return this.$store.getters.getFormEntries
      },

      formID() {
        return this.$store.getters.getUserFormID
      },

      formTitle() {
        return this.$store.getters.getUserFormTitle
      },

      userAnswers() {
        return this.$store.getters.userAnswers || {}
      }
    },
    created() {

      this.$root.$on('set-selected-answers', (id, answers) => {
        this.setSelectedAnswers(id, answers);
      });

      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});

    },
    methods: {
      setSelectedAnswers(id, answers) {
        const tmp = {...this.selectedAnswers};
        tmp[id] = answers;
        this.selectedAnswers = tmp;
      },

      saveAnswers() {
        if (this.user)
          setSelectedAnswersFB(this.formID, this.selectedAnswers, this.user.uid);

        else alert("Vous n'êtes pas connecté !");
      }
    },
    watch: {
      '$route'(to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID})
      },
    }
  }
</script>

<style scoped>
  .user-form-progress-bar {
    border: 0;
    background: linear-gradient(to right, #42b983, #42b983, #47ce54);

    height: 0.35em;
  }

  .user-form-progress-wrapper {
    width: 100%;
    float: left;
  }

  .user-form-progress-value {

    font-weight: 600;
    color: #42b983;

    position: fixed;
  }

  .user-form-footer {
    margin: 9em;
  }
</style>
