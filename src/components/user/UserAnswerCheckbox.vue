<template>
  <div>
    <form>
      <span v-for="(a, i) in answers" :key="a.text">
        <label>  <input type="checkbox" :name="a.text" :value="a.id" v-on:input="onChange($event.target)">
        {{a.text}} </label>
      </span>
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
      }
    },
    data () {
      return {
        selectedAnswers: []
      }
    },
    methods: {
      onChange: function (target) {
        const index = this.selectedAnswers.indexOf(target.value);
        if (index >= 0) {
          if (!target.checked) this.selectedAnswers.splice(index, 1)
        } else {
          this.selectedAnswers.push(target.value)
        }
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
