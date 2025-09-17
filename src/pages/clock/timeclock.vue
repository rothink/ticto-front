<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="text-center pa-8">
            <v-icon size="64" color="purple" class="mb-4"
              >mdi-clock-outline</v-icon
            >
            <h1 class="text-h3 font-weight-bold text-purple">Ponto</h1>
          </v-card-title>

          <v-card-text class="pa-8 text-center">
            <div class="mb-8">
              <div class="text-h2 font-weight-bold text-purple mb-2">
                {{ currentTime }}
              </div>
              <div class="text-h6 text-medium-emphasis">
                {{ currentDate }}
              </div>
            </div>

            <v-btn
              @click="registrarPonto"
              color="purple"
              size="x-large"
              block
              :loading="loading"
              :disabled="loading"
              class="mb-6"
            >
              <v-icon left size="32">mdi-fingerprint</v-icon>
              Clock In/Out
            </v-btn>

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

            <v-divider class="my-6"></v-divider>

            <h3 class="text-h6 mb-4">Today's Records</h3>
            <v-list v-if="registrosHoje.length > 0">
              <v-list-item
                v-for="(registro, index) in registrosHoje"
                :key="index"
                class="mb-2"
              >
                <template v-slot:prepend>
                  <v-icon color="purple"> mdi-clock-outline </v-icon>
                </template>
                <v-list-item-title> Record #{{ index + 1 }} </v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatarHora(registro.horario) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <v-card v-else variant="outlined" class="pa-4">
              <p class="text-body-2 text-medium-emphasis text-center">
                No records found for today
              </p>
            </v-card>
            <BackButton route="/" class="mr-3 ma-2" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";
import BackButton from "@/components/BackButton.vue";

const _authStore = useAuthStore();

const currentTime = ref("");
const currentDate = ref("");
const loading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const registrosHoje = ref([]);
let timeInterval = null;

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  currentDate.value = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const registrarPonto = async () => {
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await api.post("/timeclock");
    const data = response.data;

    if (data.success) {
      successMessage.value = data.message;
      carregarRegistrosHoje();
    } else {
      errorMessage.value = data.message || "Error clocking in/out";
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

const carregarRegistrosHoje = async () => {
  try {
    const response = await api.get("/timeclock/today");
    const data = response.data;
    if (data.success) {
      registrosHoje.value = data.registros;
    }
  } catch (error) {
    console.error("Error loading records:", error);
  }
};

const formatarHora = (horario) => {
  return new Date(horario).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  carregarRegistrosHoje();
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
