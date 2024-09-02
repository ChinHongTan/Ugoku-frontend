<template>
  <div class="playlist-section">
    <div class="section-header">
      <h2 class="section-title">Your Playlists</h2>
      <button @click="navigateToAllPlaylists" class="show-all-btn">Show All</button>
    </div>
    <div class="playlist-container">
      <div class="playlist-grid">
        <div
          v-for="playlist in limitedPlaylists"
          :key="playlist.id"
          class="playlist-item"
          @click="navigateToPlaylist(playlist.id)"
        >
          <img :src="playlist.coverImage" :alt="playlist.title" class="playlist-cover" />
          <div class="playlist-info">
            <h3 class="playlist-title">{{ playlist.title }}</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Playlist {
  id: number
  title: string
  coverImage: string
}

const playlists = ref<Playlist[]>([
  { id: 1, title: 'Playlist 1', coverImage: 'https://example.com/summer.jpg' },
  { id: 2, title: 'Playlist 2', coverImage: 'https://example.com/workout.jpg' },
  { id: 3, title: 'Playlist 3', coverImage: 'https://example.com/chill.jpg' },
  { id: 4, title: 'Road Trip', coverImage: 'https://example.com/roadtrip.jpg' },
  { id: 5, title: '90s Nostalgia', coverImage: 'https://example.com/90s.jpg' },
  { id: 6, title: 'Jazz Classics', coverImage: 'https://example.com/jazz.jpg' }
])

const limitedPlaylists = computed(() => playlists.value.slice(0, 3)) // Show only 4 playlists

const navigateToPlaylist = (id: number) => {
  router.push(`/playlist/${id}`)
}

const navigateToAllPlaylists = () => {
  router.push('/all-playlists')
}
</script>

<style scoped>
.playlist-section {
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
}

.show-all-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.playlist-container {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 20px;
}

.playlist-grid {
  display: flex;
  gap: 20px;
  width: max-content;
}

.playlist-item {
  flex: 0 0 auto;
  width: 200px;
  height: 280px;
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  cursor: pointer;
}

.playlist-item:hover {
  transform: translateY(-5px);
}

.playlist-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.playlist-info {
  height: 80px;
  background-color: #4caf50;
  color: white;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.playlist-title {
  font-size: 1.1em;
  font-weight: bold;
  text-align: center;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.playlist-container::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.playlist-container {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
F
