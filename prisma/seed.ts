import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('🌱 Iniciando seeding de la base de datos...');

    // Crear usuario administrador
    const adminEmail = 'admin@jardininfinito.com';
    const adminPassword = 'admin123';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Administrador',
          role: 'admin'
        }
      });
      
      console.log(`✅ Usuario administrador creado: ${adminEmail}`);
    } else {
      console.log('👤 Usuario administrador ya existe');
    }

    // Crear productos de ejemplo
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
        },
        {
          titulo: "Sansevieria",
          descripcion: "También conocida como lengua de suegra, es perfecta para principiantes por su extrema resistencia.",
          imagen: "/src/assets/plantas/hule_tinto.png",
          precioOriginal: 400,
          precioDescuento: 300,
          categoria: "Suculentas",
          stock: 15
        },
        {
          titulo: "Monstera Deliciosa",
          descripcion: "Una planta tropical espectacular con hojas perforadas que la hacen muy decorativa.",
          imagen: "/src/assets/plantas/palma_cica.png",
          precioOriginal: 800,
          precioDescuento: 650,
          categoria: "Interior",
          stock: 6
        }
      ];

      for (const producto of productosEjemplo) {
        await prisma.product.create({ data: producto });
        console.log(`  ✨ Producto creado: ${producto.titulo}`);
      }

      console.log('✅ Productos de ejemplo creados');
    } else {
      console.log('📦 Los productos ya existen en la base de datos');
    }

    console.log('🎉 Seeding completado exitosamente');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
