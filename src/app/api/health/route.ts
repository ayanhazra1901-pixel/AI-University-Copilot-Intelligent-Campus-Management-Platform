import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const docCount = await prisma.knowledgeDocument.count();

    const aiProvider = process.env.GEMINI_API_KEY
      ? 'Google Gemini API (Active)'
      : 'CampusIQ Deterministic Intelligent Engine (Demo/Fallback Mode)';

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      platform: 'CampusIQ - AI University Copilot & Intelligent Campus Management Platform',
      version: '1.0.0',
      database: {
        status: 'connected',
        provider: 'SQLite (Prisma ORM)',
        usersCount: userCount,
        knowledgeDocumentsCount: docCount,
      },
      aiEngine: {
        status: 'online',
        provider: aiProvider,
        ragSupport: true,
        complaintClassification: true,
        academicIntelligence: true,
        naturalLanguageAnalytics: true,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'degraded',
        error: 'Database connection failed',
      },
      { status: 500 }
    );
  }
}
