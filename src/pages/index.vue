<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="text-center pa-8">
            <v-icon size="64" color="purple" class="mb-4">mdi-check-circle</v-icon>
            <h1 class="text-h3 font-weight-bold text-purple">Bem-vindo!</h1>
          </v-card-title>

          <v-card-text class="pa-8 text-center">
            <p class="text-h6 mb-4">
              Olá, <strong>{{ authStore.user?.name }}</strong>!
            </p>
            <p class="text-body-1 text-medium-emphasis mb-6">
              Você está logado com sucesso no sistema Ticto.
            </p>

            <v-divider class="my-6"></v-divider>

            <v-row>
              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="pa-4">
                  <v-icon size="48" color="purple" class="mb-2">mdi-account</v-icon>
                  <h3 class="text-h6 mb-2">Perfil</h3>
                  <p class="text-body-2">{{ authStore.user?.email }}</p>
                </v-card>
              </v-col>

              <v-col cols="12" sm="6">
                <v-card variant="outlined" class="pa-4">
                  <v-icon size="48" color="purple" class="mb-2">mdi-shield-check</v-icon>
                  <h3 class="text-h6 mb-2">Autenticado</h3>
                  <p class="text-body-2">Sessão ativa</p>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
