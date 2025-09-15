import bcrypt from 'bcryptjs';
import { prisma } from './db';
import type { User } from '@prisma/client';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export class AuthService {
  
  // Hashear contraseña
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  // Verificar contraseña
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Autenticar usuario
  static async authenticate(email: string, password: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    const isValidPassword = await this.verifyPassword(password, user.password);
    return isValidPassword ? user : null;
  }

  // Crear sesión
  static async createSession(userId: string): Promise<string> {
    const token = this.generateSessionToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await prisma.session.create({
      data: {
        userId,
        token,
        expiresAt
      }
    });

    return token;
  }

  // Verificar sesión
  static async verifySession(token: string): Promise<SessionUser | null> {
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role
    };
  }

  // Eliminar sesión
  static async deleteSession(token: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token }
    });
  }

  // Limpiar sesiones expiradas
  static async cleanExpiredSessions(): Promise<void> {
    await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }

  // Generar token de sesión
  private static generateSessionToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Crear usuario administrador por defecto
  static async createDefaultAdmin(): Promise<void> {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jardininfinito.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      const hashedPassword = await this.hashPassword(adminPassword);
      
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Administrador',
          role: 'admin'
        }
      });
      
      console.log(`✅ Usuario administrador creado: ${adminEmail}`);
    }
  }
}
