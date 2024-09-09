<template>
  <div class="queue">
    <div v-if="currentSong" class="current-song">
      <h3>Now Playing</h3>
      <div class="song-info">
        <img :src="currentSong.cover" :alt="currentSong.title" class="song-cover" />
        <div class="song-details">
          <p class="song-title">{{ currentSong.title }}</p>
          <p class="song-artist">{{ currentSong.artist }}</p>
        </div>
      </div>
    </div>
    <div class="queue-list">
      <h3>Up Next</h3>
      <ul>
        <li v-for="(song, index) in queue" :key="index" class="queue-item">
          <img :src="song.cover" :alt="song.title" class="queue-item-cover" />
          <div class="queue-item-details">
            <p class="queue-item-title">{{ song.title }}</p>
            <p class="queue-item-artist">{{ song.artist }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'

const playerStore = usePlayerStore()

const currentSong = computed(() => playerStore.currentSong)
const queue = computed(() => playerStore.queue)
</script>

<style scoped>
.queue {
  padding: 20px;
}

.current-song,
.queue-list {
  margin-bottom: 30px;
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.song-info,
.queue-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  transition: background-color 0.2s ease;
}

.song-info:hover,
.queue-item:hover {
  background-color: #f0f0f0;
}

.song-cover,
.queue-item-cover {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
}

.song-details,
.queue-item-details {
  flex-grow: 1;
}

.song-title,
.queue-item-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.song-artist,
.queue-item-artist {
  font-size: 0.9em;
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}

.queue-item {
  margin-bottom: 10px;
}
</style>
