<template>
  <span id="top">
    <a href="#container" title="Go back to top">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 32 32"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11l7-7 7 7M5 19l7-7 7 7"></path>
      </svg>
    </a>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component
  export default class SkipLinks extends Vue {}
</script>

<style lang="scss" scoped>
  #top {
    position: fixed;
    bottom: 0;
    right: 0;
  }
</style>
