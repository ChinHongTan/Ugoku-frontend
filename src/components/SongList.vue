<template>
  <div class="song-list">
    <h3>All Songs</h3>
    <ul>
      <li v-for="(song, index) in allSongs" :key="index" class="song-item">
        <img :src="song.cover" :alt="song.title" class="song-item-cover" />
        <div class="song-item-details">
          <p class="song-item-title">{{ song.title }}</p>
          <p class="song-item-artist">{{ song.artist }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/store/playerStore'

const playerStore = usePlayerStore()

const allSongs = computed(() => {
  // This is a placeholder. You'll need to implement a way to get all songs.
  // For now, we'll just combine queue and history
  return [...playerStore.queue, ...playerStore.history]
})
</script>

<style scoped>
.song-list {
  padding: 20px;
}

.song-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.song-item-cover {
  width: 40px;
  height: 40px;
  object-fit: cover;
  margin-right: 10px;
}

.song-item-details {
  flex-grow: 1;
}

.song-item-title {
  font-weight: bold;
}

.song-item-artist {
  font-size: 0.9em;
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>
