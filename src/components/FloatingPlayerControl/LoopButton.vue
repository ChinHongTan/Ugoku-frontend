<template>
  <button
    class="control-btn loop-btn"
    :disabled="disabled"
    :data-mode="loopMode"
    @click="toggleLoop"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
  >
    <span class="material-symbols-rounded animated-icon">{{ loopIcon }}</span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/store/playerStore'

const props = defineProps<{
  disabled: boolean
}>()

const playerStore = usePlayerStore()

const loopMode = computed(() => playerStore.loopMode)

const loopIcon = computed(() => {
  switch (loopMode.value) {
    case 'loopAll':
      return 'repeat'
    case 'loopOne':
      return 'repeat_one'
    default:
      return 'repeat'
  }
})

const toggleLoop = () => {
  playerStore.toggleLoopMode()
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

.loop-btn[data-mode='loopAll'] .material-symbols-rounded,
.loop-btn[data-mode='loopOne'] .material-symbols-rounded {
  color: #4ced69;
  opacity: 1;
}

.loop-btn[data-mode='loopAll']:hover .material-symbols-rounded,
.loop-btn[data-mode='loopOne']:hover .material-symbols-rounded {
  filter: drop-shadow(0 0 3px rgba(76, 237, 105, 0.7));
}
</style>
