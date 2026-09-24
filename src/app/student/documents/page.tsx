'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, FileText, Download, Eye, ExternalLink, ShieldCheck } from 'lucide-react';

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    fetch('/api/knowledge')
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) setDocuments(data.documents);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">University Document Center</h1>
        <p className="text-xs text-slate-500">
          Official policies, regulations, codes of conduct, and academic guidelines indexed in the CampusIQ RAG Knowledge Base.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 py-12 text-center text-xs text-slate-400">Loading documents...</div>
        ) : documents.length > 0 ? (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-indigo-200 transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>RAG Indexed</span>
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{doc.summary}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">{doc.category} &bull; {doc.chunkCount} chunks</span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-medium flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No official documents indexed.
          </div>
        )}
      </div>

      {/* Document Inspector Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900 truncate">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="text-slate-500">
                <strong>File:</strong> {selectedDoc.fileName} ({Math.round(selectedDoc.fileSize / 1024)} KB)
              </div>
              <div className="text-slate-500">
                <strong>Department:</strong> {selectedDoc.department}
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed font-sans">
                {selectedDoc.summary}
              </div>
              <div className="text-[11px] text-indigo-700 bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                This document is indexed in the vector semantic engine and cited directly by the AI Copilot.
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
