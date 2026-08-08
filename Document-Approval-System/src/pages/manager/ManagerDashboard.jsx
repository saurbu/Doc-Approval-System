import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';
import PendingDocuments from './PendingDocuments';
import NotificationPage from './NotificationPage';

const ManagerDashboard = () => {
  const [activePage, setActivePage] = useState('pending');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const tabClass = (page) =>
    `px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition ${
      activePage === page ? 'bg-violet-400 text-white' : 'text-gray-600 hover:bg-violet-100'
    }`;

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-violet-500 bg-clip-text text-transparent">
          XYZ.com
        </h1>

        <div className="flex items-center gap-4">
          <NotificationBell onViewAll={() => setActivePage('notifications')} />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-semibold text-rose-500 border-2 border-rose-500 rounded-lg px-3 py-1.5 hover:bg-rose-500 hover:text-white transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <nav className="flex gap-2 mb-6">
        <button onClick={() => setActivePage('pending')} className={tabClass('pending')}>
          Pending Documents
        </button>
        <button onClick={() => setActivePage('notifications')} className={tabClass('notifications')}>
          Notifications
        </button>
      </nav>

      {activePage === 'pending' && <PendingDocuments />}
      {activePage === 'notifications' && <NotificationPage />}
    </div>
  );
};

export default ManagerDashboard;