<template>
  <div class="volume-controls" ref="volumeControlsRef">
    <button
      class="volume-button"
      @click="toggleMute"
      @mouseenter="showVolumeSlider"
      @mousedown="onButtonPress"
      @mouseup="onButtonRelease"
    >
      <span class="material-symbols-rounded">{{ volumeIcon }}</span>
    </button>
    <Transition name="slide-fade">
      <div
        v-if="isVolumeSliderVisible"
        class="volume-slider-container"
        @mouseenter="keepVolumeSliderVisible"
        @mouseleave="hideVolumeSlider"
      >
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="100"
          :value="isDragging ? dragVolume : volume"
          @input="onVolumeChange"
          @mousedown="startDragging"
          @mouseup="stopDragging"
          @mouseleave="stopDragging"
          ref="volumeSlider"
          :disabled="!isServerSelected"
          :style="{ '--value': `${volume}%` }"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePlayerStore } from '@/store/playerStore'

const props = defineProps<{
  isServerSelected: boolean
}>()

const volumeControlsRef = ref<HTMLDivElement | null>(null)
const volumeSlider = ref<HTMLInputElement | null>(null)
const volume = ref(100)
const lastNonZeroVolume = ref(100)
const isVolumeSliderVisible = ref(false)
const isDragging = ref(false)
const dragVolume = ref(100)

const playerStore = usePlayerStore()

const volumeIcon = computed(() => {
  if (volume.value === 0) return 'volume_off'
  if (volume.value < 50) return 'volume_down'
  return 'volume_up'
})

const showVolumeSlider = () => {
  isVolumeSliderVisible.value = true
  // Add a small delay to ensure the slider is rendered before updating its value
  setTimeout(() => {
    updateSliderValue()
  }, 0)
}

const hideVolumeSlider = () => {
  if (!volumeControlsRef.value?.matches(':hover')) {
    isVolumeSliderVisible.value = false
  }
}

const keepVolumeSliderVisible = () => {
  isVolumeSliderVisible.value = true
}

const toggleMute = () => {
  if (volume.value === 0) {
    volume.value = lastNonZeroVolume.value
  } else {
    lastNonZeroVolume.value = volume.value
    volume.value = 0
  }
  playerStore.setVolume(volume.value)
  updateSliderValue()
}

const startDragging = (event: MouseEvent) => {
  isDragging.value = true
  dragVolume.value = parseInt((event.target as HTMLInputElement).value)
  document.addEventListener('mouseup', stopDragging)
}

const stopDragging = () => {
  if (isDragging.value) {
    isDragging.value = false
    volume.value = dragVolume.value
    playerStore.setVolume(volume.value)
    updateSliderValue()
    document.removeEventListener('mouseup', stopDragging)
  }
}

const onVolumeChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  dragVolume.value = parseInt(target.value)
  if (!isDragging.value) {
    volume.value = dragVolume.value
  }
  if (dragVolume.value > 0) {
    lastNonZeroVolume.value = dragVolume.value
  }
  updateSliderValue()
}

const updateSliderValue = () => {
  if (volumeSlider.value) {
    volumeSlider.value.style.setProperty(
      '--value',
      `${isDragging.value ? dragVolume.value : volume.value}%`
    )
  }
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

onMounted(() => {
  volumeSlider.value = document.querySelector('.volume-slider')
  volume.value = playerStore.volume
  updateSliderValue()

  const handleMouseLeave = () => {
    hideVolumeSlider()
  }

  volumeControlsRef.value?.addEventListener('mouseleave', handleMouseLeave)

  onUnmounted(() => {
    volumeControlsRef.value?.removeEventListener('mouseleave', handleMouseLeave)
  })

  volume.value = playerStore.volume
})

watch(
  () => playerStore.volume,
  (newVolume) => {
    if (!isDragging.value) {
      volume.value = newVolume
      updateSliderValue()
    }
  }
)

watch(volume, (newVolume) => {
  updateSliderValue()
})
</script>

<style scoped>
.volume-controls {
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 30px;
}

.volume-button {
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 7px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.volume-button:hover .material-symbols-rounded,
.volume-controls:hover .volume-button .material-symbols-rounded {
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
}

.volume-button:hover .material-symbols-rounded {
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.7));
  color: #ffffff;
}

.volume-button .material-symbols-rounded.pressed {
  transform: scale(0.7);
  filter: drop-shadow(0 0 7px rgba(255, 255, 255, 0.9));
}

.volume-button .material-symbols-rounded:not(.pressed) {
  transition:
    filter 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}

.material-symbols-rounded {
  font-size: 30px;
  transition: all 0.3s ease;
}

.volume-slider-container {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-40px) rotate(-90deg);
  width: 120px;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
}

/* Slide and fade animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-50%) translateY(0) rotate(-90deg);
  opacity: 0;
}

.volume-slider {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.volume-slider:hover {
  height: 5px;
  background: white;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-slider::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.volume-slider:hover::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
}

.volume-slider:hover::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  border: none;
  position: relative;
  z-index: 2;
}

.volume-slider::before {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
