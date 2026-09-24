'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Filter, Calendar, User, FileText } from 'lucide-react';

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/notices?category=${filterCategory}&search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.notices) setNotices(data.notices);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [filterCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">University Notices & Circulars</h1>
          <p className="text-xs text-slate-500">
            Official announcements, examination schedules, event alerts, and administrative advisories.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        {['ALL', 'EXAM', 'ACADEMIC', 'EVENT', 'GENERAL'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterCategory === cat
                ? 'bg-slate-800 text-white font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">Loading notices...</div>
        ) : notices.length > 0 ? (
          notices.map((n) => (
            <div
              key={n.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-200 transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                    {n.category}
                  </span>
                  {n.isImportant && (
                    <span className="text-[10px] font-semibold text-rose-600 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span>Important</span>
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{n.content}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{n.authorName}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No notices found matching query.
          </div>
        )}
      </div>
    </div>
  );
}
