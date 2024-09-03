import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WelcomePage from '../views/WelcomePage.vue'
import AllPlaylists from '../components/AllPlaylists.vue'
import AuthCallbackHandler from '../components/AuthCallbackHandler.vue'

import { useUserStore } from '@/utils/userStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomePage
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    // {
    // path: '/about',
    // name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import('../views/AboutView.vue')
    // },
    {
      path: '/all-playlists',
      name: 'allPlaylists',
      component: AllPlaylists
    },
    {
      path: '/auth-callback',
      name: 'AuthCallback',
      component: AuthCallbackHandler
    }
  ]
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (to.name === 'AuthCallback') {
    // Don't redirect for the auth callback route
    next()
  } else if (to.path !== '/' && !userStore.isLoggedIn) {
    // Redirect to login page if not authenticated
    next('/')
  } else {
    next()
  }
})

export default router
