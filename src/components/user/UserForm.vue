<template>
  <div class="form" v-if="formEntries">
    <h1>{{formTitle}}</h1>

    <div v-if="filter === 'all'">

      <UserGroupedQuestion v-for="group in groupedEntries"
                           :key="group.id"
                           :group="group"
                           :userAnswers="userAnswers"/>

      <UserFormEntry v-for="entry in singleEntries"
                     :key="entry.id"
                     :entry="entry"
                     :userAnswers="userAnswers || {}"/>

    </div>

    <div v-if="filter === 'singles'">

      <UserFormEntry v-for="entry in singleEntries"
                     :key="entry.id"
                     :entry="entry"
                     :userAnswers="userAnswers || {}"/>

    </div>

    <div v-else-if="filter === 'grouped'">

      <UserGroupedQuestion v-for="group in groupedEntries"
                           :key="group.id"
                           :group="group"
                           :userAnswers="userAnswers"/>

    </div>


    <div class="user-form-footer">

    </div>

    <DockingMenu class="user-form-menu">
      <div slot="body">

        <div class="user-form-progress-wrapper">

          <div class="user-form-progress-bar"
               :style="{width: Math.floor(Object.keys(userAnswers).length/formEntries.length * 100) + '%'}">
          </div>


        </div>

        <div class="user-form-filter-buttons-wrapper">
          <button @click="changeFilter('all')" class="user-form-filter-button">
            <i class="material-icons">view_day</i>
          </button>

          <button @click="changeFilter('singles')" class="user-form-filter-button">
            <i class="material-icons">view_headline</i>
          </button>

          <button @click="changeFilter('grouped')" class="user-form-filter-button">
            <i class="material-icons">view_agenda</i>
          </button>
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
  import {setSelectedAnswersFB} from '@/thunks/userFormEntriesThunks'
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
        selectedAnswers: {},
        filter: 'all'
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
      },

      changeFilter(filter) {
        switch (filter) {
          case 'singles':
            this.filter = 'singles';
            break;
          case 'grouped':
            this.filter = 'grouped';
            break;
          default:
            this.filter = 'all';
            break;

        }
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
    background: linear-gradient(to right, #42b983, #47ce54);

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
  .errorMessage {
  }

  .user-form-filter-buttons-wrapper{
    margin: 1em 2em 1em 0.2em;

    float: right;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-filter-button{
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;

    background: #4286f4;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-filter-button:hover {
    color: white;
    background: #3462ad;
  }
</style>
