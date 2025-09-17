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
              Novo Funcionário
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-data-table
              :headers="headers"
              :items="funcionarios"
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
          <span class="text-h5"
            >{{ isEdit ? "Editar" : "Novo" }} Funcionário</span
          >
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="form.name"
              label="Nome"
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
              label="Senha"
              type="password"
              :rules="passwordRules"
              required
            ></v-text-field>

            <v-text-field
              v-if="!isEdit"
              v-model="form.password_confirmation"
              label="Confirmar Senha"
              type="password"
              :rules="confirmPasswordRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="fecharDialog">
            Cancelar
          </v-btn>
          <v-btn
            color="purple"
            variant="text"
            @click="salvarFuncionario"
            :loading="salvando"
          >
            Salvar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogExclusao" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o funcionário
          <strong>{{ funcionarioSelecionado?.name }}</strong
          >?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogExclusao = false">
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="excluirFuncionario"
            :loading="excluindo"
          >
            Excluir
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

const authStore = useAuthStore();

const funcionarios = ref([]);
const loading = ref(false);
const dialog = ref(false);
const dialogExclusao = ref(false);
const isEdit = ref(false);
const valid = ref(false);
const salvando = ref(false);
const excluindo = ref(false);
const funcionarioSelecionado = ref(null);

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
  { title: "Nome", key: "name", sortable: true },
  { title: "E-mail", key: "email", sortable: true },
  { title: "Criado em", key: "created_at", sortable: true },
  { title: "Ações", key: "actions", sortable: false },
];

const nameRules = [
  (v) => !!v || "Nome é obrigatório",
  (v) => (v && v.length >= 2) || "Nome deve ter pelo menos 2 caracteres",
];

const emailRules = [
  (v) => !!v || "E-mail é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
];

const passwordRules = [
  (v) => !!v || "Senha é obrigatória",
  (v) => (v && v.length >= 6) || "Senha deve ter pelo menos 6 caracteres",
];

const confirmPasswordRules = [
  (v) => !!v || "Confirmação de senha é obrigatória",
  (v) => v === form.password || "As senhas não coincidem",
];

const carregarFuncionarios = async () => {
  loading.value = true;
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
    } else {
      mostrarSnackbar("Erro ao carregar funcionários", "error");
    }
  } catch (error) {
    console.error("Erro ao carregar funcionários:", error);
    mostrarSnackbar("Erro de conexão", "error");
  } finally {
    loading.value = false;
  }
};

const abrirDialogCriar = () => {
  isEdit.value = false;
  limparFormulario();
  dialog.value = true;
};

const abrirDialogEditar = async (funcionario) => {
  isEdit.value = true;
  funcionarioSelecionado.value = funcionario;

  Object.assign(form, {
    name: funcionario.name,
    email: funcionario.email,
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
  funcionarioSelecionado.value = null;

  if (form.value) {
    form.value.resetValidation();
  }
};

const salvarFuncionario = async () => {
  if (!form.value) return;

  const { valid: isValid } = await form.value.validate();
  if (!isValid) return;

  salvando.value = true;
  try {
    const url = isEdit.value
      ? `http://localhost/api/funcionarios/${funcionarioSelecionado.value.id}`
      : "http://localhost/api/funcionarios";

    const method = isEdit.value ? "PUT" : "POST";

    const body = isEdit.value
      ? { name: form.name, email: form.email }
      : {
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
        };

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      mostrarSnackbar(data.message, "success");
      fecharDialog();
      carregarFuncionarios();
    } else {
      mostrarSnackbar(data.message || "Erro ao salvar funcionário", "error");
    }
  } catch (error) {
    console.error("Erro ao salvar funcionário:", error);
    mostrarSnackbar("Erro de conexão", "error");
  } finally {
    salvando.value = false;
  }
};

const confirmarExclusao = (funcionario) => {
  funcionarioSelecionado.value = funcionario;
  dialogExclusao.value = true;
};

const excluirFuncionario = async () => {
  excluindo.value = true;
  try {
    const response = await fetch(
      `http://localhost/api/funcionarios/${funcionarioSelecionado.value.id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    const data = await response.json();
    if (response.ok && data.success) {
      mostrarSnackbar(data.message, "success");
      dialogExclusao.value = false;
      carregarFuncionarios();
    } else {
      mostrarSnackbar(data.message || "Erro ao excluir funcionário", "error");
    }
  } catch (error) {
    console.error("Erro ao excluir funcionário:", error);
    mostrarSnackbar("Erro de conexão", "error");
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
  carregarFuncionarios();
});
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
