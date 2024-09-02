<template>
  <div class="right-sidebar-container">
    <button v-if="isCollapsed" @click="toggleSidebar" class="toggle-btn">
      <font-awesome-icon :icon="['fas', 'bars']" transform="grow-10" />
    </button>
    <div class="right-sidebar" :class="{ expanded: !isCollapsed }">
      <button @click="toggleSidebar" class="close-btn">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </button>
      <div class="sidebar-content">
        <h2>Queued Songs</h2>
        <ul>
          <li>Song 1</li>
          <li>Song 2</li>
          <li>Song 3</li>
        </ul>
      </div>
    </div>
  </div>
  transform="grow-6"
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isCollapsed = ref(true)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.right-sidebar-container {
  position: fixed;
  top: 60px; /* AppBar height */
  right: 0;
  height: calc(100vh - 60px); /* Subtract AppBar height */
}

.right-sidebar {
  width: 300px;
  background-color: #f0f0f0;
  height: 100%;
  transform: translateX(100%);
  transition: transform 0.3s ease-in-out;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

.right-sidebar.expanded {
  transform: translateX(0);
}

.toggle-btn {
  position: absolute;
  right: 20px;
  top: 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.toggle-btn:hover {
  background-color: #45a049;
}

.toggle-btn .fa-icon {
  font-size: 40px;
}

.close-btn {
  position: absolute;
  left: 10px;
  top: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.sidebar-content {
  padding: 20px;
  padding-top: 40px; /* Add space for the close button */
}
</style>
