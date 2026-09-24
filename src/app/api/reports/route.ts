import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'complaints'; // complaints, academics, attendance
    const format = searchParams.get('format') || 'json'; // json or csv

    if (type === 'complaints') {
      const complaints = await prisma.complaint.findMany({
        orderBy: { createdAt: 'desc' },
      });

      if (format === 'csv') {
        const header = 'TicketNumber,Title,Category,Priority,Department,Status,StudentName,CreatedAt\n';
        const rows = complaints
          .map(
            (c) =>
              `"${c.ticketNumber}","${c.title.replace(/"/g, '""')}","${c.category}","${c.priority}","${c.department}","${c.status}","${c.studentName}","${c.createdAt.toISOString()}"`
          )
          .join('\n');

        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="CampusIQ_Complaints_Report.csv"',
          },
        });
      }

      return NextResponse.json({ reportType: 'Complaints', generatedAt: new Date(), data: complaints });
    }

    if (type === 'attendance') {
      const attendances = await prisma.attendance.findMany({
        include: { course: true, student: { include: { user: true } } },
      });

      if (format === 'csv') {
        const header = 'StudentName,RollNumber,CourseCode,CourseName,Attended,Total,Percentage\n';
        const rows = attendances
          .map(
            (a) =>
              `"${a.student.user.name}","${a.student.rollNumber}","${a.course.code}","${a.course.name}",${a.attendedClasses},${a.totalClasses},${a.percentage}%`
          )
          .join('\n');

        return new NextResponse(header + rows, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="CampusIQ_Attendance_Report.csv"',
          },
        });
      }

      return NextResponse.json({ reportType: 'Attendance', generatedAt: new Date(), data: attendances });
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
