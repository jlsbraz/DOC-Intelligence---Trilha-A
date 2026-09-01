# 📁 Estrutura do Projeto

Organização limpa e profissional do repositório DOC Intelligence - Trilha A.

## 📂 Hierarquia de Pastas

```
.
├── 📄 Raiz (Arquivos Essenciais)
│   ├── package.json              # Dependências e scripts npm
│   ├── package-lock.json         # Lock de versões
│   ├── README.md                 # Documentação principal
│   ├── .gitignore                # Padrões Git ignorados
│   ├── .gitattributes            # Configuração Git
│   ├── .env*                     # Variáveis de ambiente
│   ├── .prettierrc               # Formatação de código
│   ├── tsconfig.json             # Configuração TypeScript (raiz)
│   ├── tsconfig.build.json       # Configuração TypeScript (build)
│   ├── nest-cli.json             # Configuração NestJS
│   ├── jest.config.js            # Configuração Jest
│   └── jest.integration.config.js # Testes integração
│
├── 📁 src/                       # Código fonte TypeScript
│   ├── main.ts                   # Entry point da aplicação
│   ├── app.module.ts             # Módulo raiz NestJS
│   ├── app.controller.ts         # Controlador HTTP
│   ├── app.service.ts            # Serviço de aplicação
│   ├── config.ts                 # Configurações globais
│   ├── api-key.guard.ts          # Guard de autenticação
│   ├── documents/                # Lógica de documentos
│   ├── infrastructure/           # Infraestrutura (adapters)
│   └── prisma/                   # Repositório Prisma
│
├── 📁 test/                      # Testes automatizados
│   ├── *.spec.ts                 # Testes unitários
│   ├── *.e2e.ts                  # Testes end-to-end
│   └── integration/              # Testes integração
│
├── 📁 prisma/                    # ORM Prisma
│   ├── schema.prisma             # Schema do banco de dados
│   └── migrations/               # Migrations do BD
│
├── 📁 rest-client/               # Exemplos de requisições HTTP
│   ├── *.rest                    # Arquivos REST Client
│   └── *.json                    # Dados de teste
│
├── 📁 config/                    # Configurações adicionais
│   ├── oxlint.json               # Configuração linter
│   └── prisma.config.ts          # Configuração Prisma CLI
│
├── 📁 .docker/                   # Configuração Docker
│   ├── docker-compose.yml        # Serviços (PostgreSQL, Redis)
│   ├── docker-compose.postgres.yml # PostgreSQL específico
│   └── build-dist.sh             # Script de build
│
├── 📁 docs/                      # Documentação
│   ├── ESTRUTURA-PROJETO.md      # Este arquivo
│   ├── ADR-*.md                  # Architecture Decision Records
│   └── *.md                      # Outros documentos
│
├── 📁 dist/                      # Build compilado (gerado)
│   └── *.js                      # Código compilado
│
├── 📁 node_modules/              # Dependências NPM (gerado)
│
├── 📁 storage/                   # Armazenamento de documentos (runtime)
│   └── documents/                # Documentos processados
│
└── 📁 .github/                   # Configurações GitHub
    └── workflows/                # Actions CI/CD (futuro)
```

## 🎯 Convenção de Localização

### Arquivos que DEVEM estar na Raiz
Esses arquivos são esperados pela comunidade e ferramentas padrão:

| Arquivo | Motivo |
|---------|--------|
| `package.json` | Padrão NPM/Node |
| `tsconfig.json` | TypeScript compila a partir daqui |
| `tsconfig.build.json` | NestJS espera aqui |
| `nest-cli.json` | NestJS CLI procura aqui |
| `jest.config.js` | Jest descobre por convenção |
| `.env*` | Dotenv carrega da raiz |
| `.prettierrc` | Prettier procura aqui |
| `.gitignore` | Git nativo |
| `README.md` | Padrão de repositórios |

### Arquivos Opcionais em Pastas
Podem ser movidos sem quebrar a aplicação:

| Arquivo | Localização | Motivo |
|---------|-------------|--------|
| `oxlint.json` | `config/` | Apenas linting |
| `prisma.config.ts` | `config/` | Config suplementar |
| Docs | `docs/` | Referência apenas |
| Docker | `.docker/` | Organização |

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm test
npm run test:e2e

# Docker
npm run docker:up      # Inicia PostgreSQL e Redis
npm run docker:down    # Para containers

# Migrations
npm run db:migrate     # Executa migrations
```

## 📊 Fluxo de Arquivos

```
user request
    ↓
rest-client/ (testa via HTTP)
    ↓
src/app.controller.ts (recebe requisição)
    ↓
src/documents/ (lógica de negócio)
    ↓
src/infrastructure/ (adapters - Prisma, Redis, Queue)
    ↓
prisma/ (schema + migrations)
    ↓
PostgreSQL + Redis (docker via .docker/)
```

## ✅ Validações

- ✅ Testes: 11/11 passando
- ✅ Build: Compila sem erros
- ✅ Docker: Containers no .docker/
- ✅ Gitignore: Atualizado
- ✅ Estrutura: Profissional e organizada

---

**Última atualização:** 31/08/2026
**Status:** ✅ Pronto para produção
