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
              @click="abrirDialogCriar"
              prepend-icon="mdi-plus"
            >
              New Employee
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
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEdit ? "Edit" : "New" }} Employee</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.name"
              label="Name"
              :rules="nameRules"
              required
            ></v-text-field>

            <v-text-field
              v-model="form.email"
              label="E-mail"
              :rules="emailRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="!isEdit"
              v-model="form.password"
              label="Password"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="!isEdit"
              v-model="form.password_confirmation"
              label="Confirm Password"
              type="password"
              :rules="confirmPasswordRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="fecharDialog">
            Cancel
          </v-btn>
          <v-btn
            color="purple"
            variant="text"
            @click="salvarEmployee"
            :loading="salvando"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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

const _authStore = useAuthStore();

const employees = ref([]);
const loading = ref(false);
const dialog = ref(false);
const dialogExclusao = ref(false);
const isEdit = ref(false);
const valid = ref(false);
const salvando = ref(false);
const excluindo = ref(false);
const employeeSelecionado = ref(null);

const snackbar = ref(false);
const snackbarText = ref("");
const snackbarColor = ref("success");

const form = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const headers = [
  { title: "ID", key: "id", sortable: true },
  { title: "Name", key: "name", sortable: true },
  { title: "E-mail", key: "email", sortable: true },
  { title: "Created at", key: "created_at", sortable: true },
  { title: "Actions", key: "actions", sortable: false },
];

const nameRules = [
  (v) => !!v || "Name is required",
  (v) => (v && v.length >= 2) || "Name must have at least 2 characters",
];

const emailRules = [
  (v) => !!v || "E-mail is required",
  (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
];

const passwordRules = [
  (v) => !!v || "Password is required",
  (v) => (v && v.length >= 6) || "Password must have at least 6 characters",
];

const confirmPasswordRules = [
  (v) => !!v || "Password confirmation is required",
  (v) => v === form.password || "Passwords do not match",
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

const abrirDialogCriar = () => {
  isEdit.value = false;
  limparFormulario();
  dialog.value = true;
};

const abrirDialogEditar = async (employee) => {
  isEdit.value = true;
  employeeSelecionado.value = employee;

  Object.assign(form, {
    name: employee.name,
    email: employee.email,
    password: "",
    password_confirmation: "",
  });

  dialog.value = true;

  await nextTick();
  if (form.value) {
    form.value.resetValidation();
  }
};

const fecharDialog = () => {
  dialog.value = false;
  limparFormulario();
};

const limparFormulario = () => {
  form.name = "";
  form.email = "";
  form.password = "";
  form.password_confirmation = "";
  employeeSelecionado.value = null;

  if (form.value) {
    form.value.resetValidation();
  }
};

const salvarEmployee = async () => {
  if (!form.value) return;

  const { valid: isValid } = await form.value.validate();
  if (!isValid) return;

  salvando.value = true;
  try {
    const url = isEdit.value
      ? `/employees/${employeeSelecionado.value.id}`
      : "/employees";

    const body = isEdit.value
      ? { name: form.name, email: form.email }
      : {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };

    const response = isEdit.value
      ? await api.put(url, body)
      : await api.post(url, body);

    const data = response.data;
    if (data.success) {
      mostrarSnackbar(data.message, "success");
      fecharDialog();
      carregarEmployees();
    } else {
      mostrarSnackbar(data.message || "Error saving employee", "error");
    }
  } catch (error) {
    console.error("Error saving employee:", error);
    const errorMessage = error.response?.data?.message || "Connection error";
    mostrarSnackbar(errorMessage, "error");
  } finally {
    salvando.value = false;
  }
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
