<template>
  <div>
    <textarea class="answerTextarea" v-model="selectedAnswers" v-on:input="onChange($event.target)" title="">
      {selectedAnswers}
    </textarea>
  </div>
</template>

<script>
  export default {
    name: 'UserAnswerTextarea',
    data() {
      return {
        selectedAnswers: this.currentUserAnswers || ''
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
        this.selectedAnswers = target.value;
        this.setSelectedAnswers()
      },
      setSelectedAnswers: function () {
        this.$root.$emit('set-selected-answers', this.entryID, this.selectedAnswers)
      }
    }
  }
</script>

<style scoped>
  textarea {
    resize: none;
  }
</style>
