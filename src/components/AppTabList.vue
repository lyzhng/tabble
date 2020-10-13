<template>
  <main role="main" id="main">
    <ul v-for="(tabList, windowId) in windowTabMapping" :key="windowId">
      <li class="window-info">
        <AppCloseButton
          @click.stop.prevent.native="showConfirmationModal(+windowId)"
          @keyup.enter.native="showConfirmationModal(+windowId)"
          :title="'Close window'"
        />
        {{ windowId }} ({{ tabList.length }} tabs)
      </li>

      <li>
        <ul class="table">
          <li>
            <ul class="row tablist" v-for="t in tabList" :key="t.id">
              <li class="cell">
                <AppCloseButton
                  @click.stop.prevent.native="closeTab(+t.id)"
                  @keyup.enter.native="closeTab(+t.id)"
                  :title="'Close tab'"
                />
              </li>
              <li class="cell"><AppPinControl v-if="isValidProtocol(t.protocol)" :tab="t" /></li>
              <li class="cell"><AppSoundControlButton v-if="isValidProtocol(t.protocol)" :tab="t" /></li>
              <li class="cell">
                <img :src="t.favIconUrl" alt="" :title="t.hostname + ' favicon'" width="16" height="16" />
              </li>
              <li class="cell">
                <a
                  :href="t.url"
                  @click.stop.prevent="switchTabAndWindow(+t.windowId, +t.id)"
                  :title="'Go to ' + t.url"
                  >{{ t.title }}</a
                >
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>

<script charset="utf-8" lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { browser, Tabs, Windows } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';
  import AppCloseButton from './AppCloseButton.vue';
  import AppSoundControlButton from './AppSoundControlButton.vue';
  import AppPinControl from './AppPinControl.vue';

  const VALID_PROTOCOLS = ['http:', 'https:', 'ws', 'wss', 'ftp', 'ftps', 'data', 'file'];

  @Component({
    components: {
      AppCloseButton,
      AppSoundControlButton,
      AppPinControl,
    },
  })
  export default class AppTabList extends Vue {
    tabs: Partial<Tabs.Tab>[] = [];
    windowTabMapping: Record<string, Partial<Tabs.Tab>[]> = {};

    showConfirmationModal(windowId: number) {
      this.$root.$emit('confirmForWindowId', windowId);
    }

    async mounted() {
      this.$root.$on('setTabs', (tabs: Partial<Tabs.Tab>[]) => {
        this.windowTabMapping = {};
        this.tabs = tabs;
        this.initWindowTabMapping();
      });
      this.$root.$on('closeWindow', (windowId: number) => {
        this.closeTabsInWindow(windowId);
      });
    }

    isValidProtocol(protocol: string): boolean {
      for (const p of VALID_PROTOCOLS) {
        if (protocol.startsWith(p)) {
          return true;
        }
      }
      return false;
    }

    initWindowTabMapping(): void {
      this.tabs.forEach((t) => {
        if (t.windowId !== undefined) {
          if (!(t.windowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, t.windowId, [t]);
          } else {
            const tabsInWindow: Partial<Tabs.Tab>[] = this.windowTabMapping[t.windowId];
            tabsInWindow.push(t);
          }
        }
      });
    }

    async switchTabAndWindow(windowId: number, tabId: number): Promise<void> {
      await browser.runtime.sendMessage({
        msg: Message.SWITCH_TO_TAB_AND_WINDOW,
        data: {
          tabId,
          windowId,
        }
      });
    }

    async closeTab(tabId: number): Promise<void> {
      await browser.runtime.sendMessage({
        msg: Message.CLOSE_TAB,
        data: {
          tabId
        }
      });
    }

    async closeTabsInWindow(windowId: number): Promise<void> {
      const tabsInWindow = this.windowTabMapping[windowId];
      await browser.runtime.sendMessage({
        msg: Message.CLOSE_TABS_IN_WINDOW,
        data: {
          tabs: tabsInWindow
        }
      });
    }
  }
</script>

<style lang="scss" scoped>
  ul {
    list-style-position: outside;
    line-height: 1.5;
    li {
      list-style-type: none;
      box-sizing: border-box;
    }
  }

  img {
    vertical-align: middle;
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  main {
    width: 80%;
    margin: 0 auto;
    line-height: 1.5;
  }

  .window-info {
    font-size: 1.5rem;
  }

  .tablist {
    font-size: 1rem;
  }

  .close-icon {
    margin: 0 0.5rem;
    &:hover,
    &:focus {
      cursor: pointer;
    }
  }

  .table {
    display: table;
    border-collapse: separate;
  }

  .row {
    display: table-row;
  }

  .cell {
    display: table-cell;
    &:not(.cell:last-child) {
      text-align: center;
    }
    &:last-child {
      padding: 0 0.25rem;
    }
    &:nth-last-child(2) {
      padding: 0 0.5rem;
    }
  }
</style>
