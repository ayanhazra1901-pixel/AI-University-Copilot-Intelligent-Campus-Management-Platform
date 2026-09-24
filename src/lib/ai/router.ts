import { searchKnowledgeBase, RAGSourceCitation } from './rag';
import { analyzeStudentAcademics } from './academicEngine';
import { classifyComplaintAI } from './complaintEngine';
import { askCampusAnalyticsAI } from './analyticsEngine';

export interface CopilotChatResponse {
  answer: string;
  queryCategory: 'UNIVERSITY_POLICY_RAG' | 'STUDENT_ACADEMIC' | 'COMPLAINT_ACTION' | 'CAMPUS_ANALYTICS' | 'GENERAL';
  sources?: RAGSourceCitation[];
  actionRecommendation?: {
    type: 'COMPLAINT_DRAFT' | 'ACADEMIC_VIEW' | 'DOCUMENT_VIEW';
    label: string;
    link: string;
    payload?: Record<string, any>;
  };
}

export async function processCopilotQuery(params: {
  query: string;
  userRole: 'STUDENT' | 'FACULTY' | 'ADMIN';
  studentProfileId?: string;
}): Promise<CopilotChatResponse> {
  const { query, userRole, studentProfileId } = params;
  const q = query.toLowerCase().trim();

  // 1. Check for Academic Personal Data query (Students & Faculty)
  if (
    q.includes('my attendance') ||
    q.includes('how is my attendance') ||
    q.includes('my marks') ||
    q.includes('my grades') ||
    q.includes('my gpa') ||
    q.includes('what should i focus on') ||
    q.includes('focus on academically') ||
    q.includes('my performance') ||
    q.includes('learning gap') ||
    q.includes('my subjects')
  ) {
    if (studentProfileId) {
      try {
        const analysis = await analyzeStudentAcademics(studentProfileId);

        let answer = `Here is your current **Academic Performance & Learning Analysis**:\n\n`;
        answer += `- **Current Cumulative GPA:** ${analysis.overallGpa} / 4.0\n`;
        answer += `- **Overall Attendance:** **${analysis.overallAttendancePercentage}%** across ${analysis.totalCourses} enrolled subjects.\n\n`;

        if (q.includes('attendance') || q.includes('how is my attendance')) {
          answer += `### Course Attendance Breakdown:\n`;
          analysis.courseBreakdown.forEach((c) => {
            const statusIcon = c.status === 'ATTENTION_NEEDED' ? '⚠️' : '✅';
            answer += `- ${statusIcon} **${c.name} (${c.code}):** ${c.attendancePct}% (${c.attended}/${c.total} classes)${c.attendancePct < 75 ? ' — *Below 75% threshold!*' : ''}\n`;
          });
          if (analysis.earlyAlerts.length > 0) {
            answer += `\n> **Notice:** ${analysis.earlyAlerts[0].message}`;
          }
        } else {
          // Focus / Performance / Gaps
          answer += `### 💡 Strong Areas:\n`;
          analysis.strongAreas.forEach((s) => {
            answer += `- **${s.subject}:** ${s.topic} — ${s.rationale}\n`;
          });

          if (analysis.learningGaps.length > 0) {
            answer += `\n### 🎯 Recommended Academic Focus & Learning Gaps:\n`;
            analysis.learningGaps.forEach((g) => {
              answer += `- **${g.subject} (${g.topic}):**\n  - *Observation:* ${g.rationale}\n  - *Action Plan:* **${g.recommendedAction}**\n`;
            });
          }

          if (analysis.earlyAlerts.length > 0) {
            answer += `\n> ⚠️ **Academic Alert:** ${analysis.earlyAlerts[0].message}`;
          }
        }

        return {
          answer,
          queryCategory: 'STUDENT_ACADEMIC',
          actionRecommendation: {
            type: 'ACADEMIC_VIEW',
            label: 'View Detailed Academic Dashboard',
            link: '/student/academics',
          },
        };
      } catch (err) {
        console.error('Error fetching academic data:', err);
      }
    }
  }

  // 2. Check for Complaint Action / Issue Logging intent
  if (
    (q.includes('not working') ||
      q.includes('broken') ||
      q.includes('complaint') ||
      q.includes('grievance') ||
      q.includes('water leak') ||
      q.includes('no internet') ||
      q.includes('wifi issue') ||
      q.includes('flickering') ||
      q.includes('delay in bus')) &&
    !q.includes('policy') &&
    !q.includes('sla') &&
    !q.includes('how do i submit')
  ) {
    const classification = classifyComplaintAI({
      title: query,
      description: query,
    });

    const answer = `I've analyzed your issue and prepared an automated complaint draft for you:\n\n- **Category:** ${classification.category}\n- **Subcategory:** ${classification.subcategory}\n- **Assigned Department:** **${classification.department}**\n- **Assigned Priority:** **${classification.priority}**\n- **Priority Reason:** ${classification.priorityReason}\n- **Summary:** *"${classification.summary}"*\n\nWould you like me to submit this ticket now to **${classification.department}**? Click below to proceed to the complaint submission form with pre-filled details.`;

    return {
      answer,
      queryCategory: 'COMPLAINT_ACTION',
      actionRecommendation: {
        type: 'COMPLAINT_DRAFT',
        label: 'Open Complaint with AI Pre-Fill',
        link: `/student/complaints?title=${encodeURIComponent(query)}&category=${encodeURIComponent(classification.category)}&priority=${encodeURIComponent(classification.priority)}&department=${encodeURIComponent(classification.department)}`,
        payload: classification,
      },
    };
  }

  // 3. Check for Campus Analytics queries (Admin / Faculty / "Which department has...")
  if (
    q.includes('which department has') ||
    q.includes('most complaints') ||
    q.includes('unresolved complaints') ||
    q.includes('complaint trends') ||
    q.includes('monthly complaint summary') ||
    q.includes('campus analytics') ||
    q.includes('show attendance trends')
  ) {
    const analytics = await askCampusAnalyticsAI(query);
    let answer = `${analytics.summary}\n\n### Key Highlights:\n`;
    analytics.insights.forEach((insight) => {
      answer += `- ${insight}\n`;
    });

    return {
      answer,
      queryCategory: 'CAMPUS_ANALYTICS',
      actionRecommendation: {
        type: 'DOCUMENT_VIEW',
        label: 'View Campus Analytics Dashboard',
        link: userRole === 'ADMIN' ? '/admin/analytics' : '/faculty/analytics',
      },
    };
  }

  // 4. Default: University Knowledge Base via RAG (Grounded with Source Citations)
  const ragResult = await searchKnowledgeBase(query);

  return {
    answer: ragResult.answer,
    queryCategory: 'UNIVERSITY_POLICY_RAG',
    sources: ragResult.sources,
  };
}
