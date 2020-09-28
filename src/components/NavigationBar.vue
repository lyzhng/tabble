<template>
  <h1>
    {{ heading }}
    <img
      @click.prevent.stop="toggleColorScheme"
      :src="
        lightColorScheme
          ? 'https://api.iconify.design/uil-sun.svg?color=black'
          : 'https://api.iconify.design/ion-moon.svg?color=white'
      "
      width="32"
      height="32"
    />
  </h1>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';

@Component
export default class NavigationBar extends Vue {
  lightColorScheme: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  readonly heading: string = 'tabble, your tab manager';
}
</script>
