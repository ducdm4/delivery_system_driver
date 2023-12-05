import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginPage from '../views/auth/LoginPage.vue'
import CurrentManifest from '../views/manifest/CurrentManifest.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/manifest',
      name: 'current-manifest',
      component: CurrentManifest
    }
  ]
})

router.beforeEach((to, from) => {
  const token = localStorage.getItem(import.meta.env.VITE_PUBLIC_API_KEY)
  if (!token && to.fullPath !== '/login') {
    return { name: 'login' }
  }
})

export default router
