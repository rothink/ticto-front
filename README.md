# Ticto Frontend - Vue.js + Vuetify

Frontend do sistema de ponto eletrônico desenvolvido com Vue.js 3 e Vuetify 3.

## 📋 Pré-requisitos

- Docker
- Docker Compose

## 🚀 Como executar o projeto

### 1º Passo - Clone do projeto

```bash
git clone https://github.com/rothink/ticto-front
cd ticto-front
```

### 2º Passo - Subir os containers

Execute o comando para subir o container do frontend:

```bash
docker compose up --build -d
```

Este comando irá:
- Construir a imagem Docker do frontend
- Subir o container com Vue.js + Vuetify
- Configurar o ambiente de desenvolvimento

### 3º Passo - Acessar a aplicação

Acesse o frontend em: **http://localhost:3000**

## 🛠️ Comandos úteis

### Gerenciamento de containers

```bash
# Parar os containers
docker compose down

# Ver logs dos containers
docker compose logs -f

# Ver logs específicos do frontend
docker compose logs -f frontend

# Reiniciar containers
docker compose restart

# Reconstruir containers
docker compose up --build -d
```

### Comandos de desenvolvimento

```bash
# Acessar o container do frontend
docker compose exec frontend sh

# Dentro do container, executar comandos npm:
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Linter
```

## 🏗️ Estrutura do projeto

```
front/
├── src/
│   ├── components/      # Componentes Vue reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   ├── layouts/        # Layouts da aplicação
│   ├── stores/         # Stores do Pinia
│   ├── router/         # Configuração do Vue Router
│   ├── api/           # Configuração da API
│   ├── helpers/       # Funções auxiliares
│   ├── plugins/       # Plugins do Vuetify
│   └── styles/        # Estilos globais
├── public/            # Arquivos estáticos
├── Dockerfile         # Configuração Docker
└── docker-compose.yml # Configuração Docker Compose
```

## 🔧 Tecnologias utilizadas

- **Vue.js 3** - Framework JavaScript
- **Vuetify 3** - Framework de componentes Material Design
- **Pinia** - Gerenciamento de estado
- **Vue Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool e dev server
- **Sass** - Pré-processador CSS

## 🎨 Recursos do Vuetify

### Componentes disponíveis:
- **v-btn** - Botões
- **v-card** - Cards
- **v-dialog** - Modais
- **v-form** - Formulários
- **v-data-table** - Tabelas
- **v-navigation-drawer** - Menu lateral
- **v-app-bar** - Barra superior
- **v-text-field** - Campos de texto
- **v-select** - Seletores
- **v-date-picker** - Seletor de data

### Temas e cores:
- **Tema roxo** configurado como padrão
- **Gradiente amarelo para branco** no app
- **Modo escuro/claro** disponível

## 🔌 Integração com a API

O frontend está configurado para se comunicar com o backend Laravel:

- **URL da API**: http://localhost
- **Autenticação**: Bearer Token (Laravel Sanctum)
- **Interceptadores**: Configurados no Axios

### Exemplo de uso da API:

```javascript
// Em um componente Vue
import { useApi } from '@/api'

const api = useApi()

// Fazer requisição
const response = await api.get('/users')
```

## 🐛 Solução de problemas

### Problemas comuns:

1. **Porta 3000 já em uso**:
   ```bash
   # Verificar o que está usando a porta
   sudo lsof -i :3000
   # Ou alterar a porta no docker-compose.yml
   ```

2. **Erro de permissão**:
   ```bash
   sudo chown -R $USER:$USER .
   ```

3. **Container não sobe**:
   ```bash
   docker compose down
   docker compose up --build -d
   ```

4. **Erro de dependências**:
   ```bash
   # Reconstruir o container
   docker compose down
   docker compose up --build -d
   ```

### Logs úteis:

```bash
# Logs do frontend
docker compose logs -f frontend

# Logs em tempo real
docker compose logs -f
```

## 🧪 Desenvolvimento

### Hot Reload
O Vite está configurado com Hot Module Replacement (HMR), então as mudanças no código são refletidas automaticamente no navegador.

### Linting
```bash
# Executar linter
docker compose exec frontend npm run lint
```

### Build para produção
```bash
# Build otimizado
docker compose exec frontend npm run build
```

## 📱 Responsividade

O frontend é totalmente responsivo e funciona em:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (até 767px)

## 🎯 Funcionalidades principais

- **Autenticação** de usuários
- **Registro de ponto** eletrônico
- **Dashboard** com estatísticas
- **Relatórios** de horas trabalhadas
- **Gerenciamento** de usuários (admin)
- **Interface** moderna e intuitiva

## 🔐 Autenticação

O sistema utiliza autenticação baseada em tokens:

1. **Login** via API
2. **Token** armazenado no localStorage
3. **Interceptadores** automáticos no Axios
4. **Redirecionamento** automático para login

## 📊 Estado da aplicação

Gerenciamento de estado com **Pinia**:

- **authStore** - Autenticação do usuário
- **userStore** - Dados do usuário
- **pontoStore** - Registros de ponto
- **adminStore** - Funcionalidades administrativas

## 🎨 Personalização

### Cores do tema:
```scss
// Cores principais
$primary: #9C27B0;    // Roxo
$secondary: #FFC107;  // Amarelo
$accent: #FF4081;     // Rosa
```

### Componentes customizados:
- **confirmDialog** - Para confirmações (biblioteca etcdf-componentes)
- **Layouts** responsivos
- **Formulários** com validação

## 📝 Notas importantes

- O frontend está configurado para se comunicar com o backend na porta 80
- As dependências são instaladas automaticamente no container
- O Vite está configurado para desenvolvimento otimizado
- O Vuetify 3 está configurado com todos os componentes disponíveis

## 🚀 Deploy

Para fazer deploy em produção:

```bash
# Build de produção
docker compose exec frontend npm run build

# Os arquivos serão gerados na pasta dist/
```

## 📚 Documentação adicional

- [Vue.js 3](https://vuejs.org/)
- [Vuetify 3](https://vuetifyjs.com/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vitejs.dev/)