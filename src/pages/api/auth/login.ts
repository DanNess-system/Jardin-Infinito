import type { APIRoute } from 'astro';
import { AuthService } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await AuthService.authenticate(email, password);

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Credenciales inválidas' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionToken = await AuthService.createSession(user.id);

    const response = new Response(JSON.stringify({ 
      success: true, 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      } 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

    // Establecer cookie de sesión
    response.headers.set('Set-Cookie', `session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);

    return response;

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Error interno del servidor' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
