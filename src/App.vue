<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import RightSidebar from './components/RightSidebar.vue'
import FloatingPlayerControl from './components/FloatingPlayerControl.vue'
</script>

<template>
  <div class="app-container">
    <AppBar />
    <LeftSidebar />
    <main class="main-content">
      <RouterView />
    </main>
    <RightSidebar />
    <FloatingPlayerControl />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex-grow: 1;
  margin-left: 250px; /* Width of the LeftSidebar */
  margin-right: 300px; /* Width of the RightSidebar */
  margin-top: 60px; /* Height of the AppBar */
  padding: 20px;
  padding-bottom: 100px;
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
