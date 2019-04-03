<template>
  <div>
  <custom-grid
    :center="false"
    :draggable="true"
    :sortable="true"
    :items="items"
    :cell-width="60"
    :cell-height="60"
    @change="change"
    @remove="remove"
    @click="click"
    @sort="sort">
    <template slot="cell" slot-scope="props">
      <div
        :item="props.item"
        :index="props.index"
           @remove="props.remove()">

        <div class="cell" :style="{background:props.item.color}">
          <div class="cell-remove-btn">x</div>
          {{props.item.content}}
        </div>

      </div>
    </template>
  </custom-grid>
  <hr/>
  <custom-grid
    :center="false"
    :draggable="true"
    :sortable="true"
    :items="items2"
    :cell-width="60"
    :cell-height="60"
    @change="change"
    @remove="remove"
    @click="click"
    @sort="sort">
    <template slot="cell" slot-scope="props">
      <div
        :item="props.item"
        :index="props.index"
        @remove="props.remove()">

        <div class="cell" :style="{background:props.item.color}">
          <div class="cell-remove-btn">x</div>
          {{props.item.content}}
        </div>

      </div>
    </template>
  </custom-grid>
  </div>

</template>

<script>
  import CustomGrid from "@/components/containers/CustomGrid/CustomGrid";
  import * as d3 from "d3";

  export default {
    name: "GripWIP",
    components: {CustomGrid},
    data() {
      let items = Array.apply(null, new Array(100)).map((e,i) => ({content:`item ${i}`, color:d3.interpolateRainbow(i/100)}));
      let items2 = Array.apply(null, new Array(100)).map((e,i) => ({content:`item ${i}`, color:d3.interpolateBlues(i/100)}));

      return {
        items,
        items2,
        selected: null
      }
    },
    mounted() {

    },
    methods: {
      click({items, index}) {
        let value = items.find(v => v.index === index)
        this.selected = value.item
        console.log(this.selected)
      },
      change(event) {
        console.log('change', event)
      },
      remove(itemIndex) {
        this.items.splice(itemIndex, 1);
      },
      sort(event) {
        console.log('sort', event)
      }
    }

  }
</script>

<style scoped>
  .cell {
    border-radius: 10px;
    color: white;

    width: 57px;
    height: 57px;
  }

</style>
