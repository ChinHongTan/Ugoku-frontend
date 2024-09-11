<template>
  <div class="control-buttons">
    <ShuffleButton :disabled="!isServerSelected" />
    <PreviousButton :disabled="!isServerSelected" />
    <PlayPauseButton :disabled="!isServerSelected" />
    <SkipButton :disabled="!isServerSelected" />
    <LoopButton :disabled="!isServerSelected" />
  </div>
</template>

<script setup lang="ts">
import PlayPauseButton from '@/components/FloatingPlayerControl/PlayPauseButton.vue'
import LoopButton from '@/components/FloatingPlayerControl/LoopButton.vue'
import SkipButton from '@/components/FloatingPlayerControl/SkipButton.vue'
import ShuffleButton from '@/components/FloatingPlayerControl/ShuffleButton.vue'
import PreviousButton from './PreviousButton.vue'

defineProps<{
  isServerSelected: boolean
}>()
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
