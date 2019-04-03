<template>
  <div class="sorting-grid-entry"
       :style="{
         borderLeft: `7px solid ${color}`,
         width:`${cellWidth-padding-7}px`,
         height:`${cellHeight-padding}px`
       }">
    <div class="sorting-grid-entry-content">


      <div class="sorting-grid-entry-text" >
        {{smallTitle}}
      </div>

      <div class="sorting-grid-entry-index" :style="{right: `${5+padding}px`, bottom: `${5+padding}px`}">
        {{index}}
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "CustomGridEntry",
    props: {
      entry: {
        type: Object,
        required: true
      },
      index: {
        type: Number,
        required: true,
        default: 0
      },
      color: {
        type: String,
        required: false,
        default: '#eeeeee'
      },
      cellWidth: {
        type: Number,
        required: true,
        default: 110
      },
      cellHeight: {
        type: Number,
        required: true,
        default: 60
      },
      padding: {
        type: Number,
        required: true,
        default: 3
      }
    },
    computed: {
      smallTitle() {
        if(!this.entry.generic)
          return this.entry.question.title.trim().split(' ')[0];

        return '(@) ' + this.entry.question.blocks[0].content.trim().split(' ')[0]
      }
    }
  }
</script>

<style scoped>
  .sorting-grid-entry {
    background-color: #f6f6f6;
  }

  .sorting-grid-entry-content {
    display: table;
    margin: 0 auto;
  }

  .sorting-grid-entry-icon {
    color: #00000022;
    position: fixed;
    right: 3px;
    top: 3px;
  }

  .sorting-grid-entry-index {
    color: #00000020;
    position: fixed;
  }

  .sorting-grid-entry-text {
    margin-top: 5px;
  }

</style>
