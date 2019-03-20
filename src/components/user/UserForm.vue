<template>
  <div class="form" v-if="formEntries">

      <user-close-form class="user-form-close-button" v-if="isEntryPoint" />


    <h1>{{formTitle}}</h1>
    <h2>{{user ? user.name : 'Non connecté'}}</h2>

    <div class="user-form-section-list-wrapper">
      <UserSectionList v-if="sections.length > 0"
                       :sections="sections" :focusedSection="focusedSection"
                       :formEntries="formEntries" :userAnswers="userAnswers"></UserSectionList>
    </div>

    <div v-if="sortedEntries.length > 0">

      <div v-if="filter === 'all'">

        <UserGroupedQuestion v-for="group in groupedEntries"
                             :key="group.id"
                             :group="group"
                             :userAnswers="userAnswers"
                             :selectedAnswers="selectedAnswers"/>

        <UserFormEntry v-for="entry in singleEntries"
                       :key="entry.id"
                       :entry="entry"
                       :userAnswers="userAnswers || {}"
                       :selectedAnswers="selectedAnswers"/>

      </div>

      <div v-if="filter === 'singles'">

        <UserFormEntry v-for="entry in singleEntries"
                       :key="entry.id"
                       :entry="entry"
                       :userAnswers="userAnswers || {}"
                       :selectedAnswers="selectedAnswers"/>

      </div>

      <div v-else-if="filter === 'grouped'">

        <UserGroupedQuestion v-for="group in groupedEntries"
                             :key="group.id"
                             :group="group"
                             :userAnswers="userAnswers"
                             :selectedAnswers="selectedAnswers"/>

      </div>

      <div v-else-if="filter === 'grid'">

        <UserEntryGrid :entries="sortedEntries"
                       :userAnswers="userAnswers"
                       :selectedAnswers="selectedAnswers">

        </UserEntryGrid>

      </div>
    </div>
    <div v-else>
      <h2>Aucune question n'a été trouvée...</h2>
    </div>


    <div class="user-form-footer">

    </div>

    <DockingMenu class="user-form-menu">
      <div slot="body">


        <div class="user-form-progress-bar smooth"
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

            <div class="vertical-separator"></div>

            <button v-for="s in sorters" @click="selectedSorter = s"
                    type="button"
                    class="user-form-sort-button"
                    :title="s.description">
              <i class="material-icons">{{s.icon}}</i>
            </button>

            <div class="vertical-separator"></div>


            <button @click="cleanAllFilters"
                    type="button"
                    :class="['user-form-clean-filters-button', !hasFilter ? 'disabled' : '']"
                    title="Enlever tous les filtres">
              <i class="material-icons">{{hasFilter ? 'visibility_off' : 'visibility'}}</i>
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

            <button class="user-form-save-button" @click="saveAnswers" type="button" title="Enregistrer le formulaire">
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
  import {setSelectedAnswerFB, setSelectedAnswersFB} from '@/thunks/userFormEntriesThunks'
  import InviteModal from "@/components/general/InviteModal";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import UserGroupedQuestion from "@/components/user/UserGroupedQuestion";
  import DockingMenu from "@/components/containers/DockingMenu";
  import UserEntryGrid from "@/components/user/UserEntryGrid";
  import UserSectionList from "@/components/user/UserSectionList";
  import {getSections} from "@/helpers/sectionsHelpers";
  import {isAnswered} from "@/helpers/userAnswersHelpers";
  import {decodeEmailToken} from "@/helpers/accountHelpers";
  import UserCloseForm from "./UserCloseForm";

  export default {
    name: 'UserForm',
    components: {
      UserCloseForm,
      UserSectionList, UserEntryGrid, DockingMenu, UserGroupedQuestion, InviteModal, UserFormEntry},
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

        selectedSorter: '',
        sorters: [
          {
            name: 'alphabetical',
            description: 'Filtrer par ordre alphabetique',
            icon: 'sort_by_alpha',
            sortingLayer: 0,
            sort: (a, b) => a.question.title.localeCompare(b.question.title)
          },
          {
            name: 'unalphabetical',
            description: 'Filtrer par ordre alphabetique inverse',
            icon: 'sort_by_alpha',
            sortingLayer: 0,
            sort: (a, b) => b.question.title.localeCompare(a.question.title)
          },
        ],

        /*

        {
            name: 'answered',
            description: 'Avec réponse en premier',
            icon: 'expand_less',
            sortingLayer: 1,
            sort: (a, b) => {
              const aAnswered = this.hasAnsweredToEntry(a);
              const bAnswered = this.hasAnsweredToEntry(b);

              if (!aAnswered) {
                if (!bAnswered) return 0;
                return 1;
              }
              if (!bAnswered) return 0;
              return 0;
            }
          },
          {
            name: 'notAnswered',
            description: 'Sans réponse en premier',
            icon: 'expand_more',
            sortingLayer: 1,
            sort: (a, b) => {
              const aAnswered = this.hasAnsweredToEntry(a);
              const bAnswered = this.hasAnsweredToEntry(b);
              if (aAnswered) {
                if (bAnswered) return 0;
                return 1;
              }
              if (bAnswered) return 0;
              return 0;
            }
          },

         */

        searchQuery: '',

        focusedSection: null,

      }
    },
    computed: {

      user() {
        return this.$store.getters.user;
      },

      formEntries() {
        return this.$store.getters.getFormEntries || []
      },

      singleEntries() {
        return this.sortedEntries.filter(fe => !fe.grouped);
      },

      isEntryPoint(){
        return this.user ? !!this.$store.getters.entryPoints.find(e=>e.id === this.user.id) : false;
      },

      groupedEntries() {
        const groups = {};

        this.sortedEntries.forEach(fe => {
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
        if (!this.focusedSection) return this.formEntries;

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

      sortedEntries() {
        //we copy entries before sorting because Vue does not detect array swapping
        let entries = this.sectionSearchFilteredFormEntries.map(e => e);

        if (!entries) return [];
        if (!this.selectedSorter) return entries;

        entries = entries.sort(this.selectedSorter.sort);

        return entries;
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
        return this.$store.getters.getFormID
      },

      formTitle() {
        return this.$store.getters.getFormTitle
      },

      userAnswers() {
        return this.$store.getters.userAnswers || {}
      },

      searchTokens() {
        return this.searchQuery.split(' ');
      },

      sections() {
        return getSections(this.formEntries, this.userAnswers);
      },

      hasFilter() {
        return this.filter !== 'all' || this.searchQuery || this.focusedSection
      },

    },
    created() {

      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setUser', {userID: this.$route.params.userID});


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

        if(Array.isArray(answers))  tmp[id] = answers.slice();
          else tmp[id] = answers;

        this.selectedAnswers = tmp;
      },

      saveAnswers() {
        if (this.user)
          setSelectedAnswersFB(this.formID, this.selectedAnswers, this.user.id);

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
      },

      cleanAllFilters() {
        this.filter = 'all';
        this.searchQuery = '';
        this.focusedSection = null;
      },

      hasAnsweredToEntry(entry) {
        if (!this.user) return false;

        const entryAnswers = this.userAnswers[entry.id];
        if (!entryAnswers) return false;

        const userAnswer = entryAnswers[this.user.uid];

        return !!userAnswer
      },
    },
    watch: {
      '$route'(to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
        this.$store.dispatch('setUser', {userID: this.$route.params.userID});
      },

      userAnswers() {
        this.$store.dispatch('setInvitedUsers')
      }
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

  .user-form-sort-button {
    margin-left: 0.5em;
    margin-right: 0.5em;
    padding: 0.5em;
    color: white;
    background: #fa7d32;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-form-sort-button:hover {
    background: #c86428;
  }

  .user-form-clean-filters-button {
    margin-right: 0.5em;
    margin-left: 0.5em;
    padding: 0.5em;
    color: white;
    background: tomato;

    cursor: pointer;
    font-size: large;
    border: none;

    border-radius: 5px;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .disabled {
    background: lightslategrey;
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

  .vertical-separator {
    border-left: 1px solid #00000055;
    border-right: 1px solid #00000055;
    height: 60px;
    top: 10px;
  }


</style>
