import React, { useEffect, useState, useCallback } from 'react';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../../services/notificationApi';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchNotifications(1);
      setNotifications(data.notifications);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMarkRead = async (id) => {
    setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    await markNotificationRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await markAllNotificationsRead();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-end mb-5">
        <div>
          <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">Your activity</p>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading…</p>
      ) : notifications.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-200 rounded-xl py-16 px-6">
          <p className="text-lg font-bold text-gray-800 mb-1">Nothing here yet.</p>
          <p className="text-sm text-gray-400">You'll see updates here when documents are approved, rejected, or submitted.</p>
        </div>
      ) : (
        <ul className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {notifications.map((n) => (
            <li
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`flex gap-3 px-4 py-3 border-b border-gray-100 last:border-0 cursor-pointer ${n.isRead ? '' : 'bg-violet-50'}`}
            >
              <span className={`w-2 h-2 rounded-full bg-violet-500 mt-1.5 flex-shrink-0 ${n.isRead ? 'opacity-0' : ''}`} />
              <div>
                <p className="text-sm text-gray-800 mb-1">{n.message}</p>
                <time className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;