<template>
  <div class="song-info">
    <p class="song-title">
      {{ songTitle }}
    </p>
    <div class="artist-and-timer">
      <p class="song-artist">
        {{ songArtist }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Song {
  title: string
  artist: string
}

const props = defineProps<{
  currentSong: Song | null
  isServerSelected: boolean
}>()

const songTitle = computed(() => {
  if (!props.isServerSelected) return 'Select a server'
  return props.currentSong ? props.currentSong.title : 'Not playing'
})

const songArtist = computed(() => {
  if (!props.isServerSelected) return 'to see player controls'
  return props.currentSong ? props.currentSong.artist : '-'
})
</script>

<style scoped>
.song-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
  width: 100%;
  min-width: 0; /* Allows text to truncate properly */
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
}

.artist-and-timer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
  .song-title {
    font-size: 14px;
  }

  .song-artist {
    font-size: 10px;
  }
}
</style>
