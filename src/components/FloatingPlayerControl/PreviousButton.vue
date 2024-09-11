<template>
  <button
    class="control-btn previous btn"
    :disabled="disabled"
    @click="handlePrevious"
    @mousedown="onButtonPress"
    @mouseup="onButtonRelease"
  >
    <span class="material-symbols-rounded animated-icon">skip_previous</span>
  </button>
</template>

<script setup lang="ts">
import { usePlayerStore } from '@/store/playerStore'

const props = defineProps<{
  disabled: boolean
}>()

const playerStore = usePlayerStore()

const handlePrevious = () => {
  playerStore.playPrevious()
}

const onButtonPress = (event: MouseEvent) => {
  const icon = (event.currentTarget as HTMLElement).querySelector('.material-symbols-rounded')
  icon?.classList.add('pressed')
}

const onButtonRelease = (event: MouseEvent) => {
  const icon = (event.currentTarget as HTMLElement).querySelector('.material-symbols-rounded')
  icon?.classList.remove('pressed')
}
</script>

<style scoped></style>
