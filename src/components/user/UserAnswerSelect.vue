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
        selectedAnswers: this.currentSelectedAnswers !== null ?
          this.currentSelectedAnswers || (this.currentUserAnswers || null) :
          this.currentSelectedAnswers
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
      onChange: function (target) {
        if (target.value !== '-1') {
          this.selectedAnswers = target.value;
        } else {
          this.selectedAnswers = null;
        }

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
</style>
