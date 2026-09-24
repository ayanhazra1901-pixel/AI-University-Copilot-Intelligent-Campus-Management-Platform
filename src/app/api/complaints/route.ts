import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { classifyComplaintAI } from '@/lib/ai/complaintEngine';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const studentOnly = searchParams.get('studentOnly');

    const user = await getCurrentUser();
    const where: any = {};

    if (department && department !== 'ALL') where.department = department;
    if (status && status !== 'ALL') where.status = status;
    if (priority && priority !== 'ALL') where.priority = priority;
    if (category && category !== 'ALL') where.category = category;

    // If user is a student requesting their own complaints
    if (user?.role === 'STUDENT' || studentOnly === 'true') {
      if (user?.student?.id) {
        where.studentId = user.student.id;
      }
    }

    const complaints = await prisma.complaint.findMany({
      where,
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const categories = await prisma.complaintCategory.findMany({
      where: { isActive: true },
    });

    return NextResponse.json({
      complaints,
      categories,
    });
  } catch (error) {
    console.error('Complaints GET error:', error);
    return NextResponse.json({ error: 'Failed to retrieve complaints' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, location } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    // 1. Run AI Classification & Priority Engine
    const aiResult = classifyComplaintAI({
      title,
      description,
      location,
    });

    // Student identity
    let studentId = user.student?.id;
    let studentName = user.name;

    if (!studentId) {
      const firstStudent = await prisma.studentProfile.findFirst({
        include: { user: true },
      });
      studentId = firstStudent?.id || user.id;
      studentName = firstStudent?.user?.name || user.name;
    }

    // Ticket Number: CIQ-XXXX
    const randomTicketSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `CIQ-${randomTicketSuffix}`;

    // 2. Create Complaint in DB
    const complaint = await prisma.complaint.create({
      data: {
        ticketNumber,
        studentId,
        studentName,
        title,
        description,
        location: location || 'Main Campus',
        category: body.category || aiResult.category,
        subcategory: body.subcategory || aiResult.subcategory,
        priority: body.priority || aiResult.priority,
        department: body.department || aiResult.department,
        status: 'SUBMITTED',
        aiSummary: aiResult.summary,
        aiPriorityReason: aiResult.priorityReason,
        statusHistory: {
          create: [
            {
              fromStatus: 'NONE',
              toStatus: 'SUBMITTED',
              changedBy: `${studentName} (${user.role})`,
              note: 'Complaint registered and triaged via CampusIQ AI Classification.',
            },
          ],
        },
      },
      include: {
        statusHistory: true,
      },
    });

    // 3. Create Notification for Student
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: `Ticket Created: ${complaint.ticketNumber}`,
        message: `Your grievance has been auto-assigned to ${complaint.department} with ${complaint.priority} priority.`,
        type: 'COMPLAINT',
        link: '/student/complaints',
      },
    });

    // 4. Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'COMPLAINT_CREATED',
        entity: 'Complaint',
        details: `Created ticket ${complaint.ticketNumber} [${complaint.category} -> ${complaint.department} (${complaint.priority})]`,
      },
    });

    return NextResponse.json({
      success: true,
      complaint,
      classification: aiResult,
    });
  } catch (error) {
    console.error('Complaints POST error:', error);
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
  }
}
