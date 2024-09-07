<template>
  <div class="control-buttons">
    <button class="control-btn shuffle-btn" :disabled="!isServerSelected">
      <font-awesome-icon :icon="['fas', 'shuffle']" />
    </button>
    <button class="control-btn previous-btn" :disabled="!isServerSelected" @click="previousTrack">
      <font-awesome-icon :icon="['fas', 'backward']" />
    </button>
    <PlayPauseButton :disabled="!isServerSelected" />
    <button class="control-btn next-btn" :disabled="!isServerSelected" @click="nextTrack">
      <font-awesome-icon :icon="['fas', 'forward']" />
    </button>
    <button class="control-btn repeat-btn" :disabled="!isServerSelected">
      <font-awesome-icon :icon="['fas', 'repeat']" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/utils/playerStore'
import PlayPauseButton from './PlayPauseButton.vue'

defineProps<{
  isServerSelected: boolean
}>()

const playerStore = usePlayerStore()

const previousTrack = () => {
  playerStore.previousTrack()
}

const nextTrack = () => {
  playerStore.nextTrack()
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
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .control-buttons {
    order: 2;
    width: 100%;
    justify-content: space-between;
  }

  .control-btn {
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
