# Jardín Infinito - Despliegue en Vercel

## 🌐 URLs del Proyecto

### Producción
- **URL Vercel**: https://jardin-infinito-8z5h8onpv-nestor-basave-davalos-projects.vercel.app
- **Dominio Personalizado**: (Configura tu dominio en Vercel Dashboard)
- **Panel Admin**: /admin
- **Login**: /login

## 🔧 Configuración Pendiente

### Variables de Entorno en Vercel Dashboard:
1. Ve a: https://vercel.com/nestor-basave-davalos-projects/jardin-infinito/settings/environment-variables
2. Agrega estas variables:

```
SESSION_SECRET=tu-clave-super-secreta-para-produccion
NODE_ENV=production
```

### Base de Datos PostgreSQL:
1. Ve a: https://vercel.com/nestor-basave-davalos-projects/jardin-infinito/settings/storage
2. Crea una nueva base de datos PostgreSQL
3. Vercel agregará automáticamente las variables de entorno de la DB

### Dominio Personalizado:
1. Ve a: https://vercel.com/nestor-basave-davalos-projects/jardin-infinito/settings/domains
2. Agrega tu dominio personalizado
3. Configura DNS según las instrucciones de Vercel
4. Verifica el dominio (24-48 horas)

## 📝 Credenciales de Admin
- Email: admin@jardininfinito.com
- Contraseña: admin123

## 🚀 Próximos Pasos
1. ✅ Configurar variables de entorno
2. ✅ Configurar base de datos PostgreSQL
3. ✅ Agregar dominio personalizado
4. ✅ Re-desplegar el proyecto
