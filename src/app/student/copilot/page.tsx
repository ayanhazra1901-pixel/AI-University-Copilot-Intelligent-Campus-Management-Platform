import React from 'react';
import { CopilotChat } from '@/components/CopilotChat';

export default function StudentCopilotPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">AI Student Copilot</h1>
        <p className="text-xs text-slate-500">
          Ask questions regarding attendance policy, exam schedules, regulations, or your academic performance.
        </p>
      </div>

      <CopilotChat userRole="STUDENT" />
    </div>
  );
}
