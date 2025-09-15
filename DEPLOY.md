# Jardín Infinito - Despliegue en Vercel

## 🌐 URLs del Proyecto

### Producción
- **URL Principal**: https://jardin-infinito-oi0frlmg0-nestor-basave-davalos-projects.vercel.app
- **Panel Admin**: https://jardin-infinito-oi0frlmg0-nestor-basave-davalos-projects.vercel.app/admin
- **Login**: https://jardin-infinito-oi0frlmg0-nestor-basave-davalos-projects.vercel.app/login

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

## 📝 Credenciales de Admin
- Email: admin@jardininfinito.com
- Contraseña: admin123

## 🚀 Próximos Pasos
1. Configurar variables de entorno
2. Configurar base de datos PostgreSQL
3. Re-desplegar el proyecto
