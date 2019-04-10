<template>
  <nav class="tabs">
    <div
      class="tabs-item"
      v-for="tab in tabs"
      :ref="tab.value"
      :key="tab.title"
      :class="[
        { 'tabs-item_active' : tab.value === currentTab },
        tab.value === currentTab && 'tabs-item_active',
        'tabs-item',
      ]"
      :disabled="tab.disabled || false"
      @click="handleClick(tab.value)">
      <span class="tab-content"><i v-if="tab.icon" class="material-icons md-16">{{tab.icon}}</i>{{ tab.title }}</span>
    </div>
    <div
      class="tabs-active-line"
      :style="{ width: `${activeLineWidth}px`, transform: `translateX(${activeLineOffset}px)` }"
    ></div>
  </nav>
</template>

<script>
  import windowSize from "@/mixins/windowSize";

  export default {
    name: 'tabs',
    mixins: [windowSize],
    props: {
      currentTab: {
        type: String,
        required: true,
      },
      tabs: {
        type: Array,
        required: true,
      }
    },
    watch: {
      currentTab(newCurrentTab) {
        if (this.newTab === newCurrentTab) return;
        this.moveActiveLine(newCurrentTab);
      },
      windowWidth(newWidth) {
        this.moveActiveLine(this.newTab || this.currentTab)
      },
    },
    data: () => ({
      activeLineWidth: 0,
      activeLineOffset: 0,
      newTab: '',
    }),
    methods: {
      handleClick(value) {
        this.$emit('change-tab', value);
        this.newTab = value;
        this.moveActiveLine(value);
      },

      moveActiveLine(newValue) {
        const element = this.$refs[newValue][0];
        if (!element) return;
        this.activeLineWidth = element.clientWidth;
        this.activeLineOffset = element.offsetLeft;
      },

    },
    mounted() {
      this.moveActiveLine(this.currentTab);
    },
  };
</script>

<style>
  .tabs {
    position: relative;
    margin: 0 auto;
  }

  .tabs-item {
    display: inline-block;
    margin: 0 5px;
    padding: 10px 10px 8px;
    font-size: 16px;
    letter-spacing: 1px;
    color: #ffffff75;
    text-decoration: none;
    border: none;
    background-color: transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.25s;
  }

  .tabs-item_active {
    color: white;
  }

  .tabs-item:hover {
    border-bottom: 2px solid #ffffff75;
    color: white;
  }

  .tabs-item:focus {
    outline: none;
    border-bottom: 2px solid #ffffff75;
    color: white;
  }

  .tabs-item:first-child {
    margin-left: 0;
  }

  .tabs-item:last-child {
    margin-right: 0;
  }

  .tabs-active-line {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: white;
    transition: transform 0.4s ease, width 0.4s ease;
  }

  .tab-content i {
    display: inline-flex;
    vertical-align: middle;
  }

</style>
