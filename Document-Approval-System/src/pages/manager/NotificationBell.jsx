// src/components/NotificationBell.jsx

import { useEffect, useRef, useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../api/notificationApi';
import './NotificationBell.css';

const POLL_INTERVAL_MS = 30000;

const NotificationBell = () => {
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
    <div className="bell-wrapper" ref={dropdownRef}>
      <button
        className="bell-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 3C9.24 3 7 5.24 7 8v4l-2 3v1h14v-1l-2-3V8c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
        {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-dropdown" role="menu">
          <div className="bell-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="bell-mark-all" onClick={handleMarkAllRead}>Mark all read</button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="bell-empty">You're all caught up.</p>
          ) : (
            <ul className="bell-list">
              {notifications.slice(0, 6).map((n) => (
                <li
                  key={n._id}
                  className={`bell-item ${n.isRead ? '' : 'bell-item--unread'}`}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                >
                  <p className="bell-message">{n.message}</p>
                  <time className="bell-time">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </time>
                </li>
              ))}
            </ul>
          )}

          <a href="/notifications" className="bell-view-all">View all notifications</a>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
