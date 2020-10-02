<template>
  <form @submit.prevent.stop role="search">
    <input type="text" v-model="query" @input="searchForTabs" placeholder="Search" id="search" autocomplete="off" />
    <button type="button" @click.prevent.stop="reset">Reset</button>
    <button type="button" @click.prevent.stop="showOptions = !showOptions">Options</button>
    <div id="search-options" v-if="showOptions">
      <label for="searchHostname"
        ><input
          type="checkbox"
          id="searchHostname"
          v-model="isSearchHostnameChecked"
          @input="isSearchHostnameChecked = !isSearchHostnameChecked"
        />Search within hostname</label
      >
      <label for="searchTitle"
        ><input
          type="checkbox"
          id="searchTitle"
          v-model="isSearchTitleChecked"
          @input="isSearchTitleChecked = !isSearchTitleChecked"
        />Search within title</label
      >
    </div>
  </form>
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { browser } from 'webextension-polyfill-ts';

import { Message } from '../utils/constants';

@Component
export default class AppSearch extends Vue {
  query: string = '';
  showOptions: boolean = false;
  isSearchHostnameChecked: boolean = true;
  isSearchTitleChecked: boolean = true;

  @Watch('isSearchHostnameChecked')
  async onIsSearchHostnameChecked() {
    await this.searchForTabs();
  }

  @Watch('isSearchTitleChecked')
  async onIsSearchTitleChecked() {
    await this.searchForTabs();
  }

  async mounted() {
    await this.searchForTabs();
  }

  async searchForTabs() {
    const { isSearchHostnameChecked, isSearchTitleChecked } = this;
    const res = await browser.runtime.sendMessage({
      msg: Message.GET_TABS,
      query: this.query,
      options: {
        isSearchHostnameChecked,
        isSearchTitleChecked,
      },
    });
    this.$root.$emit('setTabs', res.data.tabs);
  }

  async reset() {
    this.isSearchTitleChecked = true;
    this.isSearchHostnameChecked = true;
    this.query = '';
    await this.searchForTabs();
  }

  toggleIsSearchHostnameChecked() {
    this.isSearchHostnameChecked = !this.isSearchHostnameChecked;
  }

  toggleIsSearchTitleChecked() {
    this.isSearchTitleChecked = !this.isSearchTitleChecked;
  }
}
</script>

<style lang="scss" scoped>
[type='checkbox'] {
  vertical-align: middle;
  margin: 0 0.5rem;
}

#search-options {
  margin: 1rem 0;
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  align-items: center;
}
</style>
