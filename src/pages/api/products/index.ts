import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';
import { AuthService } from '../../../lib/auth';

// GET: Obtener todos los productos
export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URL(url).searchParams;
    const categoria = searchParams.get('categoria');
    const activo = searchParams.get('activo');

    const where: any = {};
    
    if (categoria && categoria !== 'Todas') {
      where.categoria = categoria;
    }
    
    if (activo !== null) {
      where.activo = activo === 'true';
    }

    const productos = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: productos 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obteniendo productos:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST: Crear nuevo producto (requiere autenticación)
export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Verificar autenticación
    const sessionToken = cookies.get('session')?.value;
    if (!sessionToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No autorizado' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await AuthService.verifySession(sessionToken);
    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Sesión inválida' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await request.json();
    const { titulo, descripcion, imagen, precioOriginal, precioDescuento, categoria, stock } = data;

    if (!titulo || !descripcion || !imagen || !precioOriginal || !precioDescuento || !categoria) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Todos los campos son requeridos' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const producto = await prisma.product.create({
      data: {
        titulo,
        descripcion,
        imagen,
        precioOriginal: parseFloat(precioOriginal),
        precioDescuento: parseFloat(precioDescuento),
        categoria,
        stock: parseInt(stock) || 0
      }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: producto 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error creando producto:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
