<template>
  <div class="progress-bar-container">
    <input
      type="range"
      class="progress-bar"
      :min="0"
      :max="duration"
      :value="currentPosition"
      @input="onProgressChange"
      :disabled="!isServerSelected || !currentSong"
      ref="progressBarRef"
    />
    <div class="time-display">{{ formatTime(currentPosition) }} / {{ formatTime(duration) }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { formatTime } from '@/utils/timeFormatter'

const props = defineProps<{
  currentSong: { duration: number } | null
  currentPosition: number
  isServerSelected: boolean
}>()

const emit = defineEmits<{
  (e: 'progressChange', position: number): void
}>()

const progressBarRef = ref<HTMLInputElement | null>(null)

const duration = computed(() => (props.currentSong ? props.currentSong.duration / 1000 : 0))

const onProgressChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('progressChange', parseFloat(target.value))
}

const updateProgressValue = () => {
  if (progressBarRef.value && props.currentSong) {
    const progress = (props.currentPosition / duration.value) * 100
    progressBarRef.value.style.setProperty('--progress', `${progress}%`)
  }
}

watch(() => props.currentPosition, updateProgressValue)
watch(() => props.currentSong, updateProgressValue)

onMounted(() => {
  updateProgressValue()
})

onUnmounted(() => {
  // Clean up if necessary
})
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #d3d3d3;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.progress-bar::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.progress-bar::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: none;
}

.progress-bar::-webkit-slider-runnable-track {
  background: linear-gradient(to right, #4caf50 var(--progress), #d3d3d3 var(--progress));
}

.progress-bar::-moz-range-progress {
  background-color: #4caf50;
}

.progress-bar:hover::-webkit-slider-thumb,
.progress-bar:active::-webkit-slider-thumb,
.progress-bar:hover::-moz-range-thumb,
.progress-bar:active::-moz-range-thumb {
  width: 15px;
  height: 15px;
}

.time-display {
  font-size: 12px;
  color: #ffffff;
  margin-top: 5px;
}

.progress-bar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
