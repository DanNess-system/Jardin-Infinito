import React, { useState, useEffect } from 'react';

// Interfaz para los datos que llegan de WordPress
interface WordPressPlantaHabitar {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    precio_original?: string | number;
    precio_descuento?: string | number;
    imagen?: string | number;
    categoria?: string[] | string;
    producto_destacado?: boolean | string;
    descripcion_corta?: string;
  };
}

// Interfaz para los datos procesados que usaremos en el componente
interface PlantaHabitar {
  id: number;
  titulo: string;
  descripcion: string;
  precioOriginal: number;
  precioDescuento: number;
  imagen: string;
  categoria: string;
  destacado: boolean;
  descripcionCorta: string;
}

const PlantasHabitarLoader: React.FC = () => {
  const [plantas, setPlantas] = useState<PlantaHabitar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para convertir string a número, manejando valores vacíos
  const convertToNumber = (value: string | number | undefined): number => {
    if (!value || value === '') return 0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value.toString());
    return isNaN(parsed) ? 0 : parsed;
  };

  // Función para convertir array o string a string
  const convertToString = (value: string[] | string | undefined): string => {
    if (!value) return '';
    if (Array.isArray(value)) return value.join(', ');
    return value.toString();
  };

  // Función para obtener la URL de la imagen desde WordPress
  const getWordPressImageURL = async (imageId: string | number): Promise<string> => {
    if (!imageId || imageId === '') return '';
    
    try {
      const response = await fetch(`https://api.jardininfinito.com/wp-json/wp/v2/media/${imageId}`);
      if (!response.ok) return '';
      
      const mediaData = await response.json();
      return mediaData.source_url || '';
    } catch (error) {
      console.error('Error fetching image:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchPlantas = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.jardininfinito.com/wp-json/wp/v2/plantas-habitar');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data: WordPressPlantaHabitar[] = await response.json();
        
        // Procesar los datos y obtener las imágenes
        const plantasProcessed = await Promise.all(
          data.map(async (item) => {
            const imageURL = item.acf?.imagen 
              ? await getWordPressImageURL(item.acf.imagen)
              : '';

            return {
              id: item.id,
              titulo: item.title.rendered,
              descripcion: item.content.rendered.replace(/<[^>]*>/g, ''), // Remover HTML
              precioOriginal: convertToNumber(item.acf?.precio_original),
              precioDescuento: convertToNumber(item.acf?.precio_descuento),
              imagen: imageURL,
              categoria: convertToString(item.acf?.categoria),
              destacado: Boolean(item.acf?.producto_destacado),
              descripcionCorta: item.acf?.descripcion_corta || item.content.rendered.replace(/<[^>]*>/g, '').substring(0, 100) + '...'
            };
          })
        );

        setPlantas(plantasProcessed);
      } catch (err) {
        console.error('Error fetching plantas habitar:', err);
        setError('Error al cargar las plantas para habitar. Por favor intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlantas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Cargando plantas para habitar...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-lg font-semibold">Error al cargar plantas</p>
          <p className="text-sm">{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (plantas.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <p className="text-lg font-semibold">No hay plantas disponibles</p>
          <p className="text-sm">Pronto agregaremos nuevas plantas para habitar.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {plantas.map((planta) => {
        // Lógica para determinar el precio principal y si hay descuento
        const hayDescuento = planta.precioDescuento > 0 && planta.precioOriginal > planta.precioDescuento;
        const precioFinal = hayDescuento ? planta.precioDescuento : planta.precioOriginal;
        const mostrarPrecio = precioFinal > 0;

        return (
          <div key={planta.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
            {/* Imagen */}
            <div className="relative overflow-hidden h-64">
              {planta.imagen ? (
                <img 
                  src={planta.imagen} 
                  alt={planta.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              )}
              
              {/* Badge de destacado */}
              {planta.destacado && (
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                  Destacada
                </div>
              )}
              
              {/* Badge de descuento */}
              {hayDescuento && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round(((planta.precioOriginal - planta.precioDescuento) / planta.precioOriginal) * 100)}%
                </div>
              )}
            </div>

            {/* Contenido */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                {planta.titulo}
              </h3>
              
              {planta.categoria && (
                <p className="text-sm text-gray-500 mb-2">{planta.categoria}</p>
              )}
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {planta.descripcionCorta}
              </p>
              
              {/* Precios */}
              {mostrarPrecio && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${precioFinal.toFixed(0)}
                  </span>
                  {hayDescuento && (
                    <span className="text-lg text-gray-400 line-through">
                      ${planta.precioOriginal.toFixed(0)}
                    </span>
                  )}
                </div>
              )}
              
              {/* Botón de contacto */}
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/5215512345678?text=Hola! Me interesa la planta: ${encodeURIComponent(planta.titulo)}`}
                  className="flex-1 bg-primary text-white text-center py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Consultar
                </a>
                <button className="bg-gray-100 text-gray-600 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlantasHabitarLoader;