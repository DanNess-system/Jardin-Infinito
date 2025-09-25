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

# WordPress Headless - Configuración Completa para Jardín Infinito

## 🔌 Plugins Esenciales

### 1. **Custom Post Type UI**
- Plugin: `custom-post-type-ui`
- Para crear tipos de contenido personalizado

### 2. **Advanced Custom Fields (ACF)**
- Plugin: `advanced-custom-fields`
- Para campos personalizados

⚠️ **IMPORTANTE**: Solo necesitas estos 2 plugins. Los demás son opcionales.

## 🚀 CONFIGURACIÓN PASO A PASO

### 📁 1. Crear Custom Post Types

#### **CPT 1: Productos (Ya configurado)**
```
Post Type Slug: productos
Show in REST: True
```

#### **CPT 2: Servicios Generales**
1. Ve a **CPT UI > Add/Edit Post Types**
2. **Post Type Slug**: `servicios`
3. **Plural Label**: `Servicios`
4. **Singular Label**: `Servicio`
5. **Settings**: 
   - ✅ Public: True
   - ✅ Show in REST: True
   - REST API base slug: `servicios`

#### **CPT 3: Plant Bar**
```
Post Type Slug: plant-bar
Plural Label: Plant Bar Experiences
Singular Label: Plant Bar Experience
Show in REST: True
```

#### **CPT 4: Arreglos Florales**
```
Post Type Slug: arreglos-florales
Plural Label: Arreglos Florales
Singular Label: Arreglo Floral
Show in REST: True
```

#### **CPT 5: Centros de Mesa**
```
Post Type Slug: centros-mesa
Plural Label: Centros de Mesa
Singular Label: Centro de Mesa
Show in REST: True
```

#### **CPT 6: Ocasiones Especiales**
```
Post Type Slug: ocasiones-especiales
Plural Label: Ocasiones Especiales
Singular Label: Ocasión Especial
Show in REST: True
```

### 🎯 2. Configurar Campos ACF

#### **Field Group 1: Productos**
**Título del Field Group**: `Productos Fields`
**Location**: Post Type is equal to `productos`

```
Campo: Precio
- Field Label: Precio
- Field Name: precio
- Field Type: Number
- Default Value: 0

Campo: Precio con Descuento
- Field Label: Precio Descuento
- Field Name: precio_descuento
- Field Type: Number
- Default Value: 0

Campo: Descripción Corta
- Field Label: Descripción Corta
- Field Name: descripcion_corta
- Field Type: Text
- Max Characters: 150

Campo: Categoría
- Field Label: Categoría
- Field Name: categoria
- Field Type: Text
- Placeholder: Ej: plantas-interior, suculentas, aromáticas

Campo: Stock
- Field Label: Stock Disponible
- Field Name: stock
- Field Type: Number
- Default Value: 0

Campo: Producto Destacado
- Field Label: Producto Destacado
- Field Name: producto_destacado
- Field Type: True/False
- Default: No

Campo: Imagen Adicional 1
- Field Label: Imagen Adicional 1
- Field Name: imagen_adicional_1
- Field Type: Image
- Return Format: Image ID

Campo: Imagen Adicional 2
- Field Label: Imagen Adicional 2
- Field Name: imagen_adicional_2
- Field Type: Image
- Return Format: Image ID

Campo: Imagen Adicional 3
- Field Label: Imagen Adicional 3
- Field Name: imagen_adicional_3
- Field Type: Image
- Return Format: Image ID

Campo: Imagen Adicional 4
- Field Label: Imagen Adicional 4
- Field Name: imagen_adicional_4
- Field Type: Image
- Return Format: Image ID

⚠️ CRÍTICO: Show in REST = Yes
```

#### **Field Group 2: Plant Bar Experiences**
**Título del Field Group**: `Plant Bar Fields`
**Location**: Post Type is equal to `plant-bar`

```
Campo: Duración del Servicio
- Field Label: Duración
- Field Name: duracion
- Field Type: Text
- Default Value: 60 minutos

Campo: Capacidad Mínima
- Field Label: Capacidad Mínima
- Field Name: capacidad_minima
- Field Type: Number
- Default Value: 10

Campo: Capacidad Máxima
- Field Label: Capacidad Máxima
- Field Name: capacidad_maxima
- Field Type: Number
- Default Value: 50

Campo: Precio Base por Persona
- Field Label: Precio por Persona
- Field Name: precio_persona
- Field Type: Number
- Default Value: 450

Campo: Tipo de Plant Bar
- Field Label: Tipo
- Field Name: tipo_plant_bar
- Field Type: Select
- Choices:
suculentas : Plant Bar Suculentas
tropical : Plant Bar Tropical
aromaticas : Plant Bar Aromáticas

Campo: Incluye
- Field Label: Qué Incluye
- Field Name: incluye
- Field Type: Textarea

Campo: Disponible Para
- Field Label: Disponible Para
- Field Name: disponible_para
- Field Type: Checkbox
- Choices:
bodas : Bodas
cumpleanos : Cumpleaños
corporativo : Eventos Corporativos
baby_shower : Baby Showers
despedida : Despedidas

⚠️ CRÍTICO: Show in REST = Yes
```

#### **Field Group 3: Arreglos Florales**
**Título del Field Group**: `Arreglos Florales Fields`
**Location**: Post Type is equal to `arreglos-florales`

```
Campo: Tipo de Arreglo
- Field Label: Tipo de Arreglo
- Field Name: tipo_arreglo
- Field Type: Select
- Choices:
ramo_mano : Ramo de Mano
arreglo_jarron : Arreglo en Jarrón
corona : Corona Floral
corporativo : Corporativo
tematico : Temático
preservado : Flores Preservadas

Campo: Precio Mínimo
- Field Label: Precio Desde
- Field Name: precio_min
- Field Type: Number

Campo: Precio Máximo  
- Field Label: Precio Hasta
- Field Name: precio_max
- Field Type: Number

Campo: Flores Principales
- Field Label: Flores Principales
- Field Name: flores_principales
- Field Type: Text
- Placeholder: Ej: Rosas, Peonías, Eucalipto

Campo: Color Dominante
- Field Label: Color Dominante
- Field Name: color_dominante
- Field Type: Select
- Choices:
rojo : Rojo
rosa : Rosa
blanco : Blanco
amarillo : Amarillo
naranja : Naranja
purpura : Púrpura
mixto : Colores Mixtos

Campo: Ocasión Recomendada
- Field Label: Ocasión
- Field Name: ocasion
- Field Type: Select  
- Choices:
san_valentin : San Valentín
dia_madres : Día de las Madres
boda : Bodas
graduacion : Graduación
condolencia : Condolencias
cumpleanos : Cumpleaños

Campo: Disponibilidad
- Field Label: Disponible
- Field Name: disponible
- Field Type: True/False
- Default: Yes

⚠️ CRÍTICO: Show in REST = Yes
```

#### **Field Group 4: Centros de Mesa**
**Título del Field Group**: `Centros de Mesa Fields`
**Location**: Post Type is equal to `centros-mesa`

```
Campo: Estilo
- Field Label: Estilo
- Field Name: estilo
- Field Type: Select
- Choices:
clasico : Clásico Elegante
rustico : Rústico Natural
moderno : Moderno Minimalista

Campo: Altura
- Field Label: Altura
- Field Name: altura
- Field Type: Select
- Choices:
bajo : Bajo (15-25 cm)
medio : Medio (25-40 cm)  
alto : Alto (40+ cm)

Campo: Precio Base
- Field Label: Precio Base
- Field Name: precio_base
- Field Type: Number

Campo: Ocasión Ideal
- Field Label: Ocasión Ideal
- Field Name: ocasion_ideal
- Field Type: Select
- Choices:
boda : Bodas
cumpleanos : Cumpleaños
aniversario : Aniversarios
corporativo : Eventos Corporativos

Campo: Incluye Velas
- Field Label: Incluye Velas
- Field Name: incluye_velas
- Field Type: True/False

Campo: Material del Contenedor
- Field Label: Material
- Field Name: material_contenedor
- Field Type: Select
- Choices:
cristal : Cristal
ceramica : Cerámica
madera : Madera
metal : Metal

⚠️ CRÍTICO: Show in REST = Yes
```

#### **Field Group 5: Ocasiones Especiales**
**Título del Field Group**: `Ocasiones Especiales Fields`
**Location**: Post Type is equal to `ocasiones-especiales`

```
Campo: Tipo de Ocasión
- Field Label: Tipo de Ocasión
- Field Name: tipo_ocasion
- Field Type: Select
- Choices:
boda : Bodas
quinceanera : Quinceañeras
aniversario : Aniversarios
graduacion : Graduaciones
baby_shower : Baby Showers
cumpleanos : Cumpleaños

Campo: Estilo Recomendado
- Field Label: Estilo
- Field Name: estilo_recomendado
- Field Type: Text

Campo: Flores Sugeridas
- Field Label: Flores Sugeridas
- Field Name: flores_sugeridas
- Field Type: Textarea

Campo: Rango de Precios
- Field Label: Precio Desde
- Field Name: precio_desde
- Field Type: Number

Campo: Precio Hasta
- Field Label: Precio Hasta
- Field Name: precio_hasta
- Field Type: Number

Campo: Temporada Ideal
- Field Label: Temporada
- Field Name: temporada_ideal
- Field Type: Select
- Choices:
primavera : Primavera
verano : Verano
otono : Otoño
invierno : Invierno
todo_ano : Todo el Año

⚠️ CRÍTICO: Show in REST = Yes
```

### 🔗 3. URLs de API Resultantes

Después de la configuración tendrás estos endpoints:

```
Productos:
https://api.jardininfinito.com/wp-json/wp/v2/productos

Plant Bar:
https://api.jardininfinito.com/wp-json/wp/v2/plant-bar

Arreglos Florales:
https://api.jardininfinito.com/wp-json/wp/v2/arreglos-florales

Centros de Mesa:
https://api.jardininfinito.com/wp-json/wp/v2/centros-mesa

Ocasiones Especiales:
https://api.jardininfinito.com/wp-json/wp/v2/ocasiones-especiales
```

### 📝 4. Contenido de Ejemplo

#### **Producto de Ejemplo:**
```
Título: Monstera Deliciosa Premium
Descripción: Hermosa planta tropical de interior, perfecta para espacios con luz indirecta. Sus hojas fenestradas la convierten en una pieza de decoración única.
Precio: 650
Precio Descuento: 520
Descripción Corta: Planta tropical con hojas fenestradas, ideal para interiores
Categoría: plantas-interior
Stock: 15
Producto Destacado: Yes
Imagen Destacada: (Subir imagen principal)
Imagen Adicional 1: (ID de imagen adicional)
Imagen Adicional 2: (ID de imagen adicional)
Imagen Adicional 3: (ID de imagen adicional)
Imagen Adicional 4: (ID de imagen adicional)
```

#### **Plant Bar Experience de Ejemplo:**
```
Título: Plant Bar Suculentas Premium
Duración: 75 minutos
Capacidad Mínima: 15
Capacidad Máxima: 40  
Precio por Persona: 520
Tipo: suculentas
Incluye: Todas las plantas, macetas, herramientas, instructora, materiales decorativos
Disponible Para: bodas, cumpleanos, corporativo
```

#### **Arreglo Floral de Ejemplo:**
```
Título: Ramo Romántico de Rosas
Tipo: ramo_mano
Precio Desde: 450
Precio Hasta: 850
Flores Principales: Rosas rojas, Baby's breath, Eucalipto
Color Dominante: rojo
Ocasión: san_valentin
Disponible: Yes
```

#### **Centro de Mesa de Ejemplo:**
```
Título: Centro Clásico Elegante
Estilo: clasico
Altura: medio
Precio Base: 650
Ocasión Ideal: boda
Incluye Velas: Yes
Material: cristal
```

### ✅ 5. Verificación Final

Para cada Custom Post Type creado, verifica:

1. **CPT configurado con Show in REST = True**
2. **Field Group creado con Show in REST = Yes**
3. **Al menos 1 post de ejemplo creado**
4. **API responde correctamente**

#### **Ejemplo de verificación:**

**Para Productos:**
```
GET https://api.jardininfinito.com/wp-json/wp/v2/productos/1

Respuesta esperada:
{
  "id": 1,
  "title": {"rendered": "Monstera Deliciosa Premium"},
  "content": {"rendered": "Hermosa planta tropical de interior..."},
  "featured_media": 123,
  "acf": {
    "precio": 650,
    "precio_descuento": 520,
    "descripcion_corta": "Planta tropical con hojas fenestradas",
    "categoria": "plantas-interior",
    "stock": 15,
    "producto_destacado": true,
    "imagen_adicional_1": 124,
    "imagen_adicional_2": 125,
    "imagen_adicional_3": 126,
    "imagen_adicional_4": 127
  }
}
```

**Para Plant Bar:**
```
GET https://api.jardininfinito.com/wp-json/wp/v2/plant-bar/1

Respuesta esperada:
{
  "id": 1,
  "title": {"rendered": "Plant Bar Suculentas Premium"},
  "content": {"rendered": "Descripción del servicio..."},
  "acf": {
    "duracion": "75 minutos",
    "capacidad_minima": 15,
    "precio_persona": 520,
    "tipo_plant_bar": "suculentas",
    "incluye": "Todas las plantas, macetas..."
  }
}
```

### 🔧 6. Integración con React Components

Tu ProductsLoader.tsx ya está configurado para recibir `specificCategory`. Para los nuevos servicios, usarás:

```tsx
// Para Plant Bar
<ProductsLoader 
  specificCategory="plant-bar"
  showFilters={false}
  client:load 
/>

// Para Arreglos Florales  
<ProductsLoader 
  specificCategory="arreglos-florales"
  showFilters={true}
  client:load 
/>

// Para Centros de Mesa
<ProductsLoader 
  specificCategory="centros-mesa"
  showFilters={false}
  client:load 
/>
```

### 🚨 Troubleshooting Común

**Si los campos ACF aparecen vacíos:**
1. Verificar que Field Group tenga "Show in REST" = Yes
2. Re-guardar el Field Group
3. Verificar que los posts tengan contenido en los campos

**Si el Custom Post Type no aparece en la API:**
1. Verificar "Show in REST" = True en CPT
2. Verificar que el slug sea correcto
3. Refresh de permalinks en WordPress

¡Con esta configuración tendrás un sistema completo para manejar todos los servicios de Jardín Infinito desde WordPress headless!