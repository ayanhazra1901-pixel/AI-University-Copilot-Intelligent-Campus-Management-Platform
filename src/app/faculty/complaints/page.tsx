'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FacultyComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/complaints?department=Academic%20Affairs')
      .then((res) => res.json())
      .then((data) => {
        if (data.complaints) setComplaints(data.complaints);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Academic Affairs & Course Grievances</h1>
        <p className="text-xs text-slate-500">
          Student inquiries, marks verification appeals, and lecture room equipment grievances.
        </p>
      </div>

      <div className="space-y-3">
        {complaints.length > 0 ? (
          complaints.map((c) => (
            <div key={c.id} className="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-indigo-700">{c.ticketNumber}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <h3 className="font-bold text-slate-900">{c.title}</h3>
              <p className="text-slate-600">{c.description}</p>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Logged by {c.studentName} &bull; Priority: {c.priority}
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs">
            No pending academic department grievances.
          </div>
        )}
      </div>
    </div>
  );
}
