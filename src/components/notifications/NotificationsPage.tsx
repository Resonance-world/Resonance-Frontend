'use client';

import { useState } from 'react';

type NotificationTab = 'All' | 'Match' | 'Circle' | 'Prompt' | 'Pending';

interface Notification {
  id: string;
  type: 'match' | 'circle' | 'prompt' | 'reflection';
  icon: string;
  title: string;
  description: string;
  actionText?: string;
  secondaryActionText?: string;
  timestamp?: string;
  status?: 'pending' | 'active' | 'completed';
}

/**
 * NotificationsPage - Main notifications interface
 * Implements the card-based notification system from Figma
 */
export const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState<NotificationTab>('All');

  // TODO: Fetch real notifications from API
  const notifications: Notification[] = [];

  const tabs: NotificationTab[] = ['All', 'Match', 'Circle', 'Prompt', 'Pending'];

  const filterNotifications = (tab: NotificationTab) => {
    if (tab === 'All') return notifications;
    if (tab === 'Pending') return notifications.filter(n => n.status === 'pending');
    return notifications.filter(n => n.type === tab.toLowerCase());
  };

  const filteredNotifications = filterNotifications(activeTab);

  return (
    <div className="min-h-screen">{/* Page removed header - now using global fixed header */}

      {/* Page Title */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-white mb-4">NOTIFICATION</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b" style={{borderColor: 'var(--resonance-border-subtle)'}}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-1 text-sm transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Pending notice */}
        {activeTab === 'Pending' && (
          <p className="text-gray-400 text-sm mb-4">
            Inactive invitation automatically dissolve after 30 days.
          </p>
        )}
      </div>

      {/* Notifications List */}
      <div className="px-4 pb-24 space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-lg border p-4 transition-colors hover:bg-opacity-80"
            style={{
              backgroundColor: 'var(--resonance-card-bg)',
              borderColor: 'var(--resonance-border-card)'
            }}
          >
            {/* Icon */}
            <div className="mb-3">
              {notification.type === 'match' && (
                <div className="w-8 h-8 bg-pink-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm">💖</span>
                </div>
              )}
              {notification.type === 'circle' && (
                <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm">🎁</span>
                </div>
              )}
              {notification.type === 'prompt' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">O</span>
                </div>
              )}
              {notification.type === 'reflection' && (
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm">👁</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className="text-white font-medium mb-2 leading-snug">
                {notification.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {notification.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              {notification.actionText && (
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: 'var(--resonance-button-bg)',
                    borderColor: 'var(--resonance-button-border)',
                    color: 'var(--resonance-text-primary)'
                  }}
                >
                  {notification.actionText}
                  {notification.actionText === 'Reflect' && (
                    <span className="ml-2">▶</span>
                  )}
                </button>
              )}
              {notification.secondaryActionText && (
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
                  style={{
                    borderColor: 'var(--resonance-border-card)',
                    color: 'var(--resonance-text-secondary)'
                  }}
                >
                  {notification.secondaryActionText}
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No notifications in this category</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
    </div>
  );
};
