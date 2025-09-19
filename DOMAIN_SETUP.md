# Configuración de Dominio Personalizado

## 🌐 Instrucciones para agregar tu dominio

### 1. En Vercel Dashboard:
1. Ve a: https://vercel.com/nestor-basave-davalos-projects/jardin-infinito/settings/domains
2. Haz clic en "Add Domain"
3. Ingresa tu dominio (ej: jardininfinito.com)

### 2. Configuración DNS:

#### Opción A - Nameservers (Recomendado):
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

#### Opción B - Registros DNS Manuales:

**Para dominio raíz (jardininfinito.com):**
```
Type: A
Name: @
Value: 76.76.19.61
```

**Para www (www.jardininfinito.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Configuraciones adicionales recomendadas:

**Redirección de www a dominio raíz:**
```
Type: CNAME
Name: www
Value: jardininfinito.com
```

**Certificado SSL:**
- Vercel automáticamente genera certificados SSL gratuitos
- Se activa en 24-48 horas después de la configuración DNS

### 4. Verificación:
- La verificación puede tomar de 24 a 48 horas
- Vercel mostrará el estado en el dashboard
- Una vez verificado, tu sitio estará disponible en tu dominio personalizado

## 📝 Ejemplos de dominios comunes:
- jardininfinito.com
- www.jardininfinito.com
- tienda.jardininfinito.com (subdominio)

## ⚠️ Importante:
- Conserva la URL de Vercel como respaldo
- Configura redirecciones si es necesario
- El SSL se activa automáticamente
