<template>
  <div class="user-entry-answers-details">
    <div class="user-answer-table-wrapper" v-if="hasAnswers && (entry.type !== 'text' && entry.type !== 'textarea')">
      <table class="user-answer-table">
        <tr>
          <th></th>
          <th v-for="answer in answerGroup.headers">{{getAnswerText(answer)}}</th>
        </tr>
        <tr v-for="u in usersThatAnswered" :class="u.id === user.id ? 'user-has-answered' : ''">
          <th :title="u.name">
            {{shortName(u.name)}}
          </th>
          <td v-for="answer in answerGroup.headers">
            <i v-if="hasAnsweredTo(answer, u)" class="material-icons md-36">
              check
            </i>
          </td>
        </tr>
      </table>

      <div>
        {{`${Math.round(cohesionPercentage*100)}% de cohesion`}}
      </div>
    </div>

    <div class="user-answer-table-wrapper" v-else>
      <table class="user-answer-table">
        <tr v-for="u in usersThatAnswered">
          <th :title="u.name">
            {{shortName(u.name)}}
          </th>
          <td>
            {{getAnswersFromUser(u.id)}}
          </td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
  import {answerArray, cohesion, getEntryAnswers, userAnswerGroup} from "@/helpers/userAnswersHelpers";
  import {getShortName} from "@/helpers/accountHelpers";
  import SupervisorProgressChart from "@/components/supervisor/SupervisorProgressChart";

  export default {
    name: "UserEntryAnswersDetails",
    components: {SupervisorProgressChart},
    props: {
      entry: {
        type: Object,
        required: true
      },
      userAnswers: {
        type: Object,
        required: true
      }
    },
    computed: {
      invitedUsers() {
        return this.$store.getters.invitedUsers;
      },
      user() {
        return this.$store.getters.user;
      },

      answerGroup(){
        const group = userAnswerGroup(this.entry.id, this.userAnswers);
        const headers = this.entry.answer.answers.map(a => a.id);

        return {group, headers}
      },

      entryAnswers(){
        return getEntryAnswers(this.entry.id, this.userAnswers)
      },

      usersThatAnswered(){
        return this.entryAnswers ?
          Object.keys(this.entryAnswers).map(userID => this.invitedUsers[userID]).sort((a,b)=>a.name.localeCompare(b.name))
          : [];
      },

      hasAnswers(){
        return Object.keys(this.entryAnswers).length > 0;
      },

      cohesionPercentage(){
        return cohesion(answerArray(this.entry, this.userAnswers));
      }
    },
    methods: {
      getAnswerText(answerID){
        const answer = this.entry.answer.answers.find(a => a.id === answerID);
        return answer ? answer.text : '...';
      },

      getAnswersFromUser(userID){
        return this.userAnswers[this.entry.id][userID]
      },

      hasAnsweredTo(answer, user){
        const answers = this.getAnswersFromUser(user.id);
        if(Array.isArray(answers)) return answers.includes(answer);

        return answers === answer;
      },

      shortName(name){
        return getShortName(name);
      }
    }
  }
</script>

<style scoped>
  .user-answer-table-wrapper {
    overflow-y: scroll;
    max-height: 750px;

    text-align: center;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .user-answer-table {
    border-collapse: collapse;
  }

  .user-answer-table caption {
    font-weight: bold;
    font-size: large;
    margin: 0.25em 0.25em 1em 0.25em;
  }
  .user-answer-table th {
    padding: 0.5em;
    border-bottom: 1px solid #00000033;
    border-left: 1px solid #00000033;
  }

  .user-answer-table th {
    border-top:  1px solid #00000033;
  }

  .user-answer-table th:last-child {
    border-right:  1px solid #00000033;
  }

  .user-answer-table td {
    border-top: 1px solid #00000033;
    border-bottom: 1px solid #00000033;
    border-left: 1px solid #00000033;
    padding: 0.25em 0.5em 0.25em 5px;
  }

  .user-answer-table td:last-child {
    border-right:  1px solid #00000033;
  }

  .user-answer-table tr:hover {
    background-color: #00000010;

    overflow: auto;
  }

  .user-has-answered{
    background-color: #00000010;
  }
  .user-has-answered:hover{
    background-color: #00000020 !important;
  }

  .user-entry-answers-details{

  }

</style>
