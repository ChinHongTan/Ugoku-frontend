<template>
  <div class="control-buttons">
    <button
      class="control-btn shuffle-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
    >
      <span class="material-symbols-rounded animated-icon">shuffle</span>
    </button>
    <button
      class="control-btn previous-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
    >
      <span class="material-symbols-rounded animated-icon">skip_previous</span>
    </button>
    <PlayPauseButton :disabled="!isServerSelected" />
    <button
      class="control-btn next-btn"
      :disabled="!isServerSelected"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
    >
      <span class="material-symbols-rounded animated-icon">skip_next</span>
    </button>
    <LoopButton :disabled="!isServerSelected" />
  </div>
</template>

<script setup lang="ts">
import PlayPauseButton from '@/components/FloatingPlayerControl/PlayPauseButton.vue'
import LoopButton from '@/components/FloatingPlayerControl/LoopButton.vue'

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
  margin-left: 30px;
}

.control-btn {
  background-color: transparent;
  color: whitesmoke;
  border: none;
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
  transition: all 0.3s ease;
}

.control-btn:not(:disabled):hover .material-symbols-rounded {
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
  color: #ffffff;
}

.control-btn:not(:disabled) .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}
</style>
