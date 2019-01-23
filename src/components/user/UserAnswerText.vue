<template>
  <div>
    <input title="" class="answerText" type="text"
           v-model="selectedAnswers"
           v-on:input="onChange($event.target)"/>
  </div>
</template>

<script>
  export default {
    name: 'UserAnswerText',
    data() {
      return {
        selectedAnswers: this.currentUserAnswers || null
      }
    },
    props: {
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
      onChange: function (target) {
        this.selectedAnswers = target.value || null;
        this.setSelectedAnswers()
      },

      setSelectedAnswers: function () {
        this.$root.$emit('set-selected-answers', this.entryID, this.selectedAnswers)
      }
    },
    watch:{
      currentUserAnswers: function (val) {
        this.selectedAnswers = val || null;
        this.setSelectedAnswers();
      }
    }
  }
</script>

<style scoped>
  input[type=text] {
    border: 1px solid #00000030;
    background: white;

    padding: 0.3em 0.3em 0.3em 0.75em;

    border-radius: 20px;
  }
</style>
