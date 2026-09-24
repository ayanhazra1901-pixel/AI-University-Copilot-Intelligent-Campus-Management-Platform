'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  GraduationCap,
  AlertCircle,
  Bell,
  FileText,
  Calendar,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/academics').then((res) => res.json()),
      fetch('/api/complaints?studentOnly=true').then((res) => res.json()),
      fetch('/api/notices').then((res) => res.json()),
    ])
      .then(([academicData, complaintData, noticeData]) => {
        setData(academicData);
        if (complaintData.complaints) setComplaints(complaintData.complaints.slice(0, 3));
        if (noticeData.notices) setNotices(noticeData.notices.slice(0, 3));
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const student = data?.student || {
    name: 'Aarav Sharma',
    rollNumber: 'CSE-2023-042',
    semester: 4,
    department: 'Computer Science & Engineering',
    gpa: 3.72,
    academicStatus: 'Good Standing',
  };

  const analysis = data?.analysis || {
    overallAttendancePercentage: 87.0,
    overallGpa: 3.72,
    earlyAlerts: [],
    learningGaps: [],
    strongAreas: [],
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CampusIQ Student Portal &bull; Active Term: Spring 2025</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {student.name}!
            </h1>
            <p className="text-xs text-indigo-200 mt-1">
              {student.department} &bull; Semester {student.semester} &bull; Roll: {student.rollNumber}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/student/copilot"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white text-indigo-900 font-semibold text-xs shadow-xs hover:bg-indigo-50 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ask AI Copilot</span>
            </Link>
            <Link
              href="/student/complaints?action=new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/40 transition"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Submit Complaint</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Attendance */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Overall Attendance</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {analysis.overallAttendancePercentage}%
            </span>
            <span
              className={`text-[11px] font-semibold ${
                analysis.overallAttendancePercentage >= 75 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {analysis.overallAttendancePercentage >= 75 ? 'Above 75%' : 'Below 75%'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                analysis.overallAttendancePercentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, analysis.overallAttendancePercentage)}%` }}
            />
          </div>
        </div>

        {/* GPA */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Cumulative GPA</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">{analysis.overallGpa}</span>
            <span className="text-[11px] font-semibold text-indigo-600">/ 4.00</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top 10% in CSE Cohort</span>
          </div>
        </div>

        {/* Active Grievances */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Active Complaints</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {complaints.filter((c) => c.status !== 'RESOLVED').length}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold">Under Review</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Avg response: &lt;24h</span>
          </div>
        </div>

        {/* Academic Status */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Academic Standing</div>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-lg font-bold text-emerald-700">{student.academicStatus}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-3">
            Mentor: Dr. Sunita Rao
          </div>
        </div>
      </div>

      {/* Critical Early Alerts (Explainable Notification) */}
      {analysis.earlyAlerts && analysis.earlyAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-2xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                CampusIQ Academic Early Alert
              </h3>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                {analysis.earlyAlerts[0].message}
              </p>
              <div className="mt-2 flex items-center space-x-3 text-xs">
                <Link
                  href="/student/academics"
                  className="font-semibold text-amber-900 hover:underline flex items-center space-x-1"
                >
                  <span>Review Subject Attendance</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout: Academics & Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Academic Learning Insights & Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">AI Learning Gap Recommendations</h2>
            </div>
            <Link
              href="/student/academics"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              Full Breakdown &rarr;
            </Link>
          </div>

          {analysis.learningGaps && analysis.learningGaps.length > 0 ? (
            analysis.learningGaps.map((gap: any, idx: number) => (
              <div key={idx} className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">{gap.subject}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    Needs Attention (Score: {gap.score}%)
                  </span>
                </div>
                <div className="text-xs text-rose-800 leading-relaxed">
                  <strong>Diagnostic:</strong> {gap.rationale}
                </div>
                <div className="text-xs text-indigo-900 bg-white/80 p-2 rounded-lg border border-rose-200/60 mt-1">
                  <strong>Recommended Action:</strong> {gap.recommendedAction}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-500 py-4 text-center">
              All enrolled courses are currently meeting academic targets!
            </div>
          )}

          {/* Strong Area Pill */}
          {analysis.strongAreas && analysis.strongAreas.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  {analysis.strongAreas[0].subject}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Strong Area (94%)
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {analysis.strongAreas[0].rationale}
              </p>
            </div>
          )}
        </div>

        {/* Recent Grievances / Complaints */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Recent Complaints & Status</h2>
            </div>
            <Link
              href="/student/complaints"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All ({complaints.length}) &rarr;
            </Link>
          </div>

          {complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-200 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-slate-900 line-clamp-1">{c.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0 ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'IN_PROGRESS'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.aiSummary || c.description}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono">{c.ticketNumber}</span>
                    <span>Assigned to: <strong className="text-slate-600">{c.department}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No open complaints logged.
            </div>
          )}
        </div>
      </div>

      {/* Latest University Notices */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">University Announcements & Circulars</h2>
          </div>
          <Link
            href="/student/notices"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            All Notices &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {notices.map((n) => (
            <div
              key={n.id}
              className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                  {n.category}
                </span>
                {n.isImportant && (
                  <span className="text-[10px] font-semibold text-rose-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>Important</span>
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.content}</p>
              <div className="text-[10px] text-slate-400 pt-1">
                Published by {n.authorName}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
