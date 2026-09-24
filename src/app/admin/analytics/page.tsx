'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Sparkles,
  Send,
  Download,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  FileSpreadsheet,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminAnalyticsPage() {
  const [nlQuery, setNlQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [generalAnalytics, setGeneralAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => setGeneralAnalytics(data))
      .catch((err) => console.error(err));

    // Initial default prompt
    handleNLQuery('Which department has the most unresolved complaints?');
  }, []);

  const handleNLQuery = async (queryToRun?: string) => {
    const q = (queryToRun || nlQuery).trim();
    if (!q || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setQueryResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sampleQuestions = [
    'Which department has the most unresolved complaints?',
    'What are the most common complaint categories?',
    'Show complaint trends for this month',
    'Show student attendance trends',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Campus Analytics & Decision Support</h1>
          <p className="text-xs text-slate-500">
            Natural language querying (&quot;Ask Campus Data&quot;) with verified read-only execution, live chart synthesis, and audit reports.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href="/api/reports?type=complaints&format=csv"
            download
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Natural Language &quot;Ask Campus Data&quot; Input Box */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Ask Campus Data (Authorized Read-Only NL Query)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
            Safe Mode: Read-Only SQL Sanitized
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNLQuery();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'Which department has the most complaints?', 'Show monthly trends')..."
            value={nlQuery}
            onChange={(e) => setNlQuery(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !nlQuery.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{loading ? 'Analyzing...' : 'Ask Data'}</span>
          </button>
        </form>

        {/* Preset Query Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Try asking:</span>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNlQuery(q);
                handleNLQuery(q);
              }}
              className="text-[11px] px-3 py-1 rounded-full bg-slate-50 border border-slate-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 text-slate-600 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Result Card with Chart & Executive Synthesis */}
      {queryResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                Query Result
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                &quot;{queryResult.question}&quot;
              </h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified Campus Dataset</span>
            </span>
          </div>

          {/* AI Executive Summary */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-800 leading-relaxed">
            <div className="font-semibold text-indigo-900 mb-1">Executive Decision Summary:</div>
            <div className="whitespace-pre-wrap">{queryResult.summary}</div>
          </div>

          {/* Dynamic Visualization & Data Table */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Chart */}
            <div className="h-64 w-full p-2 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
              <div className="text-[11px] font-semibold text-slate-500 mb-2">Visual Breakdown</div>
              <ResponsiveContainer width="100%" height="90%">
                {queryResult.chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={queryResult.chartData}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label
                    >
                      {queryResult.chartData.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <BarChart data={queryResult.chartData}>
                    <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Structured Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Category / Dimension</th>
                    <th className="p-3">Count / Value</th>
                    <th className="p-3">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {queryResult.chartData.map((row: any, idx: number) => {
                    const totalVal = queryResult.chartData.reduce((acc: number, cur: any) => acc + cur.value, 0);
                    const pct = totalVal > 0 ? Math.round((row.value / totalVal) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-800">{row.label}</td>
                        <td className="p-3 font-bold text-indigo-700">{row.value}</td>
                        <td className="p-3 text-slate-500">{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Insights */}
          {queryResult.insights && (
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700">Actionable Key Insights:</div>
              {queryResult.insights.map((ins: string, idx: number) => (
                <div key={idx} className="text-xs text-slate-600 flex items-start space-x-2">
                  <span className="text-indigo-600 font-bold">&bull;</span>
                  <span>{ins}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
