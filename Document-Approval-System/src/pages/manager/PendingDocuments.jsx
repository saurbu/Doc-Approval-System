import React, { useEffect, useState, useCallback } from 'react';
import { fetchPendingDocuments, approveDocument, rejectDocument } from '../../../services/managerApi';
import CommentsModal from './CommentsModal';
import StatusStamp from './StatusStamp';

const PendingDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState(null); // { action, document }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDocuments = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchPendingDocuments(pageNum);
      setDocuments(data.documents);
      setTotalPages(data.totalPages || 1);
    } catch {
      setError('Could not load pending documents. Try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDocuments(page); }, [page, loadDocuments]);

  const handleDecision = async (comment) => {
    const { action, document } = activeModal;
    setIsSubmitting(true);
    try {
      if (action === 'approve') await approveDocument(document._id, comment);
      else await rejectDocument(document._id, comment);

      setDocuments((prev) => prev.filter((d) => d._id !== document._id));
      setActiveModal(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wide mb-1">
          Manager · Review queue
        </p>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Pending documents</h1>
        <p className="text-sm text-gray-500">
          {documents.length > 0
            ? `${documents.length} document${documents.length === 1 ? '' : 's'} waiting on your decision.`
            : 'Nothing is waiting on you right now.'}
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-16">Loading queue…</div>
      ) : documents.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-200 rounded-xl py-16 px-6">
          <p className="text-lg font-bold text-gray-800 mb-1">Queue is clear.</p>
          <p className="text-sm text-gray-400">New submissions will appear here as employees upload them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-400 border-b border-gray-100">
                <th className="p-4">Document</th>
                <th className="p-4">Submitted by</th>
                <th className="p-4">Type</th>
                <th className="p-4">Submitted</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id} className="border-b border-gray-100 last:border-0">
                  <td className="p-4 font-semibold text-gray-900">{doc.title}</td>
                  <td className="p-4">
                    <div className="font-medium">{doc.uploadedBy?.name}</div>
                    <div className="text-xs text-gray-400">
                      {doc.uploadedBy?.empId} · {doc.uploadedBy?.department}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 capitalize">{doc.type}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4"><StatusStamp status="pending" /></td>
                  <td className="p-4">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setActiveModal({ action: 'approve', document: doc })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-600 hover:bg-emerald-600 hover:text-white transition"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setActiveModal({ action: 'reject', document: doc })}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-600 hover:bg-rose-600 hover:text-white transition"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5 text-sm text-gray-500">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {activeModal && (
        <CommentsModal
          action={activeModal.action}
          documentTitle={activeModal.document.title}
          onConfirm={handleDecision}
          onClose={() => setActiveModal(null)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default PendingDocuments;