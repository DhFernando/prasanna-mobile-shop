/**
 * NotificationPanel Component
 * Displays alerts and notifications for admin users
 * Supports dark/light mode
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@/components/atoms';
import { Alert } from '@/lib/types';
import { useTheme } from '@/lib/theme';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { isDark, currentTheme } = useTheme();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch('/api/alerts?includeSettings=true');
      const data = await res.json();
      if (data.success) {
        setAlerts(data.data.alerts);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen, fetchAlerts]);

  useEffect(() => {
    const checkAlerts = async () => {
      try {
        await fetch('/api/alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'check' }),
        });
        fetchAlerts();
      } catch (error) {
        console.error('Error checking alerts:', error);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAlerts]);

  const markAsRead = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'read' }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/alerts/all', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'markAllRead' }),
      });
      fetchAlerts();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    if (isDark) {
      switch (priority) {
        case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        default: return 'bg-stone-700 text-stone-300 border-stone-600';
      }
    }
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  const getTypeIcon = (type: Alert['type']) => {
    switch (type) {
      case 'out_of_stock': return 'package';
      case 'low_stock': return 'alert-triangle';
      default: return 'bell';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        absolute right-0 top-full mt-2
        w-96 max-h-[80vh]
        rounded-2xl shadow-2xl
        border z-50 overflow-hidden
        ${isDark 
          ? 'bg-stone-900 border-stone-700' 
          : 'bg-white border-stone-200'
        }
      `}>
        {/* Header */}
        <div className={`
          flex items-center justify-between p-4 border-b
          ${isDark ? 'border-stone-700' : 'border-stone-100'}
        `}>
          <div className="flex items-center gap-2">
            <Icon name="bell" size={20} className={isDark ? 'text-stone-400' : 'text-stone-600'} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-stone-900'}`}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium hover:opacity-80 transition-opacity"
                style={{ color: currentTheme.primaryHex }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className={`
                p-1 rounded-lg transition-colors
                ${isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-100'}
              `}
            >
              <Icon name="close" size={18} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div 
                className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{ 
                  borderColor: `${currentTheme.primaryHex}30`,
                  borderTopColor: currentTheme.primaryHex 
                }}
              />
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className={`
                w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center
                ${isDark ? 'bg-stone-800' : 'bg-stone-100'}
              `}>
                <Icon name="bell-off" size={24} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
              </div>
              <p className={isDark ? 'text-stone-400' : 'text-stone-500'}>No notifications</p>
              <p className={`text-sm mt-1 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className={`divide-y ${isDark ? 'divide-stone-700' : 'divide-stone-100'}`}>
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`
                    p-4 transition-colors cursor-pointer
                    ${!alert.isRead 
                      ? isDark 
                        ? 'bg-stone-800/50' 
                        : 'bg-teal-50/50'
                      : ''
                    }
                    ${isDark ? 'hover:bg-stone-800' : 'hover:bg-stone-50'}
                  `}
                  onClick={() => !alert.isRead && markAsRead(alert.id)}
                >
                  <div className="flex gap-3">
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${getPriorityColor(alert.priority)}
                    `}>
                      <Icon name={getTypeIcon(alert.type) as 'package' | 'alert-triangle' | 'bell'} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`
                            text-sm font-medium
                            ${!alert.isRead 
                              ? isDark ? 'text-white' : 'text-stone-900'
                              : isDark ? 'text-stone-300' : 'text-stone-600'
                            }
                          `}>
                            {alert.title}
                          </p>
                          <p className={`
                            text-sm mt-0.5 line-clamp-2
                            ${isDark ? 'text-stone-400' : 'text-stone-500'}
                          `}>
                            {alert.message}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dismissAlert(alert.id);
                          }}
                          className={`
                            p-1 rounded transition-colors flex-shrink-0
                            ${isDark ? 'hover:bg-stone-700' : 'hover:bg-stone-100'}
                          `}
                          title="Dismiss"
                        >
                          <Icon name="close" size={14} className={isDark ? 'text-stone-500' : 'text-stone-400'} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`
                          text-xs px-2 py-0.5 rounded-full capitalize
                          ${getPriorityColor(alert.priority)}
                        `}>
                          {alert.priority}
                        </span>
                        <span className={`text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                          {new Date(alert.createdAt).toLocaleDateString()}
                        </span>
                        {!alert.isRead && (
                          <span 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: currentTheme.primaryHex }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`
          p-3 border-t
          ${isDark ? 'border-stone-700 bg-stone-800/50' : 'border-stone-100 bg-stone-50'}
        `}>
          <a
            href="/admin/settings"
            className={`
              flex items-center justify-center gap-2 text-sm transition-colors
              ${isDark ? 'text-stone-400 hover:text-white' : 'text-stone-600'}
            `}
            style={{ '--hover-color': currentTheme.primaryHex } as React.CSSProperties}
          >
            <Icon name="settings" size={16} />
            Alert Settings
          </a>
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
