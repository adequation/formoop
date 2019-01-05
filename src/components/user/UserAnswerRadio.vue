<template>
  <div>
    <form>
      <span v-for="(a, i) in answers" :key="a.id">
        <input title="" type="radio" :name="a.text" :value="a.id" v-model="selectedAnswers" v-on:input="onChange($event.target)">
        <label> {{a.text}} </label>
      </span>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'AnswerRadio',
    data () {
      return {
        selectedAnswers: null
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

</style>
