<template>
  <div class="form" v-if="formEntries">
    <h1>{{formTitle}}</h1>

    <div class="user-form-section-list-wrapper">
      <UserSectionList v-if="sections"
                       :sections="sections" :focusedSection="focusedSection"
                       :formEntries="formEntries" :userAnswers="userAnswers"></UserSectionList>
    </div>

    <div v-if="sectionSearchFilteredFormEntries.length > 0">
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

        <UserEntryGrid :entries="sectionSearchFilteredFormEntries"
                       :userAnswers="userAnswers"></UserEntryGrid>

      </div>
    </div>
    <div v-else>
      <h2>Aucune question n'a été trouvée...</h2>
    </div>


    <div class="user-form-footer">

    </div>

    <DockingMenu class="user-form-menu">
      <div slot="body">


        <div class="user-form-progress-bar"
             :style="{width: Math.floor(Object.keys(userAnswers).length/formEntries.length * 100) + '%'}">
        </div>

        <div class="user-form-menu-items">
          <div class="user-form-filter-buttons-wrapper">
            <button v-for="f in filters" @click="changeFilter(f.name)"
                    type="button"
                    :class="filter===f.name ? 'user-form-filter-button-selected' : 'user-form-filter-button'"
                    :title=f.description>
              <i class="material-icons">{{f.icon}}</i>
            </button>
          </div>

          <div class="user-form-search-bar-wrapper">
            <i class="material-icons" role="button">search</i>
            <input type="text"
                   placeholder="Rechercher..."
                   class="user-form-search-bar"
                   v-model="searchQuery"/>
            <button type="button" class="user-form-search-delete-button" @click="searchQuery = ''">
              <i v-if="searchQuery" class="material-icons" role="button">clear</i>
            </button>
          </div>

          <div class="user-form-utils-buttons-wrapper">
            <button class="user-form-save-button" @click="saveAnswers" type="button">
              <i class="material-icons md-36">save</i>
            </button>

            <InviteModal class="user-form-invite-button" v-if="user"/>
          </div>
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
  import UserSectionList from "@/components/user/UserSectionList";
  import {getSections} from "@/helpers/sectionsHelpers";

  export default {
    name: 'UserForm',
    components: {UserSectionList, UserEntryGrid, DockingMenu, UserGroupedQuestion, InviteModal, UserFormEntry},
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
        ],

        searchQuery: '',

        focusedSection: null,

      }
    },
    computed: {

      user() {
        return nativeFbFunctions.getCurrentUser();
      },


      formEntries() {
        return this.$store.getters.getFormEntries || []
      },

      singleEntries() {
        return this.sectionSearchFilteredFormEntries.filter(fe => !fe.grouped);
      },

      groupedEntries() {
        const groups = {};

        this.sectionSearchFilteredFormEntries.forEach(fe => {
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

      sectionFilteredFormEntries() {
        if(!this.focusedSection) return this.formEntries;

        if (this.formEntries)
          return this.formEntries.filter(fe => fe.section === this.focusedSection);
        else return [];
      },

      sectionSearchFilteredFormEntries() {
        if (this.sectionFilteredFormEntries)
          return this.sectionFilteredFormEntries.filter(fe =>
            this.searchTokens.every(t =>
              fe.question.title.toLowerCase().includes(t.toLowerCase())
            ));
        else return [];
      },

      searchFilteredFormEntries() {
        if (this.formEntries)
          return this.formEntries.filter(fe =>
            this.searchTokens.every(t =>
              fe.question.title.toLowerCase().includes(t.toLowerCase())
            ));
        else return [];
      },

      formID() {
        return this.$store.getters.getUserFormID
      },

      formTitle() {
        return this.$store.getters.getUserFormTitle
      },

      userAnswers() {
        return this.$store.getters.userAnswers || {}
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },

      sections() {
        return getSections(this.formEntries, this.userAnswers);
      }

    },
    created() {

      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});

      this.$root.$on('set-selected-answers', (id, answers) => {
        this.setSelectedAnswers(id, answers);
      });

      this.$on('section-list-choice', (section) => {
        if (this.focusedSection === section.id) {
          this.focusedSection = null;
          return;
        }
        this.focusedSection = section.id;
      });

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
    position: absolute;
    top: 0;
  }

  .user-form-footer {
    margin: 9em;
  }

  .errorMessage {
  }

  .user-form-menu-items {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    padding: 1.5em;

  }

  .user-form-filter-buttons-wrapper {

    float: left;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

  }

  .user-form-utils-buttons-wrapper {

    float: right;

    display: flex;
    flex-direction: row;
    align-items: center;

  }

  .user-form-search-bar-wrapper {
    width: auto;
    background: #eeeeee;
    border: 1px solid #00000055;

    border-radius: 15px;

    display: flex;
    flex-direction: row;
    align-items: center;

    padding: 0.1em;
  }

  .user-form-search-bar {
    background: none;
    border: none;
  }

  .user-form-search-delete-button {
    background: none;
    border: none;

  }

  .user-form-search-delete-button:hover {
    color: tomato;
  }

  .user-form-search-bar-icon {
    position: absolute;
    bottom: 12px;
    left: 180px;
    width: 10px;
    height: 10px;
  }

  .user-form-section-list-wrapper {
    margin: auto;

    padding: 0.5em;

    width: 75%;
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
