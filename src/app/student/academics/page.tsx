'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Award,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export default function StudentAcademicsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/academics')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading academic intelligence...</div>;
  }

  const analysis = data?.analysis || {
    overallGpa: 3.72,
    overallAttendancePercentage: 87.0,
    courseBreakdown: [],
    strongAreas: [],
    learningGaps: [],
    earlyAlerts: [],
  };

  const assessments = data?.assessments || [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Academic Intelligence & Learning Insights</h1>
        <p className="text-xs text-slate-500">
          Explainable performance metrics, course attendance tracking against the 75% threshold, and targeted study priorities.
        </p>
      </div>

      {/* Early Alert Banner if any alert is active */}
      {analysis.earlyAlerts && analysis.earlyAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Academic Early Warning & Advisory</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            {analysis.earlyAlerts[0].message}
          </p>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Cumulative GPA</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{analysis.overallGpa} / 4.00</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-2 flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Academic Standing: Excellent</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Aggregate Attendance</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{analysis.overallAttendancePercentage}%</div>
          <div className="text-[11px] text-slate-500 font-medium mt-2">
            Target Threshold: <strong className="text-indigo-600">75%</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">Registered Courses</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">5 Courses (18 Credits)</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-2">B.Tech CSE &bull; Semester 4</div>
        </div>
      </div>

      {/* Course Attendance & Subject Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Enrolled Courses & Attendance Status</h2>
          </div>
          <span className="text-xs text-slate-400">Policy: Mandatory 75% required for exam hall ticket</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="p-3.5">Course</th>
                <th className="p-3.5">Classes Attended</th>
                <th className="p-3.5">Attendance %</th>
                <th className="p-3.5">Avg Score</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {analysis.courseBreakdown.map((c: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-medium text-slate-900">
                    <div>{c.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{c.code}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    {c.attended} / {c.total} classes
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold ${c.attendancePct < 75 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {c.attendancePct}%
                      </span>
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            c.attendancePct < 75 ? 'bg-rose-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, c.attendancePct)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-700">{c.averageScore}%</td>
                  <td className="p-3.5">
                    {c.status === 'ATTENTION_NEEDED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        ⚠️ Low Attendance
                      </span>
                    ) : c.status === 'EXCELLENT' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Excellent
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                        On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explainable Learning Gaps vs Strong Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Learning Gaps & Action Plan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Explainable Learning Gap Analysis</h2>
          </div>

          <div className="space-y-3">
            {analysis.learningGaps.map((gap: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">{gap.subject}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                    Topic: {gap.topic}
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">
                  <strong>Why flagged:</strong> {gap.rationale}
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-rose-200/60 text-xs text-indigo-900 font-medium">
                  <strong>Study Recommendation:</strong> {gap.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strong Areas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Demonstrated Strong Areas</h2>
          </div>

          <div className="space-y-3">
            {analysis.strongAreas.map((area: any, idx: number) => (
              <div key={idx} className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">{area.subject}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Topic: {area.topic}
                  </span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {area.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Assessment Records */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h2 className="text-sm font-bold text-slate-900">Recent Graded Assessments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {assessments.slice(0, 6).map((a: any) => (
            <div key={a.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">{a.title}</span>
                <span className="font-bold text-indigo-700">{a.score} / {a.maxScore}</span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{a.course?.code} - {a.course?.name}</div>
              {a.topic && <div className="text-[11px] text-slate-400">Topic: {a.topic}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
