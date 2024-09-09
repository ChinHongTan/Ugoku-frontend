<template>
  <button
    class="control-btn skip-btn"
    :disabled="disabled"
    @click="skipSong"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
  >
    <span class="material-symbols-rounded">skip_next</span>
  </button>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/store/playerStore'

const props = defineProps<{
  disabled: boolean
}>()

const playerStore = usePlayerStore()

const skipSong = () => {
  playerStore.skipSong()
}

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
  opacity: 0.7;
}

.control-btn:not(:disabled):hover .material-symbols-rounded,
.control-btn .material-symbols-rounded.active {
  opacity: 1;
  filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.7));
}

.control-btn:not(:disabled) .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.9));
}
</style>
