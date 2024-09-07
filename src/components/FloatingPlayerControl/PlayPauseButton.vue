<template>
  <button class="control-btn play-pause-btn" :disabled="disabled" @click="togglePlayPause">
    <font-awesome-icon :icon="['fas', isPlaying ? 'pause' : 'play']" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'

const props = defineProps<{
  disabled: boolean
}>()

const playerStore = usePlayerStore()

const isPlaying = computed(() => playerStore.isPlaying)

const togglePlayPause = () => {
  if (isPlaying.value) {
    playerStore.pause()
  } else {
    playerStore.play()
  }
}
</script>

<style scoped>
.play-pause-btn {
  background-color: transparent;
  color: whitesmoke;
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

.play-pause-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .play-pause-btn {
    font-size: 12px;
    padding: 8px 12px;
  }
}
</style>
