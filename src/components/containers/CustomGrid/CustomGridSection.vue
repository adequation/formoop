<template>
  <div class="sorting-grid-entry"
       :style="{
         background: color,
         width:`${cellWidth}px`,
         height:`${cellHeight}px`,
         margin: `${padding}px`,
         lineHeight: `${cellHeight}px`
       }">

      {{smallTitle}}

  </div>
</template>

<script>
  export default {
    name: "CustomGridSection",
    props: {
      section: {
        type: String,
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
        default: 70
      },
      cellHeight: {
        type: Number,
        required: true,
        default: 70
      },
      padding: {
        type: Number,
        required: true,
        default: 5
      }
    },
    computed: {
      smallTitle() {
        const trimmed = this.section.trim();
        return trimmed.length > 8 ? `${trimmed.substring(0, 5)}...` : trimmed ;
      }
    }
  }
</script>

<style scoped>
  .sorting-grid-entry {
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    color: white;
    font-weight: bold;
    border: 3px solid #00000033;
  }

</style>
