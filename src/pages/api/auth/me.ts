import type { APIRoute } from 'astro';
import { AuthService } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const sessionToken = cookies.get('session')?.value;

    if (!sessionToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        authenticated: false 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const user = await AuthService.verifySession(sessionToken);

    if (!user) {
      return new Response(JSON.stringify({ 
        success: false, 
        authenticated: false 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      authenticated: true,
      user 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error verificando sesión:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      authenticated: false 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
