# Registro do Uso de IA no Projeto DOC Intelligence

**IA Utilizada:** Claude

---


## Prompts Utilizados

### Prompt 1 — Levantamento Bibliográfico (docs/references.md)

#### Objetivo


#### Regra fundamental — fontes reais, não inventadas

Toda referência DEVE ser uma fonte real, verificável, com URL que
realmente exista e realmente diga o que você está atribuindo a ela.
NÃO invente nomes de autores, títulos de artigos, ou datas. Se você não
tiver certeza de que uma fonte existe exatamente como está descrevendo,
NÃO a inclua — prefira menos referências e todas verificáveis a mais
referências com risco de fabricação. Cada referência precisa ser
acompanhada da URL de onde foi consultada.

Para cada uma das cinco áreas abaixo, busque e selecione fontes de
qualidade — prefira: documentação oficial de ferramentas/padrões,
artigos técnicos de engenheiros praticantes (não apenas marketing de
produto), papers ou livros reconhecidos na área, e conteúdo publicado
por quem implementou o padrão em produção (não apenas teoria).

#### As cinco áreas de pesquisa, e a decisão que cada uma sustenta

##### 1. Human-in-the-loop e limiar de confiança em pipelines de IA
Sustenta: RF-06, Política de Confiança (SPEC-001 Seção 4)
Busque por: arquitetura human-in-the-loop em processamento de
documentos, calibração de limiar de confiança, riscos de limiar mal
calibrado sobrecarregando fila de revisão humana.

##### 2. Idempotência e deduplicação por hash de conteúdo
Sustenta: ADR-003
Busque por: padrões de deduplicação por hash de conteúdo, diferença
entre idempotência estrutural e semântica, uso de TTL em chaves de
deduplicação.

##### 3. Resiliência contra dependência externa instável (retry, backoff, circuit breaker)
Sustenta: ADR-001, RF-04
Busque por: retry com backoff exponencial, diferenciação entre erros
retentáveis e não-retentáveis, padrões de circuit breaker para
serviços de terceiros instáveis, práticas específicas de retry em
chamadas a modelos de IA/LLM.

##### 4. Arquitetura hexagonal (portas e adaptadores)
Sustenta: ADR-002
Busque por: arquitetura hexagonal em aplicações Node.js/NestJS,
vantagens de isolar domínio de infraestrutura, e — importante —
críticas legítimas ao padrão (quando a abstração de porta se torna
redundante em vez de proteger lógica de domínio real). Preciso das
DUAS perspectivas, não só a favorável.

##### 5. Registro de decisões de arquitetura (ADR) e versionamento de prompt/modelo
Sustenta: formato usado nos ADR-001/002/003; RF-05 (proveniência)
Busque por: formato Michael Nygard de ADR, boas práticas de tamanho e
estrutura de um ADR, práticas de versionamento de prompt e modelo para
reprodutibilidade em pipelines de IA em produção.

#### Formato de saída para cada referência

Para cada fonte encontrada, registre:

  - **Título:** (título real da fonte)
  - **Autor/Organização:** (se disponível; senão, indique "não
    identificado" em vez de inventar um nome)
  - **URL:** (link real e funcional)
  - **Data de acesso:** (data desta pesquisa)
  - **Relevância:** uma frase objetiva conectando a fonte à decisão
    específica que ela sustenta (cite o ID do ADR ou RF)
  - **Achado principal:** 1-2 frases resumindo, em suas próprias
    palavras, o que a fonte diz — não copie texto da fonte literalmente

Organize o documento em cinco seções, uma por área acima, na mesma
ordem. Ao final de cada seção, adicione uma linha "Conexão com este
projeto:" resumindo como aquele conjunto de referências influenciou a
decisão registrada no ADR correspondente.

#### O que NÃO fazer

- Não gere uma bibliografia genérica de livros clássicos de engenharia
  de software só para preencher espaço (ex: não cite "Clean Code" ou
  "Design Patterns" a menos que tenha uma conexão específica e direta
  com uma das cinco áreas).
- Não copie trechos longos de nenhuma fonte — resuma com suas próprias
  palavras, respeitando direitos autorais.
- Não misture fontes de baixíssima qualidade (posts de fórum sem
  autoria, conteúdo puramente promocional de ferramenta) com fontes
  técnicas sérias sem sinalizar a diferença de peso entre elas.
- Se para alguma das cinco áreas você não encontrar fonte de qualidade
  suficiente, diga isso explicitamente na seção correspondente, em vez
  de forçar uma referência fraca só para preencher.

#### Validação final

Ao terminar, releia o documento e confirme, para cada URL listada, que
você realmente a consultou nesta sessão de pesquisa (não da memória de
treinamento) — se qualquer URL não puder ser confirmada como
realmente visitada, marque-a com uma nota "não verificada nesta sessão"
em vez de apresentá-la como fonte confirmada.

---

### Prompt 2 — Criação de Imagens das Modelagens do Arquivo do Projeto

**IA Utilizada para este prompt:** ChatGPT

#### Diagrama de Sequência:
Crie uma imagem de um Diagrama de Sequência técnico (estilo UML), em
fundo branco, formato paisagem, com aparência de documentação de
engenharia de software profissional (mesmo estilo visual de diagramas
de arquitetura corporativos: linhas limpas, cores sólidas por
participante, ícones simples dentro de círculos coloridos no topo de
cada coluna).

TÍTULO no topo, centralizado, em negrito, fonte sans-serif escura:
"Diagrama de Sequência — Fluxo Principal de Ingestão e Processamento"

SEIS PARTICIPANTES, cada um como uma caixa retangular com cantos
arredondados no topo da imagem, com um ícone circular colorido acima
do nome, e uma linha vertical pontilhada ("linha de vida") descendo
até o final do diagrama:

1. "C — Cliente" (ícone de pessoa/usuário, cor azul)
2. "API — Ingestão" (ícone de servidor/API, cor verde)
3. "DB — Repositório" (ícone de banco de dados/cilindro, cor roxa)
4. "Q — Fila" (ícone de camadas empilhadas, cor laranja/amarela)
5. "W — Worker" (ícone de engrenagem, cor azul-petróleo)
6. "P — Provider (Mock)" (ícone de nuvem, cor vermelha/rosa)

MENSAGENS, como setas horizontais entre as linhas de vida, na ordem
exata abaixo, de cima para baixo, com o texto da mensagem escrito
acima de cada seta:

1. Seta sólida, Cliente → API: "POST /documents (arquivo)"
2. Seta sólida curva (auto-mensagem), API → API: "sniff de tipo real (magic bytes)"
3. Seta sólida curva (auto-mensagem), API → API: "calcula hash SHA-256"
4. Seta sólida, API → DB: "existe documento com este hash? (transacional)"

Depois, um BLOCO RETANGULAR CINZA CLARO com a etiqueta "alt" no canto
superior esquerdo, dividido por uma linha pontilhada horizontal em
duas partes:

   Parte 1, rotulada "[hash já existe]":
   - Seta tracejada, DB → API: "documento existente"
   - Seta tracejada, API → Cliente: "200 {id, status existente}"

   Parte 2, rotulada "[hash novo]":
   - Seta tracejada, DB → API: "não existe"
   - Seta sólida, API → DB: "grava documento (status = RECEIVED)"
   - Seta sólida, API → Q: "enfileira job de processamento"
   - Seta tracejada, API → Cliente: "202 {id, status = RECEIVED}"
   - Seta sólida, Q → W: "entrega job"
   - Seta sólida, W → P: "chama extração"

   Dentro desta parte 2, um SEGUNDO BLOCO "alt" aninhado, também cinza
   claro com borda:

      Sub-parte A, rotulada "[erro retentável (timeout / 5xx / sem resposta)]":
      - Seta tracejada, P → W: "erro transitório"
      - Seta sólida curva (auto-mensagem), W → W: "aguarda backoff exponencial"
      - Seta sólida, W → P: "retenta (até N tentativas)"

      Sub-parte B, rotulada "[erro não-retentável (validação / recusa do modelo)]":
      - Seta tracejada, P → W: "erro definitivo"
      - Seta sólida, W → DB: "status = FAILED"

   Depois do bloco aninhado, ainda dentro da parte 2:
   - Seta tracejada, P → W: "resultado + score de confiança"
   - Seta sólida, W → DB: "grava resultado + proveniência {promptText, modelId, temperature}"

   Um TERCEIRO BLOCO "alt", aninhado no mesmo nível:

      Sub-parte A, rotulada "[confiança >= limiar]":
      - Seta sólida, W → DB: "status = DONE"

      Sub-parte B, rotulada "[confiança < limiar]":
      - Seta sólida, W → DB: "status = PENDING_REVIEW"

ESTILO VISUAL:
- Setas sólidas com ponta de seta cheia representam chamadas/pedidos.
- Setas tracejadas com ponta de seta aberta representam respostas.
- Os blocos "alt" devem ter cantos levemente arredondados, fundo
  cinza muito claro ou branco com borda cinza escura, e a etiqueta
  "alt" em uma pequena caixa colorida (azul) no canto superior
  esquerdo de cada bloco.
- Texto pequeno, legível, fonte sans-serif, preto sobre fundo branco.
- Espaçamento vertical generoso entre mensagens para não poluir.
- Adicione uma pequena legenda no rodapé, à esquerda, explicando:
  seta sólida = "Fluxo de Dados"; seta tracejada = "Resposta";
  retângulo "alt" = "Alternativa (bloco condicional)".

Mantenha fidelidade total à ordem e ao texto das mensagens listadas
acima — não invente, resuma ou reordene nenhuma mensagem.

---

### Prompt 3 — Diagrama de Estados

**IA Utilizada para este prompt:** ChatGPT

#### Diagrama de Estados:
Crie uma imagem de um Diagrama de Estados técnico (estilo UML, máquina
de estados), em fundo branco, formato paisagem, com aparência de
documentação de engenharia de software profissional: caixas
retangulares com cantos arredondados, cores sólidas suaves por tipo
de estado, setas de transição com rótulos legíveis, e notas explicativas
em caixas amarelas do tipo "post-it".

TÍTULO no topo, centralizado, em negrito, fonte sans-serif escura:
"Diagrama de Máquina de Estados — Ciclo de Vida do Documento"

ESTADOS (caixas retangulares com cantos arredondados, nome em negrito
na primeira linha e descrição curta na segunda linha, dentro da caixa):

1. Um CÍRCULO PRETO SÓLIDO pequeno, no canto superior esquerdo,
   representando o estado inicial (sem texto dentro, é só o marcador).

2. "RECEIVED" — "Documento recebido (hash novo)" — caixa azul clara,
   posicionada logo à direita/abaixo do círculo inicial.

3. "QUEUED" — "Aguardando processamento na fila" — caixa laranja/âmbar
   clara, abaixo de RECEIVED.

4. "PROCESSING" — "Processando documento" — caixa verde clara, abaixo
   de QUEUED. Esta caixa deve ter uma SETA CURVA SAINDO E VOLTANDO
   PARA ELA MESMA, do lado esquerdo, formando um laço.

5. "FAILED" — "Falha no processamento (retentativas esgotadas ou erro
   não-retentável)" — caixa vermelha clara, abaixo à esquerda de
   PROCESSING.

6. "DONE" — "Processamento concluído (resultado aceito)" — caixa verde
   clara (tom diferente de PROCESSING, mais escuro/saturado), abaixo
   ao centro de PROCESSING.

7. "PENDING_REVIEW" — "Aguardando revisão humana" — caixa âmbar/laranja
   clara, abaixo à direita de PROCESSING.

8. DOIS CÍRCULOS DE ESTADO FINAL (círculo preto sólido pequeno dentro
   de um círculo maior vazado — símbolo padrão UML de estado final),
   um abaixo de DONE e outro abaixo de PENDING_REVIEW.

TRANSIÇÕES (setas direcionais entre as caixas, com o texto do rótulo
próximo à seta, em fonte pequena):

1. Do círculo inicial → RECEIVED: rótulo "POST /documents (hash novo)"
2. RECEIVED → QUEUED: rótulo "job enfileirado"
3. QUEUED → PROCESSING: rótulo "worker inicia consumo"
4. PROCESSING → PROCESSING (a seta em laço mencionada acima): rótulo
   em três linhas: "erro retentável (timeout / 5xx / sem resposta)" /
   "aguarda backoff exponencial"
5. PROCESSING → FAILED: rótulo em duas linhas: "retentativas esgotadas"
   / "ou erro não-retentável"
6. PROCESSING → DONE: rótulo "confiança >= limiar"
7. PROCESSING → PENDING_REVIEW: rótulo "confiança < limiar"
8. FAILED → PENDING_REVIEW: rótulo "roteado para conferência humana"
   (esta seta deve cruzar horizontalmente por baixo das caixas DONE e
   PENDING_REVIEW, conectando FAILED, que está à esquerda, até
   PENDING_REVIEW, que está à direita)
9. DONE → círculo de estado final (o que está abaixo de DONE)
10. PENDING_REVIEW → círculo de estado final (o que está abaixo de
    PENDING_REVIEW)

DUAS CAIXAS DE NOTA (estilo post-it amarelo, com uma pequena linha
tracejada conectando a nota ao estado correspondente):

Nota 1, conectada a RECEIVED, posicionada à direita dele, com o texto:
"Se o hash do conteúdo já existe:
- retorna o documento existente,
- não cria novo registro,
- não chama o provider novamente"

Nota 2, conectada a PROCESSING, posicionada à direita dele, com o texto:
"Erro retentável ≠ erro não-retentável.
Só o primeiro grupo aciona retry."

LEGENDA no rodapé, à esquerda, em caixa com borda fina, contendo:
- Círculo preto sólido pequeno → "Estado inicial"
- Círculo vazado com círculo preto dentro → "Estado final"
- Retângulo arredondado → "Estado"
- Seta → "Transição"

ESTILO VISUAL GERAL:
- Cores por categoria de estado: azul para estados de entrada
  (RECEIVED), âmbar/laranja para estados de espera (QUEUED,
  PENDING_REVIEW), verde para estados de processamento e sucesso
  (PROCESSING, DONE), vermelho para estado de falha (FAILED).
- Fonte sans-serif, texto preto sobre fundo claro das caixas.
- Espaçamento generoso entre elementos para não poluir a leitura.
- Setas com ponta de seta cheia, linha sólida preta ou cinza escura.

Mantenha fidelidade total aos nomes dos estados, aos textos dos
rótulos de transição e ao conteúdo das duas notas — não resuma,
não invente texto adicional, e não reordene os estados.

---

### Prompt 4 — Diagrama de Componentes

**IA Utilizada para este prompt:** ChatGPT

#### Diagrama de Componentes:
Crie uma imagem de um Diagrama de Componentes técnico, em fundo branco,
formato paisagem, com aparência de documentação de arquitetura de
software profissional: sete grupos retangulares bem demarcados (cada
um com um rótulo de categoria no topo), caixas internas com cantos
arredondados, setas de fluxo de dados sólidas e setas de implementação
tracejadas, exatamente como um diagrama de arquitetura hexagonal.

TÍTULO no topo, centralizado, em negrito, fonte sans-serif escura:
"Diagrama de Componentes — Arquitetura de Processamento de Documentos"

SETE GRUPOS (subgraphs), cada um como um retângulo grande com borda
colorida e rótulo no topo esquerdo, contendo caixas menores dentro:

1. GRUPO "Cliente (Aplicação de Atendimento)" — borda azul, posição:
   extrema esquerda, topo.
   Contém uma caixa: "Aplicação cliente" (ícone de monitor/pessoa).

2. GRUPO "Camada de Entrada — API" — borda azul, à direita do grupo 1.
   Contém três caixas empilhadas verticalmente, cada uma com ícone de
   globo/API: "POST /documents", "GET /documents/:id",
   "GET /documents?status=".

3. GRUPO "Domínio" — borda verde, à direita do grupo 2.
   Contém três caixas empilhadas verticalmente, cada uma com ícone
   verde: "Serviço de Ingestão" (ícone de upload), "Serviço de
   Processamento" (ícone de engrenagem), "Política de Confiança"
   (ícone de escudo/check).

4. GRUPO "Fila" — borda roxa, à direita do grupo 3, mais acima na
   imagem (mesma altura do grupo Domínio).
   Contém uma caixa com ícone de camadas empilhadas: "BullMQ / Redis".

5. GRUPO "Worker de Processamento" — borda laranja, abaixo do grupo 4,
   à direita do grupo 3.
   Contém uma caixa com ícone de setas circulares (reciclagem/consumo):
   "Consumer".

6. GRUPO "Portas — Interfaces do Domínio" — borda laranja/âmbar mais
   forte, posicionado ABAIXO dos grupos 2 e 3, ocupando boa parte da
   largura da imagem.
   Contém três caixas com FUNDO AZUL-ESCURO/GRAFITE ESCURO e BORDA
   LARANJA, texto branco, cada uma com um pequeno ícone de "plugue" ou
   "encaixe": "DocumentIntelligenceProvider", "StoragePort",
   "DocumentRepository" — as três lado a lado, alinhadas
   horizontalmente.

7. GRUPO "Adaptadores — Implementações Concretas" — borda cinza-azulada
   clara, abaixo do grupo 6.
   Contém três caixas lado a lado, cada uma com um ícone temático:
   "MockProvider" (ícone de nuvem/circuito), "FileSystemStorage"
   (ícone de pasta), "PrismaPostgresRepository" (ícone de elefante do
   Postgres ou banco de dados).

SETAS DE FLUXO DE DADOS (linhas sólidas com ponta de seta cheia,
representando chamadas em tempo de execução):

1. Aplicação cliente → POST /documents, rotulada "multipart/form-data"
2. POST /documents → Serviço de Ingestão
3. Serviço de Ingestão → DocumentRepository (porta, grupo 6)
4. Serviço de Ingestão → StoragePort (porta, grupo 6)
5. Serviço de Ingestão → BullMQ/Redis (fila), rotulada "enfileira job"
6. BullMQ/Redis → Consumer (worker)
7. Consumer → Serviço de Processamento
8. Serviço de Processamento → DocumentIntelligenceProvider (porta)
9. Serviço de Processamento → Política de Confiança
10. Política de Confiança → DocumentRepository (porta)
11. GET /documents/:id → DocumentRepository (porta)
12. GET /documents?status= → DocumentRepository (porta)

SETAS DE IMPLEMENTAÇÃO (linhas TRACEJADAS, com ponta de seta aberta,
apontando de baixo para cima, do adaptador para a porta correspondente,
rotuladas "implementado por" no meio da linha):

1. MockProvider ---> DocumentIntelligenceProvider
2. FileSystemStorage ---> StoragePort
3. PrismaPostgresRepository ---> DocumentRepository

ESTILO VISUAL:
- As três caixas de porta (grupo 6) devem se destacar visualmente das
  demais: fundo escuro (grafite/azul-marinho escuro), borda laranja
  vibrante, texto branco — para deixar claro que são o elemento
  central da arquitetura.
- As demais caixas (grupos 1, 2, 3, 5, 7) usam fundo claro (branco ou
  tom pastel correspondente à cor da borda do grupo), texto escuro.
- O grupo "Fila" (grupo 4) usa tom lilás/roxo claro.
- Linhas de fluxo de dados: pretas ou cinza-escuras, sólidas, grossura
  média.
- Linhas de implementação: cinza médio, tracejadas, mais finas que as
  de fluxo de dados, para reforçar visualmente que representam uma
  relação estrutural (não uma chamada em execução), não um fluxo de
  dado.
- Adicione uma pequena legenda no rodapé, à esquerda, em caixa com
  borda fina, contendo três linhas: seta sólida = "Fluxo de Dados";
  seta tracejada = "Relação de Implementação"; ícone de plugue =
  "Porta (Interface do Domínio)".

Mantenha fidelidade total aos nomes dos componentes, ao agrupamento
em subgraphs e à direção de cada seta — não invente componentes
adicionais, não renomeie nenhuma caixa, e não altere a direção das
setas de implementação (sempre do adaptador concreto para a porta
abstrata, nunca o contrário).

---

### Prompt 5 — Expandir README.md Existente

**IA Utilizada para este prompt:** GitHub Copilot

#### Contexto

O README atual do projeto (colado abaixo) é funcional mas mínimo:
cobre instalação básica, um exemplo de teste e as variáveis de
ambiente em bloco único, sem explicação. Ele não orienta um
desenvolvedor que nunca viu o projeto por todo o caminho — falta
explicar por que Docker é obrigatório, o que esperar de cada comando,
como testar cada endpoint isoladamente, e o que cada variável de
ambiente realmente controla.

[COLAR AQUI O CONTEÚDO ATUAL DO README.md]

#### Objetivo

Reescreva este README, mantendo TODO o conteúdo técnico já presente
(os comandos, as variáveis, o exemplo de request) e expandindo com as
seções abaixo. Não invente comportamento que não existe no projeto —
tudo que for adicionado deve ser inferido do código real em src/ e
prisma/, não suposto.

#### O que adicionar, mantendo o que já existe

1. Um aviso destacado logo no topo, antes até da descrição do projeto,
   explicando que Docker é pré-requisito obrigatório (PostgreSQL +
   Redis rodam em containers) — hoje isso só aparece implícito no
   comando `docker:up`, sem explicação do motivo.

2. Uma tabela de pré-requisitos (Node.js, npm, Git, Docker) com o
   comando de verificação de versão de cada um.

3. Para cada comando do bloco "Como rodar", adicione o que o
   desenvolvedor deve ver de saída no terminal quando funciona
   corretamente — hoje os comandos aparecem sem essa confirmação.

4. Expanda a seção de teste manual: em vez de um único exemplo de
   upload, cubra os cenários que os arquivos de rest-client/ (se
   existirem no projeto) ou os testes automatizados (test/*.spec.ts)
   já cobrem — health check, upload de cada formato aceito, consulta
   por ID, listagem com filtro por status, e casos de erro (arquivo
   ausente, formato inválido). Para cada um, mostre o request e a
   resposta HTTP esperada, incluindo o código de status.

5. Adicione um diagrama de arquitetura em ASCII ou texto estruturado,
   mostrando o fluxo cliente → controller → serviços de domínio →
   portas → adaptadores → infraestrutura (Postgres/Redis) — baseado
   na estrutura real de pastas do projeto, não em uma arquitetura
   genérica.

6. Expanda a seção de Docker com: por que é necessário (quais serviços
   ele provê), como verificar se subiu corretamente (`docker ps`), e
   pelo menos os dois erros mais prováveis de conexão recusada
   (Postgres na porta 5432, Redis na porta 6379) com o comando de
   correção para cada.

7. Adicione a árvore de pastas real do projeto (rode `find` ou
   equivalente para gerar a árvore de verdade, não uma genérica), com
   um comentário de uma linha ao lado de cada pasta relevante
   explicando seu papel.

8. Para CADA variável de ambiente já listada no bloco de exemplo,
   adicione: o que ela controla, o valor padrão, e o que acontece se
   for alterada (por exemplo, o que muda se CONFIDENCE_THRESHOLD subir
   ou descer, ou se WORKER_CONCURRENCY aumentar). Baseie essa explicação
   no uso real da variável em src/config.ts e nos serviços que a
   consomem — não generalize.

9. Adicione uma seção de troubleshooting cobrindo pelo menos: Docker
   não sobe, porta já em uso, conexão recusada ao Postgres, conexão
   recusada ao Redis, módulo não encontrado após build.

10. Adicione uma tabela de scripts disponíveis, lendo diretamente o
    campo "scripts" do package.json do projeto — não invente scripts
    que não existem lá.

11. Adicione uma seção de referência de API mais completa: para cada
    endpoint real do controller (não invente endpoints), documente
    método, parâmetros, exemplo de resposta de sucesso e cada código
    de erro que o código realmente retorna.

12. Adicione uma seção curta sobre a arquitetura hexagonal (ports e
    adapters), citando os nomes reais dos arquivos de porta e adapter
    do projeto, com um link para os ADRs em docs/adr/ para quem quiser
    o raciocínio completo por trás.

#### Regra crítica — evitar duplicação

Ao final, releia o documento inteiro e confirme que NENHUMA seção
repete conteúdo já coberto em outra (por exemplo, não gere duas seções
diferentes de "Scripts Disponíveis" ou dois diagramas de fluxo de
estado que descrevam a máquina de estados de forma diferente um do
outro). Se notar que uma seção nova duplica uma já existente, faça
merge das duas em vez de manter ambas. O documento final deve poder
ser lido do início ao fim sem nenhuma seção contradizer outra —
especialmente ao descrever a máquina de estados do documento e o
fluxo de erro, que já foi corrigido no código (ver docs/adr/ADR-001 a
ADR-003 e o histórico de correções desta sessão) e deve aparecer no
README de forma consistente com essa correção, não com a versão
anterior a ela.

#### Formato final

Markdown, com emojis nos títulos de seção para facilitar escaneamento
visual, tabelas para dados estruturados (pré-requisitos, variáveis de
ambiente, scripts), e blocos de código para todo comando de terminal.

---

### Prompt 6 — Auditoria Técnica de Qualidade de Código (docs/AUDIT-002.md)

**IA Utilizada para este prompt:** Claude

#### Objetivo

Gere `docs/AUDIT-002.md` avaliando a QUALIDADE INTERNA do código-fonte
— não mais a conformidade com a especificação (isso já foi feito em
AS-BUILT-001) nem os quatro pilares arquiteturais (isso já foi feito
em AUDIT-001). Esta auditoria cobre: legibilidade, duplicação,
consistência de estilo, tratamento de erro, código morto, e
qualidade dos testes em si (não só se existem, mas se são bons).

Regra geral, igual às auditorias anteriores: toda afirmação precisa de
evidência (comando executado + saída, ou trecho de código citado).
Classifique cada item como CONFORME, PARCIAL ou NÃO CONFORME. Não
pule nenhum item; se não for possível verificar, diga isso
explicitamente.

#### 1. Duplicação de código

##### 1.1 Lógica repetida entre arquivos

Compare document-ingestion.service.ts e document-processing.service.ts:
existe lógica de atualização de status, tratamento de data (`new Date()`
repetido em toda escrita), ou construção de objeto de update que
poderia estar centralizada em um helper comum? Cite os trechos
duplicados literalmente, lado a lado.

##### 1.2 Ferramenta de detecção, se disponível

Se houver jscpd, ou ferramenta equivalente de detecção de duplicação
disponível no ambiente, rode e cole a saída. Se não houver, diga
explicitamente que a checagem foi manual.

#### 2. Tratamento de erro — consistência

##### 2.1 Padrão único de erro por camada

No controller: erros de validação (arquivo ausente, tipo inválido)
lançam exceção NestJS (BadRequestException) ou retornam objeto de
erro manualmente? Verifique se há mistura dos dois padrões nos
mesmos arquivos.

##### 2.2 Nenhum catch silencioso

Busque (grep) por blocos `catch` que não fazem nada com o erro
capturado (catch vazio, ou catch que só faz `console.log` sem
propagar nem tratar). Cite cada ocorrência com arquivo e linha.

##### 2.3 Mensagens de erro específicas, não genéricas

Verifique se mensagens de erro lançadas ao cliente (ex: 400, 500)
distinguem a causa real (ex: "tipo de arquivo não suportado" vs.
apenas "Bad Request" genérico). Cite exemplos de mensagens vagas, se
houver.

#### 3. Código morto e não utilizado

##### 3.1 Exports não referenciados

Se houver ferramenta de análise estática disponível (ts-prune, ou
equivalente), rode e cole a saída, listando exports declarados mas
nunca importados em nenhum outro arquivo. Se não houver ferramenta,
faça uma checagem manual em pelo menos os arquivos de src/documents/
e src/infrastructure/, cruzando declarações com usos via grep.

##### 3.2 Imports não utilizados

Rode o linter configurado no projeto (oxlint, conforme package.json)
e cole a saída completa, sem resumir. Reporte cada warning/erro
individualmente na tabela final, não apenas o total.

##### 3.3 Comentários de código morto (código comentado, não documentação)

Busque por blocos de código comentados (não documentação/JSDoc) que
pareçam ter sido deixados de uma versão anterior. Cite cada um.

#### 4. Qualidade dos testes (não apenas existência)

##### 4.1 Os testes testam comportamento ou implementação?

Releia os três testes de risco (dedup, retry, confiança). Para cada
um, avalie: se eu renomear uma variável interna ou reordenar uma
chamada sem mudar o comportamento externo, o teste continuaria
passando? Se o teste depende de detalhe de implementação (ex: nome
exato de um campo interno que não é parte do contrato), reporte como
PARCIAL e explique por quê.

##### 4.2 Assertions fracas

Busque por testes que usam apenas `toBeDefined()`, `toBeTruthy()`, ou
`not.toThrow()` sem verificar o valor real esperado — isso costuma
indicar teste que "passa sempre" sem provar comportamento específico.
Cite cada ocorrência.

##### 4.3 Testes sem isolamento (dependência de ordem de execução)

Verifique se algum teste depende de estado deixado por outro teste
anterior na mesma suíte (variável de módulo, mock não resetado entre
testes, arquivo temporário não limpo). Cite qualquer `beforeEach`/
`afterEach` ausente onde deveria existir.

#### 5. Consistência de estilo e nomenclatura

##### 5.1 Convenção de nomes coerente

Verifique se nomes de métodos, variáveis e arquivos seguem um padrão
único (camelCase para métodos/variáveis, kebab-case para arquivos —
ou qualquer que seja o padrão predominante). Cite qualquer
inconsistência encontrada.

##### 5.2 Formatação automática aplicada

Rode `npm run format -- --check` (ou equivalente do prettier
configurado) sem aplicar mudanças, e cole a saída — ela deve listar
qualquer arquivo fora do padrão de formatação configurado.

##### 5.3 Tipagem — uso de `any`

Busque (grep) por `: any` e `as any` em todo `src/`. Cada ocorrência
enfraquece a garantia de tipo que TypeScript deveria oferecer. Cite
cada uma com arquivo, linha, e avalie se é justificável (ex: em teste,
mockando dependência) ou evitável (ex: em código de produção real).

#### 6. Complexidade e legibilidade

##### 6.1 Métodos longos demais para entender de uma vez

Identifique qualquer método com mais de ~40 linhas de corpo (exclua
comentários e linhas em branco). Para cada um, avalie se poderia ser
quebrado em funções menores nomeadas, e sugira como, sem reescrever
o código de fato — apenas aponte o ponto de corte.

##### 6.2 Aninhamento excessivo de condicionais

Busque blocos com mais de 3 níveis de indentação por aninhamento de
if/try dentro de if/try. Cite o trecho.

#### Formato de saída obrigatório

Tabela-resumo final:

| Categoria | Item | Status | Evidência resumida |
|---|---|---|---|
| Duplicação | 1.1 | ... | ... |
| ... | ... | ... | ... |

Ao final da tabela, adicione uma seção "Top 3 prioridades de
correção" — não a lista inteira, apenas os três achados que, na sua
avaliação, têm maior impacto real no projeto dado o tempo restante
até a entrega. Justifique a priorização em uma frase por item.

#### O que NÃO fazer

- Não sugira reescrever a arquitetura ou revisitar decisões já
  fechadas em ADR-001/002/003 — esta auditoria é sobre qualidade de
  código dentro da arquitetura já decidida, não sobre arquitetura.
- Não gere métricas fabricadas (ex: "cobertura de 87%") sem rodar de
  fato uma ferramenta de cobertura e colar a saída real.
- Não corrija nada automaticamente nesta tarefa — esta é uma auditoria
  de leitura, não uma tarefa de correção. Correções vêm depois, sob
  prompt separado, uma vez que você e eu decidirmos as prioridades.

---

## Reporte de Problemas Usando IA

Duas vezes durante o projeto, solicitei que o agente auditasse o código para confirmar se determinadas correções haviam funcionado. O agente afirmou que sim, mas ao revisar os relatórios gerados, identifiquei contradições internas e trechos que pareciam reutilizar resultados de execuções anteriores ao invés de reexecutar os testes com dados atuais.


