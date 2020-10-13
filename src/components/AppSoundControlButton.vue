<template>
  <div>
    <button v-if="audible && !muted" @click.prevent.stop="toggleMute" title="Mute tab" aria-label="Mute tab">
      <!-- &#128266; -->
      <img src="https://api.iconify.design/clarity:volume-up-solid.svg?color=white" width="16" height="16" />
    </button>
    <button v-else-if="muted" @click.prevent.stop="toggleMute" title="Unmute tab" aria-label="Unmute tab">
      <!-- &#128263; -->
      <img src="https://api.iconify.design/bx:bxs-volume-mute.svg?color=white" width="16" height="16" />
    </button>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { Tabs, browser } from 'webextension-polyfill-ts';

  import { Message } from '../utils/constants';

  @Component
  export default class AppSoundControlButton extends Vue {
    @Prop(Object) tab: Partial<Tabs.Tab> | undefined;

    get audible() {
      return this.tab?.audible;
    }

    get muted() {
      return this.tab?.mutedInfo?.muted;
    }

    async toggleMute() {
      await browser.runtime.sendMessage({
        msg: Message.TOGGLE_MUTE,
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
    padding: 0;
    margin: 0;
    &:hover {
      cursor: pointer;
    }
  }

  img {
    vertical-align: middle;
  }
</style>
