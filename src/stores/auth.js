import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api'

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
      const response = await api.post('/login', credentials)
      const data = response.data

      if (data.success) {
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
      const errorMessage = error.response?.data?.message || 'Erro de conexão. Tente novamente.'
      return { success: false, error: errorMessage }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await api.post('/logout')
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
