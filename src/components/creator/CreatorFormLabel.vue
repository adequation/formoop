<template>
    <div class="creator-label">
      <div class="delete-label" @click="deleteLabel()"><i class="material-icons md-16">close</i></div>
      <h2 contenteditable v-model="title">{{title}}</h2>
    </div>
</template>

<script>
    export default {
        name: "CreatorFormLabel",
      data(){
          return {
            title : this.label.title,
            content : this.label.content
          }
      },
      props:{
        label: {
          type: Object,
          required: true
        },
      },

      methods:{
        deleteLabel(){
          this.$parent.$emit('delete-label', this.label.id);
        }
      }
    }
</script>

<style scoped>
 .creator-label{

   position: relative;
   background-color: #f6f6f6;
   margin: 0.5em auto;
   width: 85%;


 }

  .delete-label{
    position: absolute;
    top: 3px;
    right: 3px;

    cursor: pointer;
  }
</style>
