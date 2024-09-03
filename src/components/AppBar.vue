<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/utils/userStore'
import { useSidebarStore } from '@/utils/sidebarStore'

interface User {
  avatar: string
  username: string
}

const userStore = useUserStore()
const sidebarStore = useSidebarStore()

const isLoggedIn = computed(() => !!userStore.user)
const router = useRouter()
const searchQuery = ref('')

const toggleSidebar = () => {
  sidebarStore.toggle()
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    // Implement your search logic here
    // For example, you might want to navigate to a search results page:
    // router.push({ name: 'searchResults', query: { q: searchQuery.value } })
  }
}

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
    <div class="logo-wrapper">
      <button @click="toggleSidebar" class="toggle-sidebar-btn">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </button>
      <img src="../assets/ugoku.png" alt="Ugoku Logo" class="logo" />
      <h1 class="green">Ugoku</h1>
    </div>

    <div v-if="isLoggedIn" class="search-bar">
      <input
        type="text"
        placeholder="Search for playlists, songs, or artists"
        v-model="searchQuery"
        @keyup.enter="performSearch"
      />
      <button @click="performSearch" class="search-button">
        <span class="search-icon">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
        </span>
      </button>
    </div>

    <div class="right-content">
      <template v-if="userStore.user">
        <div class="user-details">
          <img :src="userStore.user.avatar" alt="User Avatar" class="avatar" />
          <span class="username">{{ userStore.user.username }}</span>
        </div>
        <button @click="logout" class="logout">
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" transform="grow-3" />
        </button>
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
  padding: 0 20px;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.logo-wrapper {
  display: flex;
  align-items: center;
}

.toggle-sidebar-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--vt-c-black-mute);
  cursor: pointer;
  margin-right: 20px;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

h1 {
  font-weight: 500;
  font-size: 2rem;
  margin: 0;
}

.search-bar {
  flex-grow: 1;
  max-width: 600px;
  margin: 0 20px;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 20px;
  overflow: hidden;
}

.search-bar input {
  flex-grow: 1;
  height: 40px;
  padding: 0 15px;
  border: none;
  font-size: 14px;
  background-color: transparent;
}

.search-button {
  height: 40px;
  width: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.search-icon {
  color: #4caf50;
  font-size: 18px;
}

.right-content {
  display: flex;
  align-items: center;
}

.user-details {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 30px;
  transition: background-color 0.3s;
}

.user-details:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s;
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
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  border-radius: 4px;
  margin-right: 10px;
  transition: background-color 0.4s;
}

.logout:hover {
  background-color: #d32f2f;
  transition: background-color 0.4s;
}

.login {
  font-size: 16px;
  padding: 8px 16px;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  border-radius: 4px;
  border-width: 1px;
  border-style: solid;
  border-color: #4caf50;
}

@media (max-width: 768px) {
  .app-bar {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 2%;
  }

  .logo-wrapper {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }

  h1 {
    font-size: 1.5rem;
  }

  .search-bar {
    order: 3;
    width: 100%;
    max-width: none;
    margin: 10px 0 0 0;
  }

  .right-content {
    order: 2;
  }
}
</style>
