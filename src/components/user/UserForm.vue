<template>
  <div class="form" v-if="formEntries">

    <user-close-form class="user-form-close-button" v-if="isEntryPoint" />


    <h1>{{formTitle}}</h1>

    <h2 v-if="user">{{user.name}}</h2>

    <div v-if="!user && sortedEntries.length > 0">
      <h2>Aie ! Tu n'es pas connecté !</h2>
      <UserGetFormLinkModal :showGetLinkModal="showGetFormLinkModal"/>
    </div>

    <div v-else-if="user">
      <UserGreeting :percentage="currentFormPercentage" :showGreetingsModal="showGreetingsModal"/>
    </div>


    <div class="user-form-section-list-wrapper">
      <UserSectionList v-if="sections.length > 0 && user"
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
                       :key="`all_single_${entry.id}`"
                       :entry="entry"
                       :userAnswers="userAnswers || {}"
                       :selectedAnswers="selectedAnswers"/>

      </div>

      <div v-else-if="filter === 'singles'">

        <UserFormEntry v-for="entry in singleEntries"
                       :key="`single_${entry.id}`"
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
             :style="{width: currentFormPercentage + '%'}">
        </div>

        <div class="user-form-menu-items">
          <div class="user-form-filter-buttons-wrapper">

            <drawer v-if="showFilterDrawer" @close="showFilterDrawer=false">
              <div slot="header">
                <h1> Filtres </h1>
              </div>
              <div slot="body">
                <div v-for="elem in filters"
                     v-if="elem.name !== filter"
                     :title="elem.description"
                     @click="changeFilter(elem.name); showFilterDrawer=false">
                  <span class="drawer-content"><i v-if="elem.icon" class="material-icons md-16">{{elem.icon}}</i> {{elem.description}}</span>
                </div>
              </div>
            </drawer>

            <button class="user-form-filter-button" type="button" @click="showFilterDrawer=true">
              <i v-if="filters.find(f => f.name === filter).icon" class="material-icons md-24">{{filters.find(f => f.name === filter).icon}}</i>
            </button>

            <drawer v-if="showSorterDrawer" @close="showSorterDrawer=false">
              <div slot="header">
                <h1> Tris </h1>
              </div>
              <div slot="body">
                <div v-for="elem in sorters"
                     v-if="elem.name !== selectedSorter.name"
                     :title="elem.description"
                     @click="changeSorter(elem.name); showSorterDrawer=false">
                  <span class="drawer-content"><i v-if="elem.icon" class="material-icons md-16">{{elem.icon}}</i> {{elem.description}}</span>
                </div>
              </div>
            </drawer>

            <button class="user-form-sort-button" type="button" @click="showSorterDrawer=true">
              <i v-if="selectedSorter.icon" class="material-icons md-24">{{selectedSorter.icon}}</i>
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
  import {areAnswersUpdated, getPercentage, isAnswered} from "@/helpers/userAnswersHelpers";
  import {decodeEmailToken} from "@/helpers/accountHelpers";
  import UserCloseForm from "./UserCloseForm";
  import UserGetFormLinkModal from "./UserGetFormLinkModal";
  import DropUpMenu from "../containers/DropUpMenu";
  import Drawer from "../containers/Drawer";
  import UserGreeting from "@/components/user/UserGreeting";

  export default {
    name: 'UserForm',
    components: {
      UserGreeting,
      Drawer,
      DropUpMenu,
      UserGetFormLinkModal,
      UserCloseForm,
      UserSectionList, UserEntryGrid, DockingMenu, UserGroupedQuestion, InviteModal, UserFormEntry},
    data() {
      return {
        showModal: false,
        showFilterDrawer: false,
        showSorterDrawer: false,
        showGetFormLinkModal: false,
        showGreetingsModal: true,
        selectedAnswers: {},

        filter: 'all',
        filters: [
          {name: 'all', description: 'Voir tout', icon: 'view_day'},
          {name: 'singles', description: 'Voir non-groupées uniquement', icon: 'view_headline'},
          {name: 'grouped', description: 'Voir groupées uniquement', icon: 'view_agenda'},
          {name: 'grid', description: 'Afficher en grille', icon: 'apps'},
        ],

        selectedSorter: {
          name: 'alphabetical',
          description: 'Filtrer par ordre alphabetique',
          icon: 'sort_by_alpha',
          sortingLayer: 0,
          sort: (a, b) => a.question.title.localeCompare(b.question.title)
        },
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

      formSectionSortOrder(){
        return this.$store.getters.formSections || []
      },

      sections() {
        const sections = getSections(this.formEntries, this.userAnswers);

        return sections.sort((a,b) =>
          this.formSectionSortOrder.indexOf(a.name) - this.formSectionSortOrder.indexOf(b.name))
      },

      hasFilter() {
        return this.filter !== 'all' || this.searchQuery || this.focusedSection
      },

      currentFormPercentage(){
        return getPercentage('answered', this.formEntries, this.userAnswers);
      }

    },
    created() {

      this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
      this.$store.dispatch('setUser', {userID: this.$route.params.userID});


      this.$root.$on('set-selected-answers', (id, answers) => {
        this.setSelectedAnswers(id, answers);
      });

      this.$on('close-get-link-modal', () => {
        this.showGetFormLinkModal = false;
      });

      this.$on('close-greetings-modal', () => {
        this.showGreetingsModal = false;
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

        if(Array.isArray(answers))  tmp[id] = answers;
        else tmp[id] = answers;

        this.selectedAnswers = tmp;
      },

      saveAnswers() {
        if (this.user)
          setSelectedAnswersFB(this.formID, this.selectedAnswers, this.user.id);

        else this.showGetFormLinkModal = true
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

      changeSorter (sorter){
        this.selectedSorter = this.sorters.find(s => s.name === sorter);
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

      redirect(event){

        if(areAnswersUpdated(this.userAnswers, this.selectedAnswers, this.formEntries, this.user.id)) {
          return "Êtes vous sûr de vouloir quitter? Certaines réponses ne sont pas enregistrées.";
        }
        return void(0);
      },


    },
    watch: {
      '$route'(to, from) {
        this.$store.dispatch('setFormID', {formID: this.$route.params.formID});
        this.$store.dispatch('setUser', {userID: this.$route.params.userID});
      },
    },
    mounted() {
      window.onbeforeunload = this.redirect;
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
    outline: none;
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

  .user-form-section-list-wrapper svg{
    overflow-x: auto;
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

  .drawer-content{
    float: left;
    font-size: large;
    cursor: pointer;
    padding: 8px 8px 8px 10px;
  }

  .drawer-content:hover{
    color: rgba(0, 0, 0, .5);
  }


</style>
