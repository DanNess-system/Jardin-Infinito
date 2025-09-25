#!/bin/bash

# Script de despliegue para Hostinger
# Uso: ./deploy-hostinger.sh

echo "🚀 Iniciando despliegue para Hostinger..."

# Limpiar y construir el proyecto
echo "📦 Construyendo el proyecto..."
npm run build

# Verificar que el build fue exitoso
if [ ! -d "dist" ]; then
    echo "❌ Error: No se encontró la carpeta dist/"
    exit 1
fi

# Copiar .htaccess si no existe
if [ ! -f "dist/.htaccess" ]; then
    echo "📝 Copiando archivo .htaccess..."
    cp ".htaccess.template" "dist/.htaccess" 2>/dev/null || echo "⚠️  .htaccess ya existe o no se pudo copiar"
fi

# Crear archivo ZIP para subir a Hostinger
echo "📁 Creando archivo ZIP..."
cd dist
zip -r ../jardin-infinito-deploy.zip . -x "*.DS_Store"
cd ..

echo "✅ ¡Archivo jardin-infinito-deploy.zip creado!"
echo ""
echo "📋 INSTRUCCIONES PARA HOSTINGER:"
echo "1. Ve a tu panel de Hostinger (hpanel)"
echo "2. Abre el File Manager"
echo "3. Ve a la carpeta public_html de tu dominio"
echo "4. Elimina todo el contenido actual (opcional)"
echo "5. Sube el archivo jardin-infinito-deploy.zip"
echo "6. Extrae el contenido en public_html"
echo "7. ¡Tu sitio estará en línea!"
echo ""
echo "🔗 Alternativamente, puedes usar FTP/SFTP para subir todo el contenido de la carpeta dist/"