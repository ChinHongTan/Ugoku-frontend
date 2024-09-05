<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useSidebarStore } from '@/utils/sidebarStore'
import { usePlayerStore } from '@/utils/playerStore'
import { EventSourcePolyfill } from 'event-source-polyfill'

const sidebarStore = useSidebarStore()
const playerStore = usePlayerStore()

const sidebarClass = computed(() => ({ 'left-sidebar': true, collapsed: sidebarStore.isCollapsed }))

const isActiveNowOpen = ref(false)
const activeServers = ref<{ id: string; name: string; icon?: string }[]>([])
const selectedServerId = ref<string | null>(null)

const toggleActiveNow = () => {
  isActiveNowOpen.value = !isActiveNowOpen.value
}

let eventSource: EventSourcePolyfill | null = null

const subscribeToActiveServers = () => {
  if (eventSource) return // Prevent multiple connections

  eventSource = new EventSourcePolyfill('http://localhost:8000/play/stream')

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      if (data && data.guilds) {
        activeServers.value = data.guilds.map((guild: any) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon || 'path/to/default/icon.png'
        }))

        // Update the server songs in the player store
        data.guilds.forEach((guild: any) => {
          const currentSong = guild.currentSong
          if (currentSong) {
            playerStore.updateServerSong(guild.id, {
              title: currentSong.title,
              artist: currentSong.artist,
              album: currentSong.album,
              cover: currentSong.cover,
              duration: currentSong.duration
            })
          } else {
            playerStore.updateServerSong(guild.id, null)
          }
        })
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error)
    }
  }

  eventSource.onerror = (error) => {
    console.error('SSE error:', error)
    eventSource?.close()
    eventSource = null
  }
}

const handleServerClick = (serverId: string) => {
  selectedServerId.value = serverId
  playerStore.setSelectedServer(serverId)
}

onMounted(() => {
  subscribeToActiveServers()
  playerStore.clearSelectedServer() // Clear any previously selected server
})

onUnmounted(() => {
  eventSource?.close()
})
</script>

<template>
  <div class="left-sidebar" :class="sidebarClass">
    <div class="active-now-section">
      <h3 @click="toggleActiveNow" class="active-now-header">
        <span class="header-content">
          <font-awesome-icon :icon="['fas', 'circle']" class="status-icon" />
          <span class="header-text" v-if="!sidebarStore.isCollapsed"> Active Now </span>
        </span>
        <font-awesome-icon
          v-if="!sidebarStore.isCollapsed"
          :icon="['fas', 'chevron-right']"
          class="toggle-icon"
          :class="{ rotate: isActiveNowOpen }"
        />
      </h3>
      <TransitionGroup name="list" tag="ul" class="server-list">
        <li
          v-for="(server, index) in activeServers"
          v-if="isActiveNowOpen"
          :key="server.id"
          class="server-card"
          :class="{ selected: selectedServerId === server.id }"
          :style="{ transitionDelay: `${index * 100}ms` }"
          @click="handleServerClick(server.id)"
        >
          <img :src="server.icon" :alt="server.name" class="server-avatar" />
          <span v-if="!sidebarStore.isCollapsed" class="server-name">{{ server.name }}</span>
        </li>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.left-sidebar {
  width: 250px;
  background-color: var(--color-background);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 60px; /* Height of the AppBar */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.2s ease-out;
  overflow-x: hidden;
}

.left-sidebar.collapsed {
  width: 70px;
}

.active-now-section {
  margin-top: 20px;
}

.active-now-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: var(--color-background-soft);
  white-space: nowrap;
}

.header-content {
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 0.6em;
  color: var(--color-green);
  margin: 9px 15px 9px 20px;
}

.header-text {
  transition: opacity 0.2s ease-out;
}

.collapsed .header-text {
  opacity: 0;
}

.collapsed .server-icon {
  margin: 0;
}

.toggle-icon {
  font-size: 15px;
  color: black;
  margin-right: 10px;
  transition: transform 0.2s ease;
}

.toggle-icon.rotate {
  transform: rotate(90deg);
}

.server-list {
  padding: 10px;
  overflow: hidden;
  list-style-type: none;
  margin: 0;
}

.server-card {
  display: flex;
  align-items: center;
  background-color: var(--color-background-mute);
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 50px;
  transition: all 0.2s ease-out;
  cursor: pointer;
}

.server-card:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.server-card.selected {
  background-color: rgba(255, 255, 255, 0.2);
}

.server-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}

.server-name {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.collapsed .server-name {
  display: none;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
