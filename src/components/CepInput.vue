<template>
  <v-text-field
    v-model="cep"
    v-mask="'#####-###'"
    label="CEP"
    :rules="cepRules"
    :loading="loading"
    required
    variant="outlined"
    placeholder="00000-000"
    @blur="consultarCep"
    @input="formatarCep"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import api from "@/api";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue", "cep-encontrado"]);

const cep = ref(props.modelValue);
const loading = ref(false);

const cepRules = [
  (v) => !!v || "CEP é obrigatório",
  (v) => (v && v.length >= 8) || "CEP deve ter 8 dígitos",
];

const formatarCep = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  value = value.substring(0, 8);

  if (value.length > 0) {
    value = value.replace(/(\d{5})(\d)/, "$1-$2");
  }

  cep.value = value;
  emit("update:modelValue", value);
};

const consultarCep = async () => {
  if (!cep.value || cep.value.length < 8) return;

  const cepLimpo = cep.value.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return;

  loading.value = true;

  try {
    const response = await api.get(`/cep/${cepLimpo}`);

    if (response.data.success) {
      emit("cep-encontrado", response.data.data);
    } else {
      console.warn("CEP não encontrado:", response.data.message);
    }
  } catch (error) {
    console.error("Erro ao consultar CEP:", error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.modelValue,
  (newValue) => {
    cep.value = newValue;
  }
);
</script>
