'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  AlertCircle,
  BarChart3,
  Bot,
  Database,
  FileCheck,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Play,
  Terminal,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function LandingPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'copilot' | 'academics' | 'complaints' | 'analytics'>('copilot');
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleQuickLogin = async (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => {
    setLoadingRole(role);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        if (role === 'STUDENT') router.push('/student');
        else if (role === 'FACULTY') router.push('/faculty');
        else router.push('/admin');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CampusIQ &bull; 30-Day Innovation Challenge #4</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Intelligence for <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">Every Campus.</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            One intelligent operating layer connecting students, faculty, and administrators through
            grounded AI support, explainable academic insights, automated grievance routing, and campus analytics.
          </p>

          {/* 1-Click Interactive Demo Launcher Bar */}
          <div className="mt-10 max-w-2xl mx-auto p-4 rounded-2xl bg-white/95 border border-slate-200 shadow-xl shadow-indigo-100/50 backdrop-blur-md">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-center space-x-2">
              <Play className="w-3.5 h-3.5 text-indigo-600" />
              <span>Launch Live Interactive Prototype (1-Click Demo Access)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => handleQuickLogin('STUDENT')}
                disabled={Boolean(loadingRole)}
                className="flex flex-col items-center p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/80 hover:border-indigo-300 text-left transition group shadow-2xs"
              >
                <span className="text-xs font-bold text-indigo-900">Student Persona</span>
                <span className="text-[11px] text-indigo-600 mt-0.5">Aarav Sharma (Sem 4)</span>
                <span className="text-[10px] text-slate-500 mt-1">Copilot, Gaps & Complaints</span>
              </button>

              <button
                onClick={() => handleQuickLogin('FACULTY')}
                disabled={Boolean(loadingRole)}
                className="flex flex-col items-center p-3 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100/80 hover:border-purple-300 text-left transition group shadow-2xs"
              >
                <span className="text-xs font-bold text-purple-900">Faculty Persona</span>
                <span className="text-[11px] text-purple-600 mt-0.5">Dr. Sunita Rao (HoD)</span>
                <span className="text-[10px] text-slate-500 mt-1">Class Attendance & Alerts</span>
              </button>

              <button
                onClick={() => handleQuickLogin('ADMIN')}
                disabled={Boolean(loadingRole)}
                className="flex flex-col items-center p-3 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-100/80 hover:border-rose-300 text-left transition group shadow-2xs"
              >
                <span className="text-xs font-bold text-rose-900">Administrator Persona</span>
                <span className="text-[11px] text-rose-600 mt-0.5">Prof. Rajesh Verma</span>
                <span className="text-[10px] text-slate-500 mt-1">Analytics, RAG & Triage</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 4 Core Pillars */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
            The Official Challenge Framework
          </h2>
          <h3 className="text-3xl font-bold text-slate-900">
            Four Connected Pillars of University Intelligence
          </h3>
          <p className="text-sm text-slate-600 mt-3">
            Not a disconnected chatbot or basic ERP. An intelligent operating system spanning all campus stakeholders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
              <Bot className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pillar 1: AI University Copilot</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational assistant with grounded RAG knowledge retrieval, verifiable source citations, and context-aware query routing across policies and academic services.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pillar 2: Academic Intelligence</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explainable learning gap analysis, subject-wise attendance tracking against the 75% threshold, and supportive early alerts without ungrounded predictions.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pillar 3: Smart Complaints</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-assisted categorization, priority evaluation with safety justifications, automated department routing, and full 5-stage grievance lifecycle tracking.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Pillar 4: Campus Analytics</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Natural language &quot;Ask Campus Data&quot; with strictly read-only authorized execution, KPI dashboards, and one-click PDF/CSV reports.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Feature Deep Dive */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="lg:w-1/3 space-y-3">
              <h3 className="text-2xl font-bold text-slate-900">Experience the Integrated Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click any pillar to see how CampusIQ unifies documents, student records, and administration.
              </p>

              <div className="space-y-2 pt-4">
                <button
                  onClick={() => setActiveTab('copilot')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between border ${
                    activeTab === 'copilot'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>1. Grounded RAG Copilot</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('academics')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between border ${
                    activeTab === 'academics'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>2. Explainable Learning Gaps</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('complaints')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between border ${
                    activeTab === 'complaints'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>3. AI Complaint Triage & SLA</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full p-3 rounded-xl text-left text-xs font-semibold transition flex items-center justify-between border ${
                    activeTab === 'analytics'
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>4. NL &quot;Ask Campus Data&quot;</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="lg:w-2/3 w-full bg-slate-900 rounded-2xl p-6 text-white shadow-2xl border border-slate-800">
              {activeTab === 'copilot' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono">
                    <Terminal className="w-4 h-4" />
                    <span>Copilot RAG Retrieval Pipeline</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-sans">
                    <span className="text-slate-400">Student:</span> &quot;What is the attendance requirement?&quot;
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/70 text-xs font-sans space-y-2">
                    <div className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Grounded Response Generated</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      According to the **University Attendance Policy (Section 1.1)**, all students must maintain a **minimum of 75% attendance** per subject. Students below 75% are ineligible for End-Semester examinations...
                    </p>
                    <div className="pt-2 border-t border-indigo-800/60 flex items-center justify-between text-[11px] text-indigo-300">
                      <span>Source: Attendance_Policy_2024_25.pdf (Page 1)</span>
                      <span className="text-emerald-400 font-mono">Relevance: 98%</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'academics' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono">
                    <GraduationCap className="w-4 h-4" />
                    <span>Explainable Learning Gap Detection</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-rose-400">Needs Attention: Computer Networks (CS204)</span>
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px]">Attendance 70.0%</span>
                    </div>
                    <p className="text-slate-300 text-xs">
                      <strong>Observation:</strong> Recent Quiz score of 58/100 indicates conceptual difficulty in IP Subnetting & CIDR calculations.
                    </p>
                    <p className="text-emerald-300 text-xs">
                      <strong>Recommendation:</strong> Complete the interactive Subnetting module on LMS and attend faculty office hours on Thursday.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'complaints' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-mono">
                    <AlertCircle className="w-4 h-4" />
                    <span>Real-Time AI Complaint Triage</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="text-slate-400">Input:</span> &quot;Wi-Fi is not working in Hostel Block B 3rd Floor since yesterday&quot;
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Category</div>
                      <div className="font-semibold text-indigo-300 mt-0.5">Hostel</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Priority</div>
                      <div className="font-semibold text-amber-400 mt-0.5">HIGH (SLA: 48h)</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Assigned Dept</div>
                      <div className="font-semibold text-emerald-300 mt-0.5">IT Services</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700">
                      <div className="text-[10px] text-slate-400">Ticket Status</div>
                      <div className="font-semibold text-blue-300 mt-0.5">SUBMITTED</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-xs text-purple-400 font-mono">
                    <BarChart3 className="w-4 h-4" />
                    <span>Authorized Read-Only Campus Query</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                    <span className="text-slate-400">Admin Query:</span> &quot;Which department has the most unresolved complaints?&quot;
                  </div>
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/50 text-xs text-slate-200 leading-relaxed">
                    <strong>IT Services</strong> currently accounts for the highest volume of open complaints (2 tickets), followed by Estate & Facilities. Average resolution turnaround time is 28.4 hours.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">CampusIQ</span>
            <span>&bull; Built for 30-Day Innovation Challenge #4</span>
          </div>
          <div className="text-slate-400">
            One Intelligent Layer for the Entire University &bull; Production-Ready Architecture
          </div>
        </div>
      </footer>
    </div>
  );
}
