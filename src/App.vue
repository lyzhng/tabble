<template>
  <main>
    <NavigationBar />
    <SearchBar />
    <TabList />
  </main>
</template>

<script charset="utf-8">
import TabList from './components/TabList.vue';
import SearchBar from './components/SearchBar';
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
    SearchBar,
    NavigationBar,
  },
};
</script>
