import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'campusiq_super_secure_jwt_secret_token_2025';

export interface UserTokenPayload {
  id: string;
  email: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  name: string;
}

export function signToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('campusiq_token')?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      include: {
        student: true,
        faculty: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'STUDENT' | 'FACULTY' | 'ADMIN',
      department: user.department,
      avatar: user.avatar,
      student: user.student,
      faculty: user.faculty,
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}
