import React from 'react';
import { ShieldCheck, Mail, User, Building, Lock, CheckCircle2, KeyRound } from 'lucide-react';

const Profile = () => {
  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-center font-bold text-3xl shadow-lg shadow-indigo-500/20 shrink-0">
          AD
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-900">System Administrator</h1>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </span>
          </div>
          <p className="text-sm text-slate-500">Root System Administrator & Access Control Officer</p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-indigo-600" /> Super Admin Role
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
              <Building className="w-4 h-4 text-indigo-600" /> HQ Executive Unit
            </span>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Metadata */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Account Details</span>
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Account ID</span>
              <p className="text-sm font-mono font-bold text-slate-800">ADM-SYS-001</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Contact Email</span>
              <p className="text-sm font-semibold text-slate-800">admin@docapproval.com</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Permissions Level</span>
              <p className="text-sm font-semibold text-indigo-600">Full System Read/Write/Delete</p>
            </div>
          </div>
        </div>

        {/* Security & Access */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Security Governance</span>
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700">Two-Factor Authentication</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Enabled</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700">JWT Token Expiry</span>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-200 px-2 py-0.5 rounded">24 Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
