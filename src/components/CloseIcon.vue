<template>
  <span class="close-icon" tabindex="0" role="img">X </span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
export default class CloseIcon extends Vue {
  @Prop({ required: true }) readonly handleClicked: ((val: unknown) => void) | ((val: unknown) => Promise<void>);
}
</script>