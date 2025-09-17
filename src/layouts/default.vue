<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="authStore.user?.name"
        :subtitle="authStore.user?.email"
        nav
      >
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <template v-if="authStore.user?.role === 'employer'">
          <v-list-item
            prepend-icon="mdi-clock-outline"
            title="Ponto"
            value="ponto"
            to="/ponto"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-key"
            title="Trocar Senha"
            value="trocar-senha"
            to="/trocar-senha"
          ></v-list-item>
        </template>

        <template v-else-if="authStore.user?.role === 'admin'">
          <v-list-item
            prepend-icon="mdi-home"
            title="Home"
            value="home"
            to="/"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-account-multiple"
            title="Usuários"
            value="users"
          ></v-list-item>

          <v-list-item
            prepend-icon="mdi-cog"
            title="Configurações"
            value="settings"
          ></v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Ticto</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-avatar
            v-bind="props"
            color="purple"
            size="40"
            class="cursor-pointer"
          >
            <v-img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              alt="Avatar"
            ></v-img>
            <span v-else class="text-white font-weight-bold">
              {{ getInitials(authStore.user?.name) }}
            </span>
          </v-avatar>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title>
              {{ authStore.user?.name }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ authStore.user?.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider></v-divider>

          <v-list-item @click="handleLogout">
            <template v-slot:prepend>
              <v-icon>mdi-logout</v-icon>
            </template>
            <v-list-item-title>Sair</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const drawer = ref(true)
const rail = ref(false)

const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
