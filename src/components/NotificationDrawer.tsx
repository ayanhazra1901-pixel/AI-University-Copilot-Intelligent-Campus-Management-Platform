'use client';

import React from 'react';
import Link from 'next/link';
import { X, CheckCheck, Bell, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'COMPLAINT':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'ACADEMIC':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'NOTICE':
        return <FileText className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Notifications</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                {notifications.filter((n) => !n.isRead).length} new
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onMarkAllAsRead}
                className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 flex items-center space-x-1 rounded-md hover:bg-slate-50"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark read</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {notifications.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 transition hover:bg-slate-50/80 ${
                    !item.isRead ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-slate-100 mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h4>
                        <span className="text-[11px] text-slate-400 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-2">{item.message}</p>
                      {item.link && (
                        <Link
                          href={item.link}
                          onClick={onClose}
                          className="inline-flex items-center text-xs font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          View Details &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm font-medium">No notifications yet</p>
                <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <span className="text-xs text-slate-500">Live Campus Event Notification Stream</span>
          </div>
        </div>
      </div>
    </div>
  );
}
