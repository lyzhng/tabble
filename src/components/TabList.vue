<template>
  <div class="tab-list" :class="lightColorScheme ? '.light-scheme' : 'dark-scheme'">
    <h1>
      {{ greeting }}
      <img
        @click.prevent.stop="toggleColorScheme"
        :src="lightColorScheme ? 'https://api.iconify.design/uil-sun.svg?color=black' : 'https://api.iconify.design/ion-moon.svg?color=white'"
        width="32"
        height="32"
      />
    </h1>
    <pre v-if="error">{{ error }}</pre>
    <div class="list">
      <ul v-for="(tabList, windowId, idx) in windowTabMapping" :key="windowId">
        <li>
          <h2>
            <span class="close-icon" @click.stop.prevent="closeWindow(+windowId)">[X]</span>
            {{ idx + 1 }} ({{ tabList.length}} tabs)
          </h2>
          <ul v-for="t in tabList" :key="t.id">
            <li>
              <span class="close-icon" @click.stop.prevent="closeTab(+t.id)">[X]</span>
              <img class="favicon" :src="t.favIconUrl" alt="?" width="16" height="16" />
              <a
                :href="t.url"
                @click.stop.prevent="switchTabAndWindow(+t.windowId, +t.id)"
              >{{ t.title }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script charset="utf-8" lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Fragment } from 'vue-fragment';
import { Message } from '../utils/constants';
import { ITab, IWindowToTab, IRequest, IData } from '../utils/types';

@Component({
  components: { Fragment },
})
export default class TabList extends Vue {
  public readonly greeting: string = 'tabby, your tab manager';
  public tabs: Array<ITab> = [];
  public readonly windowTabMapping: IWindowToTab = {};
  public lightColorScheme: boolean = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  public error: string = '';

  async mounted() {
    console.log('TabList.vue mounted!');
    this.setColorScheme();
    this.initColorSchemeHandler();
    try {
      await this.getTabList();
    } catch (err) {
      throw new Error(err);
    }
    this.initWindowTabMapping();
    this.initMsgHandler();
  }

  public initColorSchemeHandler(): void {
    const mql = window.matchMedia('(prefers-color-scheme: light)');
    mql.addEventListener('change', (e) => {
      this.lightColorScheme = e.matches;
      this.setColorScheme();
    });
  }

  public async getTabList(): Promise<void> {
    try {
      const res: IRequest = await browser.runtime.sendMessage({
        msg: Message.GET_TABS,
      });
      const data: IData = res.data;
      this.tabs = res.data.tabs;
    } catch (err) {
      this.error = 'Could not fetch tabs.';
      throw new Error(err);
    }
  }

  public initWindowTabMapping(): void {
    this.tabs.forEach((t: ITab) => {
      if (!(t.windowId in this.windowTabMapping)) {
        this.$set(this.windowTabMapping, t.windowId, [t]);
      } else {
        const tabsInWindow: Array<ITab> = this.windowTabMapping[t.windowId];
        tabsInWindow.push(t);
      }
    });
  }

  public async switchTabAndWindow(windowId: number, tabId: number): Promise<void> {
    try {
      await browser.tabs.update(tabId, { active: true });
      await browser.windows.update(windowId, { focused: true });
    } catch (err) {
      this.error = 'Could not switch to selected tab.';
      throw new Error(err);
    }
  }

  public async closeTab(tabId: number): Promise<void> {
    try {
      await browser.tabs.remove(tabId);
    } catch (err) {
      this.error = 'Tab could not be closed.';
      throw new Error(err);
    }
  }

  public async closeWindow(windowId: number): Promise<void> {
    try {
      await browser.windows.remove(windowId);
    } catch (err) {
      this.error = 'Window could not be closed.';
      throw new Error(err);
    }
  }

  public handleCreated(data: IData): void {
    const { tab }: IData = data;
    const { windowId, index }: ITab = tab;
    this.tabs.splice(index, 0, tab);
    if (!(windowId in this.windowTabMapping)) {
      this.$set(this.windowTabMapping, windowId, [tab]);
    } else {
      this.windowTabMapping[windowId].splice(index, 0, tab);
    }
  }

  public handleRemoved(data: IData): void {
    const { tabId, windowId }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[windowId].filter((t) => t.id !== tabId);
    this.tabs = this.tabs.filter((t) => t.id !== tabId);
    this.$set(this.windowTabMapping, windowId, tabsInWindow);
    if (this.windowTabMapping[windowId].length === 0) {
      delete this.windowTabMapping[windowId];
    }
  }

  public handleUpdated(data: IData): void {
    const { tab }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[tab.windowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    const tabIndexInMap: number = tabsInWindow.findIndex((t) => t.id === tab.id);
    this.$set(this.tabs, tabIndexInArr, tab);
    this.$set(this.windowTabMapping[tab.windowId], tabIndexInMap, tab);
  }

  public handleMoved(data: IData): void {
    const { tab, windowId, fromIndex, toIndex }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[windowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$delete(this.tabs, tabIndexInArr);
    this.tabs.splice(toIndex, 0, tab);
    this.$delete(tabsInWindow, fromIndex);
    tabsInWindow.splice(toIndex, 0, tab);
  }

  public handleAttached(data: IData): void {
    const { tab, newWindowId, newPosition }: IData = data;
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$set(this.tabs, tabIndexInArr, tab);
    if (!(newWindowId in this.windowTabMapping)) {
      this.$set(this.windowTabMapping, newWindowId, [tab]);
    } else {
      this.windowTabMapping[newWindowId].splice(newPosition, 0, tab);
    }
  }

  public handleDetached(data: IData): void {
    const { tab, oldWindowId, oldPosition }: IData = data;
    const tabsInWindow: Array<ITab> = this.windowTabMapping[oldWindowId];
    const tabIndexInArr: number = this.tabs.findIndex((t) => t.id === tab.id);
    this.$delete(this.tabs, tabIndexInArr);
    this.$delete(tabsInWindow, oldPosition);
    if (tabsInWindow.length === 0) {
      delete this.windowTabMapping[oldWindowId];
    }
  }

  public initMsgHandler(): void {
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

  public toggleColorScheme(): void {
    this.lightColorScheme = !this.lightColorScheme;
    this.setColorScheme();
  }

  public setColorScheme(): void {
    if (this.lightColorScheme) {
      document.body.style.background = '#fff';
    } else {
      document.body.style.background = '#333';
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400&display=swap');

$font-primary: 'Roboto Mono', monospace;
$light-color: #fff;
$dark-color: #333;

@mixin reset-spacing {
  padding: 0;
  margin: 0;
}

.light-scheme {
  background: $light-color;
  color: $dark-color;

  a {
    color: $dark-color;
  }
}

.dark-scheme {
  background: $dark-color;
  color: $light-color;

  a {
    color: $light-color;
  }
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2 {
  @include reset-spacing;
}

body {
  font-family: 'Roboto Mono', monospace;
}

img {
  vertical-align: middle;
}

.tab-list {
  width: 70vw;
  margin: 0 auto;
  padding: 1rem;
}

a {
  text-decoration: none;
  &:hover,
  &:focus {
    text-decoration: underline;
  }
}

.list {
  font-size: 0.9rem;
  line-height: 1.8;
}

.close-icon {
  margin: 0 0.5rem;
  color: orangered;
  &:hover,
  &:focus {
    cursor: crosshair;
  }
}

ul {
  padding: 0 auto;
  margin: 0 auto;
  & li {
    list-style-type: none;
  }
}
</style>
