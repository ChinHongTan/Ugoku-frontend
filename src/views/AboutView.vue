<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button class="test-button" @click="sendRequest">Test</button>
    <p v-if="response">Response: {{ response }}</p>
    <a
      class="login"
      href="https://discord.com/oauth2/authorize?client_id=958201832528838706&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord&scope=identify+guilds"
    >
      Login with discord
    </a>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}

.test-button {
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
}

.login {
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
}
</style>

<script>
import axios from 'axios'

export default {
  name: 'About',
  data() {
    return {
      response: null
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
