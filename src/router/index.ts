import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AllPlaylists from '../components/AllPlaylists.vue'
import AuthCallbackHandler from '../components/AuthCallbackHandler.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
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

export default router
