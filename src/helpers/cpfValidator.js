/**
 * Helper para validação de CPF baseado no algoritmo oficial da Receita Federal
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} - true se o CPF for válido, false caso contrário
 */
export const validarCPF = (cpf) => {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, "");
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Verifica se é o CPF inválido conhecido
  if (cpfLimpo === "00000000000") return false;

  let soma = 0;
  let resto;

  // Validação do primeiro dígito verificador
  // Multiplica os 9 primeiros dígitos por (11 - posição)
  for (let i = 1; i <= 9; i++) {
    soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
  }
  
  // Multiplica por 10 e pega o resto da divisão por 11
  resto = (soma * 10) % 11;
  
  // Se resto for 10 ou 11, considera como 0
  if ((resto === 10) || (resto === 11)) resto = 0;
  
  // Verifica se o primeiro dígito verificador está correto
  if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  // Multiplica os 10 primeiros dígitos por (12 - posição)
  for (let i = 1; i <= 10; i++) {
    soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
  }
  
  // Multiplica por 10 e pega o resto da divisão por 11
  resto = (soma * 10) % 11;
  
  // Se resto for 10 ou 11, considera como 0
  if ((resto === 10) || (resto === 11)) resto = 0;
  
  // Verifica se o segundo dígito verificador está correto
  if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

  return true;
};

/**
 * Formata um CPF adicionando pontos e hífen
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (xxx.xxx.xxx-xx)
 */
export const formatarCPF = (cpf) => {
  // Remove caracteres não numéricos
  let value = cpf.replace(/\D/g, "");
  
  // Limita a 11 dígitos
  value = value.substring(0, 11);
  
  // Aplica a formatação apenas se tiver dígitos
  if (value.length > 0) {
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  
  return value;
};

/**
 * Remove a formatação do CPF, deixando apenas números
 * @param {string} cpf - CPF formatado
 * @returns {string} - CPF apenas com números
 */
export const limparCPF = (cpf) => {
  return cpf.replace(/\D/g, "");
};

/**
 * Gera regras de validação para CPF para uso com Vuetify
 * @returns {Array} - Array de funções de validação
 */
export const cpfRules = [
  (v) => !!v || "CPF é obrigatório",
  (v) => validarCPF(v) || "CPF inválido",
];

/**
 * Gera um CPF válido para testes
 * @returns {string} - CPF válido formatado
 */
export const gerarCPFValido = () => {
  // CPFs válidos conhecidos para teste (baseados no algoritmo oficial da Receita Federal)
  const cpfsValidos = [
    "123.456.789-09", // CPF de exemplo do site da DevMedia
    "111.444.777-35", // CPF válido conhecido
    "000.000.001-91", // CPF válido conhecido
    "987.654.321-00"  // CPF válido conhecido
  ];
  
  return cpfsValidos[Math.floor(Math.random() * cpfsValidos.length)];
};
