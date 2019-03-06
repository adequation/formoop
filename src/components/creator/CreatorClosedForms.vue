<template>
  <div>
    <div v-if="finishedForms.length > 0">
      <h3>Formulaires finis :</h3>

      <p v-for="form in finishedForms">
        <a :href="JsonConvert(form)" :download="form.title + '.json'"> {{ form.title }}</a>
      </p>
    </div>

    <div v-else>
      <h1>Aucun formulaire terminé</h1>
    </div>
  </div>
</template>

<script>
    export default {
      name: "CreatorClosedForms",
      computed:{
        finishedForms(){
          return this.$store.getters.finishedForms;
        },
      },
      methods: {
        /**
         * @return {string}
         */
        JsonConvert(form){
          return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.JsonParsing(form), null, 2));
        },

        JsonParsing(BrutForm){
          let newEntries = [];
          let newUsers = [];

          Object.keys(BrutForm.entries).forEach((entrykey) => {
            let answers = [];

            if (BrutForm.entries[entrykey].type === 'radio' || BrutForm.entries[entrykey].type === 'select'){
              answers = BrutForm.entries[entrykey].answer.answers;
              answers.forEach(answer => {
                answer["nbanswer"] = Object.keys(BrutForm.usersAnswers[entrykey]).filter(UAkey => BrutForm.usersAnswers[entrykey][UAkey] === answer.id).length;
              });
            }
            if(BrutForm.entries[entrykey].type === 'checkbox'){
              answers = BrutForm.entries[entrykey].answer.answers;
              answers.forEach(answer => {
                answer["nbanswer"] = 0;
                Object.keys(BrutForm.usersAnswers[entrykey]).forEach(idUser => {
                  console.log(BrutForm.usersAnswers[entrykey][idUser]);
                  answer["nbanswer"] += BrutForm.usersAnswers[entrykey][idUser].includes(answer.id)? 1:0;
                });
              });
            }
            if(BrutForm.entries[entrykey].type === 'textarea' || BrutForm.entries[entrykey].type === 'text'){
              Object.keys(BrutForm.usersAnswers[entrykey]).forEach(userID => answers.push(BrutForm.usersAnswers[entrykey][userID]));
            }

            newEntries.push(
              {
                title: BrutForm.entries[entrykey].question.title,
                type: BrutForm.entries[entrykey].type,
                answers: answers,
              });
          });

          Object.keys(BrutForm.users).forEach((userkey) => {

            let givenAnswers = [];

            Object.keys(BrutForm.usersAnswers).forEach(formID =>
              Object.keys(BrutForm.usersAnswers[formID]).forEach(userID => {
                if (userID === userkey)
                  if(BrutForm.entries[formID].type === 'radio' || BrutForm.entries[formID].type === 'select'){
                    givenAnswers.push({
                      question: BrutForm.entries[formID].question.title,
                      answer: BrutForm.entries[formID].answer.answers.filter(answer => answer.id === BrutForm.usersAnswers[formID][userID])[0].text,
                    });
                  }
                if(BrutForm.entries[formID].type ==='checkbox'){
                  let answer = [];
                  BrutForm.usersAnswers[formID][userID].forEach(A => {
                    answer.push(BrutForm.entries[formID].answer.answers.find(QA => QA.id === A).text)
                  });
                  givenAnswers.push({
                    question: BrutForm.entries[formID].question.title,
                    answer: answer,
                  });
                }
                if(BrutForm.entries[formID].type === 'textarea' || BrutForm.entries[formID].type === 'text'){
                  givenAnswers.push({
                    question: BrutForm.entries[formID].question.title,
                    answer: BrutForm.usersAnswers[formID][userID],
                  });
                }

              }));

            newUsers.push({
              email: BrutForm.users[userkey].email,
              name: BrutForm.users[userkey].name,
              givenAnswers: givenAnswers,
            })
          });

          return {
            title: BrutForm.title,
            entries: newEntries,
            users: newUsers,
          };
        }
      },
      created() {
        this.$store.dispatch('setCreatorID', {formID: null})
      },
    }
</script>

<style scoped>

</style>
