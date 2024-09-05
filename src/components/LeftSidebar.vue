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

const toggleActiveNow = () => {
  isActiveNowOpen.value = !isActiveNowOpen.value

  // Subscribe to active servers if the section is open
  // Unsubscribe and clear the array if the section is closed
  if (isActiveNowOpen.value) {
    subscribeToActiveServers()
  } else {
    eventSource?.close()
    activeServers.value = []
  }
}

let eventSource: EventSourcePolyfill | null = null

const subscribeToActiveServers = () => {
  eventSource = new EventSourcePolyfill('http://localhost:8000/play/stream')
  console.log('EventSource created:', eventSource)

  eventSource.onopen = (event) => {
    console.log('SSE connection opened:', event)
  }

  eventSource.onmessage = (event) => {
    console.log('Received SSE message:', event)
    console.log('Event data:', event.data)
    try {
      const data = JSON.parse(event.data)
      console.log('Parsed SSE data:', data)
      if (data && data.guilds) {
        console.log('Updating activeServers with:', data.guilds)
        activeServers.value = data.guilds.map((guild: any) => ({
          id: guild.id,
          name: guild.name,
          icon: guild.icon || 'path/to/default/icon.png'
        }))
        console.log('Updated activeServers:', activeServers.value)

        // Update the current song in the player store
        let currentSong = data.guilds[0]?.currentSong
        if (currentSong) {
          playerStore.updateCurrentSong({
            title: currentSong.title,
            artist: currentSong.artist,
            album: currentSong.album,
            cover: currentSong.cover,
            duration: currentSong.duration
          })
        } else {
          playerStore.updateCurrentSong({
            title: 'Not playing',
            artist: '-',
            album: '-',
            cover: '',
            duration: 0
          })
        }
      } else {
        console.log('Received data does not contain guilds:', data)
      }
    } catch (error) {
      console.error('Error parsing SSE data:', error)
      console.log('Raw event data:', event.data)
    }
  }

  eventSource.onerror = () => {
    console.error('SSE error:', error)
    eventSource?.close()
  }

  console.log('Event handlers attached:', {
    onopen: eventSource.onopen,
    onmessage: eventSource.onmessage,
    onerror: eventSource.onerror
  })
}

onMounted(() => {
  console.log('Component mounted, subscribing to active servers...')
  subscribeToActiveServers()
})

onUnmounted(() => {
  eventSource?.close()
})

// Transition hooks
const beforeEnter = (el: Element) => {
  console.log('Before enter triggered')
  el.style.opacity = '0'
  el.style.height = '0'
}

const enter = (el: Element, done: () => void) => {
  console.log('Enter animation triggered')
  const delay = el.dataset.index ? parseInt(el.dataset.index) * 100 : 0
  setTimeout(() => {
    el.style.opacity = '1'
    el.style.height = 'auto'
  }, delay)
  setTimeout(done, delay + 300)
}

const leave = (el: Element, done: () => void) => {
  console.log('Leave animation triggered')
  const delay = el.dataset.index
    ? (activeServers.value.length - 1 - parseInt(el.dataset.index)) * 100
    : 0
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.height = '0'
  }, delay)
  setTimeout(done, delay + 300)
}
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
      <TransitionGroup
        v-if="!sidebarStore.isCollapsed"
        name="list"
        tag="ul"
        class="server-list"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <li
          v-for="(server, index) in activeServers"
          :key="server.id"
          class="server-card"
          :data-index="index"
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
  border-radius: 4px;
  transition: all 0.2s ease-out;
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

.collapsed .server-card {
  justify-content: center;
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

.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
