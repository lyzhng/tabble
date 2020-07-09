<template>
  <div>
    <h1>{{ greeting }}</h1>
    <div v-for="(tabList, windowId) in windowTabMapping" :key="windowId">
      <h2>{{ windowId }}</h2>
      <div v-for="t in tabList" :key="t.id">
        <img v-bind:src="t.favIconUrl" alt="favicon" width="16px" height="16px" />
        <a :href="t.url" @click.prevent="switchTabAndWindow(t.windowId, t.id)">{{ t.title }}</a>
      </div>
    </div>
  </div>
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Message } from '../utils/constants.js';
import { ITab, IWindowToTab, IRequest } from '../utils/types';

const b: number = 3;
b = 'hi';

@Component
export default class TabList extends Vue {
  public greeting: string = 'Tabble';
  public tabs: ITab[] = [];
  public windowTabMapping: IWindowToTab = {};

  async mounted() {
    console.log('TabList.vue mounted!');
    try {
      await this.getTabList();
    } catch (err) {
      throw new Error(err);
    }
    this.initWindowTabMapping();
    this.initMsgHandler();
  }

  public async getTabList(): Promise<void> {
    try {
      const res: IRequest = await browser.runtime.sendMessage({ msg: Message.GET_TABS });
      this.tabs = res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  public initWindowTabMapping(): void {
    this.tabs.forEach((t: ITab) => {
      if (!(t.windowId! in this.windowTabMapping)) {
        this.$set(this.windowTabMapping, t.windowId, [t]);
      } else {
        const tabsInWindow: ITab[] = this.windowTabMapping[t.windowId];
        tabsInWindow.push(t);
      }
    });
  }

  public async switchTabAndWindow(windowId: number, tabId: number): Promise<void> {
    try {
      await browser.tabs.update(tabId, { active: true });
      await browser.windows.update(windowId, { focused: true });
    } catch (err) {
      throw new Error(err);
    }
  }

  public initMsgHandler(): void {
      browser.runtime.onMessage.addListener((req: IRequest) => {
        console.log(req);
        const { msg, data }: IRequest = req;
        if (msg === Message.CREATE) {
          const { tab } = data;
          const { windowId, index }: ITab = tab;
          this.tabs.splice(index, 0, tab);
          if (!(windowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, windowId, [tab]);
          } else {
            this.windowTabMapping[windowId].splice(index, 0, tab);
          }
        }
        if (msg === Message.REMOVE) {
          const { tabId, windowId } = data;
          const tabsInWindow = this.windowTabMapping[windowId].filter((t) => t.id !== tabId);
          this.tabs = this.tabs.filter((t) => t.id !== tabId);
          this.$set(this.windowTabMapping, windowId, tabsInWindow);
          if (this.windowTabMapping[windowId].length === 0) {
            delete this.windowTabMapping[windowId];
          }
        }
        if (msg === Message.UPDATE) {
          const { tab } = data;
          const tabsInWindow = this.windowTabMapping[tab.windowId];
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          const tabIndexInMap = tabsInWindow.findIndex((t) => t.id === tab.id);
          this.$set(this.tabs, tabIndexInArr, tab);
          this.$set(this.windowTabMapping[tab.windowId], tabIndexInMap, tab);
        }
        if (msg === Message.MOVE) {
          const { tab, windowId, fromIndex, toIndex } = data;
          const tabsInWindow = this.windowTabMapping[windowId];
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          this.$delete(this.tabs, tabIndexInArr);
          this.tabs.splice(toIndex, 0, tab);
          this.$delete(tabsInWindow, fromIndex);
          tabsInWindow.splice(toIndex, 0, tab);
        }
        if (msg === Message.ATTACH) {
          const { tab, newWindowId, newPosition }:  = data;
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          this.$set(this.tabs, tabIndexInArr, tab);
          if (!(newWindowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, newWindowId, [tab]);
          } else {
            this.windowTabMapping[newWindowId].splice(newPosition, 0, tab);
          }
        }
        if (msg === Message.DETACH) {
          const { tab, oldWindowId, oldPosition } = data;
          const tabsInWindow = this.windowTabMapping[oldWindowId];
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          this.$delete(this.tabs, tabIndexInArr);
          this.$delete(tabsInWindow, oldPosition);
          if (tabsInWindow.length === 0) {
            delete this.windowTabMapping[oldWindowId];
          }
        }
      });
    },
  },
};
</script>
