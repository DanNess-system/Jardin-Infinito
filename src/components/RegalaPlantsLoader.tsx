import React, { useState, useEffect } from 'react';

interface WordPressRegalaPlanta {
    id: number;
    title: { rendered: string };
    content: { rendered: string };
    featured_media: number;
    acf: {
        precio?: number | string;
        precio_descuento?: number | string;
        descripcion_corta?: string;
        categoria?: string | string[];
        stock?: number | string;
        producto_destacado?: boolean;
        etiqueta?: string; // Para badges como "Fácil Cuidado", "Purificador", etc.
        incluye?: string; // Para textos como "Incluye maceta", "Con maceta colgante"
        imagen_adicional_1?: number | string;
        imagen_adicional_2?: number | string;
        imagen_adicional_3?: number | string;
        imagen_adicional_4?: number | string;
        [key: string]: any;
    };
}

interface Imagen {
    url: string;
    alt: string;
    title: string;
}

interface PlantaRegalo {
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
    etiqueta: string;
    incluye: string;
}

interface RegalaPlantsLoaderProps {
    maxProducts?: number;
    title?: string;
}

// Función para obtener la URL base de WordPress API
function getWordPressAPIURL(): string {
    if (import.meta.env.WORDPRESS_API_URL) {
        return import.meta.env.WORDPRESS_API_URL;
    }
    
    if (typeof window !== 'undefined') {
        const currentHost = window.location.hostname;
        if (currentHost === 'jardininfinito.com' || currentHost === 'www.jardininfinito.com') {
            return 'https://api.jardininfinito.com';
        }
        if (currentHost === 'localhost' || currentHost.includes('127.0.0.1')) {
            return 'https://api.jardininfinito.com';
        }
    }
    
    return 'https://api.jardininfinito.com';
}

// Función para obtener plantas de regalo desde WordPress API
async function getRegalaPlantas(): Promise<WordPressRegalaPlanta[]> {
    const WP_API_BASE = getWordPressAPIURL();
    const response = await fetch(`${WP_API_BASE}/wp-json/wp/v2/regala-planta`);
    
    if (!response.ok) {
        throw new Error(`Error al obtener plantas de regalo: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

// Función para obtener imagen desde Media Library
async function getMediaImage(mediaId: number | string): Promise<Imagen | null> {
    const numericId = typeof mediaId === 'string' ? parseInt(mediaId) : mediaId;
    if (!numericId || numericId === 0 || isNaN(numericId)) return null;

    try {
        const WP_API_BASE = getWordPressAPIURL();
        const response = await fetch(`${WP_API_BASE}/wp-json/wp/v2/media/${numericId}`);
        if (!response.ok) {
            console.warn(`No se pudo obtener la imagen con ID ${numericId}: ${response.status}`);
            return null;
        }

        const media = await response.json();

        if (!media.source_url) {
            console.warn(`Imagen con ID ${numericId} no tiene URL válida`);
            return null;
        }

        return {
            url: media.source_url,
            alt: media.alt_text || media.title?.rendered || '',
            title: media.title?.rendered || `Imagen ${numericId}`
        };
    } catch (error) {
        console.error(`Error obteniendo imagen ${numericId}:`, error);
        return null;
    }
}

// Funciones auxiliares para conversión de datos
function convertToNumber(value: number | string | undefined | null): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
}

function convertToString(value: string | string[] | undefined | null): string {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
        return value.length > 0 ? value[0] : '';
    }
    return value;
}

// Función auxiliar para obtener todas las imágenes de una planta
async function obtenerImagenesPlanta(planta: WordPressRegalaPlanta): Promise<Imagen[]> {
    const imagenes: Imagen[] = [];

    // 1. Imagen destacada (featured_media)
    if (planta.featured_media && planta.featured_media !== 0) {
        const featuredImage = await getMediaImage(planta.featured_media);
        if (featuredImage) {
            imagenes.push(featuredImage);
        }
    }

    // 2. Imágenes adicionales de ACF
    for (let i = 1; i <= 4; i++) {
        const campoImagen = `imagen_adicional_${i}`;
        const imagenValue = planta.acf?.[campoImagen];
        if (imagenValue && imagenValue !== "" && imagenValue !== "0") {
            const img = await getMediaImage(imagenValue);
            if (img) {
                imagenes.push(img);
            }
        }
    }

    return imagenes;
}

const RegalaPlantsLoader: React.FC<RegalaPlantsLoaderProps> = ({ 
    maxProducts = 0,
    title = 'Nuestras Plantas Más Especiales para Regalar'
}) => {
    const [plantas, setPlantas] = useState<PlantaRegalo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const defaultImage = '/JardinInfinito.png';

    useEffect(() => {
        const cargarPlantas = async () => {
            try {
                setLoading(true);
                setError(null);

                const wpPlantas = await getRegalaPlantas();
                const plantasTransformadas: PlantaRegalo[] = [];

                for (const planta of wpPlantas) {
                    // Obtener todas las imágenes de la planta
                    const imagenes = await obtenerImagenesPlanta(planta);

                    // Determinar imagen principal e imágenes adicionales
                    let imagen = defaultImage;
                    let imagenesAdicionales: Imagen[] = [];

                    if (imagenes.length > 0) {
                        imagen = imagenes[0].url;
                        imagenesAdicionales = imagenes.slice(1);
                    }

                    plantasTransformadas.push({
                        id: planta.id,
                        titulo: planta.title.rendered,
                        descripcion: planta.content.rendered.replace(/<[^>]*>/g, '').trim() || 'Sin descripción',
                        imagen: imagen,
                        imagenesAdicionales: imagenesAdicionales,
                        precioOriginal: convertToNumber(planta.acf?.precio),
                        precioDescuento: convertToNumber(planta.acf?.precio_descuento),
                        categoria: convertToString(planta.acf?.categoria),
                        stock: convertToNumber(planta.acf?.stock),
                        descripcionCorta: planta.acf?.descripcion_corta || '',
                        etiqueta: planta.acf?.etiqueta || '',
                        incluye: planta.acf?.incluye || '',
                    });
                }

                // Limitar plantas si es necesario
                const plantasFiltradas = maxProducts > 0
                    ? plantasTransformadas.slice(0, maxProducts)
                    : plantasTransformadas;

                setPlantas(plantasFiltradas);

            } catch (error) {
                console.error('Error cargando plantas de regalo:', error);
                setError('No pudimos cargar las plantas de regalo en este momento.');
            } finally {
                setLoading(false);
            }
        };

        cargarPlantas();
    }, [maxProducts]);

    if (loading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">{title}</h3>
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || plantas.length === 0) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">{title}</h3>
                    <div className="text-center py-20">
                        <div className="text-gray-500 text-xl mb-4">
                            {error || 'No hay plantas especiales disponibles para regalar en este momento.'}
                        </div>
                        <p className="text-gray-400 text-sm">
                            Te invitamos a contactarnos directamente para conocer nuestras opciones disponibles.
                        </p>
                        <button
                            onClick={() => {
                                const mensaje = '¡Hola! Me interesa conocer sus plantas especiales para regalo.';
                                const whatsappUrl = `https://wa.me/523312177763?text=${encodeURIComponent(mensaje)}`;
                                window.open(whatsappUrl, '_blank');
                            }}
                            className="mt-6 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg hover:from-secondary hover:to-primary transition-all duration-300"
                        >
                            Contactar por WhatsApp
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-6">
                <h3 className="text-4xl font-bold text-center text-gray-800 mb-16">{title}</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {plantas.map((planta, index) => {
                        // Determinar los precios válidos
                        const precioOriginalValido = planta.precioOriginal && planta.precioOriginal > 0;
                        const precioDescuentoValido = planta.precioDescuento && planta.precioDescuento > 0;
                        
                        // Lógica para determinar si hay descuento real
                        const hayDescuento = precioOriginalValido && precioDescuentoValido && 
                                           planta.precioDescuento < planta.precioOriginal;
                        
                        // Determinar el precio principal a mostrar
                        const precioAMostrar = hayDescuento 
                            ? planta.precioDescuento 
                            : (precioDescuentoValido ? planta.precioDescuento : planta.precioOriginal);
                        
                        // Validar que siempre tengamos un precio válido para mostrar
                        const precioFinal = precioAMostrar && precioAMostrar > 0 ? precioAMostrar : null;

                        return (
                            <div
                                key={planta.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group animate__animated animate__fadeInUp"
                                style={{ animationDelay: `${(index % 4) * 0.1}s` }}
                            >
                                <div className="relative overflow-hidden">
                                    <img 
                                        src={planta.imagen}
                                        alt={planta.titulo}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.src = defaultImage;
                                        }}
                                    />
                                    {planta.etiqueta && (
                                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {planta.etiqueta}
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-gray-800 mb-2">{planta.titulo}</h4>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {planta.descripcionCorta || planta.descripcion}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            {hayDescuento ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm text-gray-500 line-through">
                                                        ${planta.precioOriginal.toLocaleString()}
                                                    </span>
                                                    <span className="text-2xl font-bold text-primary">
                                                        ${planta.precioDescuento.toLocaleString()}
                                                    </span>
                                                </div>
                                            ) : (
                                                precioFinal ? (
                                                    <span className="text-2xl font-bold text-primary">
                                                        ${precioFinal.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-400">
                                                        Consultar precio
                                                    </span>
                                                )
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            {planta.incluye || 'Incluye maceta'}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const precio = precioFinal ? `$${precioFinal}` : 'Precio a consultar';
                                            const mensaje = `¡Hola! Me interesa la planta para regalo: ${planta.titulo} - ${precio}`;
                                            const whatsappUrl = `https://wa.me/523312177763?text=${encodeURIComponent(mensaje)}`;
                                            window.open(whatsappUrl, '_blank');
                                        }}
                                        className="w-full mt-4 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:from-secondary hover:to-primary transition-all duration-300 font-medium"
                                    >
                                        ¡Me interesa regalar esta planta!
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default RegalaPlantsLoader;