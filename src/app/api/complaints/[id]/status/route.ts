import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, note, assignedTo, resolutionNote } = await request.json();

    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
      include: { student: { include: { user: true } } },
    });

    if (!existingComplaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: {
        status,
        assignedTo: assignedTo ?? existingComplaint.assignedTo,
        resolutionNote: resolutionNote ?? existingComplaint.resolutionNote,
        statusHistory: {
          create: {
            fromStatus: existingComplaint.status,
            toStatus: status,
            changedBy: `${user.name} (${user.role})`,
            note: note || `Status progressed to ${status}`,
          },
        },
      },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    // Notify the student about the status update
    if (existingComplaint.student?.userId) {
      await prisma.notification.create({
        data: {
          userId: existingComplaint.student.userId,
          title: `Status Update: ${existingComplaint.ticketNumber}`,
          message: `Your grievance status was changed to "${status}" by ${user.name}. ${note ? `Note: ${note}` : ''}`,
          type: 'COMPLAINT',
          link: '/student/complaints',
        },
      });
    }

    // Create Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userName: user.name,
        role: user.role,
        action: 'COMPLAINT_STATUS_UPDATE',
        entity: 'Complaint',
        details: `Updated ${existingComplaint.ticketNumber} from ${existingComplaint.status} to ${status}. Note: ${note || 'N/A'}`,
      },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (error) {
    console.error('Complaint status update error:', error);
    return NextResponse.json({ error: 'Failed to update complaint status' }, { status: 500 });
  }
}
