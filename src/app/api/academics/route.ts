import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { analyzeStudentAcademics } from '@/lib/ai/academicEngine';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Default to Aarav Sharma's student profile if user is student or if faculty/admin is previewing student #1
    let studentId = user.student?.id;
    if (!studentId) {
      const firstStudent = await prisma.studentProfile.findFirst();
      studentId = firstStudent?.id;
    }

    if (!studentId) {
      return NextResponse.json({ error: 'No student profile found' }, { status: 404 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: true,
        attendances: {
          include: { course: true },
        },
        assessments: {
          include: { course: true },
          orderBy: { date: 'desc' },
        },
        insights: true,
        alerts: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const analysis = await analyzeStudentAcademics(student.id);

    return NextResponse.json({
      student: {
        id: student.id,
        name: student.user.name,
        rollNumber: student.rollNumber,
        semester: student.semester,
        department: student.department,
        gpa: student.gpa,
        academicStatus: student.academicStatus,
        mentorName: student.mentorName,
      },
      analysis,
      attendances: student.attendances,
      assessments: student.assessments,
      insights: student.insights,
      alerts: student.alerts,
    });
  } catch (error) {
    console.error('Academics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch academic details' }, { status: 500 });
  }
}
