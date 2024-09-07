<template>
  <button @click="togglePlayPause" class="play-pause-btn" :disabled="disabled">
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
</script>

<style scoped>
.play-pause-btn {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px, 5px;
  color: white;
}

.play-pause-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.material-symbols-rounded {
  font-variation-settings:
    'FILL' 1,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
  font-size: 50px;
}
</style>
