import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
//@ts-ignore
import LoginPage from 'delivery-system-service/LoginPage'
import CurrentManifest from '../views/manifest/CurrentManifest.vue'
import MoreMenu from '../views/menu/MoreMenu.vue'
import MainProfile from '../views/user/MainProfile.vue'

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
    },
    {
      path: '/more',
      name: 'more-menu',
      component: MoreMenu
    },
    {
      path: '/account',
      name: 'account-page',
      component: MainProfile
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
