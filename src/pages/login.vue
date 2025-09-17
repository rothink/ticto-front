<template>
  <v-container fluid class="fill-height">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="elevation-12" rounded="lg">
          <v-card-title class="text-center pa-8">
            <v-icon size="48" color="purple" class="mb-4"
              >mdi-account-circle</v-icon
            >
            <h2 class="text-h4 font-weight-bold text-purple">Login</h2>
            <p class="text-body-1 text-medium-emphasis mt-2">
              Entre com suas credenciais
            </p>
          </v-card-title>

          <v-card-text class="pa-8">
            <v-form @submit.prevent="handleLogin" ref="loginForm">
              <v-text-field
                v-model="form.email"
                label="E-mail"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="solo"
                :rules="emailRules"
                :error-messages="errors.email"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="form.password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="solo"
                :rules="passwordRules"
                :error-messages="errors.password"
                class="mb-6"
                required
              />

              <v-btn
                type="submit"
                color="purple"
                size="large"
                block
                :loading="authStore.loading"
                :disabled="authStore.loading"
                class="mb-4"
              >
                <v-icon left>mdi-login</v-icon>
                Entrar
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
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  email: "",
  password: "",
});

const showPassword = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const errors = ref({});

const loginForm = ref(null);
const emailRules = [
  (v) => !!v || "E-mail é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
];

const passwordRules = [
  (v) => !!v || "Senha é obrigatória",
  (v) => (v && v.length >= 6) || "Senha deve ter pelo menos 6 caracteres",
];

const handleLogin = async () => {
  errors.value = {};
  errorMessage.value = "";
  successMessage.value = "";

  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  const result = await authStore.login(form);

  if (result.success) {
    successMessage.value = result.data.message;
    setTimeout(() => {
      router.push("/");
    }, 1500);
  } else {
    errorMessage.value = result.error;
  }
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.text-purple {
  color: #7c3aed !important;
}
</style>
