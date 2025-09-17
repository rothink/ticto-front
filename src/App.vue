<template>
  <v-app>
    <template v-if="authStore.isLoggedIn">
      <router-view />
    </template>
    <template v-else>
      <router-view />
    </template>
  </v-app>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})
</script>
