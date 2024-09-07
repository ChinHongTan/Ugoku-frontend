<template>
  <div class="floating-player-control">
    <div class="player-content">
      <ControlButtons :isServerSelected="isServerSelected" />
      <div class="info-section">
        <AlbumCover :currentSong="currentSong" :isPlaying="isPlaying" />
        <SongInfo
          :currentSong="currentSong"
          :isServerSelected="isServerSelected"
          :currentPosition="currentPosition"
        />
        <ProgressBar
          :currentSong="currentSong"
          :currentPosition="currentPosition"
          :isServerSelected="isServerSelected"
          @progressChange="onProgressChange"
        />
      </div>
      <VolumeControl :isServerSelected="isServerSelected" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'
import ControlButtons from './ControlButtons.vue'
import AlbumCover from './AlbumCover.vue'
import SongInfo from './SongInfo.vue'
import ProgressBar from './ProgressBar.vue'
import VolumeControl from './VolumeControl.vue'
import { calculateCurrentPosition } from '@/utils/playerUtils'

const playerStore = usePlayerStore()

const currentSong = computed(() => playerStore.currentSong)
const isPlaying = computed(() => playerStore.isPlaying)
const isServerSelected = computed(() => playerStore.selectedServerId !== null)

const currentPosition = ref(0)

let progressInterval: ReturnType<typeof setInterval> | null = null

const onProgressChange = (newPosition: number) => {
  currentPosition.value = newPosition
  playerStore.seekTo(newPosition)
}

const startProgressInterval = () => {
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = setInterval(() => {
    if (currentSong.value) {
      currentPosition.value = calculateCurrentPosition(currentSong.value)
    }
  }, 1000)
}

watch(isPlaying, (newIsPlaying) => {
  if (newIsPlaying) {
    startProgressInterval()
  } else {
    if (progressInterval) clearInterval(progressInterval)
    if (!currentSong.value) {
      currentPosition.value = 0
    }
  }
})

watch(currentSong, (newSong) => {
  if (newSong) {
    currentPosition.value = calculateCurrentPosition(newSong)
    if (isPlaying.value) {
      startProgressInterval()
    }
  } else {
    currentPosition.value = 0
    if (progressInterval) clearInterval(progressInterval)
  }
})

onMounted(() => {
  if (isPlaying.value) {
    startProgressInterval()
  }
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style src="./styles.css" scoped></style>
