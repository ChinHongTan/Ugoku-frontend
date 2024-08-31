<script setup lang="ts">
import { onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '../utils/userStore'

interface User {
  avatar: string
  username: string
}

const userStore = useUserStore()
const router = useRouter()

const logout = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token found')
      return
    }
    // Send POST request to server to logout
    await axios.post(
      'http://localhost:8000/auth/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Clear user data and token from local storage
    userStore.clearUser()
    localStorage.removeItem('token')

    // redirect to home page
    router.push('/')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token && !userStore.user) {
    try {
      const response = await axios.get(`http://localhost:8000/api/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      userStore.setUser(response.data.user)
    } catch (error) {
      console.error('Error fetching user info:', error)
      localStorage.removeItem('token')
      // Remove invalid token
    }
  }
})
</script>

<template>
  <div class="app-bar">
    <h1 class="green">Ugoku</h1>
    <div class="right-content">
      <template v-if="userStore.user">
        <img :src="userStore.user.avatar" alt="User Avatar" class="avatar" />
        <span class="username">{{ userStore.user.username }}</span>
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
  width: 100%;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  padding: 0 2%;
  box-sizing: border-box;
}

h1 {
  font-weight: 500;
  font-size: 2rem;
  margin: 0;
}

.right-content {
  display: flex;
  align-items: center;
  height: 100%;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  margin-right: 10px;
  font-size: 18px;
  font-weight: 500;
}

.logout {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0px 10px;
  cursor: pointer;
  font-size: 18px;
  height: 100%;
}

.login {
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
