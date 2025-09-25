// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// Configuración simple para sitio estático con React Islands
export default defineConfig({
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      // Exponer variables de entorno al cliente
      'import.meta.env.WORDPRESS_API_URL': JSON.stringify(process.env.WORDPRESS_API_URL || 'https://api.jardininfinito.com')
    }
  }
});