<template>
  <button
    class="control-btn shuffle-btn"
    :class="{ active: isShuffleActive }"
    :disabled="disabled"
    @click="toggleShuffle"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
  >
    <span class="material-symbols-rounded">shuffle</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/store/playerStore'

const props = defineProps<{
  disabled: boolean
}>()

const playerStore = usePlayerStore()
const isShuffleActive = ref(false)

const toggleShuffle = async () => {
  isShuffleActive.value = !isShuffleActive.value
  await playerStore.toggleShuffle(isShuffleActive.value)
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
.shuffle-btn.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.shuffle-btn.active
  .material-symbols-rounded {
  color: #1db954;
}
</style>