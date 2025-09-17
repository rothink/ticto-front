import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)

  const isLoggedIn = computed(() => isAuthenticated.value && user.value !== null)
  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = !!userData
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await fetch('http://localhost/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setUser(data.user)
        if (data.token) {
          localStorage.setItem('token', data.token)
        }
        return { success: true, data }
      } else {
        return { success: false, error: data.message || 'Erro ao fazer login' }
      }
    } catch (error) {
      console.error('Erro na requisição de login:', error)
      return { success: false, error: 'Erro de conexão. Tente novamente.' }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('token')
      await fetch('http://localhost/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erro na requisição de logout:', error)
    } finally {
      setUser(null)
      localStorage.removeItem('token')
      loading.value = false
    }
  }

  const initializeAuth = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error)
        localStorage.removeItem('user')
      }
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    isLoggedIn,
    setUser,
    login,
    logout,
    initializeAuth
  }
})
