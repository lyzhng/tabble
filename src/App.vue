<template>
  <div id="container">
    <ul id="skiplinks">
      <li>
        <a href="#container">Go back to top</a>
      </li>
      <li>
        <a href="#search">Skip to search</a>
      </li>
      <li>
        <a href="#main">Skip to main</a>
      </li>
    </ul>
    <div id="content">
      <NavigationBar />
      <TabList />
    </div>
  </div>
</template>

<script charset="utf-8">
  import TabList from './components/TabList.vue';
  import NavigationBar from './components/NavigationBar';

  export default {
    name: 'App',
    components: {
      TabList,
      NavigationBar,
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
  #skiplinks {
    position: fixed;
    list-style-type: none;
    padding: 0;
    margin: 0.5rem;
    line-height: 1.25;

    & a:focus {
      display: inline-block;
    }
  }
</style>
