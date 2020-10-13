<template>
  <button class="close-icon" :title="title" :aria-label="title">X</button>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  export default class AppCloseButton extends Vue {
    @Prop(String) title: string | undefined;
  }
</script>

<style lang="scss" scoped>
  button {
    background: transparent;
    border: none;
    margin: 0;
    padding: 0;
  }
</style>
