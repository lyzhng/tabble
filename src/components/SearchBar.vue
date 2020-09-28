<template>
  <input type="text" v-model="query" @input="searchForTabs" placeholder="Search" />
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
import { Message } from '../utils/constants';

@Component
export default class SearchBar extends Vue {
  public query: string = '';

  async mounted() {
    await this.searchForTabs();
  }

  async searchForTabs(): Promise<void> {
    const res = await browser.runtime.sendMessage({
      msg: Message.GET_TABS,
      query: this.query,
    });
    this.$parent.$emit('setTabs', res.data.tabs);
  }
}
</script>
