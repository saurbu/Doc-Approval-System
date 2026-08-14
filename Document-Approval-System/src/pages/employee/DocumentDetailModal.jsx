import React from 'react';
import { X, FileText, CheckCircle, Clock, XCircle, ExternalLink, Calendar, User } from 'lucide-react';

const DocumentDetailModal = ({ doc, isOpen, onClose }) => {
  if (!isOpen || !doc) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-4 h-4 text-rose-600" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-4 h-4 text-amber-600" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold truncate max-w-[280px]">Document Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Title</span>
              <h2 className="text-xl font-bold text-slate-800 mt-0.5">{doc.title}</h2>
            </div>
            <div>{getStatusBadge(doc.status)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Submitted Date
              </span>
              <p className="font-semibold text-slate-700 mt-1">
                {new Date(doc.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> File Name
              </span>
              <p className="font-semibold text-slate-700 mt-1 truncate">
                {doc.fileName || 'document.pdf'}
              </p>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">Description</span>
            <p className="text-sm text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 min-h-[60px]">
              {doc.description || 'No description provided.'}
            </p>
          </div>

          {doc.rejectionReason && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block mb-1">
                Rejection Remarks
              </span>
              <p className="text-sm text-rose-800">{doc.rejectionReason}</p>
            </div>
          )}

          {doc.fileUrl && (
            <div className="pt-2">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition border border-slate-200"
              >
                <ExternalLink className="w-4 h-4 text-blue-600" />
                View Uploaded Document File
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 flex justify-end border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-medium transition text-sm cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailModal;
