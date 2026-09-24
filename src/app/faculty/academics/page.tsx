'use client';

import React, { useState, useEffect } from 'react';
import { GraduationCap, Users, BookOpen, AlertTriangle } from 'lucide-react';

export default function FacultyAcademicsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academics')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const analysis = data?.analysis;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Department Academic Analytics</h1>
        <p className="text-xs text-slate-500">
          Cohort level attendance distribution, early intervention indicators, and course grade tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-indigo-600 font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Course Grade Distribution</span>
          </div>
          <p className="text-xs text-slate-600">
            CS201 Data Structures Midterm median score: <strong>88.5%</strong>. 92% of students demonstrated high proficiency in Graph Algorithms.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-amber-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Students Flagged for Academic Advising</span>
          </div>
          <p className="text-xs text-slate-600">
            Aarav Sharma (CSE-2023-042) attendance in CS204 is currently at <strong>70.0%</strong>. Early alert advisory dispatched.
          </p>
        </div>
      </div>
    </div>
  );
}
