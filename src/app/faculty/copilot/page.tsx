import React from 'react';
import { CopilotChat } from '@/components/CopilotChat';

export default function FacultyCopilotPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Faculty AI Copilot</h1>
        <p className="text-xs text-slate-500">
          Faculty AI assistant for academic regulations, examination grading procedures, and course policies.
        </p>
      </div>

      <CopilotChat userRole="FACULTY" />
    </div>
  );
}
