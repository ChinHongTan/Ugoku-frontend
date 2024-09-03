<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './utils/userStore'
import { useSidebarStore } from './utils/sidebarStore'
import AppBar from './components/AppBar.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import RightSidebar from './components/RightSidebar.vue'
import FloatingPlayerControl from './components/FloatingPlayerControl.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)

const sidebarStore = useSidebarStore()
const mainContentClass = computed(() => ({
  'sidebar-expanded': !sidebarStore.isCollapsed,
  'sidebar-collapsed': sidebarStore.isCollapsed
}))
</script>

<template>
  <div class="app-container" :class="{ 'logged-in': isLoggedIn }">
    <AppBar />
    <template v-if="isLoggedIn">
      <LeftSidebar />
      <main class="main-content" :class="mainContentClass">
        <RouterView />
      </main>
      <RightSidebar />
      <FloatingPlayerControl />
    </template>
    <template v-else>
      <main class="welcome-content">
        <RouterView />
      </main>
    </template>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.app-container.logged-in {
  flex-direction: row;
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; /* Width of the LeftSidebar */
  margin-right: 300px; /* Width of the RightSidebar */
  margin-top: 60px; /* Height of the AppBar */
  padding: 20px;
  padding-bottom: 100px;
  transition: margin-left 0.3s ease-out;
}

.main-content.sidebar-expanded {
  margin-left: 250px; /* Width of the expanded LeftSidebar */
}

.main-content.sidebar-collapsed {
  margin-left: 60px; /* Width of the collapsed LeftSidebar */
}

.welcome-content {
  flex-grow: 1;
  margin-top: 60px; /* Height of the AppBar */
  padding: 20px;
}

@media (min-width: 1024px) {
  .main-content {
    margin-right: 30px; /* Width of the collapsed RightSidebar */
  }
}
</style>

<script lang="ts">
import axios from 'axios'

export default {
  name: 'AboutView',
  data() {
    return {
      response: null as null | string
    }
  },
  methods: {
    async sendRequest() {
      try {
        const response = await axios.get('http://localhost:8000/')
        this.response = response.data
      } catch (error) {
        console.error(error)
        this.response = 'Error occurred while fetching data'
      }
    },
    async login() {
      try {
        const response = await axios.get('http://localhost:8000/auth/discord')
        this.response = response.data
      } catch (error) {
        console.error(error)
        this.response = 'Error occurred while fetching data'
      }
    }
  }
}
</script>
