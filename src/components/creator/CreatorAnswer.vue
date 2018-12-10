<template>
  <div class="answer">
    <div v-if="types.find(t => t.value === type)">
      <div v-if="type === 'textarea'">
        <p class="singleOption">Réponse longue</p>
      </div>
      <div v-if="type === 'text'">
        <p class="singleOption">Réponse courte</p>
      </div>
      <div v-if="type === 'radio' || type === 'checkbox' || type === 'select' ">
        <CreatorAnswerList :answers="answers" :type="type" :entryID="entryID"/>
      </div>
    </div>
    <div v-else>
      <p>Type inconnu</p>
    </div>
  </div>
</template>

<script>
  import CreatorAnswerList from './CreatorAnswerList'

  export default {
    name: 'CreatorAnswer',
    components: {CreatorAnswerList},
    props: {
      answers: {
        type: Array,
        required: true
      },
      types: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      entryID: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>
  .answer{
    margin: 2em;
  }
</style>
