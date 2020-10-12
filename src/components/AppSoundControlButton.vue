<template>
  <span>
    <!-- <svg v-if="audible && !muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="32" height="32">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="muted" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" width="32" height="32">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg> -->
    <span v-if="audible && !muted" @click="toggleMute">Mute</span>
    <span v-else-if="muted" @click="toggleMute">Unmute</span>
  </span>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  // import Fragment from 'vue-fragment';
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
  span {
    color: white;
  }
</style>
