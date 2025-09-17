<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="text-center pa-8">
            <v-icon size="64" color="purple" class="mb-4">mdi-key</v-icon>
            <h1 class="text-h3 font-weight-bold text-purple">Alterar Senha</h1>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form @submit.prevent="handleTrocarSenha" ref="senhaForm">
              <v-text-field
                v-model="form.senhaAtual"
                label="Current Password"
                :type="showSenhaAtual ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showSenhaAtual ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showSenhaAtual = !showSenhaAtual"
                variant="solo"
                :rules="senhaAtualRules"
                :error-messages="errors.senhaAtual"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="form.novaSenha"
                label="New Password"
                :type="showNovaSenha ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-plus"
                :append-inner-icon="showNovaSenha ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showNovaSenha = !showNovaSenha"
                variant="solo"
                :rules="novaSenhaRules"
                :error-messages="errors.novaSenha"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="form.confirmarSenha"
                label="Confirm New Password"
                :type="showConfirmarSenha ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="
                  showConfirmarSenha ? 'mdi-eye' : 'mdi-eye-off'
                "
                @click:append-inner="showConfirmarSenha = !showConfirmarSenha"
                variant="solo"
                :rules="confirmarSenhaRules"
                :error-messages="errors.confirmarSenha"
                class="mb-4"
                required
              />

              <v-btn
                type="submit"
                color="purple"
                size="large"
                block
                :loading="loading"
                :disabled="loading"
                class="mt-6"
              >
                <v-icon left>mdi-key-change</v-icon>
                Change Password
              </v-btn>
            </v-form>

            <v-alert
              v-if="successMessage"
              type="success"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="successMessage = ''"
            >
              {{ successMessage }}
            </v-alert>

            <v-alert
              v-if="errorMessage"
              type="error"
              variant="tonal"
              class="mt-4"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";

const authStore = useAuthStore();

const form = reactive({
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
});

const errors = ref({});
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const showSenhaAtual = ref(false);
const showNovaSenha = ref(false);
const showConfirmarSenha = ref(false);

const senhaForm = ref(null);

const senhaAtualRules = [(v) => !!v || "Current password is required"];

const novaSenhaRules = [
  (v) => !!v || "New password is required",
  (v) => (v && v.length >= 6) || "Password must have at least 6 characters",
];

const confirmarSenhaRules = [
  (v) => !!v || "Password confirmation is required",
  (v) => v === form.novaSenha || "Passwords do not match",
];

const handleTrocarSenha = async () => {
  const { valid } = await senhaForm.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const response = await api.post("/change-password", {
      senha_atual: form.senhaAtual,
      nova_senha: form.novaSenha,
      confirmar_senha: form.confirmarSenha,
    });

    const data = response.data;

    if (data.success) {
      successMessage.value = data.message;
      form.senhaAtual = "";
      form.novaSenha = "";
      form.confirmarSenha = "";
    } else {
      errorMessage.value = data.message || "Error changing password";

      if (data.errors) {
        errors.value = data.errors;
      }
    }
  } catch (error) {
    console.error("Request error:", error);
    const errorMessage =
      error.response?.data?.message || "Connection error. Try again.";
    errorMessage.value = errorMessage;
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
