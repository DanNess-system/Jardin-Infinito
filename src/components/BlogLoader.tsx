import { useState, useEffect } from 'react';

// Interfaces para WordPress
interface WordPressBlogPost {
    id: number;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    content: {
        rendered: string;
    };
    featured_media: number;
    date: string;
    acf: {
        autor?: string;
        fecha_publicacion?: string;
        categoria?: string;
        tiempo_lectura?: number | string;
    };
}

interface WordPressMedia {
    id: number;
    source_url: string;
    alt_text: string;
}

interface BlogPost {
    id: number;
    titulo: string;
    extracto: string;
    contenido: string;
    imagen: string;
    imagenAlt: string;
    fecha: string;
    autor: string;
    categoria: string;
    tiempoLectura: number;
}

// Función para convertir valores a número
function convertToNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 5 : parsed; // Default 5 minutos si falla
    }
    return 5;
}

// Función para obtener la imagen desde WordPress
async function getMediaImage(mediaId: number, apiBase: string): Promise<{ url: string; alt: string } | null> {
    if (!mediaId || mediaId === 0) return null;
    
    try {
        const response = await fetch(`${apiBase}/wp-json/wp/v2/media/${mediaId}`);
        if (!response.ok) return null;
        
        const media: WordPressMedia = await response.json();
        return {
            url: media.source_url,
            alt: media.alt_text || 'Imagen del blog'
        };
    } catch (error) {
        console.error('Error fetching media:', error);
        return null;
    }
}

// Determinar la URL base de la API
// NOTA: WordPress siempre está en producción (no hay instalación local)
const getApiBase = (): string => {
    return 'https://api.jardininfinito.com';
};

interface BlogLoaderProps {
    maxPosts?: number;
    showOnlyRecent?: boolean;
}

export default function BlogLoader({ maxPosts = 6, showOnlyRecent = false }: BlogLoaderProps) {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const WP_API_BASE = getApiBase();
                console.log('🌐 API Base URL:', WP_API_BASE);
                console.log('📡 Fetching URL:', `${WP_API_BASE}/wp-json/wp/v2/blog?per_page=${maxPosts}&_embed`);
                
                const response = await fetch(`${WP_API_BASE}/wp-json/wp/v2/blog?per_page=${maxPosts}&_embed`);
                
                console.log('📊 Response status:', response.status);
                console.log('📊 Response OK:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`Error al cargar las entradas del blog: ${response.status}`);
                }

                const data: WordPressBlogPost[] = await response.json();

                console.log('📰 Blog posts recibidos:', data.length);
                console.log('📝 Datos completos recibidos:', data);
                if (data.length > 0) {
                    console.log('📝 Primer post (completo):', data[0]);
                    console.log('🖼️ Featured media ID:', data[0].featured_media);
                    console.log('🔧 ACF fields:', data[0].acf);
                }

                // Procesar cada post y obtener su imagen
                const postsWithImages = await Promise.all(
                    data.map(async (post) => {
                        console.log(`🔄 Procesando post ID ${post.id}:`, post.title.rendered);
                        const mediaData = await getMediaImage(post.featured_media, WP_API_BASE);
                        console.log(`🖼️ Media data para post ${post.id}:`, mediaData);
                        
                        const processedPost = {
                            id: post.id,
                            titulo: post.title.rendered,
                            extracto: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                            contenido: post.content.rendered,
                            imagen: mediaData?.url || '/placeholder-blog.jpg',
                            imagenAlt: mediaData?.alt || post.title.rendered,
                            fecha: post.acf?.fecha_publicacion || new Date(post.date).toLocaleDateString('es-ES'),
                            autor: post.acf?.autor || 'Jardín Infinito',
                            categoria: post.acf?.categoria || 'General',
                            tiempoLectura: convertToNumber(post.acf?.tiempo_lectura)
                        };
                        
                        console.log(`✅ Post procesado ${post.id}:`, processedPost);
                        return processedPost;
                    })
                );

                console.log('✨ Total posts procesados:', postsWithImages.length);
                console.log('✨ Posts finales:', postsWithImages);
                setPosts(postsWithImages);
            } catch (error) {
                console.error('❌ Error fetching blog posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [maxPosts]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl animate-pulse h-96"></div>
                ))}
            </div>
        );
    }

    // Mensaje cuando no hay posts
    if (posts.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay entradas de blog</h3>
                <p className="text-gray-500">Aún no se han publicado entradas. ¡Vuelve pronto!</p>
                <p className="text-sm text-gray-400 mt-4">Revisa la consola del navegador para más detalles (F12)</p>
            </div>
        );
    }

    const getCategoriaColor = (categoria: string) => {
        const colores: { [key: string]: string } = {
            'cuidado-plantas': 'bg-emerald-500',
            'diseno-jardin': 'bg-teal-500',
            'consejos': 'bg-lime-500',
            'tendencias': 'bg-green-500',
            'eventos': 'bg-primary'
        };
        return colores[categoria] || 'bg-primary';
    };

    const getCategoriaTexto = (categoria: string) => {
        const textos: { [key: string]: string } = {
            'cuidado-plantas': 'Cuidado de Plantas',
            'diseno-jardin': 'Diseño de Jardín',
            'consejos': 'Consejos',
            'tendencias': 'Tendencias',
            'eventos': 'Eventos'
        };
        return textos[categoria] || 'General';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <article
                    key={post.id}
                    className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                    {/* Imagen */}
                    <div className="relative h-56 overflow-hidden">
                        <img
                            src={post.imagen}
                            alt={post.imagenAlt}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                            <span className={`${getCategoriaColor(post.categoria)} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                                {getCategoriaTexto(post.categoria)}
                            </span>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        {/* Meta información */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>{post.fecha}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{post.tiempoLectura} min</span>
                            </div>
                        </div>

                        {/* Título */}
                        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                            {post.titulo}
                        </h3>

                        {/* Extracto */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                            {post.extracto}
                        </p>

                        {/* Autor y botón */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-sm text-gray-600">{post.autor}</span>
                            </div>
                            <a
                                href={`/blog/${post.id}`}
                                className="text-primary font-semibold hover:text-secondary transition-colors flex items-center gap-1"
                            >
                                Leer más
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
