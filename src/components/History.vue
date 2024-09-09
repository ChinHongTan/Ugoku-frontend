<template>
  <div class="history">
    <h3>Recently Played</h3>
    <ul v-if="history.length > 0">
      <li v-for="(song, index) in history" :key="index" class="history-item">
        <img :src="song.cover" :alt="song.title" class="history-item-cover" />
        <div class="history-item-details">
          <p class="history-item-title">{{ song.title }}</p>
          <p class="history-item-artist">{{ song.artist }}</p>
        </div>
      </li>
    </ul>
    <p v-else class="no-history">No recent songs</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/utils/playerStore'

const playerStore = usePlayerStore()
const history = computed(() => playerStore.history)
</script>

<style scoped>
.history {
  padding: 20px;
}

h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 15px;
}

.history-item {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  transition: background-color 0.2s ease;
}

.history-item:hover {
  background-color: #f0f0f0;
}

.history-item-cover {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
}

.history-item-details {
  flex-grow: 1;
}

.history-item-title {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.history-item-artist {
  font-size: 0.9em;
  color: #666;
}

ul {
  list-style-type: none;
  padding: 0;
}

.no-history {
  color: #666;
  font-style: italic;
}
</style>
