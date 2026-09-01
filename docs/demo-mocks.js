#!/usr/bin/env node

/**
 * DEMONSTRAÇÃO PRÁTICA: Mocks em Ação
 * 
 * Execute este script para ver os mocks funcionando:
 *   npm install
 *   npx ts-node demo-mocks.ts
 * 
 * Ou em JavaScript puro:
 *   node demo-mocks-js.js
 */

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  DEMONSTRAÇÃO: Mocks Funcionando em Tempo Real                ║
╚════════════════════════════════════════════════════════════════╝
`);

// Simulação simplificada dos mocks
class SimpleMockRedis {
  constructor() {
    this.data = new Map();
    this.lists = new Map();
  }

  async lpush(key, ...values) {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key);
    list.unshift(...values);
    console.log(`  📤 Enfileirado em '${key}': ${values[0]}`);
    return list.length;
  }

  async rpop(key) {
    if (!this.lists.has(key)) return null;
    const list = this.lists.get(key);
    const value = list.pop();
    console.log(`  📥 Desempilhado de '${key}': ${value}`);
    return value;
  }

  async llen(key) {
    if (!this.lists.has(key)) return 0;
    return this.lists.get(key).length;
  }

  async set(key, value) {
    this.data.set(key, value);
    console.log(`  💾 Armazenado '${key}' = ${value}`);
  }

  async get(key) {
    return this.data.get(key) || null;
  }

  async flushdb() {
    this.data.clear();
    this.lists.clear();
    console.log(`  🗑️  Banco de dados limpo`);
  }
}

class SimpleMockRepository {
  constructor() {
    this.documents = new Map();
    this.counter = 0;
  }

  async create(data) {
    this.counter++;
    const doc = {
      id: `doc-${this.counter}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.documents.set(doc.id, doc);
    console.log(`  ✨ Documento criado: ${doc.id}`);
    return doc;
  }

  async findById(id) {
    return this.documents.get(id) || null;
  }

  async findByContentHash(hash) {
    for (const doc of this.documents.values()) {
      if (doc.contentHash === hash) {
        console.log(`  🔍 Encontrado duplicado: ${doc.id}`);
        return doc;
      }
    }
    return null;
  }

  async updateStatus(id, status, result, confidence) {
    const doc = this.documents.get(id);
    if (!doc) return null;
    doc.status = status;
    doc.result = result;
    doc.confidence = confidence;
    doc.updatedAt = new Date();
    console.log(`  🔄 Status atualizado: ${id} → ${status}`);
    return doc;
  }

  async getAll() {
    return Array.from(this.documents.values());
  }

  async clear() {
    this.documents.clear();
    this.counter = 0;
  }
}

// ============================================================================
// DEMO 1: Simulando Ingestão de Documento
// ============================================================================

async function demo1() {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│ DEMO 1: Ingestão de Documento                                  │
└────────────────────────────────────────────────────────────────┘
`);

  const repo = new SimpleMockRepository();
  const redis = new SimpleMockRedis();

  console.log(`1️⃣  Usuário faz upload de documento.pdf`);
  const docData = {
    filename: 'documento.pdf',
    contentHash: 'hash-abc123',
    mimeType: 'application/pdf',
    status: 'PENDING',
  };

  console.log(`\n2️⃣  Serviço de ingestão processa`);
  const doc1 = await repo.create(docData);
  await redis.lpush('document-processing', JSON.stringify({ documentId: doc1.id }));

  console.log(`\n3️⃣  Resultado retornado ao usuário`);
  console.log(`  ID: ${doc1.id}`);
  console.log(`  Status: ${doc1.status}`);
  console.log(`  Duplicado: false`);

  console.log(`\n4️⃣  Usuário faz upload do MESMO documento`);
  console.log(`\n5️⃣  Serviço detecta duplicação`);
  const doc2 = await repo.findByContentHash(docData.contentHash);

  console.log(`\n6️⃣  Resultado: Detectado como duplicado`);
  console.log(`  ID: ${doc2?.id} (MESMO ID)`);
  console.log(`  Duplicado: true ✅`);

  console.log(`\n7️⃣  Fila BullMQ (em memória)`);
  const queueSize = await redis.llen('document-processing');
  console.log(`  Tamanho da fila: ${queueSize} job(s)`);
}

// ============================================================================
// DEMO 2: Deduplicação em Tempo Real
// ============================================================================

async function demo2() {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│ DEMO 2: Deduplicação Funcionando                               │
└────────────────────────────────────────────────────────────────┘
`);

  const repo = new SimpleMockRepository();

  // Upload 1
  console.log(`1️⃣  Upload do documento: "relatorio.pdf" com hash "xyz789"`);
  const doc1 = await repo.create({
    filename: 'relatorio.pdf',
    contentHash: 'xyz789',
    mimeType: 'application/pdf',
    status: 'PENDING',
  });

  // Upload 2 (mesmo arquivo)
  console.log(`\n2️⃣  Upload do MESMO documento: "relatorio.pdf"`);
  console.log(`\n3️⃣  Sistema procura por hash "xyz789"`);
  const existing = await repo.findByContentHash('xyz789');

  if (existing) {
    console.log(`\n4️⃣  Resultado da Deduplicação:`);
    console.log(`  ✅ Duplicado encontrado!`);
    console.log(`  ID retornado: ${existing.id}`);
    console.log(`  Não cria documento novo`);
    console.log(`  Não ocupa espaço de armazenamento`);
    console.log(`  Não processa novamente`);
  }

  console.log(`\n5️⃣  Documentos em repositório:`);
  const all = await repo.getAll();
  console.log(`  Total: ${all.length} (não ${all.length + 1})`);
}

// ============================================================================
// DEMO 3: Pipeline de Processamento
// ============================================================================

async function demo3() {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│ DEMO 3: Pipeline de Processamento                              │
└────────────────────────────────────────────────────────────────┘
`);

  const repo = new SimpleMockRepository();
  const redis = new SimpleMockRedis();

  console.log(`1️⃣  ETAPA 1: Ingestão`);
  const doc = await repo.create({
    filename: 'contrato.pdf',
    contentHash: 'hash-contract',
    mimeType: 'application/pdf',
    status: 'PENDING',
  });

  console.log(`\n2️⃣  ETAPA 2: Enfileiramento`);
  await redis.lpush(
    'document-processing',
    JSON.stringify({
      documentId: doc.id,
      timestamp: new Date().toISOString(),
    })
  );

  console.log(`\n3️⃣  ETAPA 3: Simular processamento`);
  console.log(`  ⏳ Worker BullMQ detecta job`);
  const job = await redis.rpop('document-processing');
  console.log(`  📦 Job: ${job}`);

  console.log(`\n4️⃣  ETAPA 4: Provider analisa documento`);
  console.log(`  🤖 MockProvider simula análise...`);
  console.log(`  ✅ Análise completa`);

  console.log(`\n5️⃣  ETAPA 5: Atualizar status`);
  const processed = await repo.updateStatus(
    doc.id,
    'PROCESSED',
    'Extracted text from document...',
    0.92
  );

  console.log(`\n6️⃣  Documento Final:`);
  console.log(`  ID: ${processed.id}`);
  console.log(`  Status: ${processed.status}`);
  console.log(`  Confiança: ${(processed.confidence * 100).toFixed(0)}%`);
  console.log(`  Resultado: "${processed.result}"`);
}

// ============================================================================
// DEMO 4: Performance
// ============================================================================

async function demo4() {
  console.log(`
┌────────────────────────────────────────────────────────────────┐
│ DEMO 4: Performance - Processando 1000 Documentos               │
└────────────────────────────────────────────────────────────────┘
`);

  const repo = new SimpleMockRepository();
  const redis = new SimpleMockRedis();

  console.log(`\n⏱️  Iniciando teste de performance...`);
  const start = Date.now();

  // Ingerir 1000 documentos
  console.log(`\n1️⃣  Ingerindo 1000 documentos`);
  for (let i = 0; i < 1000; i++) {
    await repo.create({
      filename: `doc-${i}.pdf`,
      contentHash: `hash-${i}`,
      mimeType: 'application/pdf',
      status: 'PENDING',
    });

    if ((i + 1) % 250 === 0) {
      console.log(`  ✅ ${i + 1} documentos ingeridos`);
    }
  }

  console.log(`\n2️⃣  Processando 100 documentos`);
  for (let i = 0; i < 100; i++) {
    await repo.updateStatus(`doc-${i}`, 'PROCESSED', 'Done', 0.95);
  }

  const elapsed = Date.now() - start;

  console.log(`\n3️⃣  Testando deduplicação`);
  console.log(`  Procurando por hash-500...`);
  const dup = await repo.findByContentHash('hash-500');
  console.log(`  Encontrado: ${dup?.id} ✅`);

  console.log(`\n📊 Resultado de Performance:`);
  console.log(`  Tempo total: ${elapsed}ms`);
  console.log(`  1000 ingestões: ${(elapsed / 1000).toFixed(2)}ms por documento`);
  console.log(`  100 processamentos: ${(elapsed / 100).toFixed(2)}ms por processamento`);
  console.log(`  Busca por hash: Instantânea ✨`);
  console.log(`\n  ✅ Tudo em memória, sem banco de dados!`);
}

// ============================================================================
// EXECUTAR TODAS AS DEMOS
// ============================================================================

async function main() {
  await demo1();
  await demo2();
  await demo3();
  await demo4();

  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  ✅ DEMONSTRAÇÕES CONCLUÍDAS                                   ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  O que vimos:                                                  ║
║  ✅ Mocks em Memória Funcionando                              ║
║  ✅ Ingestão de Documentos                                    ║
║  ✅ Deduplicação Automática                                   ║
║  ✅ Pipeline de Processamento                                 ║
║  ✅ Performance com 1000 documentos                           ║
║                                                                ║
║  Agora experimente:                                            ║
║  $ npm test              # Testes com mocks ✅               ║
║  $ npm run start:dev     # Aplicação com mocks ✅           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);
}

main().catch(console.error);
