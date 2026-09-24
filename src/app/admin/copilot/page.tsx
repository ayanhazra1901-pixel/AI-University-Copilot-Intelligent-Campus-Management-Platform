import React from 'react';
import { CopilotChat } from '@/components/CopilotChat';

export default function AdminCopilotPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campus Administrator Copilot</h1>
        <p className="text-xs text-slate-500">
          Executive AI support grounded in university regulations, policy synthesis, grievance statistics, and analytics.
        </p>
      </div>

      <CopilotChat userRole="ADMIN" />
    </div>
  );
}
