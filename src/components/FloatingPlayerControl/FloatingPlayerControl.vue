<template>
  <div class="floating-player-control">
    <div class="player-content">
      <ControlButtons :is-server-selected="isServerSelected" />
      <div class="info-section">
        <div class="album-cover-container" :class="{ rotating: isPlaying }">
          <img
            v-if="currentSong?.cover"
            class="album-cover"
            :src="currentSong.cover"
            width="40"
            height="40"
            alt="Album cover"
          />
          <DefaultAlbumCover v-else />
        </div>
        <div class="song-info">
          <p class="song-title">{{ songTitle }}</p>
          <div class="artist-and-timer">
            <p class="song-artist">{{ songArtist }}</p>
            <div class="timer">
              {{ formatTime(currentPosition) }} / {{ formatTime(formattedDuration) }}
            </div>
          </div>
          <ProgressBar
            :current-position="currentPosition"
            :duration="formattedDuration"
            :is-playing="isPlaying"
            :disabled="!isServerSelected || !currentSong"
            @update:position="onProgressDrag"
            @seek="onProgressRelease"
            @dragStart="onDragStart"
            @dragEnd="onDragEnd"
          />
        </div>
      </div>
      <div class="right-controls">
        <QueueToggleButton />
        <VolumeControl :is-server-selected="isServerSelected" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/store/playerStore'
import { formatTime } from '@/utils/timeUtils'
import DefaultAlbumCover from '@/components/FloatingPlayerControl/DefaultAlbumCover.vue'
import ControlButtons from '@/components/FloatingPlayerControl/ControlButtons.vue'
import VolumeControl from '@/components/FloatingPlayerControl/VolumeControl.vue'
import ProgressBar from '@/components/FloatingPlayerControl/ProgressBar.vue'
import QueueToggleButton from '@/components/FloatingPlayerControl/QueueToggleButton.vue'

interface Song {
  title: string
  artist: string
  cover?: string
  duration: number
  playback_start_time: string
}

const playerStore = usePlayerStore()

const currentSong = computed<Song | null>(() => playerStore.currentSong)
const isPlaying = computed<boolean>(() => playerStore.isPlaying)
const isServerSelected = computed<boolean>(() => playerStore.selectedServerId !== null)

const currentPosition = ref(0)
const progressInterval = ref<number | null>(null)

const isDragging = ref(false)
let draggedPosition = ref(0)

const formattedDuration = computed(() =>
  currentSong.value ? currentSong.value.duration / 1000 : 0
)

const songTitle = computed(() =>
  isServerSelected.value ? (currentSong.value?.title ?? 'Not playing') : 'Select a server'
)

const songArtist = computed(() =>
  isServerSelected.value ? (currentSong.value?.artist ?? '-') : 'to see player controls'
)

playerStore.$onAction(({ name, after }) => {
  if (name === 'playbackFinished') {
    after(() => {
      currentPosition.value = 0
    })
  }
})

const calculateCurrentPosition = (): number => {
  if (currentSong.value && currentSong.value.playback_start_time) {
    const startTime = new Date(currentSong.value.playback_start_time).getTime()
    const now = Date.now()
    const elapsedTime = (now - startTime) / 1000 // Convert to seconds
    return Math.min(elapsedTime, currentSong.value.duration / 1000)
  }
  return 0
}

const onProgressDrag = (position: number) => {
  if (isDragging.value) {
    draggedPosition.value = position
  }
}

const onProgressRelease = (position: number) => {
  currentPosition.value = position
  playerStore.seekToPosition(position)
  if (isPlaying.value) {
    startProgressInterval()
  }
}

const onDragStart = () => {
  isDragging.value = true
  stopProgressInterval()
}

const onDragEnd = () => {
  isDragging.value = false
  currentPosition.value = draggedPosition.value
  if (isPlaying.value) {
    startProgressInterval()
  }
}

const startProgressInterval = () => {
  stopProgressInterval()
  progressInterval.value = setInterval(() => {
    if (!isDragging.value) {
      currentPosition.value = calculateCurrentPosition()
    }
  }, 1000) // Update every second
}

const stopProgressInterval = () => {
  if (progressInterval.value !== null) {
    cancelAnimationFrame(progressInterval.value)
    progressInterval.value = null
  }
}

watch(isPlaying, (newIsPlaying) => {
  if (newIsPlaying) {
    startProgressInterval()
  } else {
    stopProgressInterval()
    if (!currentSong.value) {
      currentPosition.value = 0
    }
  }
})

watch(currentSong, (newSong) => {
  if (newSong) {
    currentPosition.value = calculateCurrentPosition()
    if (isPlaying.value) {
      startProgressInterval()
    }
  } else {
    currentPosition.value = 0
    stopProgressInterval()
  }
})

onMounted(() => {
  if (isPlaying.value) {
    startProgressInterval()
  }
})

onUnmounted(() => {
  stopProgressInterval()
})
</script>

<style scoped>
.floating-player-control {
  --player-bg-color: rgba(0, 0, 0, 0.25);
  --player-border-radius: 99px;
  --player-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  --info-section-bg-color: rgba(0, 0, 0, 0.2);
  --info-section-box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.25);
  --text-color: white;

  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  max-width: 900px;
  background-color: var(--player-bg-color);
  backdrop-filter: blur(15px) saturate(180%);
  -webkit-backdrop-filter: blur(15px) saturate(180%);
  border-radius: var(--player-border-radius);
  box-shadow: var(--player-box-shadow);
  padding: 10px;
  z-index: 1000;
}

.player-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
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
  border-radius: 50%;
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
  background-color: var(--info-section-bg-color);
  border-radius: var(--player-border-radius);
  padding: 5px 50px 5px 5px;
  box-shadow: var(--info-section-box-shadow);
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
  color: var(--text-color);
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
  color: var(--text-color);
  font-size: 12px;
  text-align: right;
  white-space: nowrap;
}

.right-controls {
  display: flex;
  align-items: center;
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

  .right-controls {
    order: 3;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
