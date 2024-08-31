<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const user = ref(null)

const logout = async () => {
  user.value = null
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const response = await axios.get(`http://localhost:8000/api/user?token=${token}`)
      user.value = response.data.user
    } catch (error) {
      console.error('Error fetching user info:', error)
    }
  }
})
</script>

<template>
  <div class="app-bar">
    <h1 class="green left-align">Ugoku</h1>
    <div class="right-align">
      <template v-if="user">
        <img :src="user.avatar" alt="User Avatar" class="avatar" />
        <span class="username">{{ user?.username }}</span>
        <button @click="logout" class="logout">Logout</button>
      </template>
      <a
        v-else
        class="login right-align green"
        href="https://discord.com/oauth2/authorize?client_id=958201832528838706&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fauth%2Fdiscord&scope=identify+guilds"
      >
        Login with discord
      </a>
    </div>
  </div>
</template>

<style scoped>
.app-bar {
  background-color: white;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  height: 60px;
}

.left-align {
  margin-right: auto;
  padding-left: 2%;
}

.right-align {
  margin-left: auto;
  padding-right: 2%;
}

.login {
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

h1 {
  font-weight: 500;
  font-size: 2rem;
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  margin-right: 10px;
}

.logout {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
