<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="text-center pa-8">
            <v-icon size="64" color="purple" class="mb-4">mdi-key</v-icon>
            <h1 class="text-h3 font-weight-bold text-purple">Trocar Senha</h1>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form @submit.prevent="handleTrocarSenha" ref="senhaForm">
              <v-text-field
                v-model="form.senhaAtual"
                label="Senha Atual"
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
                label="Nova Senha"
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
                label="Confirmar Nova Senha"
                :type="showConfirmarSenha ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmarSenha ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmarSenha = !showConfirmarSenha"
                variant="solo"
                :rules="confirmarSenhaRules"
                :error-messages="errors.confirmarSenha"
                class="mb-6"
                required
              />

              <v-btn
                type="submit"
                color="purple"
                size="large"
                block
                :loading="loading"
                :disabled="loading"
                class="mb-4"
              >
                <v-icon left>mdi-key-change</v-icon>
                Trocar Senha
              </v-btn>

              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="errorMessage = ''"
              >
                {{ errorMessage }}
              </v-alert>

              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4"
                closable
                @click:close="successMessage = ''"
              >
                {{ successMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const form = reactive({
  senhaAtual: "",
  novaSenha: "",
  confirmarSenha: "",
});

const showSenhaAtual = ref(false);
const showNovaSenha = ref(false);
const showConfirmarSenha = ref(false);
const loading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const errors = ref({});

const senhaForm = ref(null);

const senhaAtualRules = [
  (v) => !!v || "Senha atual é obrigatória",
];

const novaSenhaRules = [
  (v) => !!v || "Nova senha é obrigatória",
  (v) => (v && v.length >= 6) || "Nova senha deve ter pelo menos 6 caracteres",
];

const confirmarSenhaRules = [
  (v) => !!v || "Confirmação de senha é obrigatória",
  (v) => v === form.novaSenha || "As senhas não coincidem",
];

const handleTrocarSenha = async () => {
  errors.value = {};
  errorMessage.value = "";
  successMessage.value = "";

  const { valid } = await senhaForm.value.validate();
  if (!valid) return;

  loading.value = true;

  try {
    const response = await fetch("http://localhost/api/trocar-senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify({
        senha_atual: form.senhaAtual,
        nova_senha: form.novaSenha,
        confirmar_senha: form.confirmarSenha,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      successMessage.value = data.message;
      form.senhaAtual = "";
      form.novaSenha = "";
      form.confirmarSenha = "";
    } else {
      errorMessage.value = data.message || "Erro ao trocar senha";

      if (data.errors) {
        errors.value = data.errors;
      }
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    errorMessage.value = "Erro de conexão. Tente novamente.";
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
