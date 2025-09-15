import { defineMiddleware } from 'astro:middleware';
import { AuthService } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;
  
  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin'];
  
  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    url.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const sessionToken = cookies.get('session')?.value;
    
    if (!sessionToken) {
      return redirect('/login');
    }

    const user = await AuthService.verifySession(sessionToken);
    
    if (!user) {
      // Eliminar cookie inválida
      cookies.delete('session');
      return redirect('/login');
    }

    // Agregar información del usuario al contexto
    context.locals.user = user;
  }

  return next();
});
