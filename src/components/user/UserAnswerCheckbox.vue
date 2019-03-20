<template>
  <div class="user-answer-checkbox-wrapper">
    <form>
      <div v-for="(a, i) in answers"
           :key="a.id"
           :class="['noselect', selectedAnswers.includes(a.id) ? 'user-answer-checkbox-selected' : 'user-answer-checkbox']"
           @click="onChange(a, $event)">

        <span class="user-answer-checkbox-content">
          <i class="material-icons md-18">{{selectedAnswers.includes(a.id) ? 'check_box' : 'check_box_outline_blank'}}</i>
          {{a.text}}
        </span>

      </div>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'UserAnswerCheckbox',
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
        type: Array,
        required: false
      },
      currentSelectedAnswers: {
        type: Array,
        required: false
      }
    },
    data() {
      return {
        selectedAnswers: (this.currentUserAnswers || []).slice()
      }
    },
    methods: {
      onChange: function (answer, e) {
        console.log('changeTab', this.selectedAnswers);

        const index = this.selectedAnswers.indexOf(answer.id);
        if (index >= 0) {
          this.selectedAnswers.splice(index, 1)
        } else {
          this.selectedAnswers.push(answer.id)
        }
        this.setSelectedAnswers();

        e.preventDefault();
      },

      setSelectedAnswers: function () {
        console.log('setTab', this.selectedAnswers);
        this.$root.$emit('set-selected-answers', this.entryID, this.selectedAnswers)
      }
    },
    watch:{
      currentUserAnswers: function (val, old) {
        this.selectedAnswers = (this.currentSelectedAnswers || val || []).slice()
        this.setSelectedAnswers();
      },
    }
  }

</script>

<style scoped>

  .user-answer-checkbox {
    margin: 0.25em 0.7em 0.25em 0.7em;

    cursor: pointer;
    font-size: large;
    background: white;
    border: 1px solid #00000055;
    padding: 0.1em 0.3em 0.1em 0.3em;

    width: auto;
    overflow: hidden;
    display: inline-block;

    border-radius: 5px;
  }

  .user-answer-checkbox:hover {
    background: #00000022;

  }

  .user-answer-checkbox-selected:focus {
    animation: click-fade 0.8s ease-out;
  }

  .user-answer-checkbox-selected {
    margin: 0.25em 0.7em 0.25em 0.7em;

    cursor: pointer;
    font-size: large;
    background: white;
    color:  #3C7ADF;
    border: 2px solid #4286f4;
    padding: 0.2em 0.3em 0.2em 0.3em;

    width: auto;
    overflow: hidden;
    display: inline-block;

    border-radius: 5px;
  }

  .user-answer-checkbox-selected:hover {
    background: #4286f422;
  }

  .user-answer-checkbox-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                     supported by Chrome and Opera */
  }

  .user-answer-checkbox-content i{
    margin-right: 0.2em;
  }

</style>
