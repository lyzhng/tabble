<template>
  <span id="top" role="button" tabindex="0">
    <a href="#container" title="Go back to top">
      <img src="https://api.iconify.design/ant-design:up-outlined.svg?color=white" height="32" width="32" />
    </a>
  </span>
</template>

<script lang="ts">
  import Vue from 'vue';
  import Component from 'vue-class-component';

  @Component
  export default class AppBackToTopArrow extends Vue {}
</script>

<style lang="scss" scoped>
  #top {
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
  }
</style>
