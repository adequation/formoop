<template>
  <div class="user-answer-radio-wrapper">
    <form>
      <div v-for="(a, i) in answers"
            :key="a.id"
            id="user-answer-radio"
            :class="['noselect', selectedAnswers === a.id ? 'user-answer-radio-selected' : 'user-answer-radio']"
            @click="onChange(a, $event)">

        <span class="user-answer-radio-content">
          {{a.text}}
        </span>

      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'AnswerRadio',
    data () {
      return {
        selectedAnswers: this.currentUserAnswers || ''
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
      }
    },
    methods: {
      onChange: function (answer, e) {
        if(this.selectedAnswers !== answer.id) this.selectedAnswers = answer.id;
        else this.selectedAnswers = null;

        this.setSelectedAnswers();

        e.preventDefault();
      },

      setSelectedAnswers: function () {
        this.$root.$emit('set-selected-answers', this.entryID, this.selectedAnswers)
      }
    },
    watch:{
      currentUserAnswers: function (val) {
        this.selectedAnswers = val || ''
      }
    }
  }
</script>

<style scoped>

  .user-answer-radio{
    margin: 1em;

    cursor: pointer;
    font-size: large;
    background: white;
    border: 1px solid #00000055;
    padding: 0.2em 0.5em 0.1em 0.5em;

    width: auto;
    overflow: hidden;
    display: inline-block;

    border-radius: 15px;
  }

  .user-answer-radio:hover{
    background: #00000022;

  }

  .user-answer-radio-selected{

    margin: 1em;

    cursor: pointer;
    font-size: large;
    color: white;
    background: #4286f4;
    border: 1px solid #00000055;
    padding: 0.2em 0.5em 0.1em 0.5em;

    font-weight:600;


    width: auto;
    overflow: hidden;
    display: inline-block;

    border-radius: 15px;
  }

  .user-answer-radio-selected:hover{
    background: #3462ad;
  }

  .user-answer-radio-content{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .user-answer-radio-content i{
    margin-right: 0.2em;
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }


</style>
