<template>
  <input type="text" v-model="query" @input="searchForTabs" placeholder="Search" id="searchbox" />
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
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