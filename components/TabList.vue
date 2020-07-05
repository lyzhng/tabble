<template>
  <div>
    <h1>{{ greeting }}</h1>
    <div v-for="t in tabs">
      <img v-bind:src="t.favIconUrl" alt="favicon" width="16px" height="16px" />
      <a :href="t.url" @click.prevent="goToTab(t.id)">{{ t.title }}</a>
    </div>
  </div>
</template>

<script charset="utf-8">
export default {
  name: 'TabList',
  mounted: function () {
    this.getTabList();
  },
  data: function () {
    return {
      greeting: 'Tabble',
      tabs: [],
    };
  },
  methods: {
    getTabList: async function () {
      const tabList = await browser.runtime.sendMessage('get_tabs');
      this.tabs = tabList;
    },
    goToTab: async function (tabId) {
      console.log('tabid', tabId);
      await browser.tabs.update(tabId, { active: true });
    },
  },
};
</script>
