<template>
  <span>
    <span v-if="pinned" @click="togglePin">Unpin</span>
    <span v-else @click="togglePin">Pin</span>
  </span>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { browser, Tabs } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';

  @Component
  export default class AppPinControl extends Vue {
    @Prop(Object) tab: Partial<Tabs.Tab> | undefined;

    get pinned() {
      return this.tab?.pinned;
    }

    async togglePin() {
      await browser.runtime.sendMessage({
        msg: Message.TOGGLE_PIN,
        data: {
          tab: this.tab,
        },
      });
    }
  }
</script>

<style lang="scss" scoped>
  span {
    color: white;
  }
</style>
