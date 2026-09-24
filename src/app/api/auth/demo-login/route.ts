import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { role } = await request.json(); // STUDENT, FACULTY, ADMIN

    let targetEmail = 'student@campusiq.edu';
    if (role === 'FACULTY') targetEmail = 'faculty@campusiq.edu';
    if (role === 'ADMIN') targetEmail = 'admin@campusiq.edu';

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: { student: true, faculty: true },
    });

    if (!user) {
      return NextResponse.json({ error: `Demo account for role ${role} not found. Please run seed.` }, { status: 404 });
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role as 'STUDENT' | 'FACULTY' | 'ADMIN',
      name: user.name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        avatar: user.avatar,
        student: user.student,
        faculty: user.faculty,
      },
    });

    response.cookies.set('campusiq_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Demo login error:', error);
    return NextResponse.json({ error: 'Internal server error during demo login' }, { status: 500 });
  }
}
