<template>
  <div class="csv-errors-container">

    <div class="csv-message csv-error"
         v-for="e in errors">
      <div class="csv-error-content">

        <span class="csv-message-header"> <i class="material-icons">error</i> {{e.message}}</span>
        <p class="csv-message-description"> {{e.place}}</p>

      </div>
    </div>

    <div class="csv-message csv-warning"
         v-for="w in warnings">
      <div class="csv-warning-content">

        <span class="csv-message-header"> <i class="material-icons">warning</i> {{w.message}}</span>
        <p class="csv-message-description"> {{w.place}}</p>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "CsvErrorAndWarning",
    props: {
      errors: {
        type: Array,
        required: true
      },
      warnings: {
        type: Array,
        required: true
      },
    }
  }
</script>

<style scoped>

  .csv-errors-container {
    overflow-y: auto;
  }

  .csv-message {
    border-radius: 4px;
    width: 75%;
    margin: auto auto 5px;
    text-align: left;
    line-height: normal;
    padding: 5px;
  }

  .csv-error {
    background-color: #fff1f0;
    border: 1px solid #ffa39e;
  }

  .csv-error .csv-message-header i {
    color: tomato;
  }

  .csv-warning {
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
  }

  .csv-warning .csv-message-header i {
    color: orange;
  }

  .csv-message-header {
    font-weight: bold;
  }

  .csv-message-description {
    margin-left: 10px;

    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
  }
</style>
