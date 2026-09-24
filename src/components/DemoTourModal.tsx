'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileText,
  AlertCircle,
  BarChart3,
  X,
  Play,
  RotateCcw,
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: (role: 'STUDENT' | 'FACULTY' | 'ADMIN') => void;
}

export function DemoTourModal({ isOpen, onClose, onSwitchRole }: DemoTourModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Student Persona & Copilot RAG',
      role: 'STUDENT' as const,
      description:
        'Switch to Student persona (Aarav Sharma) and ask the AI Copilot: "What is the attendance requirement?" to see grounded RAG with source citations.',
      actionLabel: 'Go to Student Copilot',
      action: () => {
        onSwitchRole('STUDENT');
        router.push('/student/copilot');
        onClose();
      },
    },
    {
      title: 'Step 2: Academic Intelligence & Learning Gaps',
      role: 'STUDENT' as const,
      description:
        'Ask the Copilot "What should I focus on academically?" or open the Academics tab to see explainable learning gap detection and the 70% attendance early alert in CS204.',
      actionLabel: 'Open Academics Dashboard',
      action: () => {
        onSwitchRole('STUDENT');
        router.push('/student/academics');
        onClose();
      },
    },
    {
      title: 'Step 3: AI-Assisted Complaint Logging',
      role: 'STUDENT' as const,
      description:
        'Submit a complaint: "Wi-Fi is not working in Hostel Block B, 3rd Floor". Observe live AI auto-classification into Hostel/IT, HIGH priority, and auto-dispatch.',
      actionLabel: 'Launch Complaint Desk',
      action: () => {
        onSwitchRole('STUDENT');
        router.push('/student/complaints?action=new');
        onClose();
      },
    },
    {
      title: 'Step 4: Admin Triage & Status Progression',
      role: 'ADMIN' as const,
      description:
        'Switch to Administrator (Prof. Rajesh Verma). Inspect the grievance queue, review the AI routing, and progress ticket status to "In Progress" or "Resolved".',
      actionLabel: 'Open Admin Complaint Board',
      action: () => {
        onSwitchRole('ADMIN');
        router.push('/admin/complaints');
        onClose();
      },
    },
    {
      title: 'Step 5: Campus Analytics & "Ask Campus Data"',
      role: 'ADMIN' as const,
      description:
        'Open Campus Analytics. Ask natural language questions like: "Which department has the most unresolved complaints?" or "Show complaint trends" to see dynamic charts and insights.',
      actionLabel: 'Open Campus Analytics',
      action: () => {
        onSwitchRole('ADMIN');
        router.push('/admin/analytics');
        onClose();
      },
    },
    {
      title: 'Step 6: Admin Knowledge Base & RAG Indexing',
      role: 'ADMIN' as const,
      description:
        'View university regulations, upload or index a new document, inspect its semantic chunks, and observe how the Copilot immediately grounds its answers.',
      actionLabel: 'Open Knowledge Base',
      action: () => {
        onSwitchRole('ADMIN');
        router.push('/admin/knowledge');
        onClose();
      },
    },
  ];

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Hackathon 5-7 Min Demo Walkthrough</span>
          </div>
          <h2 className="text-xl font-bold">CampusIQ Interactive Demo Script</h2>
          <p className="text-xs text-indigo-200 mt-1">
            Follow these verified steps to demonstrate all 4 challenge pillars seamlessly.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 py-2.5 overflow-x-auto gap-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'w-8 bg-indigo-600'
                  : idx < currentStep
                  ? 'w-4 bg-emerald-500'
                  : 'w-3 bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">
              {current.title}
            </span>
            <span className="text-xs text-slate-400">
              Role: <strong className="text-slate-700">{current.role}</strong>
            </span>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed mb-6">{current.description}</p>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1 mb-6">
            <div className="font-semibold text-slate-700">Demo Tip for Judges:</div>
            <div>
              CampusIQ is powered by a hybrid architecture with 100% deterministic fallback support so the
              entire flow works smoothly even without external API keys.
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-30"
            >
              &larr; Previous Step
            </button>

            <div className="flex items-center space-x-3">
              <button
                onClick={current.action}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition"
              >
                <span>{current.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {currentStep < steps.length - 1 && (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
