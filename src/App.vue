<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppBar from './components/AppBar.vue'
</script>

<template>
  <div class="container">
    <AppBar />
    <header>
    </header>

    <RouterView />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
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