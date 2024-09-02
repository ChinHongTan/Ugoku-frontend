<template>
  <div class="floating-player-control">
    <div class="player-content">
      <div class="control-buttons">
        <button class="control-btn shuffle-btn">
          <font-awesome-icon :icon="['fas', 'shuffle']" />
        </button>
        <button class="control-btn previous-btn">
          <font-awesome-icon :icon="['fas', 'backward']" />
        </button>
        <button class="control-btn play-pause-btn">
          <font-awesome-icon :icon="['fas', 'play']" />
        </button>
        <button class="control-btn next-btn">
          <font-awesome-icon :icon="['fas', 'forward']" />
        </button>
        <button class="control-btn repeat-btn">
          <font-awesome-icon :icon="['fas', 'carrot']" />
        </button>
      </div>
      <div class="info-section">
        <img class="album-cover" src="../assets/nanahira.jpg" width="40px" height="40px" />
        <div class="song-info">
          <p class="song-title">Heeartbeeat Oveerheeat!!!!</p>
          <p class="song-artist">Camellia, Nanahira</p>
          <input type="range" class="progress-bar" min="0" max="100" value="0" ref="progressBar" />
        </div>
      </div>
      <div class="volume-controls">
        <i class="volume-icon">
          <font-awesome-icon :icon="['fas', 'volume-low']" />
        </i>
        <input
          type="range"
          class="volume-slider"
          min="0"
          max="100"
          value="100"
          ref="volumeSlider"
        />
        <i class="volume-icon">
          <font-awesome-icon :icon="['fas', 'volume-high']" />
        </i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const volumeSlider = ref<HTMLInputElement | null>(null)
const progressBar = ref<HTMLInputElement | null>(null)

const updateSliderValue = () => {
  if (volumeSlider.value) {
    const volume = (parseInt(volumeSlider.value.value) / parseInt(volumeSlider.value.max)) * 100
    volumeSlider.value.style.setProperty('--value', `${volume}%`)
  }
}

const updateProgressValue = () => {
  if (progressBar.value) {
    const progress = (parseInt(progressBar.value.value) / parseInt(progressBar.value.max)) * 100
    progressBar.value.style.setProperty('--value', `${progress}%`)
  }
}

onMounted(() => {
  volumeSlider.value = document.querySelector('.volume-slider')
  progressBar.value = document.querySelector('.progress-bar')

  if (volumeSlider.value) {
    volumeSlider.value.addEventListener('input', updateSliderValue)
    updateSliderValue() // Set initial value
  }

  if (progressBar.value) {
    progressBar.value.addEventListener('input', updateProgressValue)
    updateProgressValue() // Set initial value
  }
})

onUnmounted(() => {
  if (volumeSlider.value) {
    volumeSlider.value.removeEventListener('input', updateSliderValue)
  }

  if (progressBar.value) {
    progressBar.value.removeEventListener('input', updateProgressValue)
  }
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
  -webkit-backdrop-filter: blur(10px) saturate(150%);
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

.play-pause-btn {
  color: white;
  font-size: 30px;
  padding: 5px 5px;
}

.album-cover {
  border-radius: 50%;
  margin-right: 15px;
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
  font-weight: bold;
  font-size: 18px;
}

.song-artist {
  font-size: 12px;
  opacity: 0.7;
}

.volume-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 30px;
}

.volume-slider {
  width: 80px;
}

.volume-icon {
  font-size: 14px;
  color: white;
}

.progress-bar {
  margin-top: 5px;
}

.progress-bar,
.volume-slider {
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
.progress-bar:active,
.volume-slider:hover,
.volume-slider:active {
  height: 5px;
  background: white;
}

.progress-bar::-webkit-slider-thumb,
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-bar::-moz-range-thumb,
.volume-slider::-moz-range-thumb {
  width: 0;
  height: 0;
  background: transparent;
  border: none;
  transition: all 0.2s ease;
}

.progress-bar:hover::-moz-range-thumb,
.volume-slider:hover::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
}

.progress-bar:hover::-webkit-slider-thumb,
.progress-bar:active::-webkit-slider-thumb,
.volume-slider:hover::-webkit-slider-thumb,
.volume-slider:active::-webkit-slider-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: white;
  position: relative;
  z-index: 2;
}

.progress-bar::-moz-range-progress,
.volume-slider::-moz-range-progress {
  background-color: #4caf50;
  height: 5px;
  border-radius: 5px;
}

.progress-bar:hover::-moz-range-progress {
  height: 8px;
}

/* For WebKit browsers, create a filled effect */
.info-section .progress-bar::before,
.volume-slider::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: var(--value, 0%);
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
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

  .play-pause-btn {
    font-size: 14px;
    padding: 8px 15px;
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
