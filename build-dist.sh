#!/bin/bash

# Script para compilar manualmente
echo "Removendo dist anterior..."
rm -rf dist

echo "Compilando com TypeScript..."
npx tsc -p tsconfig.build.json

echo "Verificando resultado..."
if [ -f "dist/main.js" ]; then
  echo "✅ Build sucesso! dist/main.js criado"
  ls -lh dist/main.js
else
  echo "❌ Build falhou! dist/main.js não encontrado"
  echo "Conteúdo de dist:"
  ls -la dist/ || echo "dist não existe"
fi
