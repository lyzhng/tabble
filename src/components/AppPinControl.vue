<template>
  <div>
    <button v-if="pinned" @click.prevent.stop="togglePin" title="Unpin tab" aria-label="Unpin tab">
      <!-- &#128204; -->
      <img src="https://api.iconify.design/ic:baseline-pin-off.svg?color=white" width="16" height="16" />
    </button>
    <button v-else @click.prevent.stop="togglePin" title="Pin tab" aria-label="Pin tab">
      <img src="https://api.iconify.design/ic:sharp-pin.svg?color=white" width="16" height="16" />
    </button>
  </div>
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
  div {
    display: inline;
  }

  button {
    border: none;
    background-color: transparent;
    &:hover {
      cursor: pointer;
    }
  }

  img {
    vertical-align: middle;
  }
</style>
