import { AuthService } from '../lib/auth';
import { prisma } from '../lib/db';

async function initializeApp() {
  try {
    console.log('🚀 Inicializando aplicación...');

    // Crear usuario administrador por defecto
    await AuthService.createDefaultAdmin();

    // Crear algunos productos de ejemplo si no existen
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      console.log('📦 Creando productos de ejemplo...');
      
      const productosEjemplo = [
        {
          titulo: "Hule Tinto",
          descripcion: "Hule Tinto es una planta de interior muy popular, conocida por su resistencia y facilidad de cuidado.",
          imagen: "/src/assets/plantas/hule_tinto.png",
          precioOriginal: 600,
          precioDescuento: 450,
          categoria: "Interior",
          stock: 10
        },
        {
          titulo: "Palma Cica",
          descripcion: "La Palma Cica es una planta de interior muy apreciada por su belleza y facilidad de cuidado.",
          imagen: "/src/assets/plantas/palma_cica.png",
          precioOriginal: 950,
          precioDescuento: 750,
          categoria: "Interior",
          stock: 5
        },
        {
          titulo: "Helechos Colgantes",
          descripcion: "Los Helechos Colgantes son plantas ideales para interiores, aportando un toque de frescura y elegancia.",
          imagen: "/src/assets/plantas/helechos_colgantes.png",
          precioOriginal: 450,
          precioDescuento: 320,
          categoria: "Colgantes",
          stock: 8
        },
        {
          titulo: "Cuna de Moisés",
          descripcion: "La Cuna de Moisés es una planta de interior muy popular, conocida por su resistencia y facilidad de cuidado.",
          imagen: "/src/assets/plantas/cuna_de_moises.png",
          precioOriginal: 750,
          precioDescuento: 580,
          categoria: "Interior",
          stock: 12
        }
      ];

      for (const producto of productosEjemplo) {
        await prisma.product.create({ data: producto });
      }

      console.log('✅ Productos de ejemplo creados');
    }

    // Limpiar sesiones expiradas
    await AuthService.cleanExpiredSessions();

    console.log('✅ Aplicación inicializada correctamente');

  } catch (error) {
    console.error('❌ Error inicializando aplicación:', error);
  }
}

// Ejecutar inicialización
initializeApp();
