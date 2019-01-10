<template>
  <div class="json-parser">
    <input type="file" accept="application/json" @change="onChangeJsonInput($event)"/>
    <div v-if="errors">
      <p>{{errors}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "JsonParser",
    data(){
      return {
        json : null,
        errors: ''
      }
    },
    props: {
    },
    methods: {
      onChangeJsonInput(e) {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0], "UTF-8");

        reader.onload = (evt) => {
          this.json = JSON.parse(evt.target.result);
          //console.log(this.json);
          this.$root.$emit("json-parsed", this.json);
          if(this.parsedContainer) this.parsedContainer = this.json;
        };

        reader.onerror = function (evt) {
          this.errors = evt.target;
        }

      }
    }
  }
</script>

<style scoped>

</style>
