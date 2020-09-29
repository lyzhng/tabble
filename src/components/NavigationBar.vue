<template>
  <nav>
    <h1 id="heading">
      {{ heading }}
      <img
        @click.prevent.stop="toggleColorScheme"
        :src="
          colorScheme === 'light'
            ? 'https://api.iconify.design/uil-sun.svg?color=black'
            : 'https://api.iconify.design/ion-moon.svg?color=yellow'
        "
        width="32"
        height="32"
      />
    </h1>
    <SearchBar />
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
import SearchBar from './SearchBar';
import { mapGetters } from 'vuex';

@Component({
  components: {
    SearchBar,
  },
})
export default class NavigationBar extends Vue {
  colorScheme: string = null;
  readonly heading: string = 'tabble, your tab manager';

  mounted() {
    this.initColorScheme();
    this.initColorSchemeHandler();
  }

  initColorScheme() {
    this.colorScheme = localStorage.getItem('color-scheme') ?? this.colorScheme;
    document.body.setAttribute('color-scheme', this.colorScheme);
  }

  toggleColorScheme() {
    switch (this.colorScheme) {
      case 'light':
        this.colorScheme = 'dark';
        break;
      case 'dark':
        this.colorScheme = 'light';
        break;
    }
    localStorage.setItem('color-scheme', this.colorScheme);
    document.body.setAttribute('color-scheme', this.colorScheme);
  }

  initColorSchemeHandler() {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', (e) => {
      if (e.matches) {
        this.colorScheme = 'light';
      } else {
        this.colorScheme = 'dark';
      }
      localStorage.setItem('color-scheme', this.colorScheme);
      document.body.setAttribute('color-scheme', this.colorScheme);
    });
  }
}
</script>

<style lang="scss" scoped>
nav {
  text-align: center;
}

img {
  vertical-align: middle;
  &:hover,
  &:focus {
    cursor: pointer;
  }
}
</style>
