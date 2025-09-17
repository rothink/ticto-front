<template>
  <v-btn
    :color="color"
    :variant="variant"
    :size="size"
    :prepend-icon="icon"
    @click="handleClick"
    :disabled="disabled"
    :loading="loading"
  >
    {{ text }}
  </v-btn>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  text: {
    type: String,
    default: "Voltar",
  },
  color: {
    type: String,
    default: "grey",
  },
  variant: {
    type: String,
    default: "outlined",
  },
  size: {
    type: String,
    default: "default",
  },
  icon: {
    type: String,
    default: "mdi-arrow-left",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  route: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["click"]);

const handleClick = () => {
  if (props.route) {
    router.push(props.route);
  } else {
    router.back();
  }

  emit("click");
};
</script>
