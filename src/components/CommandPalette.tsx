'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, AlertCircle, FileText, BarChart3, User, X, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

export function CommandPalette({ isOpen, onClose, userRole = 'STUDENT' }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const basePrefix = userRole.toLowerCase();

  const commands = [
    {
      title: 'Ask AI Copilot',
      subtitle: 'Ask about university policies, rules, and personal academics',
      icon: Sparkles,
      color: 'text-indigo-600 bg-indigo-50',
      action: () => {
        router.push(`/${basePrefix}/copilot`);
        onClose();
      },
    },
    {
      title: 'Submit a Complaint',
      subtitle: 'AI-assisted ticket logging with auto-categorization',
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-50',
      action: () => {
        router.push('/student/complaints?action=new');
        onClose();
      },
    },
    {
      title: 'Check Attendance & Marks',
      subtitle: 'Review course attendance % and learning gap analysis',
      icon: BarChart3,
      color: 'text-emerald-600 bg-emerald-50',
      action: () => {
        router.push('/student/academics');
        onClose();
      },
    },
    {
      title: 'University Notices & Circulars',
      subtitle: 'Latest exams, events, and administrative updates',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      action: () => {
        router.push(`/${basePrefix}/notices`);
        onClose();
      },
    },
    {
      title: 'Campus Analytics Dashboard',
      subtitle: 'Ask Campus Data & grievance resolution statistics',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-50',
      action: () => {
        router.push(userRole === 'ADMIN' ? '/admin/analytics' : '/admin/analytics');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search (e.g. 'Attendance', 'Copilot', 'Wi-Fi issue')..."
            className="w-full bg-transparent text-slate-800 text-sm focus:outline-none placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Quick Navigation & Commands
          </div>

          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={cmd.action}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-50 transition text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${cmd.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition">
                        {cmd.title}
                      </div>
                      <div className="text-xs text-slate-500">{cmd.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              No matching commands found for &quot;{query}&quot;
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[10px] font-mono">ESC</span>
            <span>to close</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Powered by</span>
            <span className="font-semibold text-indigo-600">CampusIQ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
