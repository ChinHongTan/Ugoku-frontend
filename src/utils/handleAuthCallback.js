import axios from 'axios'
import router from '../router'
import { useUserStore } from '../utils/userStore'

export async function handleAuthCallback() {
  const userStore = useUserStore()
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')

  if (token) {
    try {
      const response = await axios.get('http://localhost:8000/api/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      localStorage.setItem('token', token)
      userStore.setUser(response.data.user)

      // Redirect to home page or dashboard
      router.push('/')
    } catch (error) {
      console.error('Error fetching user info:', error)
      // Handle error by redirecting to an error page
      router.push('/login-error')
    }
  } else {
    console.error('No token found in URL')
    router.push('/login-error')
  }
}
