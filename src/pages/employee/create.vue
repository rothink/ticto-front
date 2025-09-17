<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="elevation-4" rounded="lg">
          <v-card-title class="pa-6">
            <v-icon size="32" color="purple" class="mr-3"
              >mdi-account-plus</v-icon
            >
            <h2 class="text-h4 font-weight-bold text-purple">
              Novo Funcionário
            </h2>
            <v-spacer></v-spacer>
            <v-btn
              color="grey"
              variant="outlined"
              @click="$router.push('/employees')"
              prepend-icon="mdi-arrow-left"
            >
              Voltar
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-form
              @submit.prevent="salvarFuncionario"
              ref="form"
              v-model="valid"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.name"
                    label="Nome Completo"
                    :rules="nameRules"
                    required
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.email"
                    label="E-mail"
                    type="email"
                    :rules="emailRules"
                    required
                    variant="outlined"
                    autocomplete="off"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.cpf"
                    v-mask="'###.###.###-##'"
                    label="CPF"
                    :rules="cpfRules"
                    required
                    variant="outlined"
                    placeholder="000.000.000-00"
                    @blur="manterFormatacaoCPF"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.data_nascimento"
                    label="Data de Nascimento"
                    type="date"
                    :rules="dataNascimentoRules"
                    required
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <CepInput
                    v-model="form.cep"
                    @cep-encontrado="preencherEndereco"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="8">
                  <v-text-field
                    v-model="enderecoRef"
                    label="Endereço"
                    :rules="enderecoRules"
                    required
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.numero"
                    label="Número"
                    :rules="numeroRules"
                    required
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="complementoRef"
                    label="Complemento"
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="bairroRef"
                    label="Bairro"
                    :rules="bairroRules"
                    required
                    variant="outlined"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="cidadeRef"
                    label="Cidade"
                    :rules="cidadeRules"
                    required
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="estadoRef"
                    label="Estado"
                    :rules="estadoRules"
                    required
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.password"
                    label="Senha"
                    type="password"
                    :rules="passwordRules"
                    required
                    variant="outlined"
                    autocomplete="off"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.password_confirmation"
                    label="Confirmar Senha"
                    type="password"
                    :rules="confirmPasswordRules"
                    required
                    variant="outlined"
                    autocomplete="off"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" class="text-center">
                  <v-btn
                    type="submit"
                    color="purple"
                    size="large"
                    :loading="salvando"
                    :disabled="!valid"
                    prepend-icon="mdi-content-save"
                  >
                    Salvar Funcionário
                  </v-btn>
                </v-col>
              </v-row>
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
import { ref, reactive, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "@/api";
import {
  validarCPF,
  formatarCPF as formatarCPFHelper,
} from "@/helpers/cpfValidator";
import CepInput from "@/components/CepInput.vue";

const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  cpf: "",
  data_nascimento: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  password: "",
  password_confirmation: "",
});

// Refs individuais para debug
const enderecoRef = ref("");
const complementoRef = ref("");
const bairroRef = ref("");
const cidadeRef = ref("");
const estadoRef = ref("");

const valid = ref(false);
const salvando = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

// Função para sincronizar refs com form
const sincronizarForm = () => {
  form.endereco = enderecoRef.value;
  form.complemento = complementoRef.value;
  form.bairro = bairroRef.value;
  form.cidade = cidadeRef.value;
  form.estado = estadoRef.value;
};

const nameRules = [
  (v) => !!v || "Nome é obrigatório",
  (v) => (v && v.length >= 2) || "Nome deve ter pelo menos 2 caracteres",
];

const emailRules = [
  (v) => !!v || "E-mail é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
];

const cpfRules = [
  (v) => !!v || "CPF é obrigatório",
  (v) => {
    if (!v) return "CPF é obrigatório";

    // Se o valor tem formatação (pontos e hífen), usa diretamente
    // Se não tem formatação, adiciona formatação antes de validar
    let cpfParaValidar = v;
    if (!v.includes(".") && !v.includes("-")) {
      cpfParaValidar = formatarCPFHelper(v);
    }

    const isValid = validarCPF(cpfParaValidar);
    return isValid || "CPF inválido";
  },
];

const dataNascimentoRules = [(v) => !!v || "Data de nascimento é obrigatória"];

const enderecoRules = [(v) => !!v || "Endereço é obrigatório"];

const numeroRules = [(v) => !!v || "Número é obrigatório"];

const bairroRules = [(v) => !!v || "Bairro é obrigatório"];

const cidadeRules = [(v) => !!v || "Cidade é obrigatória"];

const estadoRules = [(v) => !!v || "Estado é obrigatório"];

const passwordRules = [
  (v) => !!v || "Senha é obrigatória",
  (v) => (v && v.length >= 6) || "Senha deve ter pelo menos 6 caracteres",
];

const confirmPasswordRules = [
  (v) => !!v || "Confirmação de senha é obrigatória",
  (v) => v === form.password || "As senhas não coincidem",
];

const manterFormatacaoCPF = () => {
  if (form.cpf) {
    const value = formatarCPFHelper(form.cpf);
    form.cpf = value;
  }
};

const preencherEndereco = async (dadosCep) => {
  // Atualizar os refs individuais
  enderecoRef.value = dadosCep.endereco || "";
  bairroRef.value = dadosCep.bairro || "";
  cidadeRef.value = dadosCep.cidade || "";
  estadoRef.value = dadosCep.estado || "";

  // Sincronizar com o form
  sincronizarForm();

  await nextTick();
};

const salvarFuncionario = async () => {
  if (!valid.value) return;

  salvando.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const response = await api.post("/employees", form);
    const data = response.data;

    if (data.success) {
      successMessage.value = data.message;
      setTimeout(() => {
        router.push("/employees");
      }, 2000);
    } else {
      errorMessage.value = data.message || "Erro ao salvar funcionário";
    }
  } catch (error) {
    console.error("Erro ao salvar funcionário:", error);
    const errorMessage = error.response?.data?.message || "Erro de conexão";
    errorMessage.value = errorMessage;
  } finally {
    salvando.value = false;
  }
};
</script>

<style scoped>
.text-purple {
  color: #7c3aed !important;
}
</style>
