<template>
  <AppConfirmationModal
    modalTitle="Close this window?"
    modalInfo="All of the tabs in this window will be closed. This tab includes blah blah blah blah. More and more and more and more info."
    modalPrompt="Are you sure you want to continue?"
    :options="options"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import AppConfirmationModal from './AppConfirmationModal.vue';

@Component({
  components: {
    AppConfirmationModal,
  },
})
export default class AppCloseWindowConfirmation extends Vue {
  confirmForWindowId: number | undefined;

  mounted() {
    this.$root.$on('confirmForWindowId', (windowId: number) => {
      this.confirmForWindowId = windowId;
    });
  }

  get options() {
    return {
      cancel: {
        handler: this.hideConfirmationModal,
      },
      buttonOptions: [
        {
          displayedText: "Yes, I'm sure.",
          handler: this.closeWindow,
          style: {
            backgroundColor: 'maroon',
            color: 'white',
          },
        },
        {
          displayedText: "No, don't close it.",
          handler: this.hideConfirmationModal,
          style: {
            backgroundColor: 'gray',
            color: 'white',
          },
        },
      ],
    };
  }

  hideConfirmationModal() {
    this.$root.$emit('hideConfirmationModal');
  }

  closeWindow() {
    this.$root.$emit('closeWindow', this.confirmForWindowId);
    this.hideConfirmationModal();
  }
}
</script>