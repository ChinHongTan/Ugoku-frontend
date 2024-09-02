<template>
  <div class="all-playlists">
    <h1>All Playlists</h1>
    <div class="playlist-grid">
      <div
        class="playlist-column"
        v-for="(column, columnIndex) in playlistColumns"
        :key="columnIndex"
      >
        <div
          v-for="playlist in column"
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
  { id: 4, title: 'Playlist 4', coverImage: 'https://example.com/roadtrip.jpg' },
  { id: 5, title: 'Playlist 5', coverImage: 'https://example.com/90s.jpg' },
  { id: 6, title: 'Playlist 6', coverImage: 'https://example.com/jazz.jpg' },
  { id: 7, title: 'Rock Anthems', coverImage: 'https://example.com/rock.jpg' },
  { id: 8, title: 'EDM Party', coverImage: 'https://example.com/edm.jpg' },
  { id: 9, title: 'Classical Melodies', coverImage: 'https://example.com/classical.jpg' }
  // Add more playlists as needed
])

const playlistColumns = computed(() => {
  const columns = []
  for (let i = 0; i < playlists.value.length; i += 3) {
    columns.push(playlists.value.slice(i, i + 3))
  }
  return columns
})

const navigateToPlaylist = (id: number) => {
  router.push(`/playlist/${id}`)
}
</script>

<style scoped>
.all-playlists {
  padding: 20px;
}

.playlist-grid {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 20px; /* Space for potential scrollbar */
}

.playlist-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.playlist-item {
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
  background-color: #4caf50; /* Replace with your primary color */
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
.playlist-grid::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.playlist-grid {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
