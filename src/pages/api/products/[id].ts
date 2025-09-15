import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/db';
import { AuthService } from '../../../lib/auth';

// GET: Obtener producto por ID
export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID del producto es requerido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const producto = await prisma.product.findUnique({
      where: { id }
    });

    if (!producto) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Producto no encontrado' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data: producto 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT: Actualizar producto (requiere autenticación)
export const PUT: APIRoute = async ({ params, request, cookies }) => {
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

    const { id } = params;
    const data = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID del producto es requerido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Producto no encontrado' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Actualizar producto
    const updateData: any = {};
    if (data.titulo) updateData.titulo = data.titulo;
    if (data.descripcion) updateData.descripcion = data.descripcion;
    if (data.imagen) updateData.imagen = data.imagen;
    if (data.precioOriginal) updateData.precioOriginal = parseFloat(data.precioOriginal);
    if (data.precioDescuento) updateData.precioDescuento = parseFloat(data.precioDescuento);
    if (data.categoria) updateData.categoria = data.categoria;
    if (data.stock !== undefined) updateData.stock = parseInt(data.stock);
    if (data.activo !== undefined) updateData.activo = data.activo;

    const producto = await prisma.product.update({
      where: { id },
      data: updateData
    });

    return new Response(JSON.stringify({ 
      success: true, 
      data: producto 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error actualizando producto:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE: Eliminar producto (requiere autenticación)
export const DELETE: APIRoute = async ({ params, cookies }) => {
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

    const { id } = params;

    if (!id) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'ID del producto es requerido' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar que el producto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Producto no encontrado' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Producto eliminado exitosamente' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error eliminando producto:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
