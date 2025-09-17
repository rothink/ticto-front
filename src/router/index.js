
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/pages/login.vue'
import Index from '@/pages/index.vue'
import Ponto from '@/pages/ponto.vue'
import TrocarSenha from '@/pages/trocar-senha.vue'
import DefaultLayout from '@/layouts/default.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true,
      title: 'Login'
    }
  },
  {
    path: '/',
    name: 'home',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Home'
    },
    children: [
      {
        path: '',
        component: Index
      }
    ]
  },
  {
    path: '/ponto',
    name: 'ponto',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Ponto'
    },
    children: [
      {
        path: '',
        component: Ponto
      }
    ]
  },
  {
    path: '/trocar-senha',
    name: 'trocar-senha',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Trocar Senha'
    },
    children: [
      {
        path: '',
        component: TrocarSenha
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && localStorage.getItem('user')) {
    authStore.initializeAuth()
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.requiresGuest && authStore.isLoggedIn) {
    if (authStore.user?.role === 'employer') {
      next('/ponto')
    } else {
      next('/')
    }
    return
  }

  if (to.meta.title) {
    document.title = `${to.meta.title} - Ticto`
  }

  next()
})

router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
