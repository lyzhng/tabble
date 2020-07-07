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
    await this.getTabList();
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
      const res = await browser.runtime.sendMessage({
        msg: GET_TABS_MSG,
      });
      this.tabs = res.data;
    },
    setWindowTabMapping: function () {
      const { tabs, windowTabMapping } = this;
      tabs.forEach((t) => {
        if (!(t.windowId in windowTabMapping)) {
          this.$set(windowTabMapping, t.windowId, [t]);
        } else {
          this.$set(windowTabMapping, t.windowId, [...windowTabMapping[t.windowId], t]);
        }
      });
    },
    switchTabAndWindow: async function (windowId, tabId) {
      await browser.tabs.update(tabId, { active: true });
      await browser.windows.update(windowId, { focused: true });
    },
    initMsgHandler: function () {
      browser.runtime.onMessage.addListener((req, sender) => {
        console.log(req);
        const { msg, data } = req;
        if (msg === 'create') {
          const { tab } = data;
          const { windowId, index } = tab;
          this.tabs.push(tab);
          if (!(windowId in this.windowTabMapping)) {
            this.$set(this.windowTabMapping, windowId, [tab]);
          } else {
            this.windowTabMapping[windowId].splice(index, 0, tab);
          }
        }
        if (msg === 'remove') {
          const { tabId, windowId } = data;
          this.tabs = this.tabs.filter((t) => t.id !== tabId);
          const tabsInWindow = this.windowTabMapping[windowId].filter((t) => t.id !== tabId);
          this.$set(this.windowTabMapping, windowId, tabsInWindow);
        }
      });
    },
  },
};
</script>
