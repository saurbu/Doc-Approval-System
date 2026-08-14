import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  UploadCloud,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  User,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Check,
  CheckCheck,
  Building,
  Phone,
  Mail,
  Shield,
  LayoutDashboard,
  Eye,
  AlertCircle,
  Loader2
} from 'lucide-react';
import {
  getProfile,
  updateProfile,
  changePassword,
  myDocuments,
  myNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../../../services/employeeApi';
import DocumentUploadModal from './DocumentUploadModal';
import DocumentDetailModal from './DocumentDetailModal';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'documents' | 'notifications' | 'profile'
  const [activeTab, setActiveTab] = useState('overview');

  // User profile state
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit profile form state
  const [editProfileForm, setEditProfileForm] = useState({ name: '', number: '', department: '' });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Change password form state
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPwd, setChangingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' });

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [docLoading, setDocLoading] = useState(true);
  const [docFilter, setDocFilter] = useState(''); // '' | 'Pending' | 'Approved' | 'Rejected'
  const [docSearch, setDocSearch] = useState('');

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // General Notification / Toast alert state
  const [toast, setToast] = useState('');

  // Fetch initial profile
  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await getProfile();
      if (res.data.success) {
        setProfile(res.data.employee);
        setEditProfileForm({
          name: res.data.employee.name || '',
          number: res.data.employee.number || '',
          department: res.data.employee.department || ''
        });
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setDocLoading(true);
      const params = {};
      if (docFilter) params.status = docFilter;
      const res = await myDocuments(params);
      if (res.data.success) {
        setDocuments(res.data.documents || []);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setDocLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setNotifLoading(true);
      const params = {};
      if (unreadOnly) params.unreadOnly = 'true';
      const res = await myNotifications(params);
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setNotifLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchDocuments();
    fetchNotifications();
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [docFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [unreadOnly]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
  };

  // Profile update handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      setProfileMsg({ type: '', text: '' });
      const res = await updateProfile(editProfileForm);
      if (res.data.success) {
        setProfile(res.data.employee);
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        showToast('Profile updated!');
      }
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdMsg({ type: 'error', text: 'New password and confirm password do not match' });
      return;
    }
    try {
      setChangingPwd(true);
      setPwdMsg({ type: '', text: '' });
      const res = await changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword
      });
      if (res.data.success) {
        setPwdMsg({ type: 'success', text: 'Password changed successfully!' });
        setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Password changed successfully!');
      }
    } catch (err) {
      setPwdMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setChangingPwd(false);
    }
  };

  // Mark single notification read
  const handleMarkRead = async (id) => {
    try {
      const res = await markNotificationRead(id);
      if (res.data.success) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Mark all notifications read
  const handleMarkAllRead = async () => {
    try {
      const res = await markAllNotificationsRead();
      if (res.data.success) {
        fetchNotifications();
        showToast('All notifications marked as read');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered documents by search
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(docSearch.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(docSearch.toLowerCase()))
  );

  // Document status counts
  const totalCount = documents.length;
  const pendingCount = documents.filter((d) => d.status === 'Pending').length;
  const approvedCount = documents.filter((d) => d.status === 'Approved').length;
  const rejectedCount = documents.filter((d) => d.status === 'Rejected').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce border border-slate-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg text-white font-bold text-lg">
              EA
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Employee Portal
              </h1>
              <p className="text-xs text-slate-400">Document Approval System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Icon */}
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Info Badge */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer border border-slate-700"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'E'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-white">{profile?.name || 'Employee'}</div>
                <div className="text-[10px] text-slate-400">{profile?.empId || 'ID: --'}</div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                My Documents
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                Notifications
              </div>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500 text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-5 h-5" />
              Profile & Security
            </button>
          </div>

          {/* Quick Submit Action Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800 space-y-3">
            <h4 className="font-bold text-base">Need Document Approval?</h4>
            <p className="text-xs text-slate-300">
              Submit your document for manager approval in seconds.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 font-semibold text-sm rounded-xl transition shadow-md cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload New Document
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Welcome back, {profile?.name || 'Employee'}! 👋
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Department: <span className="font-medium text-slate-700">{profile?.department || 'General'}</span> | Employee ID: <span className="font-medium text-slate-700">{profile?.empId || 'N/A'}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  Submit Document
                </button>
              </div>

              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Documents</span>
                    <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                      <FileText className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-slate-800">{totalCount}</div>
                  <p className="text-xs text-slate-400">All submitted files</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-amber-600">{pendingCount}</div>
                  <p className="text-xs text-slate-400">Awaiting manager review</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Approved</span>
                    <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-600">{approvedCount}</div>
                  <p className="text-xs text-slate-400">Successfully approved</p>
                </div>

                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-semibold uppercase tracking-wider">Rejected</span>
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                      <XCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-extrabold text-rose-600">{rejectedCount}</div>
                  <p className="text-xs text-slate-400">Requires revisions</p>
                </div>
              </div>

              {/* Recent Submissions Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg text-slate-800">Recent Documents</h3>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    View All →
                  </button>
                </div>

                {docLoading ? (
                  <div className="py-12 text-center text-slate-400 flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Loading recent documents...
                  </div>
                ) : documents.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <FileText className="w-12 h-12 mx-auto text-slate-300" />
                    <p className="font-medium text-slate-600">No documents submitted yet</p>
                    <p className="text-xs">Click 'Submit Document' to upload your first file.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                          <th className="pb-3 px-2">Document Title</th>
                          <th className="pb-3 px-2">Submitted Date</th>
                          <th className="pb-3 px-2">Status</th>
                          <th className="pb-3 px-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {documents.slice(0, 5).map((doc) => (
                          <tr key={doc._id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-2 font-semibold text-slate-800 max-w-[200px] truncate">
                              {doc.title}
                            </td>
                            <td className="py-3.5 px-2 text-slate-500">
                              {new Date(doc.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5 px-2">
                              {doc.status === 'Approved' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved
                                </span>
                              )}
                              {doc.status === 'Rejected' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                                </span>
                              )}
                              {doc.status === 'Pending' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-2 text-right">
                              <button
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">My Submitted Documents</h3>
                  <p className="text-xs text-slate-400">Track and manage your document approval status</p>
                </div>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Document
                </button>
              </div>

              {/* Filters and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={docSearch}
                    onChange={(e) => setDocSearch(e.target.value)}
                    placeholder="Search documents by title..."
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {['', 'Pending', 'Approved', 'Rejected'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setDocFilter(status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                        docFilter === status
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === '' ? 'All Status' : status}
                    </button>
                  ))}
                  <button
                    onClick={fetchDocuments}
                    className="p-2 text-slate-400 hover:text-slate-600 transition"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Documents Table */}
              {docLoading ? (
                <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Fetching documents...
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No matching documents found</p>
                  <p className="text-xs">Try clearing search filters or uploading a new file.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                        <th className="pb-3 px-3">Title & File</th>
                        <th className="pb-3 px-3">Date Submitted</th>
                        <th className="pb-3 px-3">Status</th>
                        <th className="pb-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredDocuments.map((doc) => (
                        <tr key={doc._id} className="hover:bg-slate-50/80 transition">
                          <td className="py-4 px-3">
                            <div className="font-semibold text-slate-800">{doc.title}</div>
                            <div className="text-xs text-slate-400 truncate max-w-xs">{doc.fileName}</div>
                          </td>
                          <td className="py-4 px-3 text-slate-500 text-xs">
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-3">
                            {doc.status === 'Approved' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Approved
                              </span>
                            )}
                            {doc.status === 'Rejected' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Rejected
                              </span>
                            )}
                            {doc.status === 'Pending' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pending
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedDoc(doc);
                                setIsDetailModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-xs transition cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Notifications</h3>
                  <p className="text-xs text-slate-400">Updates regarding your document status and activity</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUnreadOnly(!unreadOnly)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      unreadOnly ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Unread Only
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-medium transition cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark All Read
                    </button>
                  )}
                </div>
              </div>

              {notifLoading ? (
                <div className="py-16 text-center text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-16 text-center text-slate-400 space-y-2">
                  <Bell className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="font-semibold text-slate-600">No notifications found</p>
                  <p className="text-xs">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                        n.isRead
                          ? 'bg-white border-slate-100 text-slate-600'
                          : 'bg-blue-50/50 border-blue-100 text-slate-900 font-medium'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl mt-0.5 ${
                          n.isRead ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm">{n.message}</p>
                          <span className="text-[11px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE & SECURITY */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Details Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-6">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-bold flex items-center justify-center shadow-lg">
                    {profile?.name ? profile.name.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{profile?.name || 'Employee'}</h3>
                    <p className="text-xs text-slate-400">{profile?.role || 'Employee'} • ID: {profile?.empId || 'N/A'}</p>
                  </div>
                </div>

                {/* Edit Profile Form */}
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-700 uppercase tracking-wider">
                    Personal Information
                  </h4>

                  {profileMsg.text && (
                    <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                      profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                      {profileMsg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editProfileForm.name}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Email Address (Read-only)</label>
                      <input
                        type="email"
                        value={profile?.email || ''}
                        disabled
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                      <input
                        type="text"
                        value={editProfileForm.number}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, number: e.target.value })}
                        placeholder="e.g. +8801700000000"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                      <input
                        type="text"
                        value={editProfileForm.department}
                        onChange={(e) => setEditProfileForm({ ...editProfileForm, department: e.target.value })}
                        placeholder="e.g. Engineering, Sales, HR"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition disabled:opacity-50 cursor-pointer"
                    >
                      {updatingProfile ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Change Password Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 space-y-6">
                <div className="flex items-center gap-2 text-slate-800">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold">Change Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {pwdMsg.text && (
                    <div className={`p-3 rounded-xl text-sm flex items-center gap-2 ${
                      pwdMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                      {pwdMsg.text}
                    </div>
                  )}

                  <div className="space-y-3 max-w-md">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Current Password</label>
                      <input
                        type="password"
                        value={pwdForm.currentPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                        placeholder="Enter current password"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
                      <input
                        type="password"
                        value={pwdForm.newPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                        placeholder="At least 6 characters"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        value={pwdForm.confirmPassword}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                        placeholder="Re-enter new password"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <button
                      type="submit"
                      disabled={changingPwd}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {changingPwd ? 'Updating...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(msg) => {
          fetchDocuments();
          showToast(msg);
        }}
      />

      <DocumentDetailModal
        doc={selectedDoc}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDoc(null);
        }}
      />
    </div>
  );
};

export default EmployeeDashboard;
