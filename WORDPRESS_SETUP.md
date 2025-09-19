# WordPress Headless - Plugins Requeridos

## 🔌 Plugins Esenciales

### 1. **WP REST API (Incluido en WordPress)**
- Ya viene integrado en WordPress
- Proporciona endpoints básicos

### 2. **Custom Post Type UI**
- Plugin: `custom-post-type-ui`
- Para crear tipos de contenido personalizado (Productos, Servicios)

### 3. **Advanced Custom Fields (ACF)**
- Plugin: `advanced-custom-fields`
- Para campos personalizados (precio, descripción, imágenes)

### 4. **WP REST API Custom Fields**
- Plugin: `rest-api-custom-fields`
- Expone campos personalizados en la API

### 5. **JWT Authentication for WP REST API**
- Plugin: `jwt-authentication-for-wp-rest-api`
- Para autenticación segura

### 6. **WP REST API CORS**
- Plugin: `wp-rest-api-cors`
- Permite conexiones desde dominios externos

### 7. **Media Library REST API**
- Plugin: `wp-rest-api-media-library`
- Para gestionar imágenes vía API

## 📋 Lista de Instalación:

1. Custom Post Type UI
2. **Advanced Custom Fields** (versión gratuita) 
   - ⚠️ **Nota**: La versión gratuita NO incluye campo Gallery
   - **Alternativa**: Usar múltiples campos Image
3. JWT Authentication for WP REST API
4. REST API to MiniProgram
5. WP REST Cache
6. Application Passwords (WordPress 5.6+)

## 🚀 CONFIGURACIÓN PASO A PASO

### 📁 1. Crear Custom Post Types

#### Para Productos:
1. Ve a **CPT UI > Add/Edit Post Types**
2. Llena los siguientes campos:
   - **Post Type Slug**: `productos`
   - **Plural Label**: `Productos`
   - **Singular Label**: `Producto`
3. En **Settings**:
   - ✅ **Public**: True
   - ✅ **Show in REST**: True (IMPORTANTE)
   - **REST API base slug**: `productos`
   - ✅ **Has Archive**: True
   - ✅ **Supports**: Title, Editor, Thumbnail, Custom Fields
4. Clic en **Add Post Type**

#### Para Servicios:
1. Ve a **CPT UI > Add/Edit Post Types**
2. Llena los siguientes campos:
   - **Post Type Slug**: `servicios`
   - **Plural Label**: `Servicios`
   - **Singular Label**: `Servicio`
3. En **Settings**:
   - ✅ **Public**: True
   - ✅ **Show in REST**: True (IMPORTANTE)
   - **REST API base slug**: `servicios`
   - ✅ **Has Archive**: True
   - ✅ **Supports**: Title, Editor, Thumbnail, Custom Fields
4. Clic en **Add Post Type**

### 🎯 2. Configurar Campos ACF para Productos

1. Ve a **Custom Fields > Field Groups**
2. Clic en **Add New**
3. **Título del Field Group**: `Campos Productos`

#### Campos a agregar:

**Campo 1: Precio**
- **Field Label**: `Precio`
- **Field Name**: `precio`
- **Field Type**: `Number`
- **Default Value**: `0`

**Campo 2: Descripción Corta**
- **Field Label**: `Descripción Corta`
- **Field Name**: `descripcion_corta`
- **Field Type**: `Text`

**Campo 3: Categoría**
- **Field Label**: `Categoría`
- **Field Name**: `categoria`
- **Field Type**: `Select`
- **Choices** (uno por línea):
```
plantas_interior : Plantas de Interior
plantas_exterior : Plantas de Exterior
macetas : Macetas
herramientas : Herramientas
fertilizantes : Fertilizantes
```

**Campo 4: Stock**
- **Field Label**: `Stock`
- **Field Name**: `stock`
- **Field Type**: `Number`
- **Default Value**: `0`

**Campo 5: Producto Destacado**
- **Field Label**: `Producto Destacado`
- **Field Name**: `destacada`
- **Field Type**: `True / False`
- **Default Value**: `No`
- **Message**: `Marcar para mostrar en la sección destacados de la página principal`

**Campo 6: Imágenes Adicionales** (ACF Gratuito)
- **Field Label**: `Imagen Adicional 1`
- **Field Name**: `imagen_adicional_1`
- **Field Type**: `Image`

**Campo 7: Imágenes Adicionales 2**
- **Field Label**: `Imagen Adicional 2`
- **Field Name**: `imagen_adicional_2`
- **Field Type**: `Image`

**Campo 8: Imágenes Adicionales 3**
- **Field Label**: `Imagen Adicional 3`
- **Field Name**: `imagen_adicional_3`
- **Field Type**: `Image`

**Campo 8: Imágenes Adicionales 4**
- **Field Label**: `Imagen Adicional 4`
- **Field Name**: `imagen_adicional_4`
- **Field Type**: `Image`

> **Nota**: Con ACF gratuito usamos campos `Image` individuales en lugar de `Gallery`. Si necesitas más imágenes, puedes agregar más campos similares.

#### Configurar Ubicación:
- **Show this field group if**: Post Type is equal to `producto`

### 🎯 3. Configurar Campos ACF para Servicios

1. Ve a **Custom Fields > Field Groups**
2. Clic en **Add New**
3. **Título del Field Group**: `Campos Servicios`

#### Campos a agregar:

**Campo 1: Precio Base**
- **Field Label**: `Precio Base`
- **Field Name**: `precio_base`
- **Field Type**: `Number`
- **Default Value**: `0`

**Campo 2: Duración**
- **Field Label**: `Duración`
- **Field Name**: `duracion`
- **Field Type**: `Text`
- **Default Value**: `1 hora`

**Campo 3: Tipo de Servicio**
- **Field Label**: `Tipo de Servicio`
- **Field Name**: `tipo_servicio`
- **Field Type**: `Select`
- **Choices**:
```
mantenimiento : Mantenimiento
diseño : Diseño de Jardines
consultoria : Consultoría
instalacion : Instalación
```

**Campo 4: Incluye**
- **Field Label**: `Qué Incluye`
- **Field Name**: `incluye`
- **Field Type**: `Textarea`

#### Configurar Ubicación:
- **Show this field group if**: Post Type is equal to `servicio`

### ⚙️ 4. Configurar REST API

#### En wp-config.php agregar:
```php
// JWT Auth
define('JWT_AUTH_SECRET_KEY', 'tu-clave-secreta-muy-segura');
define('JWT_AUTH_CORS_ENABLE', true);
```

#### 🚨 IMPORTANTE: Verificar ACF en REST API

**Si los campos ACF aparecen vacíos (`"acf": []`) en la API, seguir estos pasos:**

1. **Ve a Custom Fields > Field Groups**
2. **Edita el Field Group "Campos Productos"**
3. **En la sección "Settings" (abajo del todo):**
   - ✅ **Show in REST**: `Yes` (CRÍTICO)
   - **REST API base**: `acf` (por defecto)

4. **Para cada campo individual:**
   - **Ve a cada campo (precio, categoria, etc.)**
   - **En "Field Settings":**
     - ✅ **Show in REST**: `Yes`

5. **Guardar los cambios**

#### 🔍 Debugging ACF:

**Verificar endpoint con ACF:**
```
https://api.jardininfinito.com/wp-json/wp/v2/productos/27
```

**La respuesta DEBE incluir:**
```json
{
  "acf": {
    "precio": 450,
    "categoria": "plantas_interior",
    "stock": 15,
    "descripcion_corta": "Planta ideal...",
    "imagen_adicional_1": 28,
    "imagen_adicional_2": 29,
    "imagen_adicional_3": null
  }
}
```

**Si sigue apareciendo `"acf": []`:**
1. Verificar que ACF plugin esté activo
2. Re-guardar los Field Groups
3. Verificar permisos de ACF en REST API

#### Verificar endpoints:
- **Productos**: `https://api.jardininfinito.com/wp-json/wp/v2/productos`
- **Servicios**: `https://api.jardininfinito.com/wp-json/wp/v2/servicios`

### 📝 5. Crear Contenido de Prueba

#### Productos de ejemplo:
1. Ve a **Productos > Add New**
2. Título: `Monstera Deliciosa`
3. Contenido: Descripción detallada de la planta
4. Llenar campos ACF:
    - Precio: `450`
    - Descripción Corta: `Planta de interior ideal para principiantes`
    - Categoría: `plantas_interior`
    - Stock: `15`
5. Agregar imagen destacada
6. Publicar

2. Ve a **Productos > Add New**
3. Título: `Ficus Lyrata`
4. Contenido: Planta de hojas grandes, perfecta para decoración moderna
5. Llenar campos ACF:
    - Precio: `620`
    - Descripción Corta: `Planta de interior de fácil mantenimiento`
    - Categoría: `plantas_interior`
    - Stock: `10`
6. Agregar imagen destacada
7. Publicar

#### Servicios de ejemplo:
1. Ve a **Servicios > Add New**
2. Título: `Mantenimiento de Jardín`
3. Contenido: Descripción del servicio
4. Llenar campos ACF:
   - Precio Base: `800`
   - Duración: `2 horas`
   - Tipo de Servicio: `mantenimiento`
   - Incluye: `Poda, riego, fertilización básica`
5. Agregar imagen destacada
6. Publicar

## 🌐 URLs de API Resultantes:

- **Productos**: `https://tu-wordpress.com/wp-json/wp/v2/productos`
- **Servicios**: `https://tu-wordpress.com/wp-json/wp/v2/servicios`
- **Media**: `https://tu-wordpress.com/wp-json/wp/v2/media`
- **Custom Fields**: Incluidos automáticamente con ACF