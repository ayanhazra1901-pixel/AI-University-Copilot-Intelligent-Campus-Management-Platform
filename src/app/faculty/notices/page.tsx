'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Calendar, User } from 'lucide-react';

export default function FacultyNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/notices')
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) setNotices(data.notices);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">University Notices & Circulars</h1>
        <p className="text-xs text-slate-500">Official faculty circulars, exam duties, and campus notices.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map((n) => (
          <div key={n.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
              {n.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
            <p className="text-xs text-slate-600">{n.content}</p>
            <div className="pt-2 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
              <span>{n.authorName}</span>
              <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
