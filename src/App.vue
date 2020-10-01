<template>
  <div id="container">
    <div id="content">
      <AppNavigation />
      <AppTabList />
      <AppBackToTopArrow />
    </div>
  </div>
</template>

<script charset="utf-8">
import AppTabList from './components/AppTabList.vue';
import AppNavigation from './components/AppNavigation.vue';
import AppBackToTopArrow from './components/AppBackToTopArrow';

export default {
  name: 'App',
  components: {
    AppTabList,
    AppNavigation,
    AppBackToTopArrow,
  },
  mounted() {
    this.initKeyHandler();
  },
  methods: {
    initKeyHandler() {
      document.addEventListener('keydown', ({ key }) => {
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        const scrollAmt = height * 0.15;
        switch (key) {
          case 'j':
            window.scrollBy({
              top: scrollAmt,
              behavior: 'smooth',
            });
            break;
          case 'k':
            window.scrollBy({
              top: -scrollAmt,
              behavior: 'smooth',
            });
            break;
          case 'G':
            window.scrollBy({
              top: document.body.scrollHeight,
              behavior: 'smooth',
            });
            break;
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap');
$font-primary: 'Roboto Mono', monospace;
#container {
  font-family: $font-primary;
}
#content {
  width: 65vw;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0.5rem 1rem;
}
</style>
