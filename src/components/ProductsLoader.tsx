import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface WordPressProduct {
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

interface ProductsLoaderProps {
    showOnlyFeatured?: boolean;
    maxProducts?: number;
    showFilters?: boolean;
    specificCategory?: string;
    title?: string;
}

// Función para obtener la URL base de WordPress API
function getWordPressAPIURL(): string {
    // En desarrollo, usar variable de entorno si existe
    if (import.meta.env.WORDPRESS_API_URL) {
        return import.meta.env.WORDPRESS_API_URL;
    }
    
    // En producción, detectar automáticamente basado en el dominio actual
    if (typeof window !== 'undefined') {
        const currentHost = window.location.hostname;
        if (currentHost === 'jardininfinito.com' || currentHost === 'www.jardininfinito.com') {
            return 'https://api.jardininfinito.com';
        }
        // Para desarrollo local
        if (currentHost === 'localhost' || currentHost.includes('127.0.0.1')) {
            return 'https://api.jardininfinito.com';
        }
    }
    
    // Fallback por defecto
    return 'https://api.jardininfinito.com';
}

// Función para obtener productos desde WordPress API
async function getWordPressProducts(): Promise<WordPressProduct[]> {
    const WP_API_BASE = getWordPressAPIURL();
    const response = await fetch(`${WP_API_BASE}/wp-json/wp/v2/productos`);
    
    if (!response.ok) {
        throw new Error(`Error al obtener productos: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

// Función para obtener imagen desde Media Library
async function getMediaImage(mediaId: number | string): Promise<Imagen | null> {
    // Convertir a número y validar
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
    if (value === null || value === undefined) return 'General';
    if (Array.isArray(value)) {
        return value.length > 0 ? value[0] : 'General';
    }
    return value;
}

// Función auxiliar para obtener todas las imágenes de un producto
async function obtenerImagenesProducto(product: WordPressProduct): Promise<Imagen[]> {
    const imagenes: Imagen[] = [];

    // 1. Imagen destacada (featured_media)
    if (product.featured_media && product.featured_media !== 0) {
        const featuredImage = await getMediaImage(product.featured_media);
        if (featuredImage) {
            imagenes.push(featuredImage);
        }
    }

    // 2. Imágenes adicionales de ACF (escalable hasta 20 imágenes)
    for (let i = 1; i <= 20; i++) {
        const campoImagen = `imagen_adicional_${i}`;
        const imagenValue = product.acf?.[campoImagen];
        // Solo procesar si el valor existe y no es string vacío
        if (imagenValue && imagenValue !== "" && imagenValue !== "0") {
            const img = await getMediaImage(imagenValue);
            if (img) {
                imagenes.push(img);
            }
        }
    }

    return imagenes;
}

const ProductsLoader: React.FC<ProductsLoaderProps> = ({ 
    showOnlyFeatured = false, 
    maxProducts = 0, 
    showFilters = true,
    specificCategory = '',
    title = ''
}) => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [categorias, setCategorias] = useState<string[]>(['Todas']);
    const [categoriaActiva, setCategoriaActiva] = useState<string>('Todas');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const defaultImage = '/JardinInfinito.png'; // Imagen por defecto en public

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                setLoading(true);
                setError(null);

                const wpProducts = await getWordPressProducts();
                const productosTransformados: Producto[] = [];

                for (const product of wpProducts) {
                    // Filtrar por destacados si es necesario
                    if (showOnlyFeatured && !product.acf?.producto_destacado) {
                        continue;
                    }

                    // Filtrar por categoría específica si se proporciona
                    if (specificCategory && product.acf?.categoria !== specificCategory) {
                        continue;
                    }

                    // Obtener todas las imágenes del producto
                    const imagenes = await obtenerImagenesProducto(product);

                    // Determinar imagen principal e imágenes adicionales
                    let imagen = defaultImage;
                    let imagenesAdicionales: Imagen[] = [];

                    if (imagenes.length > 0) {
                        imagen = imagenes[0].url;
                        imagenesAdicionales = imagenes.slice(1);
                    }

                    productosTransformados.push({
                        id: product.id,
                        titulo: product.title.rendered,
                        descripcion: product.content.rendered.replace(/<[^>]*>/g, '').trim() || 'Sin descripción',
                        imagen: imagen,
                        imagenesAdicionales: imagenesAdicionales,
                        precioOriginal: convertToNumber(product.acf?.precio),
                        precioDescuento: convertToNumber(product.acf?.precio_descuento),
                        categoria: convertToString(product.acf?.categoria),
                        stock: convertToNumber(product.acf?.stock),
                        descripcionCorta: product.acf?.descripcion_corta || '',
                    });
                }

                // Limitar productos si es necesario
                const productosFiltrados = maxProducts > 0
                    ? productosTransformados.slice(0, maxProducts)
                    : productosTransformados;

                setProductos(productosFiltrados);

                // Extraer categorías únicas
                const categoriasUnicas = [...new Set(productosFiltrados.map(p => p.categoria))];
                setCategorias(['Todas', ...categoriasUnicas]);

            } catch (error) {
                console.error('Error cargando productos:', error);
                setError('Error al cargar los productos. Por favor, intenta de nuevo.');
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, [showOnlyFeatured, maxProducts, specificCategory]);

    // Filtrar productos por categoría
    const productosFiltrados = categoriaActiva === 'Todas'
        ? productos
        : productos.filter(p => p.categoria === categoriaActiva);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6">
            {title && (
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {title}
                    </h2>
                </div>
            )}

            {/* Filtros de categoría */}
            {showFilters && (
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categorias.map(categoria => (
                        <button
                            key={categoria}
                            onClick={() => setCategoriaActiva(categoria)}
                            className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-medium ${categoriaActiva === categoria
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:text-primary'
                                }`}
                        >
                            {categoria}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid de productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados.map((producto, index) => (
                    <div
                        key={producto.id}
                        className="animate__animated animate__fadeInUp"
                        style={{ animationDelay: `${(index % 8) * 0.1}s` }}
                    >
                        <ProductCard producto={producto} />
                    </div>
                ))}
            </div>

            {/* Mensaje si no hay productos */}
            {productosFiltrados.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">
                        No hay productos disponibles en esta categoría.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ProductsLoader;