<template>
  <div class="user-answer">
    <div v-if="(user) || (currentUserAnswers ? Object.keys(currentUserAnswers).length <= 0 : true)"> <!-- && invited !-->
      <div v-if="answer.type === 'textarea'">
        <UserAnswerTextarea :entryID="entryID" :currentUserAnswers="currentUserAnswers"/>
      </div>
      <div v-if="answer.type === 'text'">
        <UserAnswerText :entryID="entryID" :currentUserAnswers="currentUserAnswers"/>
      </div>
      <div v-if="answer.type === 'radio'">
        <UserAnswerRadio :answers="answer.answers" :entryID="entryID" :currentUserAnswers="currentUserAnswers"/>
      </div>
      <div v-if="answer.type === 'checkbox'">
        <UserAnswerCheckbox :answers="answer.answers" :entryID="entryID" :currentUserAnswers="currentUserAnswers"/>
      </div>
      <div v-if="answer.type === 'select'">
        <UserAnswerSelect :answers="answer.answers" :entryID="entryID" :currentUserAnswers="currentUserAnswers"/>
      </div>
      <div>

        <p class="answered-by"><strong>{{currentEntryAnswers ? Object.keys(currentEntryAnswers).length : ''}}</strong></p>

        <button v-if="currentUserAnswers ? currentUserAnswers : false" id="deleteAnswer" type="button"
                @click="deleteAnswer()">Supprimer ma réponse
        </button>

      </div>
    </div>
    <div v-else-if="(!user) && (currentEntryAnswers ? !Object.keys(currentEntryAnswers).length <= 0 : true)" class="already-answered">
      <h3>Cette question a déjà une réponse</h3>
    </div>
    <div v-else>
    </div>
  </div>

</template>

<script>
  import UserAnswerTextarea from './UserAnswerTextarea'
  import UserAnswerText from './UserAnswerText'
  import UserAnswerRadio from './UserAnswerRadio'
  import UserAnswerCheckbox from './UserAnswerCheckbox'
  import UserAnswerSelect from './UserAnswerSelect'
  import * as Firebase from "firebase";
  import {firebaseConfig} from "@/firebaseConfig";
  import {deleteUserAnswerFB} from "@/thunks/userFormEntriesThunks";
  import {nativeFbFunctions} from "@/helpers/firebaseHelpers";
  export default {
    name: 'UserAnswer',
    components: {UserAnswerText, UserAnswerTextarea, UserAnswerRadio, UserAnswerCheckbox, UserAnswerSelect},
    computed:{
      user(){
        return nativeFbFunctions.getCurrentUser();
      },
      currentEntryAnswers() {
        return this.usersAnswers[this.entryID] || {};
      },
      currentUserAnswers() {
        return this.currentEntryAnswers ? this.currentEntryAnswers[this.user.uid] : {};
      }
    },
    props:{
      answer:{
        type: Object,
        required: true
      },
      entryID:{
        type: String,
        required: true
      },
      usersAnswers:{
        type: Object,
        required: false
      },
      small: {
        type: Boolean,
        required: false
      }
    },
    methods: {
      deleteAnswer(){
        deleteUserAnswerFB(this.$store.getters.getUserFormID, this.entryID, this.user.uid);
      }
    }
  }
</script>

<style scoped>

  .user-answer{
    margin: 1em;
  }

  .already-answered {
    color: #42b983;
  }

  .answered-by {
    color: #42b983;
    font-size: large;
  }

</style>
