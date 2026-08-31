#!/usr/bin/env node

/**
 * EXEMPLO PRÁTICO: Como a Aplicação Funciona
 * 
 * Este arquivo mostra exemplos reais de como usar a aplicação
 * em modo mock (padrão) e modo real (com Docker).
 * 
 * Veja também:
 * - docs/RESUMO-RAPIDO.md
 * - docs/MOCK-CONFIGURATION.md
 */

// ============================================================================
// EXEMPLO 1: Testes Unitários (Funcionam com Mocks)
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 1: TESTES UNITÁRIOS (Modo Mock - Padrão)            ║
╚════════════════════════════════════════════════════════════════╝

COMANDO:
  npm test

RESULTADO:
  ✅ 4 suites
  ✅ 11 testes
  ✅ Tempo: 7.4 segundos
  ✅ Sem Docker necessário

O QUE ACONTECE INTERNAMENTE:

1. MockPrismaRepository é instanciado
   └─ Armazena documentos em memória (Map<string, Document>)

2. MockRedisClient é usado
   └─ Simula fila BullMQ em memória

3. Testes executam
   └─ Ingestão de documentos
   └─ Processamento com provider mock
   └─ Validação de deduplicação

EXEMPLO DE TESTE:
`);

// ============================================================================
// EXEMPLO 2: Teste de Ingestão de Documento
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 2: TESTE DE INGESTÃO DE DOCUMENTO                   ║
╚════════════════════════════════════════════════════════════════╝

CÓDIGO DO TESTE (test/document-workflow.spec.ts):
────────────────────────────────────────────────────

import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('Document Workflow', () => {
  it('should ingest a PDF document and return an ID', async () => {
    // 1. Setup
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const controller = module.get(AppController);
    const mockFile = {
      buffer: Buffer.from('%PDF-1.7\\nTest document'),
      originalname: 'test.pdf',
      mimetype: 'application/pdf',
    };

    // 2. Ação
    const result = await controller.createDocument(mockFile, response);

    // 3. Validação
    expect(result).toHaveProperty('id');
    expect(result.status).toBe('PENDING');
    expect(result.duplicate).toBe(false);
  });
});

FLUXO INTERNO:

1. AppModule carrega (modo mock ativado)
   ├─ MockPrismaRepository criado
   ├─ MockRedisClient criado
   └─ MockProvider configurado

2. AppController.createDocument() executado
   ├─ Valida arquivo PDF/PNG/JPEG
   ├─ Calcula hash SHA-256
   └─ Chama DocumentIngestionService

3. DocumentIngestionService.ingestDocument()
   ├─ Verifica se documento já existe (MockPrismaRepository)
   ├─ Se novo: cria registro
   ├─ Enfileira job (MockRedisClient)
   └─ Retorna ID e status

4. Teste valida resultado
   ✅ ID foi gerado
   ✅ Status é PENDING
   ✅ Não é duplicado

RESULTADO NO CONSOLE:
  ✅ Test: should ingest a PDF document and return an ID
`);

// ============================================================================
// EXEMPLO 3: Teste de Deduplicação
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 3: TESTE DE DEDUPLICAÇÃO                             ║
╚════════════════════════════════════════════════════════════════╝

CÓDIGO DO TESTE (test/document-workflow.spec.ts):
────────────────────────────────────────────────────

it('should detect duplicate documents', async () => {
  const mockFile = {
    buffer: Buffer.from('%PDF-1.7\\nDuplicate test'),
    originalname: 'duplicate.pdf',
    mimetype: 'application/pdf',
  };

  // 1ª INGESTÃO
  const result1 = await controller.createDocument(mockFile, response);
  expect(result1.duplicate).toBe(false);  // ✅ Novo documento
  expect(result1.id).toBeDefined();
  const documentId = result1.id;

  // 2ª INGESTÃO (Mesmo arquivo)
  const result2 = await controller.createDocument(mockFile, response);
  expect(result2.duplicate).toBe(true);   // ✅ Detectado como duplicado
  expect(result2.id).toBe(documentId);    // ✅ Mesmo ID
});

FLUXO INTERNO:

1ª Ingestão:
  └─ hash = sha256('%PDF-1.7\\nDuplicate test')
  └─ MockPrismaRepository.findByContentHash(hash) → null
  └─ Cria novo documento
  └─ Armazena em memória
  └─ Retorna: duplicate=false, id='uuid-123'

2ª Ingestão (mesmo arquivo):
  └─ hash = sha256('%PDF-1.7\\nDuplicate test')  [MESMO]
  └─ MockPrismaRepository.findByContentHash(hash) → documento
  └─ Encontrou documento existente!
  └─ Retorna: duplicate=true, id='uuid-123'  [MESMO ID]

MOCK FUNCIONANDO:
  ✅ Map<string, Document> em memória
  ✅ Busca por contentHash funciona
  ✅ Deduplicação validada
`);

// ============================================================================
// EXEMPLO 4: Requisição HTTP Real
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 4: REQUISIÇÃO HTTP REAL (Com npm run start:dev)      ║
╚════════════════════════════════════════════════════════════════╝

PASSO 1: Iniciar aplicação
────────────────────────────
  $ npm run start:dev
  
  Output:
  [NestFactory] Starting Nest application...
  [InstanceLoader] BullMQQueueAdapter {}
  [InstanceLoader] BullMQWorkerAdapter {}
  [InstanceLoader] AppModule {}
  Nest application successfully started on port 3000

PASSO 2: Testar endpoint raiz
────────────────────────────
  $ curl http://localhost:3000/
  
  Header:
    x-api-key: test-key
  
  Response:
    Hello World!

PASSO 3: Upload de documento
────────────────────────────
  $ curl -X POST http://localhost:3000/documents \\
    -H "x-api-key: test-key" \\
    -F "file=@documento.pdf"
  
  Response:
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "duplicate": false
    }

PASSO 4: Recuperar status do documento
─────────────────────────────────────
  $ curl http://localhost:3000/documents/550e8400-e29b-41d4-a716-446655440000 \\
    -H "x-api-key: test-key"
  
  Response:
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "status": "PENDING",
      "result": null,
      "confidence": null,
      "provenance": null
    }

MOCK FUNCIONANDO:
  ✅ Documento armazenado em MockPrismaRepository
  ✅ Job enfileirado em MockRedisClient
  ✅ Provider mock pronto para processar
`);

// ============================================================================
// EXEMPLO 5: Modo Mock vs Modo Real
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 5: MODO MOCK vs MODO REAL                            ║
╚════════════════════════════════════════════════════════════════╝

MODO MOCK (Padrão - Desenvolvimento)
────────────────────────────────────

Comando:
  npm test
  npm run start:dev

Config:
  ENABLE_MOCKS=true (padrão)
  DATABASE_URL=ignorado
  REDIS_HOST=ignorado

Camadas:
  ┌─────────────────────┐
  │   AppController     │
  ├─────────────────────┤
  │ AppModule           │
  ├─────────────────────┤
  │ Services (Domínio)  │
  ├─────────────────────┤
  │ MockPrismaRepo   ◄──┼─ EM MEMÓRIA
  │ MockRedisClient  ◄──┼─ EM MEMÓRIA
  │ MockProvider     ◄──┼─ SIMULADO
  └─────────────────────┘

Testes:
  ✅ 11 testes em 7.4s
  ✅ Sem Docker
  ✅ Sem banco de dados
  ✅ Sem rede

MODO REAL (Validação - Com Docker)
──────────────────────────────────

Comando:
  docker-compose up -d
  ENABLE_MOCKS=false \\
  DATABASE_URL=postgresql://user:password@localhost:5432/doc-intelligence \\
  npm run test:e2e

Config:
  ENABLE_MOCKS=false
  DATABASE_URL=postgresql://...
  REDIS_HOST=localhost
  REDIS_PORT=6379

Camadas:
  ┌─────────────────────┐
  │   AppController     │
  ├─────────────────────┤
  │ AppModule           │
  ├─────────────────────┤
  │ Services (Domínio)  │
  ├─────────────────────┤
  │ PrismaPostgres   ◄──┼─ PostgreSQL 16-alpine
  │ BullMQ+Redis     ◄──┼─ Redis 7-alpine
  │ MockProvider     ◄──┼─ SIMULADO
  └─────────────────────┘

Testes:
  ✅ 1 e2e em 6.8s
  ✅ 1 integração em 5.7s
  ✅ Com Docker
  ✅ Com banco de dados real
  ✅ Com Redis real
`);

// ============================================================================
// EXEMPLO 6: Fluxo Completo de um Documento
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 6: FLUXO COMPLETO DE PROCESSAMENTO                   ║
╚════════════════════════════════════════════════════════════════╝

PASSO-A-PASSO (com Modo Mock):

1. USUÁRIO FAZI UPLOAD
   ─────────────────────
   POST /documents
   File: documento.pdf (Buffer com %PDF-1.7...)
   Header: x-api-key: test-key

2. VALIDAÇÃO NO CONTROLLER
   ─────────────────────────
   AppController.createDocument():
   ├─ ✅ Valida MIME type
   ├─ ✅ Valida tamanho (>= 4 bytes)
   ├─ ✅ Detecta formato (PDF/PNG/JPEG)
   └─ ✅ Rejeita outros formatos

3. INGESTÃO NO SERVIÇO
   ───────────────────
   DocumentIngestionService.ingestDocument():
   ├─ Calcula hash: sha256(buffer)
   ├─ Procura em MockPrismaRepository
   │  └─ findByContentHash(hash)
   │     ├─ Se existe: DUPLICADO ✅
   │     └─ Se não: NOVO ✅
   ├─ Se novo:
   │  ├─ Cria registro em MockPrismaRepository
   │  ├─ Status = PENDING
   │  └─ Enfileira job em MockRedisClient
   └─ Retorna resultado

4. RESPOSTA AO USUÁRIO
   ────────────────────
   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "status": "PENDING",
     "duplicate": false
   }

5. PROCESSAMENTO (Assíncrono em modo real)
   ─────────────────────────────────────────
   BullMQ Worker pega job da fila:
   ├─ Extrai documentId do job
   ├─ Chama DocumentProcessingService
   ├─ Provider analisa documento
   │  └─ MockProvider retorna análise
   ├─ Atualiza status
   │  └─ Status = PROCESSED
   ├─ Salva resultado
   └─ Remove job da fila

6. USUÁRIO CONSULTA RESULTADO
   ──────────────────────────
   GET /documents/550e8400-e29b-41d4-a716-446655440000
   Header: x-api-key: test-key

   {
     "id": "550e8400-e29b-41d4-a716-446655440000",
     "status": "PROCESSED",
     "result": "Extracted text from document...",
     "confidence": 0.95,
     "provenance": "mock-model"
   }

MOCK EM AÇÃO:
  ✅ MockPrismaRepository armazena documento
  ✅ MockRedisClient enfileira job
  ✅ MockProvider processa documento
  ✅ Tudo em memória, sem I/O
`);

// ============================================================================
// EXEMPLO 7: Executar Teste Específico
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 7: EXECUTAR TESTES ESPECÍFICOS                       ║
╚════════════════════════════════════════════════════════════════╝

OPÇÃO 1: Rodar todos os testes
───────────────────────────────
  $ npm test
  
  Output:
  PASS src/app.controller.spec.ts (6.33 s)
  PASS src/api-key.guard.spec.ts (6.66 s)
  PASS test/document-workflow.spec.ts (6.27 s)
  PASS test/document-processing-edge-cases.spec.ts (6.28 s)
  
  Test Suites: 4 passed, 4 total
  Tests:       11 passed, 11 total
  Time:        7.398 s

OPÇÃO 2: Rodar teste específico
────────────────────────────────
  $ npm test -- document-workflow.spec.ts
  
  Output:
  PASS test/document-workflow.spec.ts (6.27 s)
    Document Workflow
      ✓ should ingest a PDF document and return an ID (45 ms)
      ✓ should detect duplicate documents (38 ms)

OPÇÃO 3: Modo watch (desenvolver)
─────────────────────────────────
  $ npm run test:watch
  
  Output:
  Watch mode
  Press a to run all tests
  Press o to run only changed tests
  Press p to filter by filename
  Press q to quit

OPÇÃO 4: Com cobertura
──────────────────────
  $ npm run test:cov
  
  Output:
  ───────────────────────────
  File                 | % Stmts | % Branch | % Funcs | % Lines |
  ───────────────────────────
  All files            |   85.2 |    78.5 |   92.0 |   84.8 |

MOCK FUNCIONANDO:
  ✅ Testes rodam em paralelo
  ✅ Sem dependências externas
  ✅ Watch mode super rápido
`);

// ============================================================================
// EXEMPLO 8: Como Mudar para Modo Real
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 8: MIGRAR PARA MODO REAL (com Docker)                ║
╚════════════════════════════════════════════════════════════════╝

PASSO 1: Iniciar Docker
───────────────────────
  $ docker-compose up -d
  
  Output:
  ✓ Image postgres:16-alpine Pulled 22.8s
  ✓ Image redis:7-alpine Pulled 12.3s
  ✓ Container postgres Started 7.7s
  ✓ Container redis Started 7.7s

PASSO 2: Preparar variáveis de ambiente
───────────────────────────────────────
  $ export ENABLE_MOCKS=false
  $ export DATABASE_URL=postgresql://user:password@localhost:5432/doc-intelligence

PASSO 3: Aplicar migrações
──────────────────────────
  $ npx prisma migrate deploy
  
  Output:
  Applying migration '20260830000000_init'
  Applying migration '20260831090000_add_document_status_index'
  All migrations have been successfully applied.

PASSO 4: Rodar testes em modo real
──────────────────────────────────
  $ npm run test:e2e
  
  Output:
  PASS test/app.e2e-spec.ts (6.8 s)
    AppController (e2e)
      ✓ / (GET) (150 ms)
  
  Test Suites: 1 passed, 1 total
  Tests:       1 passed, 1 total

PASSO 5: Parar Docker
─────────────────────
  $ docker-compose down
  
  Output:
  ✓ Container postgres Removed 1.5s
  ✓ Container redis Removed 1.5s

VOLTANDO PARA MOCK:
───────────────────
  $ unset ENABLE_MOCKS
  $ unset DATABASE_URL
  $ npm test  # ✅ Funciona novamente sem Docker!
`);

// ============================================================================
// EXEMPLO 9: Debug com Console Logs
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 9: DEBUG - Como os Mocks Funcionam                   ║
╚════════════════════════════════════════════════════════════════╝

VENDO O MOCK PRISMA FUNCIONANDO
───────────────────────────────

const repository = new MockPrismaRepository();

// 1. Criar documento
const doc = await repository.create({
  id: 'doc-1',
  filename: 'test.pdf',
  contentHash: 'abc123',
  mimeType: 'application/pdf',
  status: 'PENDING',
  // ... outros campos
});
console.log('Criado:', doc.id);  // Output: Criado: doc-1

// 2. Buscar por ID
const found = await repository.findById('doc-1');
console.log('Encontrado:', found?.filename);  // Output: Encontrado: test.pdf

// 3. Buscar por hash
const duplicate = await repository.findByContentHash('abc123');
console.log('Duplicado:', duplicate?.id);  // Output: Duplicado: doc-1

// 4. Atualizar status
const updated = await repository.updateStatus('doc-1', 'PROCESSED', 'Resultado', 0.95);
console.log('Status:', updated?.status);  // Output: Status: PROCESSED

// 5. Ver tudo em memória
console.log('Documentos:', repository.getAll().length);  // Output: Documentos: 1

VENDO O MOCK REDIS FUNCIONANDO
───────────────────────────────

const redis = new MockRedisClient();

// 1. Enfileirar job
await redis.lpush('document-processing', JSON.stringify({documentId: 'doc-1'}));
console.log('Enfileirado');  // Output: Enfileirado

// 2. Ver tamanho da fila
const len = await redis.llen('document-processing');
console.log('Tamanho da fila:', len);  // Output: Tamanho da fila: 1

// 3. Desempilhar job
const job = await redis.rpop('document-processing');
console.log('Job:', job);  // Output: Job: {"documentId":"doc-1"}

// 4. Fila vazia
const empty = await redis.llen('document-processing');
console.log('Fila vazia:', empty === 0);  // Output: Fila vazia: true

TUDO EM MEMÓRIA, SEM BANCO DE DADOS! ✅
`);

// ============================================================================
// EXEMPLO 10: Estrutura do Documento Armazenado
// ============================================================================

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  EXEMPLO 10: ESTRUTURA DO DOCUMENTO ARMAZENADO                ║
╚════════════════════════════════════════════════════════════════╝

DOCUMENTO NOVO
──────────────
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  filename: 'documento.pdf',
  contentHash: 'a1b2c3d4e5f6...',
  mimeType: 'application/pdf',
  storagePath: './storage/uploads/550e8400-e29b-41d4-a716-446655440000.pdf',
  status: 'PENDING',
  attempts: 0,
  confidence: null,
  result: null,
  provenance: null,
  errorType: null,
  lastError: null,
  createdAt: 2026-08-31T10:30:45.123Z,
  updatedAt: 2026-08-31T10:30:45.123Z
}

DOCUMENTO APÓS PROCESSAMENTO
───────────────────────────
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  filename: 'documento.pdf',
  contentHash: 'a1b2c3d4e5f6...',
  mimeType: 'application/pdf',
  storagePath: './storage/uploads/550e8400-e29b-41d4-a716-446655440000.pdf',
  status: 'PROCESSED',           ◄─ Mudou
  attempts: 1,                    ◄─ Mudou
  confidence: 0.95,               ◄─ Mudou
  result: 'Extracted text...',    ◄─ Mudou
  provenance: 'mock-model',       ◄─ Mudou
  errorType: null,
  lastError: null,
  createdAt: 2026-08-31T10:30:45.123Z,
  updatedAt: 2026-08-31T10:30:50.456Z  ◄─ Mudou
}

DOCUMENTO COM ERRO
──────────────────
{
  id: '550e8401-e29b-41d4-a716-446655440001',
  filename: 'documento2.pdf',
  contentHash: 'f1e2d3c4b5a6...',
  mimeType: 'application/pdf',
  storagePath: './storage/uploads/550e8401-e29b-41d4-a716-446655440001.pdf',
  status: 'RETRY',                ◄─ Retentar
  attempts: 2,                    ◄─ Tentou 2x
  confidence: null,
  result: null,
  provenance: null,
  errorType: 'TimeoutError',      ◄─ Tipo de erro
  lastError: 'Timeout while calling provider',
  createdAt: 2026-08-31T10:30:45.123Z,
  updatedAt: 2026-08-31T10:30:52.789Z
}

DOCUMENTO DUPLICADO
───────────────────
Ao tentar ingerir novamente, retorna:
{
  id: '550e8400-e29b-41d4-a716-446655440000',  ◄─ MESMO ID
  status: 'PROCESSED',
  duplicate: true,                              ◄─ MARCADO COMO DUPLICADO
  result: 'Extracted text...',
  confidence: 0.95,
  provenance: 'mock-model'
}

TUDO ARMAZENADO EM MEMÓRIA COM MOCKS ✅
`);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ EXEMPLOS CONCLUÍDOS                                        ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Para COMEÇAR:                                                ║
║  $ npm install                                                ║
║  $ npm test           # ✅ Funciona com mocks!               ║
║  $ npm run start:dev  # ✅ Aplicação rodando!                ║
║                                                                ║
║  Para VALIDAR com Docker:                                    ║
║  $ docker-compose up -d                                       ║
║  $ ENABLE_MOCKS=false npm run test:e2e                       ║
║  $ docker-compose down                                        ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
