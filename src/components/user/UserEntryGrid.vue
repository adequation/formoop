<template>
  <div class="user-entry-grid">

    <div v-for="entry in entries"
         :key="entry.id"
         :class="['user-grid-entry', inConflict(entry) ? 'user-grid-entry-conflicted' : hasAnswers(entry) ? 'user-grid-entry-answered' : '']"
         @click="focusedEntry = entry">
      <div class="user-grid-entry-content">
        {{entry.question.title}}
      </div>
    </div>

    <Modal v-if="focusedEntry" @close="closeModal">
      <div slot="body">
        <UserFormEntry
          :key="`grid_${focusedEntry.id}`"
          :entry="focusedEntry"
          :userAnswers="userAnswers || {}"
          :selectedAnswers="selectedAnswers"/>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  import Modal from "@/components/containers/Modal";
  import UserFormEntry from "@/components/user/UserFormEntry";
  import {isEntryInConflict} from "@/helpers/userAnswersHelpers";

  export default {
    name: "UserEntryGrid",
    components: {Modal, UserFormEntry},
    data() {
      return {
        focusedEntry: null
      }
    },
    props: {
      entries: {
        type: Array,
        required: true
      },
      userAnswers: {
        type: Object,
        required: true
      },
      selectedAnswers: {
        type: Object,
        required: true
      },
    },
    computed: {
      user() {
        return nativeFbFunctions.getCurrentUser();
      },
    },
    methods: {
      currentEntryAnswers(entry) {
        return this.userAnswers ? this.userAnswers[entry.id] || {} : {};
      },

      currentUserAnswers(entry) {
        if (!this.user) return {};


        return this.currentEntryAnswers(entry) ? this.currentEntryAnswers(entry)[this.user.id] : {};
      },

      inConflict(entry){
        return isEntryInConflict(entry.id, this.userAnswers);
      },

      hasAnswers(entry) {
        return Object.keys(this.currentEntryAnswers(entry)).length > 0;
      },

      otherUserAnswers() {
        if (!this.user) return {};

        const otherAnswers = {};
        const currentUserID = this.user.uid;
        Object.keys(this.currentEntryAnswers).map(userID => {
          if (userID !== currentUserID) otherAnswers[userID] = this.currentEntryAnswers[userID]
        });

        return otherAnswers;
      },

      closeModal() {
        this.focusedEntry = null;
      },
    },
    created() {
      this.$on('close', () => this.closeModal());
    }
  }
</script>

<style scoped>

  .user-entry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    grid-auto-rows: 1fr;
    width: auto;
    margin-left: 20%;
    margin-right: 20%;
  }

  .user-entry-grid::before {
    content: '';
    width: 0;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  .user-entry-grid > *:first-child {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  .user-grid-entry-content {
    position: relative;
    top: 50%;
    transform: translateY(-50%);

    font-weight: bold;
  }

  .user-grid-entry {
    margin: 2px;
    background: #f6f6f6;

    transition: transform .2s;
  }

  .user-grid-entry-answered {
    border-left: 7px #42b983 solid;
  }

  .user-grid-entry-conflicted {
    border-left: 7px solid tomato;
  }

  .user-entry-grid > *:hover {
    transform: scale(1.05);

    -webkit-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  }


</style>
