<template>
  <div class="user-answer">
    <div v-if="(user) || (usersAnswers ? Object.keys(usersAnswers).length <= 0 : true)"> <!-- && invited !-->
      <div v-if="answer.type === 'textarea'">
        <UserAnswerTextarea :entryID="entryID"/>
      </div>
      <div v-if="answer.type === 'text'">
        <UserAnswerText :entryID="entryID"/>
      </div>
      <div v-if="answer.type === 'radio'">
        <UserAnswerRadio :answers="answer.answers" :entryID="entryID"/>
      </div>
      <div v-if="answer.type === 'checkbox'">
        <UserAnswerCheckbox :answers="answer.answers" :entryID="entryID"/>
      </div>
      <div v-if="answer.type === 'select'">
        <UserAnswerSelect :answers="answer.answers" :entryID="entryID"/>
      </div>
      <div>
        <p class="answered-by">{{usersAnswers ? Object.keys(usersAnswers).length : ''}}</p>

        <button v-if="usersAnswers[user.uid]" id="deleteAnswer" type="button"
                @click="deleteAnswer()">Supprimer ma réponse
        </button>

      </div>
    </div>
    <div v-else-if="(!user) && (usersAnswers ? !Object.keys(usersAnswers).length <= 0 : true)" class="already-answered">
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
  export default {
    name: 'UserAnswer',
    components: {UserAnswerText, UserAnswerTextarea, UserAnswerRadio, UserAnswerCheckbox, UserAnswerSelect},
    computed:{
      user(){

        /////test debug, remove when a cleaner solution is found...
        if (!Firebase.apps.length) {
          Firebase.initializeApp(firebaseConfig);
        }////test debug, remove when a cleaner solution is found...

        return Firebase.auth().currentUser;
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

</style>
