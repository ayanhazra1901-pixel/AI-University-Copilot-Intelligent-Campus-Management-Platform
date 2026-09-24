import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = { isArchived: false };
    if (category && category !== 'ALL') where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const notices = await prisma.notice.findMany({
      where,
      orderBy: [{ isImportant: 'desc' }, { publishedAt: 'desc' }],
    });

    return NextResponse.json({ notices });
  } catch (error) {
    console.error('Notices GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notices' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { title, content, category, targetRole, department, isImportant } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const notice = await prisma.notice.create({
      data: {
        title,
        content,
        category: category || 'GENERAL',
        targetRole: targetRole || 'ALL',
        department: department || 'General Administration',
        isImportant: Boolean(isImportant),
        authorName: user.name,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'NOTICE_PUBLISHED',
        entity: 'Notice',
        details: `Published notice "${notice.title}" [Category: ${notice.category}]`,
      },
    });

    return NextResponse.json({ success: true, notice });
  } catch (error) {
    console.error('Notices POST error:', error);
    return NextResponse.json({ error: 'Failed to create notice' }, { status: 500 });
  }
}
