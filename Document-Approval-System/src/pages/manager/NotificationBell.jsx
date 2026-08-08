import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Bell } from 'lucide-react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../../services/notificationApi';

const POLL_INTERVAL_MS = 30000;

const NotificationBell = ({ onViewAll }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await fetchNotifications(1);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // silent — a failed poll shouldn't interrupt the user
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [load]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    try { await markNotificationRead(id); } catch { load(); }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try { await markAllNotificationsRead(); } catch { load(); }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className="relative p-2 rounded-lg hover:bg-violet-100 text-gray-700"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 font-bold text-gray-900">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-violet-600 underline font-medium">
                Mark all read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">You're all caught up.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {notifications.slice(0, 6).map((n) => (
                <li
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer ${n.isRead ? '' : 'bg-violet-50'}`}
                >
                  <p className="text-sm text-gray-800 mb-1">{n.message}</p>
                  <time className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </time>
                </li>
              ))}
            </ul>
          )}

          {onViewAll && (
            <button
              onClick={() => { onViewAll(); setOpen(false); }}
              className="block w-full text-center text-sm text-violet-600 py-2 border-t border-gray-100 hover:bg-violet-50"
            >
              View all notifications
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;