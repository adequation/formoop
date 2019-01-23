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

    <div v-else-if="filter === 'grid'">

      <UserEntryGrid :entries="formEntries"
                     :userAnswers="userAnswers"></UserEntryGrid>

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
          <button v-for="f in filters" @click="changeFilter(f.name)"
                  type="button"
                  :class="filter===f.name ? 'user-form-filter-button-selected' : 'user-form-filter-button'"
                  :title=f.description>
            <i class="material-icons">{{f.icon}}</i>
          </button>
        </div>


        <div class="user-form-utils-buttons-wrapper">
          <button class="user-form-save-button" @click="saveAnswers" type="button">
            <i class="material-icons md-36">save</i>
          </button>

          <InviteModal class="user-form-invite-button" v-if="user"/>
        </div>

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
  import UserEntryGrid from "@/components/user/UserEntryGrid";

  export default {
    name: 'UserForm',
    components: {UserEntryGrid, DockingMenu, UserGroupedQuestion, InviteModal, UserFormEntry},
    data() {
      return {
        showModal: false,
        selectedAnswers: {},

        filter: 'all',
        filters: [
          {name: 'all', description: 'Voir tout', icon: 'view_day'},
          {name: 'singles', description: 'Voir non-groupées uniquement', icon: 'view_headline'},
          {name: 'grouped', description: 'Voir groupées uniquement', icon: 'view_agenda'},
          {name: 'grid', description: 'Afficher en grille', icon: 'apps'},
        ]
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
          case 'grid':
            this.filter = 'grid';
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

  .user-form-filter-buttons-wrapper {
    margin: 1em 2em 1em 2em;

    float: left;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-utils-buttons-wrapper {
    margin: 1em 2em 1em 2em;

    float: right;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-filter-button {
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

  .user-form-filter-button-selected {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #4286f4;

    cursor: pointer;
    font-size: large;
    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    border: 2px solid #ffffff;
  }

  .user-form-filter-button:hover {
    background: #3462ad;
  }

  .user-form-save-button {
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #2d8246;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-save-button:hover {
    background: #276a35;
  }


</style>
