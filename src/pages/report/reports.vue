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
                  label="Data Início"
                  type="date"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <v-text-field
                  v-model="filtros.data_fim"
                  label="Data Fim"
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
                  Filtrar
                </v-btn>
                <v-btn
                  color="grey"
                  variant="outlined"
                  @click="limparFiltros"
                  :disabled="loading"
                >
                  <v-icon left>mdi-refresh</v-icon>
                  Limpar
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
                    item.created_at ||
                      item.horario ||
                      item.date ||
                      item.timestamp
                  )
                }}
              </template>
            </v-data-table>
            <BackButton route="/" class="mr-3 ma-2" />
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
  { title: "ID", key: "registro_id", sortable: true },
  { title: "Funcionário", key: "nome_funcionario", sortable: true },
  { title: "Cargo", key: "cargo", sortable: true },
  { title: "Idade", key: "idade", sortable: true },
  { title: "Gestor", key: "nome_gestor", sortable: true },
  { title: "Data/Hora", key: "data_hora_completa", sortable: true },
];

const formatarDataHora = (dataHora) => {
  if (!dataHora) return "N/A";

  let date;
  if (typeof dataHora === "string") {
    date = new Date(dataHora);
  } else if (dataHora.created_at) {
    date = new Date(dataHora.created_at);
  } else {
    date = new Date(dataHora);
  }

  if (isNaN(date.getTime())) {
    console.warn("Invalid date:", dataHora);
    return "Data inválida";
  }

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

    const response = await api.get(`/reports/timeclock?${params}`);
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

const carregarRelatorios = async () => {
  loading.value = true;
  try {
    const response = await api.get("/reports/timeclock");
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

onMounted(() => {
  carregarRelatorios();
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
