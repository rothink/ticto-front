<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="pa-6">
            <v-icon size="32" color="purple" class="mr-3"
              >mdi-account-multiple</v-icon
            >
            <h2 class="text-h4 font-weight-bold text-purple">Funcionários</h2>
            <v-spacer></v-spacer>
            <v-btn
              color="purple"
              @click="$router.push('/employees/create')"
              prepend-icon="mdi-plus"
            >
              Novo Funcionário
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-data-table
              :headers="headers"
              :items="employees"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  color="primary"
                  @click="abrirDialogEditar(item)"
                ></v-btn>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  color="error"
                  @click="confirmarExclusao(item)"
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
          <BackButton route="/" class="mr-3 ma-2" />
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogExclusao" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete the employee
          <strong>{{ employeeSelecionado?.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogExclusao = false">
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="excluirEmployee"
            :loading="excluindo"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/api";
import BackButton from "@/components/BackButton.vue";

const _authStore = useAuthStore();

const employees = ref([]);
const loading = ref(false);
const dialogExclusao = ref(false);
const excluindo = ref(false);
const employeeSelecionado = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Name", key: "name", sortable: true },
  { title: "E-mail", key: "email", sortable: true },
  { title: "CPF", key: "cpf", sortable: true },
  { title: "Cargo", key: "cargo", sortable: true },
  { title: "Created at", key: "created_at", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const carregarEmployees = async () => {
  loading.value = true;
  try {
    const response = await api.get("/employees");
    const data = response.data;
    if (data.success) {
      employees.value = data.funcionarios;
    } else {
      mostrarSnackbar("Error loading employees", "error");
    }
  } catch (error) {
    console.error("Error loading employees:", error);
    mostrarSnackbar("Connection error", "error");
  } finally {
    loading.value = false;
  }
};

const abrirDialogEditar = async (employee) => {
  employeeSelecionado.value = employee;
  // Redirecionar para página de edição (implementar depois)
  console.log("Editar funcionário:", employee);
};

const confirmarExclusao = (employee) => {
  employeeSelecionado.value = employee;
  dialogExclusao.value = true;
};

const excluirEmployee = async () => {
  excluindo.value = true;
  try {
    const response = await api.delete(
      `/employees/${employeeSelecionado.value.id}`
    );
    const data = response.data;
    if (data.success) {
      mostrarSnackbar(data.message, "success");
      dialogExclusao.value = false;
      carregarEmployees();
    } else {
      mostrarSnackbar(data.message || "Error deleting employee", "error");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
    const errorMessage = error.response?.data?.message || "Connection error";
    mostrarSnackbar(errorMessage, "error");
  } finally {
    excluindo.value = false;
  }
};

const mostrarSnackbar = (text, color) => {
  snackbarText.value = text;
  snackbarColor.value = color;
  snackbar.value = true;
};

onMounted(() => {
  carregarEmployees();
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
