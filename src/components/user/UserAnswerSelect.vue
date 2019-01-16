<template>
  <div>
    <form>
      <select title="" @change="onChange($event.target)">
        <option value="-1"> </option>
        <option v-for="(a, i) in answers" :key="a.id" :name="a.text" :value="a.id" :selected="selectedAnswers === a.id">
          {{a.text}} </option>
      </select>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'AnswerSelect',
    data () {
      return {
        selectedAnswers: this.currentUserAnswers || '-1'
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
      onChange: function (target) {
        if (target.value !== -1) {
          this.selectedAnswers = target.value;
          this.setSelectedAnswers()
        } else {
          this.selectedAnswers = null
        }
      },

      setSelectedAnswers: function () {
        this.$root.$emit('set-selected-answers', this.entryID, this.selectedAnswers)
      }
    }
  }
</script>

<style scoped>
</style>
