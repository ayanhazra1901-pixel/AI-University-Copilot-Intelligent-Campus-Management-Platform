'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Send,
  User,
  Bot,
  FileText,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface SourceCitation {
  documentId: string;
  documentTitle: string;
  fileName: string;
  pageNumber: number;
  relevanceScore: number;
  excerpt: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  queryCategory?: string;
  sources?: SourceCitation[];
  actionRecommendation?: {
    type: string;
    label: string;
    link: string;
    payload?: any;
  };
  timestamp: string;
}

interface CopilotChatProps {
  initialPrompt?: string;
  userRole?: string;
}

export function CopilotChat({ initialPrompt, userRole = 'STUDENT' }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello! I am **CampusIQ Copilot**, your grounded university AI assistant.\n\nI can retrieve official university policies with source citations, analyze your academic performance and attendance, assist with filing complaints, and answer campus questions. How can I assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<SourceCitation | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestedPrompts = [
    'What is the attendance requirement?',
    'What should I focus on academically?',
    'How do I apply for academic leave?',
    'Wi-Fi is not working in Hostel Block B',
    'What are the examination rules?',
    'Which department has the most unresolved complaints?',
  ];

  const handleSend = async (textToSend?: string) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        content: data.answer || 'I could not retrieve an answer at this moment.',
        queryCategory: data.queryCategory,
        sources: data.sources,
        actionRecommendation: data.actionRecommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          content: 'CampusIQ Copilot encountered a network error. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        content: 'Conversation history cleared. How can I help you next?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-900">CampusIQ Copilot</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Grounded RAG Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in verified university regulations, academic records, and grievance workflows
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs shadow-2xs'
                }`}
              >
                {/* Category Pill for Assistant */}
                {msg.queryCategory && (
                  <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-indigo-100/70 text-indigo-800 text-[10px] font-semibold mb-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Domain: {msg.queryCategory}</span>
                  </div>
                )}

                {/* Markdown text rendered cleanly */}
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Action Recommendation Button */}
                {msg.actionRecommendation && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80">
                    <Link
                      href={msg.actionRecommendation.link}
                      className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition"
                    >
                      <span>{msg.actionRecommendation.label}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Grounded Source Citations (Pillar 1 Requirement) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200/80">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Grounded University Sources ({msg.sources.length})</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.sources.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedSource(src)}
                          className="flex items-start space-x-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-left transition group"
                        >
                          <div className="p-1 rounded bg-indigo-50 text-indigo-600 shrink-0 mt-0.5">
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-slate-800 group-hover:text-indigo-600 truncate">
                              {src.fileName}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center justify-between mt-0.5">
                              <span>Page {src.pageNumber}</span>
                              <span className="text-emerald-700 font-semibold">{src.relevanceScore}% match</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message metadata & actions */}
              <div
                className={`flex items-center space-x-3 text-[11px] text-slate-400 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'assistant' && (
                  <>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="hover:text-slate-600 flex items-center space-x-1"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button className="hover:text-indigo-600">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="hover:text-rose-600">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              <span>Analyzing intent and consulting university knowledge base...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 overflow-x-auto flex gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask anything (e.g. 'What is the attendance policy?', 'How is my attendance?')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Source Preview Drawer */}
      {selectedSource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-semibold text-slate-900">{selectedSource.fileName}</h3>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Document: {selectedSource.documentTitle}</span>
                <span className="font-semibold text-emerald-600">Page {selectedSource.pageNumber}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-mono">
                {selectedSource.excerpt}
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedSource(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-white text-xs font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
