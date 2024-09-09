<template>
  <div class="right-sidebar-container">
    <div class="right-sidebar" :class="{ expanded: isOpen }">
      <button @click="toggleSidebar" class="close-btn">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>
      <div class="sidebar-content">
        <div class="tabs">
          <div class="tab-highlight" :class="{ 'move-right': activeTab === 'history' }"></div>
          <button @click="setActiveTab('queue')" :class="{ active: activeTab === 'queue' }">
            Queue
          </button>
          <button @click="setActiveTab('history')" :class="{ active: activeTab === 'history' }">
            History
          </button>
        </div>
        <div class="tab-content">
          <transition name="fade" mode="out-in">
            <Queue v-if="activeTab === 'queue'" />
            <History v-else-if="activeTab === 'history'" />
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { usePlayerStore } from '@/store/playerStore'
import Queue from '@/components/RightSideBar/Queue.vue'
import History from '@/components/RightSideBar/History.vue'

const playerStore = usePlayerStore()

const isOpen = computed(() => playerStore.isQueueOpen)
const activeTab = ref('queue')

const toggleSidebar = () => {
  playerStore.toggleQueue()
}

const setActiveTab = (tab: 'queue' | 'history') => {
  activeTab.value = tab
}
</script>

<style scoped>
.right-sidebar-container {
  position: fixed;
  top: 60px; /* AppBar height */
  right: 0;
  height: calc(100vh - 60px); /* Subtract AppBar height */
  z-index: 1000;
}

.right-sidebar {
  width: 300px;
  background-color: #ffffff;
  height: 100%;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.right-sidebar.expanded {
  transform: translateX(0);
}

.close-btn {
  position: absolute;
  left: 10px;
  top: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: #ff5252;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  padding-top: 50px; /* Add space for the close button */
}

.tabs {
  display: flex;
  position: relative;
  height: 40px;
  margin-bottom: 20px;
  background-color: #f5f5f5;
  border-radius: 20px;
  overflow: hidden;
}

.tab-highlight {
  position: absolute;
  width: 50%;
  height: 100%;
  background-color: #4caf50;
  border-radius: 20px;
  transition: transform 0.3s ease;
}

.tab-highlight.move-right {
  transform: translateX(100%);
}

.tabs button {
  flex: 1;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: color 0.3s ease;
  color: #666;
  z-index: 1;
}

.tabs button.active {
  color: white;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
}

/* Custom scrollbar */
.tab-content::-webkit-scrollbar {
  width: 8px;
}

.tab-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Transition for tab content */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
