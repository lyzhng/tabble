<template>
  <div id="overlay">
    <div id="dialog-box">
      <div id="dialog-title">
        {{ modalTitle }}
        <span
          id="close-button"
          tabindex="0"
          role="button"
          @click.prevent.stop="cancel"
          @keyup.enter="cancel"
          aria-label="Cancel"
          >&times;
        </span>
      </div>
      <div id="dialog-msg">
        <p id="dialog-info">{{ modalInfo }}</p>
        <p id="dialog-prompt">{{ modalPrompt }}</p>
      </div>
      <div id="options">
        <button
          type="button"
          v-for="option in buttonOptions"
          @click.prevent.stop="option.handler"
          :key="option.displayedText"
          :style="option.style"
          :aria-label="option.displayedText"
        >
          {{ option.displayedText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
interface CancelOption {
  handler: () => void;
}

interface ButtonOption {
  displayedText: string;
  handler: () => void;
  style?: {
    backgroundColor: string;
    color: string;
  };
}
interface OptionDetails {
  cancel: CancelOption;
  buttonOptions: ButtonOption[];
}

import { Component, Vue, Prop } from 'vue-property-decorator';
@Component
export default class AppConfirmationModal extends Vue {
  @Prop(String) modalTitle: string | undefined;
  @Prop(String) modalInfo: string | undefined;
  @Prop(String) modalPrompt: string | undefined;
  @Prop(Object) options!: OptionDetails;

  get cancel() {
    return this.options.cancel.handler;
  }

  get buttonOptions() {
    return this.options.buttonOptions;
  }
}
</script>

<style lang="scss" scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

p {
  margin: 0.25rem;
}

#overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  display: grid;
  place-items: center;
  z-index: 2;
}

#dialog-box {
  min-width: 400px;
  max-width: 650px;
  min-height: 250px;
  max-height: 300px;
  position: relative;
  background-color: #222831;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#dialog-title {
  position: absolute;
  top: 0;
  left: 0;
  background-color: black;
  color: white;
  width: 100%;
  padding: 0.75rem 1rem;
  top: 0;
  left: 0;
  font-size: 1.1rem;
  border-radius: 5px 5px 0 0;
}

#dialog-msg {
  color: white;
  margin: 1rem;
  line-height: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  & > p {
    flex-basis: 50%;
  }
}

#close-button {
  position: absolute;
  display: inline-block;
  right: 0;
  margin-right: 1rem;
  z-index: 1;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
}

#close-button::after {
  position: absolute;
  content: '';
  background-color: rgba(255, 255, 255, 0.25);
  z-index: -1;
  background-color: maroon;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

#options {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  width: 100%;
}

#options button {
  flex: 1 1 50%;
  border: 0;
  padding: 0.5rem;
  font-size: 0.9rem;
  &:hover {
    cursor: pointer;
  }
  &:first-child {
    border-radius: 0 0 0 5px;
  }
  &:last-child {
    border-radius: 0 0 5px 0;
  }
}
</style>