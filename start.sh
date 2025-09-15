#!/bin/bash
# Script de inicialización para producción

echo "🚀 Iniciando configuración de producción..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install --production

# Generar cliente de Prisma
echo "🗄️ Configurando base de datos..."
npx prisma generate

# Crear base de datos y aplicar migraciones
npx prisma db push

# Poblar la base de datos con datos iniciales
npx prisma db seed

echo "✅ Configuración completada. Iniciando servidor..."
node ./dist/server/entry.mjs
