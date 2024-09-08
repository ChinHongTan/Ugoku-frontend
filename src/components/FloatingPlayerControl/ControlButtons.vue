<template>
  <div class="control-buttons">
    <button
      class="control-btn shuffle-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
      @mouseleave="onButtonRelease"
    >
      <span class="material-symbols-rounded">shuffle</span>
    </button>
    <button
      class="control-btn previous-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
      @mouseleave="onButtonRelease"
    >
      <span class="material-symbols-rounded">skip_previous</span>
    </button>
    <PlayPauseButton :disabled="!isServerSelected" />
    <button
      class="control-btn next-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
      @mouseleave="onButtonRelease"
    >
      <span class="material-symbols-rounded">skip_next</span>
    </button>
    <button
      class="control-btn repeat-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
      @mouseleave="onButtonRelease"
    >
      <span class="material-symbols-rounded">repeat</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import PlayPauseButton from '@/components/PlayPauseButton.vue'

defineProps<{
  isServerSelected: boolean
}>()

const onButtonPress = (event: MouseEvent) => {
  const icon = (event.currentTarget as HTMLElement).querySelector('.material-symbols-rounded')
  if (icon) {
    icon.classList.add('pressed')
  }
}

const onButtonRelease = (event: MouseEvent) => {
  const icon = (event.currentTarget as HTMLElement).querySelector('.material-symbols-rounded')
  if (icon) {
    icon.classList.remove('pressed')
  }
}
</script>

<style scoped>
.control-buttons {
  display: flex;
  gap: 5px;
  margin-left: 30px;
}

.control-btn {
  background-color: transparent;
  color: whitesmoke;
  border: none;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.material-symbols-rounded {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  font-size: 30px;
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.1s ease;
}

.control-btn:not(:disabled):hover .material-symbols-rounded {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
  color: #ffffff;
}

.control-btn:not(:disabled) .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}

.control-btn:not(:disabled) .material-symbols-rounded:not(.pressed) {
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}
</style>
