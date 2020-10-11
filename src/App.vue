<template>
  <div id="container">
    <div id="content">
      <AppCloseWindowConfirmation v-show="showCloseWindowConfirmation" />
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
  import AppCloseWindowConfirmation from './components/AppCloseWindowConfirmation.vue';

  export default {
    name: 'App',
    components: {
      AppTabList,
      AppNavigation,
      AppBackToTopArrow,
      AppCloseWindowConfirmation,
    },
    data() {
      return {
        showCloseWindowConfirmation: false,
      };
    },
    mounted() {
      this.$root.$on('confirmForWindowId', (windowId) => {
        this.showCloseWindowConfirmation = true;
      });
      this.$root.$on('hideConfirmationModal', () => {
        this.showCloseWindowConfirmation = false;
      });
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
    display: flex;
    justify-content: center;
  }
  #content {
    width: 65vw;
    position: absolute;
    top: 0;
    min-height: 100vh;
    margin: 0 auto;
    padding: 0.5rem 1rem;
  }
</style>
