<template>
  <form @submit.prevent.stop role="search">
    <input type="text" v-model="query" @input="searchForTabs" placeholder="Search" id="search" />
  </form>
</template>

<script charset="utf-8" lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { browser } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';

  @Component
  export default class SearchBar extends Vue {
    query: string = '';

    async mounted() {
      await this.searchForTabs();
    }

    async searchForTabs() {
      const res = await browser.runtime.sendMessage({
        msg: Message.GET_TABS,
        query: this.query,
      });
      this.$root.$emit('setTabs', res.data.tabs);
    }
  }
</script>
