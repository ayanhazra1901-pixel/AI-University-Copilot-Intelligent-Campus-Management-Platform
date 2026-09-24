'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export default function FacultyDashboard() {
  const [academics, setAcademics] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/academics').then((res) => res.json()),
      fetch('/api/complaints?department=Academic%20Affairs').then((res) => res.json()),
    ])
      .then(([acadData, compData]) => {
        setAcademics(acadData);
        if (compData.complaints) setComplaints(compData.complaints);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-purple-500/30 text-purple-200 text-xs font-medium mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty Academic Command</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, Dr. Sunita Rao</h1>
          <p className="text-xs text-purple-200 mt-1">
            Associate Professor & HoD Academics &bull; Department of Computer Science & Engineering
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/faculty/copilot"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-purple-900 font-semibold text-xs shadow-xs hover:bg-purple-50 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Faculty Copilot</span>
          </Link>
          <Link
            href="/faculty/academics"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs border border-purple-400/40 transition"
          >
            <span>Cohort Performance</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Assigned Courses</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">2 Subjects</div>
          <div className="text-[11px] text-purple-600 font-medium mt-2">CS201 (DSA) &bull; CS202 (DBMS)</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Average Class Attendance</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">92.5%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2">Exceeds 75% Target</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Early Alerts Flagged</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">1 Student</div>
          <div className="text-[11px] text-slate-400 mt-2">CS204 Attendance under 75%</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Academic Inquiries</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{complaints.length} Tickets</div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-2">1 Under Grade Review</div>
        </div>
      </div>

      {/* Assigned Courses Section */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900">Current Semester Teaching Load</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">CS201: Data Structures & Algorithms</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Avg: 95.0% Attendance
              </span>
            </div>
            <p className="text-slate-600 text-xs">
              45 Students enrolled &bull; 4 Credits &bull; Midterm Graded (Class Avg: 88%)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-900">CS202: Database Management Systems</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Avg: 90.0% Attendance
              </span>
            </div>
            <p className="text-slate-600 text-xs">
              45 Students enrolled &bull; 4 Credits &bull; SQL Lab Assessment in Progress
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
