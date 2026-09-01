# 📖 DOC Intelligence — Trilha A

> **Vertical Slice: Document Ingestion, Processing & State Management**
>
> Uma pipeline de inteligência de documentos baseada em fila assíncrona (BullMQ + Redis) com Prisma + PostgreSQL, seguindo **arquitetura hexagonal**. Processa uploads de documentos (PDF, PNG, JPEG), realiza deduplicação, enfileiramento assíncrono e rastreamento de status.

---

## ⚡ Quick Start (5 minutos)

Se você quer rodar rápido, siga este fluxo:

```bash
# 1️⃣ Instale as dependências
npm install

# 2️⃣ Inicie o servidor
npm start

# 3️⃣ Abra VS Code e vá para rest-client/02-documents-upload.rest
# Clique em "Upload PNG" para testar
```

**Pronto!** O servidor está rodando em `http://localhost:3000` com API key `dev-key`.

---

## 📋 Pré-requisitos

Certifique-se que você tem instalado:

| Requisito | Versão | Verificar |
|-----------|--------|----------|
| **Node.js** | >= v22.17.0 | `node --version` |
| **npm** | >= 10.9.2 | `npm --version` |
| **Git** | Qualquer versão | `git --version` |

> ℹ️ **PostgreSQL e Redis?** O projeto está configurado para rodar em **modo mock** por padrão (tudo em memória). Se quiser usar infraestrutura real, execute `npm run docker:up` para iniciar os containers.

---

## 🚀 Instalação Passo a Passo

### Passo 1️⃣: Clonar e Entrar no Diretório

```bash
cd seu-local-de-projetos
git clone <link-do-repositorio>
cd "DOC Intelligence - Trilha A"
```

### Passo 2️⃣: Instalar Dependências

```bash
npm install
```

**O que acontece aqui?**
- ✅ Baixa todas as dependências de `package.json`
- ✅ Executa o script `postinstall` que roda `prisma generate` (gera tipos)
- ✅ Cria pasta `node_modules/`

**Tempo esperado:** 1-3 minutos (dependendo da velocidade de internet)

### Passo 3️⃣: Verificar Instalação

```bash
npm run build
```

**Esperado:**
```
✅ Successfully compiled TypeScript
```

Se vir um erro, verifique se Node.js está corretamente instalado.

---

## 🏃 Rodando o Projeto

### Iniciar o Servidor

```bash
npm start
```

**Você verá algo assim:**

```
[NestFactory] Starting NestApplication...
[InstanceLoader] DocumentModule dependencies initialized
[InstanceLoader] BullModule dependencies initialized
LOG [NestApplication] Listening on port 3000 🚀
```

✅ **Perfeito!** O servidor está rodando em `http://localhost:3000`

**Deixe este terminal aberto** (você vai usar a API em outro terminal/janela).

### Modos de Execução

| Comando | Uso | Quando usar |
|---------|-----|------------|
| `npm start` | Produção (compila antes) | Deploy, testes finais |
| `npm run start:dev` | Desenvolvimento (watch mode) | Desenvolvimento ativo |
| `npm run build` | Só compila | Verificar erros TypeScript |
| `npm test` | Rodar testes | CI/CD, validação |

---

## 🧪 Testando a API (O Fluxo Principal)

### Onde Estão os Testes?

Abra a pasta `rest-client/` no VS Code:

```
rest-client/
├── 01-health.rest              ← Health check
├── 02-documents-upload.rest    ← Upload de documentos ⭐ COMECE AQUI
├── 03-documents-query.rest     ← Consultar documentos
├── 04-documents-negative.rest  ← Testes de erro
├── 05-workflow.rest            ← Fluxo completo
└── fixtures/
    ├── sample.png
    ├── sample.jpg
    └── sample.pdf
```

### Instalar Extensão REST Client (Importante!)

1. Abra VS Code
2. Vá em **Extensões** (Ctrl+Shift+X)
3. Busque **"REST Client"** (por Huachao Mao)
4. Clique em **Instalar**

![REST Client Extension](https://i.imgur.com/7K8Z5JN.png)

---

## 🎯 Testando Passo a Passo

### Teste 1️⃣: Health Check (Verificar se está vivo)

**Arquivo:** `rest-client/01-health.rest`

```http
@baseUrl = http://localhost:3000
@apiKey = dev-key

### Health check
GET {{baseUrl}}/health
x-api-key: {{apiKey}}
Accept: application/json
```

**Para testar:**
1. Abra `rest-client/01-health.rest` no VS Code
2. Clique em **"Send Request"** (acima do `GET`)

**Resposta esperada:**
```json
HTTP/1.1 200 OK
{
  "status": "ok",
  "service": "DOC Intelligence - Trilha A"
}
```

✅ Se vir isso, a API está funcionando!

---

### Teste 2️⃣: Upload de Documentos ⭐ (Seu Teste Principal)

**Arquivo:** `rest-client/02-documents-upload.rest`

Este arquivo tem 4 requests:

#### 2.1) Upload PNG

```http
### Upload PNG (esperado: 202)
# @name uploadPng
POST {{baseUrl}}/documents
x-api-key: {{apiKey}}
Content-Type: multipart/form-data; boundary=----DocIntelBoundary

------DocIntelBoundary
Content-Disposition: form-data; name="file"; filename="sample.png"
Content-Type: image/png

< ./fixtures/sample.png
------DocIntelBoundary--
```

**Para testar:**
1. Abra `rest-client/02-documents-upload.rest`
2. Encontre a seção "### Upload PNG"
3. Clique em **"Send Request"**

**Resposta esperada (HTTP 202 - Aceito para processamento):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RECEIVED",
  "contentHash": "abc123def456...",
  "duplicate": false,
  "uploadedAt": "2026-08-31T10:30:00.000Z"
}
```

**O que significa:**
- ✅ `status: "RECEIVED"` = Arquivo recebido e enfileirado
- 📝 `id` = Identificador único do documento (use para consultar depois)
- `duplicate: false` = É um novo documento (não é cópia)

#### 2.2) Upload JPEG

Mesmo processo do PNG, mas com arquivo JPEG:

```http
### Upload JPEG (esperado: 202)
# @name uploadJpeg
POST {{baseUrl}}/documents
...
< ./fixtures/sample.jpg
```

#### 2.3) Upload PDF

```http
### Upload PDF (esperado: 202)
# @name uploadPdf
POST {{baseUrl}}/documents
...
< ./fixtures/sample.pdf
```

#### 2.4) Upload Duplicado (Deduplicação)

Se você fizer upload do mesmo arquivo PNG duas vezes:

```http
### Upload duplicado (esperado: 200 + duplicate: true)
# @name uploadDuplicate
POST {{baseUrl}}/documents
...
< ./fixtures/sample.png
```

**Resposta esperada:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RECEIVED",
  "duplicate": true,  ← ⚠️ DOCUMENTO DUPLICADO!
  "existingId": "550e8400-e29b-41d4-a716-446655440000"
}
```

💡 **O sistema detecta documentos duplicados pelo hash de conteúdo!**

---

### Teste 3️⃣: Consultar Documentos (Depois de fazer upload)

**Arquivo:** `rest-client/03-documents-query.rest`

#### 3.1) Consultar por ID

Pegue o `id` do teste anterior e substitua em `@documentId`:

```http
@documentId = 550e8400-e29b-41d4-a716-446655440000

### Consultar documento por ID
GET {{baseUrl}}/documents/{{documentId}}
x-api-key: {{apiKey}}
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "DONE",
  "result": {
    "confidence": 0.95,
    "extractedText": "...",
    "provenance": {...}
  }
}
```

#### 3.2) Listar Todos os Documentos

```http
### Listar todos os documentos
GET {{baseUrl}}/documents
x-api-key: {{apiKey}}
```

**Resposta:**
```json
[
  { "id": "...", "status": "DONE", ... },
  { "id": "...", "status": "PROCESSING", ... },
  { "id": "...", "status": "FAILED", ... }
]
```

#### 3.3) Filtrar por Status

```http
### Listar documentos DONE
GET {{baseUrl}}/documents?status=DONE
x-api-key: {{apiKey}}

### Listar documentos PROCESSING
GET {{baseUrl}}/documents?status=PROCESSING
x-api-key: {{apiKey}}

### Listar documentos FAILED
GET {{baseUrl}}/documents?status=FAILED
x-api-key: {{apiKey}}
```

---

### Teste 4️⃣: Casos de Erro (Validação)

**Arquivo:** `rest-client/04-documents-negative.rest`

Estes testes verificam se o servidor rejeita requisições inválidas:

#### 4.1) Upload sem Arquivo

```http
### Upload sem arquivo (esperado: 400)
POST {{baseUrl}}/documents
x-api-key: {{apiKey}}
Content-Type: multipart/form-data; boundary=----DocIntelBoundary

------DocIntelBoundary--
```

**Resposta esperada (HTTP 400):**
```json
{
  "statusCode": 400,
  "message": "No file provided"
}
```

#### 4.2) Upload de Formato Inválido (.txt)

```http
### Upload tipo inválido .txt (esperado: 400)
POST {{baseUrl}}/documents
x-api-key: {{apiKey}}
...
Content-Type: text/plain
...
arquivo invalido
```

**Resposta esperada (HTTP 400):**
```json
{
  "statusCode": 400,
  "message": "Only PDF, PNG, and JPEG files are allowed"
}
```

#### 4.3) Consultar ID Inválido

```http
### Consulta com ID inválido
GET {{baseUrl}}/documents/id-invalido-123
x-api-key: {{apiKey}}
```

**Resposta esperada (HTTP 400):**
```json
{
  "statusCode": 400,
  "message": "Invalid UUID format"
}
```

---

### Teste 5️⃣: Workflow Completo (Execute em Ordem)

**Arquivo:** `rest-client/05-workflow.rest`

Este arquivo testa o fluxo completo da aplicação:

```http
### 1) Health check
# @name step1Health
GET {{baseUrl}}/health
x-api-key: {{apiKey}}

### 2) Upload PNG
# @name step2Upload
POST {{baseUrl}}/documents
...
< ./fixtures/sample.png

### 3) Consultar status (id automático do passo 2)
GET {{baseUrl}}/documents/{{step2Upload.response.body.id}}
x-api-key: {{apiKey}}

### 4) Reenviar mesmo arquivo (deduplicação)
POST {{baseUrl}}/documents
...
< ./fixtures/sample.png

### 5) Listar documentos DONE
GET {{baseUrl}}/documents?status=DONE
x-api-key: {{apiKey}}
```

**Para executar:**
1. Abra `rest-client/05-workflow.rest`
2. Para cada request, clique em **"Send Request"**
3. **Ou** use a extensão REST Client que tem opção de executar todos em sequência

**Fluxo:**
1. ✅ Health check (verifica que servidor está vivo)
2. ✅ Upload novo (recebe `id`)
3. ✅ Consulta o status dele (deve estar DONE ou PROCESSING)
4. ✅ Upload duplicado (detecta duplicação)
5. ✅ Lista os docs finalizados (você vê o documento processado)

---

## 🏗️ Arquitetura do Projeto

```
┌─────────────────────────────────────────────────────────────────┐
│                    Cliente (REST Client)                         │
│     POST /documents     GET /documents/:id     GET /documents   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   AppController (API)   │
                    │ • Recebe upload        │
                    │ • Valida arquivo       │
                    │ • Enfileira job        │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
  ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
  │  Ingestion   │      │ Processing   │      │  Document        │
  │  Service     │      │  Service     │      │  Repository      │
  │              │      │              │      │                  │
  │ • Hash       │      │ • Provider   │      │ • findById()     │
  │ • Dedup      │      │ • Retry      │      │ • findByHash()   │
  │ • Storage    │      │ • Trust      │      │ • create()       │
  │ • Enqueue    │      │ • Error      │      │ • update()       │
  └──────────────┘      └──────────────┘      └──────────────────┘
        │                      │                        │
        └──────────┬───────────┴────────────┬───────────┘
                   │                        │
           ┌───────▼─────┐         ┌────────▼─────────┐
           │   BullMQ    │         │  Prisma +        │
           │   Queue     │         │  PostgreSQL      │
           │ (Redis)     │         │  (real)          │
           └─────────────┘         └──────────────────┘
```

**Fluxo:**
1. **Cliente** envia arquivo via REST
2. **Controller** valida e chama **IngestionService**
3. **IngestionService** calcula hash, detecta dedup, enfileira
4. **BullMQ Worker** processa o job via **ProcessingService**
5. **ProcessingService** chama provider externo, atualiza status
6. **Repository** (Prisma) persiste dados
7. **Cliente** consulta status via **GET /documents/:id**

---

## 🐳 Modos de Execução

### Modo 1: Mock (Padrão - Recomendado para Começar)

```bash
npm start
```

- ✅ Tudo em memória (sem dependências externas)
- ✅ Rápido e leve
- ⚠️ Dados perdidos ao reiniciar

**Bom para:** Testes rápidos, desenvolvimento

### Modo 2: Real (Com PostgreSQL + Redis)

```bash
# 1. Inicie os containers
npm run docker:up

# 2. Aplique migrations
npm run db:migrate

# 3. Rode o servidor
npm start
```

- ✅ Dados persistidos
- ✅ Fila real com Redis
- ⚠️ Precisa de Docker instalado

**Bom para:** Testes de produção, dados reais

---

## 📁 Estrutura do Projeto

```
DOC Intelligence - Trilha A/
├── 📄 Essencial (Raiz)
│   ├── package.json              ← Dependências
│   ├── tsconfig.json             ← TypeScript config
│   ├── nest-cli.json             ← NestJS config
│   ├── jest.config.js            ← Testes
│   ├── .env*                     ← Variáveis de ambiente
│   └── README.md                 ← Este arquivo
│
├── 📁 src/                       ← Código-fonte TypeScript
│   ├── main.ts                   ← Entrada da aplicação
│   ├── app.controller.ts         ← Rotas HTTP
│   ├── app.service.ts            ← Lógica principal
│   ├── documents/                ← Serviços de documentos
│   │   ├── document-ingestion.service.ts
│   │   ├── document-processing.service.ts
│   │   ├── document-repository.port.ts
│   │   └── ...
│   ├── infrastructure/           ← Adapters (BullMQ, Prisma)
│   └── config.ts                 ← Configurações globais
│
├── 📁 rest-client/               ← Testes HTTP (REST Client)
│   ├── 01-health.rest           ← Health check
│   ├── 02-documents-upload.rest ← Upload (COMECE AQUI!)
│   ├── 03-documents-query.rest  ← Consultas
│   ├── 04-documents-negative.rest ← Casos de erro
│   ├── 05-workflow.rest         ← Fluxo completo
│   └── fixtures/                ← Arquivos de teste
│
├── 📁 prisma/                    ← ORM Prisma
│   ├── schema.prisma            ← Schema do banco
│   └── migrations/              ← Histórico de mudanças
│
├── 📁 test/                      ← Testes automatizados
│   ├── *.spec.ts               ← Testes unitários
│   └── *.e2e.ts                ← Testes end-to-end
│
├── 📁 config/                    ← Configurações extras
│   └── oxlint.json              ← Linter config
│
├── 📁 .docker/                   ← Docker
│   ├── docker-compose.yml
│   └── docker-compose.postgres.yml
│
├── 📁 docs/                      ← Documentação
│   ├── ADR-*.md                 ← Decisões arquiteturais
│   └── *.md                     ← Documentos
│
├── 📁 dist/                      ← Build compilado (gerado)
├── 📁 node_modules/              ← Dependências (gerado)
└── 📁 storage/                   ← Armazenamento (gerado)
```

---

## 🎓 Entendendo o Fluxo de Upload

### O que Acontece Quando Você Faz Upload?

```
1️⃣ Cliente envia arquivo via POST /documents
        ↓
2️⃣ Controller valida:
   ✓ Arquivo presente?
   ✓ Formato correto? (PDF/PNG/JPEG)
   ✓ API key válida?
        ↓
3️⃣ IngestionService processa:
   ✓ Calcula hash SHA-256 do arquivo
   ✓ Verifica se já existe (dedup)
   ✓ Salva arquivo em storage/
   ✓ Cria documento no banco (RECEIVED)
   ✓ Enfileira job no BullMQ
        ↓
4️⃣ ProcessingService (worker) executa:
   ✓ Busca documento
   ✓ Chama document intelligence provider
   ✓ Extrair informações, confiança, etc
   ✓ Atualiza status para DONE ou FAILED
        ↓
5️⃣ Cliente consulta GET /documents/:id
   ✓ Retorna status e resultado
```

---

## 🔑 Autenticação (API Key)

Todas as requisições precisam do header:

```http
x-api-key: dev-key
```

**Configurado em:** `.env` como `API_KEY_PLACEHOLDER=dev-key`

**Sem a chave:**
```json
HTTP/1.1 401 Unauthorized
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 🧪 Rodando Testes Automatizados

### Rodar Todos os Testes

```bash
npm test
```

**Esperado:**
```
PASS src/app.controller.spec.ts
PASS src/api-key.guard.spec.ts
PASS test/document-workflow.spec.ts
PASS test/document-processing-edge-cases.spec.ts

Test Suites: 4 passed, 4 total
Tests:       11 passed, 11 total
Snapshots:   0 total
Time:        15.234 s
```

✅ **11 testes cobrindo:**
- Upload de arquivos
- Validação de formatos
- Deduplicação
- Fluxo de processamento
- Autenticação

### Rodar Testes de Integração

```bash
npm run test:e2e
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz com:

```bash
# Server
PORT=3000
NODE_ENV=development

# API
API_KEY_PLACEHOLDER=dev-key

# Database (deixe em branco para mock mode)
DATABASE_URL=

# Redis (deixe em branco para mock mode)
REDIS_HOST=
REDIS_PORT=

# Processing
PROVIDER_TIMEOUT_MS=45000
PROCESSING_MAX_ATTEMPTS=3
PROCESSING_BACKOFF_MS=1000
CONFIDENCE_THRESHOLD=0.8
WORKER_CONCURRENCY=1

# Storage
STORAGE_UPLOAD_DIR=./storage/uploads
```

> **Dica:** Se deixar `DATABASE_URL` e `REDIS_HOST` em branco, o sistema entra em **mock mode** (tudo em memória).

---

## 🐛 Troubleshooting

### Problema: "Cannot find module 'dist/main'"

```bash
npm run build
npm start
```

### Problema: "Port 3000 já está em uso"

Mude a porta no `.env`:
```bash
PORT=3001
```

Ou mate o processo anterior:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Problema: "Cannot connect to Redis"

Se vir erro como `Error: connect ECONNREFUSED 127.0.0.1:6379`:

**Opção 1:** Deixe em mock mode (delete `REDIS_HOST` do `.env`)

**Opção 2:** Inicie Redis:
```bash
npm run docker:up
```

### Problema: Testes falhando

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json dist
npm install
npm test
```

---

## 📚 Scripts Disponíveis

| Script | O que faz |
|--------|----------|
| `npm start` | Inicia servidor em modo produção |
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Compila TypeScript → JavaScript |
| `npm test` | Roda testes unitários |
| `npm run test:e2e` | Roda testes end-to-end |
| `npm run db:migrate` | Executa Prisma migrations |
| `npm run docker:up` | Inicia PostgreSQL e Redis |
| `npm run docker:down` | Para containers |

---

## 🎯 Próximos Passos

Depois de verificar que tudo funciona:

1. **Entenda o código:** Abra `src/app.controller.ts` e `src/documents/`
2. **Modifique validações:** Altere formatos aceitos em `src/documents/document-processing.service.ts`
3. **Adicione novo endpoint:** Estenda `AppController` com novas rotas
4. **Integre com banco real:** Execute `npm run docker:up` e use PostgreSQL
5. **Customize provider:** Modifique `document-intelligence-provider.port.ts`

---

## 📞 Suporte

Problemas? Verifique:
- ✅ Node.js v22.17.0+
- ✅ npm install completou
- ✅ Servidor rodando (`npm start`)
- ✅ Rest Client extension instalada
- ✅ Arquivo `rest-client/fixtures/sample.png` existe

---

## 📡 API Reference Detalhada

### 1️⃣ Health Check

```http
GET /health
x-api-key: dev-key
```

**Resposta (200):**
```json
{
  "status": "ok",
  "service": "DOC Intelligence - Trilha A"
}
```

---

### 2️⃣ Upload de Documento

```http
POST /documents
x-api-key: dev-key
Content-Type: multipart/form-data

file: <binary>  (PDF, PNG, ou JPEG)
```

**Parâmetros:**
- `file` (required): Arquivo em formato PDF, PNG, ou JPEG
- `x-api-key` (required): Chave de API (`dev-key`)

**Resposta (202 - Aceito para processamento):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RECEIVED",
  "contentHash": "sha256hash...",
  "duplicate": false,
  "uploadedAt": "2026-08-31T10:30:00.000Z"
}
```

**Resposta (200 - Duplicado):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "RECEIVED",
  "duplicate": true,
  "existingId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Erros:**
- `400` - Arquivo inválido ou formato não suportado
- `401` - API key inválida
- `413` - Arquivo muito grande

---

### 3️⃣ Consultar Documento por ID

```http
GET /documents/:id
x-api-key: dev-key
```

**Parâmetros:**
- `:id` (required): UUID do documento

**Resposta (200):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "DONE",
  "contentHash": "sha256hash...",
  "result": {
    "confidence": 0.95,
    "extractedText": "Lorem ipsum dolor sit amet...",
    "provenance": {
      "provider": "openai",
      "model": "gpt-4-vision",
      "timestamp": "2026-08-31T10:30:05.000Z"
    }
  },
  "uploadedAt": "2026-08-31T10:30:00.000Z"
}
```

**Status Possíveis:**
- `RECEIVED` - Arquivo recebido, aguardando processamento
- `PROCESSING` - Sendo processado
- `DONE` - Processado com sucesso
- `FAILED` - Erro durante processamento
- `PENDING_REVIEW` - Aguardando revisão manual

**Erros:**
- `400` - ID inválido
- `401` - API key inválida
- `404` - Documento não encontrado

---

### 4️⃣ Listar Documentos (com filtro opcional)

```http
GET /documents
x-api-key: dev-key

# Ou com filtro:
GET /documents?status=DONE
x-api-key: dev-key
```

**Parâmetros Query:**
- `status` (optional): Filtrar por status (RECEIVED, PROCESSING, DONE, FAILED, PENDING_REVIEW)

**Resposta (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "DONE",
    "contentHash": "sha256hash...",
    "uploadedAt": "2026-08-31T10:30:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "status": "PROCESSING",
    "contentHash": "sha256hash...",
    "uploadedAt": "2026-08-31T10:31:00.000Z"
  }
]
```

**Erros:**
- `401` - API key inválida
- `400` - Status inválido

---

## 🔐 Segurança

- ✅ **API Key Required:** Todas as rotas requerem header `x-api-key`
- ✅ **Input Validation:** Validação rigorosa de tipos de arquivo
- ✅ **File Size Limits:** Limite de tamanho por arquivo
- ✅ **CORS Enabled:** Mas apenas para origens autorizadas
- ✅ **Rate Limiting:** Implementado via Redis (em modo real)

---

## 🏗️ Estrutura Interna (Para Desenvolvedores)

### Arquitetura em Camadas

```
┌─────────────────────────────────────────────────┐
│         API Controller (app.controller.ts)       │
│      Rotas HTTP e validação básica               │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│        Service Layer (Lógica de Negócio)        │
│  • IngestionService    - Receber e validar      │
│  • ProcessingService   - Processar documento    │
│  • TrustPolicyService  - Validar confiança      │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│      Infrastructure / Adapters                  │
│  • DocumentRepository (Prisma)                  │
│  • DocumentQueue (BullMQ)                       │
│  • FileStorage                                  │
│  • DocumentIntelligenceProvider                 │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────┐
│           External Services                     │
│  • PostgreSQL (dados)                           │
│  • Redis (fila)                                 │
│  • OpenAI API (processamento)                   │
└─────────────────────────────────────────────────┘
```

### Ports & Adapters (Hexagonal Architecture)

**Ports (Interfaces):**
- `document-repository.port.ts` - Abstração de banco de dados
- `document-intelligence-provider.port.ts` - Abstração de processamento
- `storage-port.ts` - Abstração de armazenamento

**Adapters (Implementações):**
- `prisma-postgres.repository.ts` - Implementação com Prisma
- `mock-provider.ts` - Mock para testes
- `file-system-storage.ts` - Sistema de arquivos

---

## 📊 Fluxo de Dados

```
1. Cliente envia POST /documents com arquivo
       ↓
2. AppController.uploadDocument()
       ↓
3. Validação:
   ✓ Arquivo presente?
   ✓ Tipo correto?
   ✓ API key válida?
       ↓
4. IngestionService.ingest()
   • Calcula SHA-256 hash
   • Verifica duplicação
   • Salva arquivo
   • Cria record no BD (status: RECEIVED)
   • Enfileira job
       ↓
5. BullMQ Worker pega job
       ↓
6. ProcessingService.process()
   • Busca documento
   • Chama provider externo
   • Extrair informações
   • Atualiza status (DONE/FAILED)
       ↓
7. Cliente consulta GET /documents/:id
       ↓
8. AppController.getDocument()
   • Retorna status e resultado
```

---

## 💡 Conceitos Principais

### Deduplicação
Sistema compara hash SHA-256 de cada arquivo. Se já existe documento com mesmo hash, marca como duplicado.

### Enfileiramento Assíncrono
Ao receber upload, o documento entra em fila (BullMQ). Worker processa em background sem bloquear API.

### Estados do Documento
- **RECEIVED** - Enfileirado
- **PROCESSING** - Sendo processado
- **DONE** - Sucesso
- **FAILED** - Erro (com retry)
- **PENDING_REVIEW** - Confiança baixa

### Mock vs Real Mode
- **Mock:** Dados em memória, nenhuma dependência externa
- **Real:** PostgreSQL + Redis, persistência, escalabilidade

---

## 👨‍💻 Desenvolvimento

### Adicionar Novo Endpoint

```typescript
// src/app.controller.ts
@Post('/documents/analyze')
@UseGuards(ApiKeyGuard)
async analyzeDocument(@Body() dto: AnalyzeDto) {
  return this.appService.analyze(dto);
}
```

### Customizar Provider

```typescript
// src/documents/document-intelligence-provider.port.ts
export interface DocumentIntelligenceProvider {
  process(buffer: Buffer): Promise<ProcessingResult>;
}

// src/documents/custom-provider.ts
@Injectable()
export class CustomProvider implements DocumentIntelligenceProvider {
  async process(buffer: Buffer): Promise<ProcessingResult> {
    // Sua implementação aqui
  }
}
```

### Adicionar Validação

```typescript
// src/documents/document-processing.service.ts
private validateFile(file: Express.Multer.File): void {
  const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
  if (!allowed.includes(file.mimetype)) {
    throw new BadRequestException('Invalid file type');
  }
}
```

---

## 📚 Referências Externas

- **NestJS:** https://docs.nestjs.com/
- **Prisma:** https://www.prisma.io/docs/
- **BullMQ:** https://docs.bullmq.io/
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## 📝 Licença

Projeto desenvolvido para a Trilha A de Vertical Slice em Inteligência de Documentos.

---

## ✨ Versão

**v1.0.0** - 31 de Agosto, 2026

Última atualização do README: 31/08/2026

```bash
npm run build
npm start
```

### Problema: "Port 3000 já está em uso"

Mude a porta no `.env`:
```bash
PORT=3001
```

Ou mate o processo anterior:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

### Problema: "Cannot connect to Redis"

Se vir erro como `Error: connect ECONNREFUSED 127.0.0.1:6379`:

**Opção 1:** Deixe em mock mode (delete `REDIS_HOST` do `.env`)

**Opção 2:** Inicie Redis:
```bash
npm run docker:up
```

### Problema: Testes falhando

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json dist
npm install
npm test
```

---

## 📚 Scripts Disponíveis

| Script | O que faz |
|--------|----------|
| `npm start` | Inicia servidor em modo produção |
| `npm run start:dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Compila TypeScript → JavaScript |
| `npm test` | Roda testes unitários |
| `npm run test:e2e` | Roda testes end-to-end |
| `npm run db:migrate` | Executa Prisma migrations |
| `npm run docker:up` | Inicia PostgreSQL e Redis |
| `npm run docker:down` | Para containers |

---

## 🎯 Próximos Passos

Depois de verificar que tudo funciona:

1. **Entenda o código:** Abra `src/app.controller.ts` e `src/documents/`
2. **Modifique validações:** Altere formatos aceitos em `src/documents/document-processing.service.ts`
3. **Adicione novo endpoint:** Estenda `AppController` com novas rotas
4. **Integre com banco real:** Execute `npm run docker:up` e use PostgreSQL
5. **Customize provider:** Modifique `document-intelligence-provider.port.ts`

---

## 📞 Suporte

Problemas? Verifique:
- ✅ Node.js v22.17.0+
- ✅ npm install completou
- ✅ Servidor rodando (`npm start`)
- ✅ Rest Client extension instalada
- ✅ Arquivo `rest-client/fixtures/sample.png` existe

---

## 📄 API Reference

### POST /documents
```bash
curl -X POST http://localhost:3000/documents -F "file=@invoice.pdf"
```
Response (202): `{ "id": "uuid", "status": "RECEIVED", "existing": false }`

### GET /documents/:id
```bash
curl http://localhost:3000/documents/uuid
```
Response: Documento completo com status, confiança, resultado.

### GET /documents?status=DONE
Filtra por status: `RECEIVED|QUEUED|PROCESSING|DONE|PENDING_REVIEW|FAILED`

---

## 🔄 Fluxo de Estado

```
POST /documents (novo)
        ▼
    RECEIVED
        ▼
    QUEUED (enfileirado)
        ▼
    PROCESSING (worker consome)
        │
        ├─ Erro retentável → [backoff] → retry ou PENDING_REVIEW
        ├─ Erro não-retentável → PENDING_REVIEW
        └─ Sucesso → DONE (se confiança ≥ 0.8) ou PENDING_REVIEW
```

---

## 🧪 Testes

```bash
npm test                    # Todos (9 testes)
npm test -- --watch        # Watch mode
npm run test:cov           # Cobertura
npm run test:integration    # Teste real contra PostgreSQL (Docker deve estar ativo)
```

O teste de integração usa o `PrismaPostgresRepository` real, executa duas ingestões concorrentes com o mesmo conteúdo e verifica no PostgreSQL a existência de uma única linha e uma única chamada ao provider. Ele fica separado da suíte unitária porque exige infraestrutura local.

Para subir a infraestrutura local:

```bash
docker compose up -d postgres redis
npx prisma migrate deploy
npm run test:integration
```

O projeto usa a configuração do Prisma 7 em `prisma.config.ts`: a URL de conexão para migrations fica em `datasource.url` desse arquivo, enquanto `prisma/schema.prisma` declara apenas o provider PostgreSQL. `DATABASE_URL` é obrigatória; o arquivo `.env.example` contém somente placeholders.

O timeout do provider é configurável por `PROVIDER_TIMEOUT_MS` e tem default de 45 segundos, acima da latência máxima de 40 segundos descrita no ambiente.

**Suites**: 
- Workflow (dedup, retry, confiança) — 3 testes
- Edge cases (exhaustão, timeout, terminal states) — 5 testes  
- Controller smoke test — 1 teste

---

## 🛠️ Configuração

**Retry ajustável**:
```bash
PROCESSING_MAX_ATTEMPTS=5          # Tentativas
PROCESSING_BACKOFF_MS=2000         # Backoff base (ms)
```

**Confiança ajustável**:
```bash
CONFIDENCE_THRESHOLD=0.5           # Score mínimo para DONE
```

**Worker**:
```bash
WORKER_CONCURRENCY=4               # Parallelismo
```

---

## 🏛️ Arquitetura Detalhada

- **Domain** (`src/documents/`): Serviços, portas, tipos
- **Adapters** (`src/infrastructure/`, `src/prisma/`): Implementações
- **API** (`src/app.controller.ts`): Endpoints
- **Config** (`src/config.ts`): Variáveis centralizadas

Ver [ADRS.md](./ADRS.md) para decisões arquiteturais (hexagonal, CommonJS, adapters, etc.)

---

## 📊 Status do Projeto

✅ **100% Completo (MVP)**
- Ingestion + Deduplication
- Async processing com retry
- State machine (6 estados)
- Confidence-based routing
- PostgreSQL persistence
- Redis queue
- 8/8 testes passando
- Build CommonJS clean

---

## 🚢 Deployment

Docker + env vars para PostgreSQL, Redis, config.

Ver README seção "Deployment" para exemplos Dockerfile e CI/CD.

---

## 📖 Referências

- [ADRS.md](./ADRS.md) — Architecture Decision Records
- `/doc` — Especificação (SPEC-001, diagrama)
- [BullMQ Docs](https://docs.bullmq.io/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NestJS Docs](https://docs.nestjs.com/)

---

**Desenvolvido**: Demonstração de vertical slice com arquitetura hexagonal, fila assíncrona, e testes comportamentais.


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
