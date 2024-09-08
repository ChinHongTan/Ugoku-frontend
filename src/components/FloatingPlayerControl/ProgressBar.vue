<template>
  <div class="progress-bar-container">
    <input
      type="range"
      class="progress-bar"
      :min="0"
      :max="duration"
      :value="isDragging ? dragPosition : currentPosition"
      @input="onProgressChange"
      @mousedown="startDragging"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
      :disabled="disabled"
      :style="{ '--value': `${progressPercentage}%` }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  currentPosition: number
  duration: number
  isPlaying: boolean
  disabled: boolean
}>()

const emit = defineEmits<{
  (e: 'update:position', position: number): void
  (e: 'seek', position: number): void
  (e: 'dragStart'): void
  (e: 'dragEnd'): void
}>()

const isDragging = ref(false)
const dragPosition = ref(props.currentPosition)

const progressPercentage = computed(() => {
  const position = isDragging.value ? dragPosition.value : props.currentPosition
  return (position / props.duration) * 100
})

const startDragging = (event: MouseEvent) => {
  isDragging.value = true
  dragPosition.value = parseInt((event.target as HTMLInputElement).value)
  emit('dragStart')
  document.addEventListener('mouseup', stopDragging)
}

const stopDragging = () => {
  if (isDragging.value) {
    isDragging.value = false
    emit('seek', dragPosition.value)
    emit('dragEnd')
    document.removeEventListener('mouseup', stopDragging)
  }
}

const onProgressChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  dragPosition.value = parseInt(target.value)
  emit('update:position', dragPosition.value)
}

watch(
  () => props.currentPosition,
  (newPosition) => {
    if (!isDragging.value) {
      dragPosition.value = newPosition
    }
  }
)
</script>

<style scoped>
.progress-bar {
  width: 100%;
  margin-top: 5px;
}

.progress-bar {
  -webkit-appearance: none;
  height: 4px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.progress-bar:hover,
.progress-bar:active {
  height: 5px;
  background: white;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-bar::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
}

.progress-bar:hover::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
}

.progress-bar:hover::-webkit-slider-thumb,
.progress-bar:active::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
}

.progress-bar::-moz-range-progress {
  background-color: #4caf50;
  height: 5px;
  border-radius: 5px;
}

.progress-bar:hover::-moz-range-progress {
  height: 8px;
}

/* For WebKit browsers, create a filled effect */
.progress-bar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: var(--value, 0%);
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  pointer-events: none;
}
</style>
