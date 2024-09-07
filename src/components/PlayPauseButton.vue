<template>
  <button
    @click="togglePlayPause"
    class="play-pause-btn"
    :disabled="disabled"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
    @mouseleave="onButtonRelease"
  >
    <span class="material-symbols-rounded">
      {{ isPlaying ? 'pause' : 'play_arrow' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'

const playerStore = usePlayerStore()

const isPlaying = computed(() => playerStore.isPlaying)

const togglePlayPause = () => {
  playerStore.togglePlayPause()
}

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

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
.play-pause-btn {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  color: white;
}

.play-pause-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-pause-btn:not(:disabled):hover .material-symbols-rounded {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
  color: #ffffff;
}

.play-pause-btn:not(:disabled) .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.9));
}

.play-pause-btn:not(:disabled) .material-symbols-rounded:not(.pressed) {
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}

.material-symbols-rounded {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  font-size: 50px;
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.1s ease;
}
</style>
