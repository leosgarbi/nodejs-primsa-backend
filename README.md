# 🚀 Backend API - Template CRUD

Um template profissional de backend para iniciar serviços com clientes. Implementa um CRUD completo com autenticação, roles, validação e banco de dados pré-configurado.

## ✨ Features

- ✅ **Autenticação JWT** - Segurança integrada com tokens
- ✅ **Sistema de Roles** - USER, MEMBER, ADMIN com controle de acesso
- ✅ **CRUD Users** - Operações completas de usuários
- ✅ **Validação com Zod** - Validação de tipos em tempo de execução
- ✅ **Documentação Swagger** - API documentada automaticamente
- ✅ **Banco de Dados** - PostgreSQL com Prisma ORM
- ✅ **Migrations** - Controle de versão do banco
- ✅ **Logger estruturado** - Logs com Pino
- ✅ **ESLint + Prettier** - Código formatado e limpo
- ✅ **TypeScript** - Type-safe em 100%

## 🛠️ Stack Tecnológico

| Ferramenta | Versão | Propósito |
|-----------|--------|----------|
| **Bun** | 1.3.13+ | Runtime JavaScript ultrarrápido |
| **Fastify** | 5.8.5 | Framework HTTP de alto desempenho |
| **Prisma** | 7.8.0 | ORM para banco de dados |
| **PostgreSQL** | 14+ | Banco de dados |
| **TypeScript** | 5+ | Linguagem tipada |
| **Zod** | 4.3.6 | Validação de schemas |
| **JWT** | 10.0.0 | Autenticação |
| **Docker** | - | Containerização |

## 🚀 Início Rápido

### 1. Clone e instale

```bash
git clone https://github.com/leosgarbi/nodejs-primsa-backend.git
cd nodejs-primsa-backend
bun install
```

### 2. Configure o ambiente

Copie o arquivo `.env.example` para `.env` e preencha as variáveis:

```bash
cp .env.example .env
```

```env
# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/seu_banco"

# Servidor
PORT=3000
HOST="0.0.0.0"
NODE_ENV="development"

# JWT
JWT_SECRET="sua-chave-secreta-super-segura-aqui"
JWT_EXPIRE="7d"
```

### 3. Setup do Banco de Dados

Com Docker (recomendado):

```bash
docker-compose up -d
```

Ou crie um banco PostgreSQL manualmente e execute as migrations:

```bash
bun run prisma migrate dev
```

### 4. Inicie o servidor

Desenvolvimento (com hot-reload)
```bash
bun run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📚 Documentação da API

Acesse a documentação interativa do Swagger:

```
http://localhost:3000/docs
```

### Endpoints Principais

#### 🔐 Autenticação
- `POST /auth/login` - Faz login e retorna JWT token
- `GET /auth/me` - Retorna dados do usuário autenticado

#### 👥 Usuários
- `GET /users` - Lista todos os usuários (admin)
- `GET /users/:id` - Obtém usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Deleta usuário

## 📁 Estrutura do Projeto

```
src/
├── @types/           # Tipos personalizados do TypeScript
├── generated/        # Código gerado (Prisma Client)
├── lib/              # Utilitários compartilhados
├── middleware/       # Middlewares (autenticação, etc)
├── plugins/          # Plugins do Fastify
├── routes/           # Rotas agrupadas por módulo
│   ├── auth/        # Autenticação (login, me)
│   └── users/       # Usuários (CRUD)
├── app.ts           # Setup da aplicação
├── env.ts           # Variáveis de ambiente
└── server.ts        # Entrada do servidor

prisma/
├── schema.prisma    # Modelo de dados
└── migrations/      # Histórico de migrations

docker-compose.yml   # Setup Docker
tsconfig.json        # Configuração TypeScript
.eslintrc.json       # Configuração ESLint
.prettierrc.json     # Configuração Prettier
```

## 🔄 Database Migrations

### Criar nova migration

Após alterar `prisma/schema.prisma`:

```bash
npx prisma migrate dev 
```

### Ver estado do banco

```bash
npx prisma studio
```


## 🐳 Docker & Docker Compose

O projeto inclui `docker-compose.yml` com PostgreSQL pré-configurado:

```bash
# Iniciar ambiente
docker-compose up -d

# Parar ambiente
docker-compose down

# Ver logs
docker-compose logs -f
```

## 📄 Licença

MIT - Sinta-se livre para usar como template em seus projetos!

---