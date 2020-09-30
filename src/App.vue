<template>
  <main id="app">
    <NavigationBar />
    <TabList />
  </main>
</template>

<script charset="utf-8">
import TabList from './components/TabList.vue';
import NavigationBar from './components/NavigationBar';

export default {
  name: 'App',
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
  mounted() {
    this.initKeyHandler();
  },
  components: {
    TabList,
    NavigationBar,
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap');
$font-primary: 'Roboto Mono', monospace;
main {
  width: 65vw;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  font-family: $font-primary;
}
</style>