<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="pa-6">
            <v-icon size="32" color="purple" class="mr-3"
              >mdi-chart-line</v-icon
            >
            <h2 class="text-h4 font-weight-bold text-purple">Relatórios</h2>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row class="mb-6">
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.data_inicio"
                  label="Start Date"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.data_fim"
                  label="End Date"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3" class="d-flex align-center gap-2">
                <v-btn
                  color="purple"
                  @click="filtrarRegistros"
                  :loading="loading"
                >
                  <v-icon left>mdi-magnify</v-icon>
                  Filter
                </v-btn>
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="limparFiltros"
                  :disabled="loading"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  Clear
                </v-btn>
              </v-col>
            </v-row>

            <v-data-table
              :headers="headers"
              :items="registros"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.horario="{ item }">
                {{
                  formatarDataHora(
                    item.horario ||
                      item.created_at ||
                      item.date ||
                      item.timestamp
                  )
                }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";

const _authStore = useAuthStore();

const registros = ref([]);
const loading = ref(false);

const filtros = reactive({
  data_inicio: "",
  data_fim: "",
});

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Employee", key: "user.name", sortable: true },
  { title: "Date/Time", key: "horario", sortable: true },
];

const formatarDataHora = (dataHora) => {
  if (!dataHora) return "N/A";
  const date = new Date(dataHora);
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const filtrarRegistros = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();
    if (filtros.data_inicio) {
      params.append("data_inicio", filtros.data_inicio);
    }
    if (filtros.data_fim) {
      params.append("data_fim", filtros.data_fim);
    }

    const response = await api.get(`/relatorios/ponto?${params}`);
    const data = response.data;
    if (data.success) {
      registros.value = data.registros;
    } else {
      console.error("Error loading reports:", data.message);
    }
  } catch (error) {
    console.error("Error loading reports:", error);
  } finally {
    loading.value = false;
  }
};

const limparFiltros = () => {
  filtros.data_inicio = "";
  filtros.data_fim = "";
  filtrarRegistros();
};

onMounted(() => {
  filtrarRegistros();
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
