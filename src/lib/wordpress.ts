// Cliente para consumir la API de WordPress
export class WordPressAPI {
  private baseUrl: string;
  private username?: string;
  private password?: string;

  constructor(baseUrl: string, username?: string, password?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remover slash final
    this.username = username;
    this.password = password;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Agregar autenticación básica si está disponible
    if (this.username && this.password) {
      const auth = btoa(`${this.username}:${this.password}`);
      headers.Authorization = `Basic ${auth}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WordPress API Error:', error);
      throw error;
    }
  }

  // Obtener todos los productos
  async getProducts(params: {
    per_page?: number;
    page?: number;
    status?: 'publish' | 'draft';
    orderby?: 'date' | 'title';
    order?: 'asc' | 'desc';
  } = {}) {
    const searchParams = new URLSearchParams();
    
    // Parámetros por defecto
    searchParams.append('per_page', (params.per_page || 10).toString());
    searchParams.append('page', (params.page || 1).toString());
    searchParams.append('status', params.status || 'publish');
    searchParams.append('orderby', params.orderby || 'date');
    searchParams.append('order', params.order || 'desc');

    return this.request(`/productos?${searchParams.toString()}`);
  }

  // Obtener un producto específico
  async getProduct(id: number) {
    return this.request(`/productos/${id}`);
  }

  // Obtener todos los servicios
  async getServices(params: {
    per_page?: number;
    page?: number;
    status?: 'publish' | 'draft';
  } = {}) {
    const searchParams = new URLSearchParams();
    
    searchParams.append('per_page', (params.per_page || 10).toString());
    searchParams.append('page', (params.page || 1).toString());
    searchParams.append('status', params.status || 'publish');

    return this.request(`/servicios?${searchParams.toString()}`);
  }

  // Obtener categorías
  async getCategories() {
    return this.request('/categories');
  }

  // Obtener media/imágenes
  async getMedia(id: number) {
    return this.request(`/media/${id}`);
  }

  // Crear producto (requiere autenticación)
  async createProduct(productData: any) {
    return this.request('/productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  // Actualizar producto (requiere autenticación)
  async updateProduct(id: number, productData: any) {
    return this.request(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  // Eliminar producto (requiere autenticación)
  async deleteProduct(id: number) {
    return this.request(`/productos/${id}`, {
      method: 'DELETE',
    });
  }
}

// Configuración del cliente
const WP_BASE_URL = import.meta.env.PUBLIC_WP_API_URL || 'https://tu-wordpress.com';
const WP_USERNAME = import.meta.env.WP_USERNAME;
const WP_PASSWORD = import.meta.env.WP_PASSWORD;

export const wordpressAPI = new WordPressAPI(WP_BASE_URL, WP_USERNAME, WP_PASSWORD);

// Tipos TypeScript para los datos
export interface WordPressProduct {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  acf: {
    precio_original: number;
    precio_descuento: number;
    categoria: string;
    stock: number;
    destacada: boolean;  // Nueva propiedad para productos destacados
    activo: boolean;
    imagen_producto: {
      url: string;
      alt: string;
    };
  };
  featured_media: number;
  date: string;
  modified: string;
  status: string;
}

export interface WordPressService {
  id: number;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf: {
    descripcion_corta: string;
    descripcion_completa: string;
    icono: {
      url: string;
      alt: string;
    };
    activo: boolean;
  };
  featured_media: number;
}