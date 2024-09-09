<template>
  <button
    @click="toggleQueue"
    class="queue-toggle-btn"
    :class="{ 'is-open': isOpen }"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
  >
    <span class="material-symbols-rounded animated-icon">queue_music</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/store/playerStore'

const playerStore = usePlayerStore()

const isOpen = computed(() => playerStore.isQueueOpen)

const toggleQueue = () => {
  playerStore.toggleQueue()
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
.queue-toggle-btn {
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  padding: 5px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-symbols-rounded {
  font-size: 30px;
  transition: all 0.3s ease;
}

.queue-toggle-btn.is-open .material-symbols-rounded {
  color: #75fb4c;
  filter: drop-shadow(0 0 5px rgba(117, 251, 76, 0.7));
}

.queue-toggle-btn:not(:disabled):hover .material-symbols-rounded {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
  color: #ffffff;
}

.queue-toggle-btn.is-open:not(:disabled):hover .material-symbols-rounded {
  color: #a0ff85;
  filter: drop-shadow(0 0 5px rgba(117, 251, 76, 0.9));
}

.queue-toggle-btn:not(:disabled) .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.9));
}

.queue-toggle-btn:not(:disabled) .material-symbols-rounded:not(.pressed) {
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}
</style>
