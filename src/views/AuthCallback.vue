<template>
  <div>
    <h2>Authentication Successful</h2>
    <div v-if="userInfo">
      <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="User Avatar" />
      <p>Welcome, {{ userInfo.username }}!</p>
      <p>User ID: {{ userInfo.id }}</p>
    </div>
    <p v-else>Loading user information...</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AuthCallback',
  data() {
    return {
      userInfo: null
    }
  },
  async mounted() {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    // Store user info in Vuex or local storage
    if (token) {
      try {
        const response = await axios.get(`http://localhost:8000/api/user?token=${token}`)
        this.userInfo = response.data.user
        localStorage.setItem('token', token)
        this.$router.push('/')
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    }
  }
}
</script>
