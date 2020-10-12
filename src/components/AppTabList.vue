<template>
  <main role="main" id="main">
    <ul v-for="(tabList, windowId) in windowTabMapping" :key="windowId">
      <li class="window-info">
        <AppCloseButton
          @click.stop.prevent.native="showConfirmationModal(+windowId)"
          @keyup.enter.native="showConfirmationModal(+windowId)"
        />
        {{ windowId }} ({{ tabList.length }} tabs)
      </li>

      <li>
        <ul v-for="t in tabList" :key="t.id" class="tablist">
          <li>
            <AppCloseButton @click.stop.prevent.native="closeTab(+t.id)" @keyup.enter.native="closeTab(+t.id)" />
            <AppPinControl v-if="isValidProtocol(t.protocol)" :tab="t" />
            <AppSoundControlButton :tab="t" />
            <img :src="t.favIconUrl" alt="" :title="t.hostname + ' favicon'" width="16" height="16" />
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
  import { browser, Tabs, Windows } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';
  import AppCloseButton from './AppCloseButton.vue';
  import AppSoundControlButton from './AppSoundControlButton.vue';
  import AppPinControl from './AppPinControl.vue';

  const INVALID_PROTOCOLS = ['about:', 'moz-extension:'];

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
      for (const p of INVALID_PROTOCOLS) {
        if (protocol.startsWith(p)) {
          return false;
        }
      }
      return true;
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
      await browser.tabs.update(tabId, { active: true });
      await browser.windows.update(windowId, { focused: true });
    }

    async closeTab(tabId: number): Promise<void> {
      await browser.tabs.remove(tabId);
    }

    async closeTabsInWindow(windowId: number): Promise<void> {
      const tabsInWindow = this.windowTabMapping[windowId];
      const removedTabs: Promise<void>[] = tabsInWindow
        .filter((t) => t.id !== undefined)
        .map((t) => browser.tabs.remove(t.id!));
      await Promise.all(removedTabs);
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
</style>
