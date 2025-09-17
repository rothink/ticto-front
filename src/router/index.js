
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Login from '@/pages/login.vue'
import Index from '@/pages/index.vue'
import Timeclock from '@/pages/timeclock.vue'
import ChangePassword from '@/pages/change-password.vue'
import Employees from '@/pages/employees.vue'
import Reports from '@/pages/reports.vue'
import TimeRecords from '@/pages/time-records.vue'
import DefaultLayout from '@/layouts/default.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      requiresGuest: true,
      title: 'Login',
    },
  },
  {
    path: '/',
    name: 'home',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Home',
    },
    children: [
      {
        path: '',
        component: Index,
      },
    ],
  },
  {
    path: '/timeclock',
    name: 'timeclock',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Ponto',
    },
    children: [
      {
        path: '',
        component: Timeclock,
      },
    ],
  },
  {
    path: '/change-password',
    name: 'change-password',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Alterar Senha',
    },
    children: [
      {
        path: '',
        component: ChangePassword,
      },
    ],
  },
  {
    path: '/employees',
    name: 'employees',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Funcionários',
    },
    children: [
      {
        path: '',
        component: Employees,
      },
    ],
  },
  {
    path: '/reports',
    name: 'reports',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Relatórios',
    },
    children: [
      {
        path: '',
        component: Reports,
      },
    ],
  },
  {
    path: '/time-records',
    name: 'time-records',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
      title: 'Pontos Registrados',
    },
    children: [
      {
        path: '',
        component: TimeRecords,
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
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
      next('/timeclock')
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
