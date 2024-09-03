<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

import { useSidebarStore } from '@/utils/sidebarStore'
const sidebarStore = useSidebarStore()

const sidebarClass = computed(() => ({ 'left-sidebar': true, collapsed: sidebarStore.isCollapsed }))

const isActiveNowOpen = ref(false)
const activeServers = ref<{ id: string; name: string }[]>([])

const toggleActiveNow = () => {
  isActiveNowOpen.value = !isActiveNowOpen.value
}

const updateActiveServers = (servers: { id: string; name: string }[]) => {
  activeServers.value = servers
}

onMounted(() => {
  updateActiveServers([
    { id: '1', name: 'Server A' },
    { id: '2', name: 'Server B' },
    { id: '3', name: 'Server C' }
  ])
})

// Transition hooks
const beforeEnter = (el: HTMLElement) => {
  el.style.opacity = '0'
  el.style.height = '0'
}

const enter = (el: HTMLElement, done: () => void) => {
  const delay = el.dataset.index ? parseInt(el.dataset.index) * 100 : 0
  setTimeout(() => {
    el.style.opacity = '1'
    el.style.height = 'auto'
  }, delay)
  setTimeout(done, delay + 300)
}

const leave = (el: HTMLElement, done: () => void) => {
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
        tag="div"
        class="server-list"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
      >
        <div
          v-if="isActiveNowOpen"
          v-for="(server, index) in activeServers"
          :key="server.id"
          class="server-card"
          :data-index="index"
        >
          {{ server.name }}
        </div>
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
}

.server-card {
  background-color: var(--color-background-mute);
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: all 0.2s ease-out;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  height: 0;
  transform: translateY(-30px);
}
</style>
