<template>
  <div class="album-cover-container" :class="{ rotating: isPlaying }">
    <img
      v-if="currentSong && currentSong.cover"
      class="album-cover"
      :src="currentSong.cover"
      alt="Album Cover"
    />
    <DefaultAlbumCover v-else />
  </div>
</template>

<script setup lang="ts">
import DefaultAlbumCover from './DefaultAlbumCover.vue'

interface Song {
  cover?: string
}

defineProps<{
  currentSong: Song | null
  isPlaying: boolean
}>()
</script>

<style scoped>
.album-cover-container {
  width: 40px;
  height: 40px;
  margin-right: 15px;
  overflow: hidden;
  border-radius: 50%;
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
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 600px) {
  .album-cover-container {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }
}
</style>
