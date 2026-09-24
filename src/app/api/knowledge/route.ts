import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.knowledgeDocument.findMany({
      include: {
        chunks: {
          select: {
            id: true,
            chunkIndex: true,
            pageNumber: true,
            keywords: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('Knowledge GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { title, fileName, fileType, department, category, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and document content are required' }, { status: 400 });
    }

    // Split into chunks (~500 chars)
    const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
    const chunkList = paragraphs.length > 0 ? paragraphs : [content];

    const doc = await prisma.knowledgeDocument.create({
      data: {
        title,
        fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
        fileType: fileType || 'PDF',
        department: department || 'General Administration',
        category: category || 'Academic',
        fileSize: Buffer.byteLength(content, 'utf-8'),
        processingStatus: 'PROCESSED',
        chunkCount: chunkList.length,
        summary: `Document indexed with ${chunkList.length} chunks covering ${category}.`,
        chunks: {
          create: chunkList.map((chunkText: string, index: number) => ({
            chunkIndex: index,
            pageNumber: Math.floor(index / 2) + 1,
            keywords: extractKeywords(chunkText).slice(0, 8).join(', '),
            content: chunkText,
          })),
        },
      },
      include: {
        chunks: true,
      },
    });

    // Log admin audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'DOCUMENT_UPLOAD',
        entity: 'KnowledgeDocument',
        details: `Uploaded and indexed "${doc.title}" with ${chunkList.length} semantic chunks.`,
      },
    });

    return NextResponse.json({ success: true, document: doc });
  } catch (error) {
    console.error('Knowledge POST error:', error);
    return NextResponse.json({ error: 'Failed to index document' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Document ID required' }, { status: 400 });

    const doc = await prisma.knowledgeDocument.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'DOCUMENT_DELETE',
        entity: 'KnowledgeDocument',
        details: `Deleted knowledge document "${doc.title}".`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Knowledge DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}

function extractKeywords(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    )
  );
}
