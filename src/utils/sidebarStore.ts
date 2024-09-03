import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const isCollapsed = ref(true)

  function toggle() {
    isCollapsed.value = !isCollapsed.value
  }

  return { isCollapsed, toggle }
})
