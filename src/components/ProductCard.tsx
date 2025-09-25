import React, { useState } from 'react';

interface Imagen {
  url: string;
  alt: string;
  title: string;
}

interface Producto {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  imagenesAdicionales: Imagen[];
  precioOriginal: number;
  precioDescuento: number;
  categoria: string;
  stock: number;
  descripcionCorta: string;
}

interface ProductCardProps {
  producto: Producto;
}

const ProductCard: React.FC<ProductCardProps> = ({ producto }) => {
  const [imagenActual, setImagenActual] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Determinar los precios válidos (diferentes de null o 0)
  const precioOriginalValido = producto.precioOriginal && producto.precioOriginal > 0;
  const precioDescuentoValido = producto.precioDescuento && producto.precioDescuento > 0;
  
  // Lógica para determinar si hay descuento real
  const hayDescuento = precioOriginalValido && precioDescuentoValido && 
                       producto.precioDescuento < producto.precioOriginal;
  
  // Determinar el precio principal a mostrar
  const precioAMostrar = hayDescuento 
    ? producto.precioDescuento 
    : (precioDescuentoValido ? producto.precioDescuento : producto.precioOriginal);

  // Calcular el porcentaje de descuento solo si hay descuento real
  const descuentoPorcentaje = hayDescuento
    ? Math.round(((producto.precioOriginal - producto.precioDescuento) / producto.precioOriginal) * 100)
    : 0;

  // Crear array de todas las imágenes (principal + adicionales)
  const todasLasImagenes = [
    { url: producto.imagen, alt: producto.titulo, title: producto.titulo },
    ...producto.imagenesAdicionales
  ];

  const handleImageError = () => {
    setImageError(true);
  };

  const cambiarImagen = (index: number) => {
    setImagenActual(index);
    setImageError(false);
  };

  const imagenMostrar = imageError || !todasLasImagenes[imagenActual]?.url 
    ? '/JardinInfinito.png' 
    : todasLasImagenes[imagenActual].url;

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      {/* Badge de descuento */}
      {producto.precioDescuento < producto.precioOriginal && (
        <div className="absolute top-4 right-4 z-10">
          <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg animate-pulse">
            -{descuentoPorcentaje}%
          </span>
        </div>
      )}
      
      {/* Contenedor de imagen con galería */}
      <div className="relative overflow-hidden bg-[#f0f0f0] h-64">
        {/* Imagen principal */}
        <img 
          src={imagenMostrar}
          alt={todasLasImagenes[imagenActual]?.alt || producto.titulo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay con información adicional */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-sm font-medium">Stock: {producto.stock}</p>
            {producto.descripcionCorta && (
              <p className="text-xs mt-1 opacity-90">{producto.descripcionCorta}</p>
            )}
          </div>
        </div>

        {/* Navegación de galería */}
        {todasLasImagenes.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {todasLasImagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => cambiarImagen(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === imagenActual 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {producto.titulo}
        </h3>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {producto.descripcion}
        </p>
        
        {/* Categoría */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
            {producto.categoria}
          </span>
        </div>
        
        {/* Precios */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            {producto.precioDescuento < producto.precioOriginal ? (
              <>
                <span className="text-sm text-gray-500 line-through">
                  ${producto.precioOriginal.toLocaleString()}
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${producto.precioDescuento.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ${producto.precioOriginal.toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Estado de stock */}
          <div className={`text-sm font-medium px-2 py-1 rounded ${
            producto.stock > 0 
              ? 'text-green-600 bg-green-100' 
              : 'text-red-600 bg-red-100'
          }`}>
            {producto.stock > 0 ? 'Disponible' : 'Agotado'}
          </div>
        </div>
        
        {/* Botón de acción */}
        <button 
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
            producto.stock > 0
              ? 'bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
          disabled={producto.stock === 0}
          onClick={() => {
            // Aquí puedes agregar lógica para contactar por WhatsApp o abrir modal
            const mensaje = `¡Hola! Me interesa el producto: ${producto.titulo} - $${producto.precioDescuento || producto.precioOriginal}`;
            const whatsappUrl = `https://wa.me/523312177763?text=${encodeURIComponent(mensaje)}`;
            window.open(whatsappUrl, '_blank');
          }}
        >
          {producto.stock > 0 ? '¡Me interesa!' : 'Sin stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;