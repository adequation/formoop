<template>

  <div class="dropup" >
    <div :class="['dropup-btn', showList? 'dropup-btn_active' : '']" @click="showList = !showList" >
      <span><i v-if="listOfElements.find(f => f.name === selectedElement).icon" class="material-icons md-16">{{listOfElements.find(f => f.name === selectedElement).icon}}</i></span>
    </div>

    <div :class="[showList ? 'dropup-content_show' : 'dropup-content_hide', 'dropup-content']">
      <div class="dropup-item" v-for="elem in listOfElements"
           v-if="elem.name !== selectedElement"
           :title="elem.description"
           @click="handleClick(elem)">
        <span><i v-if="elem.icon" class="material-icons md-16">{{elem.icon}}</i></span>
      </div>
    </div>

  </div>



</template>

<script>
    export default {
      name: "DropUpMenu",
      data: () =>{
        return {
          showList: false,
        }
      },
      props: {
          selectedElement: {
            type: String,
            required: true,
          },
          listOfElements: {
            type: Array,
            required: true,
          }
      },
      methods: {
        handleClick(value){
          this.$emit('dropupMenu-selected', value.name);
          this.showList = false;
        }
      },
    }
</script>

<style scoped>

  .dropup {
    position: relative;
    display: inline-block;
  }

  .dropup-content {
    position: absolute;
    background-color: inherit;
    border-radius: 5px;
    min-width: 30px;
    bottom: 50px;
    z-index: 1;
  }

  .dropup-content_hide {
    display: none;
  }

  .dropup-content_show {
    display: block;
  }


  .dropup-item {
    padding: 12px;
    border-radius: 5px;
    display: block;
    font-size: larger;
  }


  .dropup-item:hover {
    background-color: #62605a;

  }

  .dropup-btn {
    padding: 0.6em;
    font-size: large;
  }

  .dropup-btn_active {
    border: 2px solid #ffffff;
    border-radius: 5px;
  }


</style>
