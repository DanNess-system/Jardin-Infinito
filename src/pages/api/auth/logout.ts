import type { APIRoute } from 'astro';
import { AuthService } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionToken = cookies.get('session')?.value;

    if (sessionToken) {
      await AuthService.deleteSession(sessionToken);
    }

    const response = new Response(JSON.stringify({ 
      success: true, 
      message: 'Sesión cerrada exitosamente' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // Eliminar cookie de sesión
    response.headers.set('Set-Cookie', 'session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');

    return response;

  } catch (error) {
    console.error('Error en logout:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
