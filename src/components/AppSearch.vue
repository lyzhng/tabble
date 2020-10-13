<template>
  <form @submit.prevent.stop role="search">
    <div id="general-search">
      <input type="text" v-model="query" @input="searchForTabs()" placeholder="Search" id="search" autocomplete="off" />
      <div id="search-buttons">
        <button type="button" @click.prevent.stop="reset">Reset</button>
        <button type="button" @click.prevent.stop="showOptions = !showOptions">Options</button>
      </div>
    </div>
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
  import { browser, Tabs } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';
  import { BrowserMessage } from '../utils/types';

  type ExtraTabInfo<T> = T & { tab?: Tabs.Tab; tabId?: number };

  @Component
  export default class AppSearch extends Vue {
    query: string = '';
    showOptions: boolean = false;
    isSearchHostnameChecked: boolean = true;
    isSearchTitleChecked: boolean = true;
    tabs: Partial<Tabs.Tab>[] = [];

    @Watch('isSearchHostnameChecked')
    async onIsSearchHostnameChecked() {
      await this.searchForTabs();
    }

    @Watch('isSearchTitleChecked')
    async onIsSearchTitleChecked() {
      await this.searchForTabs();
    }

    @Watch('tabs')
    onTabsChanged() {
      this.$root.$emit('setTabs', this.tabs);
    }

    async mounted() {
      this.initMsgHandler();
      await this.searchForTabs();
    }

    async searchForTabs(tabs?: Tabs.Tab[] | undefined) {
      const { isSearchHostnameChecked, isSearchTitleChecked } = this;

      const msgObj = {
        msg: Message.GET_TABS,
        data: {
          query: this.query,
          options: {
            isSearchHostnameChecked,
            isSearchTitleChecked,
          },
        },
      } as BrowserMessage;

      if (tabs !== undefined) {
        msgObj.msg = Message.HANDLE_REMOVED;
        msgObj.data.tabs = tabs;
      }

      const res = await browser.runtime.sendMessage(msgObj);
      this.tabs = res.data.tabs;
    }

    async reset() {
      this.isSearchTitleChecked = true;
      this.isSearchHostnameChecked = true;
      this.query = '';
      this.searchForTabs();
    }

    async handleCreated(): Promise<void> {
      await this.searchForTabs();
    }

    async handleRemoved(tabs: Tabs.Tab[]): Promise<void> {
      const { isSearchHostnameChecked, isSearchTitleChecked } = this;
      await this.searchForTabs(tabs);
    }

    async handleUpdated(): Promise<void> {
      await this.searchForTabs();
    }

    async handleMoved(): Promise<void> {
      await this.searchForTabs();
    }

    async handleAttached(): Promise<void> {
      await this.searchForTabs();
    }

    async handleDetached(): Promise<void> {
      await this.searchForTabs();
    }

    initMsgHandler(): void {
      browser.runtime.onMessage.addListener(async (req: BrowserMessage) => {
        console.log(req);
        switch (req.msg) {
          case Message.CREATE:
            await this.handleCreated();
            break;
          case Message.REMOVE:
            await this.handleRemoved(req.data.tabs!);
            break;
          case Message.UPDATE:
            await this.handleUpdated();
            break;
          case Message.MOVE:
            await this.handleMoved();
            break;
          case Message.ATTACH:
            await this.handleAttached();
            break;
          case Message.DETACH:
            await this.handleDetached();
            break;
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  [type='checkbox'] {
    vertical-align: middle;
    margin: 0 0.5rem;
  }

  form {
    display: flex;
    flex-direction: column;
  }

  #search-options {
    margin: 1rem 0;
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    align-content: flex-start;
    flex: 1;
  }

  #general-search {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 0.5rem;
    align-items: center;
  }
</style>
