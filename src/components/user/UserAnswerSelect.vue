<template>
  <div>

      <CustomSelect :options="optionsNames" :optionType="optionType" :selected="getOptionNameFromID(selectedAnswers)" class="option-select"/>

  </div>
</template>

<script>
  import CustomSelect from "../general/CustomSelect";

  export default {
    name: 'AnswerSelect',
    components: {CustomSelect},
    data() {
      return {
        selectedAnswers: this.currentUserAnswers || null,
        optionType: "Réponse"
      }
    },
    props: {
      answers: {
        type: Array,
        required: true
      },
      entryID: {
        type: String,
        required: true
      },
      currentUserAnswers: {
        type: String,
        required: false
      },
      currentSelectedAnswers: {
        type: String,
        required: false
      }
    },
    methods: {

      setSelectedAnswers: function (answer) {
        this.$root.$emit('set-selected-answers', this.entryID, answer)
      },

      getOptionNameFromID(optionID){
        let optionName = null;
        this.answers.forEach(a => {
          if (a.id === optionID) optionName = a.text
        });
        return optionName;
      }
    },

    watch: {
      currentUserAnswers: function (val) {
        this.selectedAnswers = val || null;
        this.setSelectedAnswers();
      }
    },
    created() {
      this.$on('set-option-selection', option => {
        if(option === null){

          this.setSelectedAnswers(null);
        }
        else{
          let answer = '';
          this.answers.forEach(a => {
            if (a.text === option) answer = a.id
          });
          this.setSelectedAnswers(answer);
        }
      });
    },
    computed: {
      optionsNames() {
        return this.answers.map(a => {
          return a.text;
        })
      },
    }
  }
</script>

<style scoped>
  .option-select{
    width: 180px;
    margin: 7px auto;
  }
</style>
