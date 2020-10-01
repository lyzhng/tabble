<template>
  <main role="main" id="main">
    <ul v-for="(tabList, windowId) in windowTabMapping" :key="windowId">
      <li class="window-info">
        <span
          class="close-icon"
          @click.stop.prevent="closeTabsInWindow(+windowId)"
          @keyup.enter="closeTabsInWindow(+windowId)"
          tabindex="0"
          role="img"
          aria-label="Close window"
          title="Close window"
          >X
        </span>
        {{ windowId }} ({{ tabList.length }} tabs)
      </li>

      <li>
        <ul v-for="t in tabList" :key="t.id" class="tablist">
          <li>
            <span
              class="close-icon"
              @click.stop.prevent="closeTab(+t.id)"
              @keyup.enter="closeTab(+t.id)"
              tabindex="0"
              role="img"
              aria-label="Close tab"
              title="Close tab"
              >X</span
            >
            <img :src="t.favIconUrl" alt="" :title="getHostname(t.url) + ' favicon'" width="16" height="16" />
            <a :href="t.url" @click.stop.prevent="switchTabAndWindow(+t.windowId, +t.id)" :title="'Go to ' + t.url">{{
              t.title
            }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </main>
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { browser, Tabs } from 'webextension-polyfill-ts';

import { Message } from '../utils/constants';
import { ITab, IWindowToTab, IRequest, IData } from '../utils/types';
import CloseIcon from './CloseIcon';

@Component({
  components: {
    CloseIcon,
  },
})
export default class TabList extends Vue {
  tabs: Array<ITab> = [];
  windowTabMapping: IWindowToTab = {};

  async mounted() {
    this.initMsgHandler();
    this.$root.$on('setTabs', (data) => {
      this.windowTabMapping = {} as IWindowToTab;
      this.tabs = data;
      this.initWindowTabMapping();
    });
  }

  getHostname(url: string): string {
    return new URL(url).hostname;
  }

  initWindowTabMapping(): void {
    this.tabs.forEach((t: ITab) => {
      if (!(t.windowId in this.windowTabMapping)) {
        this.$set(this.windowTabMapping, t.windowId, [t]);
      } else {
        const tabsInWindow: Array<ITab> = this.windowTabMapping[t.windowId];
        tabsInWindow.push(t);
      }
    });
  }

  async switchTabAndWindow(windowId: number, tabId: number): Promise<void> {
    await browser.tabs.update(tabId, { active: true });
    await browser.windows.update(windowId, { focused: true });
  }

  async closeTab(tabId: number): Promise<void> {
    await browser.tabs.remove(tabId);
  }

  async closeTabsInWindow(windowId: number): Promise<void> {
    const tabsInWindow = this.windowTabMapping[windowId];
    const removedTabs: Promise<void>[] = tabsInWindow.map((t) => browser.tabs.remove(t.id));
    await Promise.all(removedTabs);
  }

  handleCreated(data: IData): void {
    const { tab }: IData = data;
    const { windowId, index }: ITab = tab;
    this.tabs.splice(index, 0, tab);
    if (!(windowId in this.windowTabMapping)) {
      this.$set(this.windowTabMapping, windowId, [tab]);
    } else {
      this.windowTabMapping[windowId].splice(index, 0, tab);
    }
  }

  handleRemoved(data: IData): void {
    const { tabId, windowId }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[windowId].filter((t) => t.id !== tabId);
    this.tabs = this.tabs.filter((t) => t.id !== tabId);
    this.$set(this.windowTabMapping, windowId, tabsInWindow);
    if (this.windowTabMapping[windowId].length === 0) {
      this.$delete(this.windowTabMapping, windowId);
    }
  }

  handleUpdated(data: IData): void {
    const { tab }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[tab.windowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    const tabIndexInMap: number = tabsInWindow.findIndex((t) => t.id === tab.id);
    this.$set(this.tabs, tabIndexInArr, tab);
    this.$set(this.windowTabMapping[tab.windowId], tabIndexInMap, tab);
  }

  handleMoved(data: IData): void {
    const { tab, windowId, fromIndex, toIndex }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[windowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$delete(this.tabs, tabIndexInArr);
    this.tabs.splice(toIndex, 0, tab);
    this.$delete(tabsInWindow, fromIndex);
    tabsInWindow.splice(toIndex, 0, tab);
  }

  handleAttached(data: IData): void {
    const { tab, newWindowId, newPosition }: IData = data;
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$set(this.tabs, tabIndexInArr, tab);
    if (!(newWindowId in this.windowTabMapping)) {
      this.$set(this.windowTabMapping, newWindowId, [tab]);
    } else {
      this.windowTabMapping[newWindowId].splice(newPosition, 0, tab);
    }
  }

  handleDetached(data: IData): void {
    const { tab, oldWindowId, oldPosition }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[oldWindowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$delete(this.tabs, tabIndexInArr);
    this.$delete(tabsInWindow, oldPosition);
    if (tabsInWindow.length === 0) {
      this.$delete(this.windowTabMapping, oldWindowId);
    }
  }

  initMsgHandler(): void {
    browser.runtime.onMessage.addListener((req: IRequest) => {
      console.log(req);
      const { msg, data }: IRequest = req;
      switch (msg) {
        case Message.CREATE:
          this.handleCreated(data);
          break;
        case Message.REMOVE:
          this.handleRemoved(data);
          break;
        case Message.UPDATE:
          this.handleUpdated(data);
          break;
        case Message.MOVE:
          this.handleMoved(data);
          break;
        case Message.ATTACH:
          this.handleAttached(data);
          break;
        case Message.DETACH:
          this.handleDetached(data);
          break;
      }
    });
  }
}
</script>

<style lang="scss" scoped>
ul {
  list-style-position: outside;
  li {
    list-style-type: none;
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
</style>
