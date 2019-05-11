<template>
  <div>
    <textarea class="user-answer-textarea" v-model="selectedAnswers" v-on:input="onChange($event.target)" title="">
      {{selectedAnswers || ''}}
    </textarea>
  </div>
</template>

<script>
  export default {
    name: 'UserAnswerTextarea',
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
      },
      currentSelectedAnswers: {
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
  .user-answer-textarea {
    resize: vertical;
    width: 50%;
    height: 100%;

    overflow: auto;


    border: 1px solid #00000055;

    border-radius: 5px;
    margin-bottom: 7px;
  }
</style>
