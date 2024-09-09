import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type UserData = any // I don't think this is important, if it is I will fill in the details later

export const useUserStore = defineStore('user', () => {
  const user = ref<UserData | null>(null)

  function setUser(userData: UserData) {
    user.value = userData
  }

  function clearUser() {
    user.value = null
  }

  const isLoggedIn = computed(() => !!user.value)

  return { user, setUser, clearUser, isLoggedIn }
})
