<template>
  <div>
    <h1>{{ greeting }}</h1>
    <div v-for="(tabList, windowId) in windowTabMapping">
      <h2>{{ windowId }}</h2>
      <div v-for="t in tabList">
        <img v-bind:src="t.favIconUrl" alt="favicon" width="16px" height="16px" />
        <a :href="t.url" @click.prevent="switchTabAndWindow(t.windowId, t.id)">{{ t.title }}</a>
      </div>
    </div>
  </div>
</template>

<script charset="utf-8">
import { GET_TABS_MSG } from '../utils/constants.js';

export default {
  name: 'TabList',
  mounted: async function () {
    console.log('TabList.vue mounted!');
    this.initMsgHandler();
    try {
      await this.getTabList();
    } catch (err) {
      console.error('Error getting tab list.');
      throw new Error('Could not retrieve tab list.');
    }
    this.setWindowTabMapping();
  },
  data: function () {
    return {
      greeting: 'Tabble',
      tabs: [],
      windowTabMapping: {},
    };
  },
  methods: {
    getTabList: async function () {
      try {
        const res = await browser.runtime.sendMessage({
          msg: GET_TABS_MSG,
        });
        this.tabs = res.data;
      } catch (err) {
        console.error('Error sending GET_TABS_MSG.');
        throw new Error('Could not send GET_TABS_MSG.');
      }
    },
    setWindowTabMapping: function () {
      this.tabs.forEach((t) => {
        if (!(t.windowId in this.windowTabMapping)) {
          this.$set(this.windowTabMapping, t.windowId, [t]);
        } else {
          const tabsInWindow = this.windowTabMapping[t.windowId];
          tabsInWindow.push(t);
        }
      });
    },
    switchTabAndWindow: async function (windowId, tabId) {
      try {
        await browser.tabs.update(tabId, { active: true });
        await browser.windows.update(windowId, { focused: true });
      } catch (err) {
        console.error('Error switching to tab or window.');
        throw new Error('Could not switch to tab or window.');
      }
    },
    initMsgHandler: function () {
      browser.runtime.onMessage.addListener((req, sender) => {
        console.log(req);
        const { msg, data } = req;
        if (msg === 'create') {
          const { tab } = data;
          const { windowId, index } = tab;
          this.tabs.splice(index, 0, tab);
          if (!(windowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, windowId, [tab]);
          } else {
            this.windowTabMapping[windowId].splice(index, 0, tab);
          }
        }
        if (msg === 'remove') {
          const { tabId, windowId } = data;
          const tabsInWindow = this.windowTabMapping[windowId].filter((t) => t.id !== tabId);
          this.tabs = this.tabs.filter((t) => t.id !== tabId);
          this.$set(this.windowTabMapping, windowId, tabsInWindow);
          if (this.windowTabMapping[windowId].length === 0) {
            delete this.windowTabMapping[windowId];
          }
        }
        if (msg === 'update') {
          const { tab } = data;
          const tabsInWindow = this.windowTabMapping[tab.windowId];
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          const tabIndexInMap = tabsInWindow.findIndex((t) => t.id === tab.id);
          this.$set(this.tabs, tabIndexInArr, tab);
          this.$set(this.windowTabMapping[tab.windowId], tabIndexInMap, tab);
        }
        if (msg === 'move') {
          const { tab, windowId, fromIndex, toIndex } = data;
          const tabsInWindow = this.windowTabMapping[windowId];
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          this.$delete(this.tabs, tabIndexInArr);
          this.tabs.splice(toIndex, 0, tab);
          this.$delete(tabsInWindow, fromIndex);
          tabsInWindow.splice(toIndex, 0, tab);
        }
        if (msg === 'attach') {
          const { tab, newWindowId, newPosition } = data;
          const tabIndexInArr = this.tabs.findIndex((t) => t.id === tab.id);
          this.$set(this.tabs, tabIndexInArr, tab);
          if (!(newWindowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, newWindowId, [tab]);
          } else {
            this.windowTabMapping[newWindowId].splice(newPosition, 0, tab);
          }
        }
        if (msg === 'detach') {
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
