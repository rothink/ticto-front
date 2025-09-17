<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="pa-6">
            <v-icon size="32" color="purple" class="mr-3"
              >mdi-chart-line</v-icon
            >
            <h2 class="text-h4 font-weight-bold text-purple">
              Relatórios de Ponto
            </h2>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row class="mb-6">
              <v-col cols="12" md="3">
                <v-select
                  v-model="filtros.funcionario_id"
                  :items="funcionarios"
                  item-title="name"
                  item-value="id"
                  label="Funcionário"
                  clearable
                  variant="outlined"
                ></v-select>
              </v-col>
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
              <template v-slot:item.created_at="{ item }">
                {{ formatarDataHora(item.created_at) }}
              </template>
            </v-data-table>

            <v-row v-if="registros.length > 0" class="mt-4">
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon left>mdi-information</v-icon>
                    Resumo
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="4">
                        <div class="text-center">
                          <div class="text-h4 text-purple">
                            {{ registros.length }}
                          </div>
                          <div class="text-body-2">Total de Registros</div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="text-center">
                          <div class="text-h4 text-purple">
                            {{ funcionariosUnicos }}
                          </div>
                          <div class="text-body-2">Funcionários</div>
                        </div>
                      </v-col>
                      <v-col cols="12" md="4">
                        <div class="text-center">
                          <div class="text-h4 text-purple">
                            {{ diasUnicos }}
                          </div>
                          <div class="text-body-2">Dias Únicos</div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
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
import { ref, reactive, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const registros = ref([]);
const funcionarios = ref([]);
const loading = ref(false);

const filtros = reactive({
  funcionario_id: null,
  data_inicio: "",
  data_fim: "",
});

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Funcionário", key: "user.name", sortable: true },
  { title: "E-mail", key: "user.email", sortable: true },
  { title: "Data/Hora", key: "created_at", sortable: true },
];

const funcionariosUnicos = computed(() => {
  const ids = new Set(registros.value.map((r) => r.user_id));
  return ids.size;
});

const diasUnicos = computed(() => {
  const datas = new Set(registros.value.map((r) => r.created_at.split("T")[0]));
  return datas.size;
});

const carregarFuncionarios = async () => {
  try {
    const response = await fetch("http://localhost/api/funcionarios", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok && data.success) {
      funcionarios.value = data.funcionarios;
    }
  } catch (error) {
    console.error("Erro ao carregar funcionários:", error);
  }
};

const filtrarRegistros = async () => {
  loading.value = true;
  try {
    const params = new URLSearchParams();

    if (filtros.funcionario_id) {
      params.append("funcionario_id", filtros.funcionario_id);
    }
    if (filtros.data_inicio) {
      params.append("data_inicio", filtros.data_inicio);
    }
    if (filtros.data_fim) {
      params.append("data_fim", filtros.data_fim);
    }

    const response = await fetch(
      `http://localhost/api/relatorios/ponto?${params}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok && data.success) {
      registros.value = data.registros;
    } else {
      console.error("Erro ao carregar relatórios:", data.message);
    }
  } catch (error) {
    console.error("Erro ao carregar relatórios:", error);
  } finally {
    loading.value = false;
  }
};

const limparFiltros = () => {
  filtros.funcionario_id = null;
  filtros.data_inicio = "";
  filtros.data_fim = "";
  filtrarRegistros();
};

const formatarDataHora = (dataHora) => {
  return new Date(dataHora).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

onMounted(() => {
  carregarFuncionarios();
  filtrarRegistros();
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
