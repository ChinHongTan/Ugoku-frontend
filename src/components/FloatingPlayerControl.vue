<template>
  <div class="floating-player-control">
    <div class="player-content">
      <div class="control-buttons">
        <button class="control-btn shuffle-btn" :disabled="!isServerSelected">
          <font-awesome-icon :icon="['fas', 'shuffle']" />
        </button>
        <button class="control-btn previous-btn" :disabled="!isServerSelected">
          <font-awesome-icon :icon="['fas', 'backward']" />
        </button>
        <PlayPauseButton :disabled="!isServerSelected" />
        <button class="control-btn next-btn" :disabled="!isServerSelected">
          <font-awesome-icon :icon="['fas', 'forward']" />
        </button>
        <button class="control-btn repeat-btn" :disabled="!isServerSelected">
          <font-awesome-icon :icon="['fas', 'carrot']" />
        </button>
      </div>
      <div class="info-section">
        <div class="album-cover-container" :class="{ rotating: isPlaying }">
          <img
            v-if="currentSong && currentSong.cover"
            class="album-cover"
            :src="currentSong.cover"
            width="40px"
            height="40px"
          />
          <DefaultAlbumCover v-else />
        </div>
        <div class="song-info">
          <p class="song-title">
            {{
              isServerSelected
                ? currentSong
                  ? currentSong.title
                  : 'Not playing'
                : 'Select a server'
            }}
          </p>
          <div class="artist-and-timer">
            <p class="song-artist">
              {{
                isServerSelected
                  ? currentSong
                    ? currentSong.artist
                    : '-'
                  : 'to see player controls'
              }}
            </p>
            <div class="timer">
              {{ formatTime(currentPosition) }} /
              {{ formatTime(currentSong ? currentSong.duration / 1000 : 0) }}
            </div>
          </div>
          <input
            type="range"
            class="progress-bar"
            :min="0"
            :max="currentSong ? currentSong.duration / 1000 : 0"
            :value="currentPosition"
            @input="onProgressChange"
            ref="progressBar"
            :disabled="!isServerSelected || !currentSong"
          />
        </div>
      </div>
      <VolumeControl :isServerSelected="isServerSelected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'
import DefaultAlbumCover from '@/components/DefaultAlbumCover.vue'
import PlayPauseButton from '@/components/PlayPauseButton.vue'
import VolumeControl from '@/components/FloatingPlayerControl/VolumeControl.vue'

const playerStore = usePlayerStore()

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const isServerSelected = computed(() => playerStore.selectedServerId !== null)

const progressBar = ref<HTMLInputElement | null>(null)
const currentPosition = ref(0)

playerStore.$onAction(({ name, after }) => {
  if (name === 'playbackFinished') {
    after(() => {
      currentPosition.value = 0
      updateProgressValue()
    })
  }
})

const calculateCurrentPosition = () => {
  if (currentSong.value) {
    const startTime = new Date(currentSong.value.playback_start_time).getTime()
    const now = new Date().getTime()
    const elapsedTime = (now - startTime) / 1000 // Convert to seconds
    return Math.min(elapsedTime, currentSong.value.duration)
  }
  return 0
}

const updateProgressValue = () => {
  if (progressBar.value) {
    if (currentSong.value) {
      progressBar.value.value = currentPosition.value.toString()
      const progress = (currentPosition.value / (currentSong.value.duration / 1000)) * 100
      progressBar.value.style.setProperty('--value', `${progress}%`)
    } else {
      progressBar.value.value = '0'
      progressBar.value.style.setProperty('--value', '0%')
    }
  }
}

const onProgressChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  currentPosition.value = parseInt(target.value)
  updateProgressValue()
}

let progressInterval: number | null = null

const startProgressInterval = () => {
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = setInterval(() => {
    currentPosition.value = calculateCurrentPosition()
    updateProgressValue()
  }, 1000)
}

watch(isPlaying, (newIsPlaying) => {
  if (newIsPlaying) {
    startProgressInterval()
  } else {
    if (progressInterval) clearInterval(progressInterval)
    if (!currentSong.value) {
      currentPosition.value = 0
      updateProgressValue()
    }
  }
})

watch(currentSong, (newSong) => {
  if (newSong) {
    currentPosition.value = calculateCurrentPosition()
    updateProgressValue()
    if (isPlaying.value) {
      startProgressInterval()
    }
  } else {
    currentPosition.value = 0
    updateProgressValue()
    if (progressInterval) clearInterval(progressInterval)
  }
})

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

onMounted(() => {
  progressBar.value = document.querySelector('.progress-bar')

  if (progressBar.value) {
    progressBar.value.addEventListener('input', updateProgressValue)
    updateProgressValue() // Set initial value
  }

  if (isPlaying.value) {
    startProgressInterval()
  }
})

onUnmounted(() => {
  if (progressBar.value) {
    progressBar.value.removeEventListener('input', updateProgressValue)
  }

  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
.floating-player-control {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 900px;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px) saturate(150%);
  -webkit-backdrop-filter: blur(15px) saturate(150%);
  border-radius: 99px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  padding: 10px 10px;
  z-index: 1000;
}

.player-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.control-buttons {
  display: flex;
  gap: 5px;
  margin-left: 30px;
}

.control-btn {
  background-color: transparent;
  color: whitesmoke;
  border: none;
  padding: 5px 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 20px;
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.album-cover-container {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.album-cover-container.rotating {
  animation: rotate 10s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.album-cover {
  height: 100%;
  border-radius: 999px;
  object-fit: cover;
}

.info-section,
.song-info {
  flex-grow: 1;
  min-width: 100px;
  max-width: 400px;
  display: flex;
}

.info-section {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 99px;
  padding: 5px 50px 5px 5px;
  box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.25);
}

.song-info {
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  width: 100%;
}

.song-title,
.song-artist {
  margin: 0;
  padding: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.song-title {
  font-weight: 600;
  font-size: 16px;
}

.song-artist {
  font-size: 12px;
  opacity: 0.7;
  flex-grow: 1;
}

.artist-and-timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timer {
  color: white;
  font-size: 12px;
  text-align: right;
  white-space: nowrap;
}

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

@media (max-width: 900px) {
  .floating-player-control {
    padding: 10px;
  }

  .player-content {
    flex-wrap: wrap;
    gap: 15px;
  }

  .control-buttons {
    order: 2;
    width: 100%;
    justify-content: space-between;
  }

  .control-btn {
    font-size: 12px;
    padding: 8px 12px;
  }

  .progress-bar {
    order: 1;
    width: 100%;
    max-width: none;
  }

  .volume-controls {
    order: 3;
    width: 100%;
    justify-content: flex-end;
  }

  .info-section {
    order: 1;
    width: 100%;
    max-width: none;
  }
}
</style>
