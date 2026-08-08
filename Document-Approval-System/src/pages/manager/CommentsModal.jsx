import React, { useState } from 'react';

const COPY = {
  approve: {
    title: 'Approve this document',
    hint: 'Add a note for the employee (optional).',
    confirmLabel: 'Approve',
    confirmClass: 'bg-emerald-600 hover:bg-emerald-700',
    required: false,
  },
  reject: {
    title: 'Reject this document',
    hint: 'Tell the employee what needs to change.',
    confirmLabel: 'Reject',
    confirmClass: 'bg-rose-600 hover:bg-rose-700',
    required: true,
  },
};

const CommentsModal = ({ action, documentTitle, onConfirm, onClose, isSubmitting }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const copy = COPY[action];

  const handleConfirm = () => {
    if (copy.required && !comment.trim()) {
      setError('A reason is required to reject a document.');
      return;
    }
    onConfirm(comment.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
          {documentTitle}
        </p>
        <h2 className="text-xl font-bold text-gray-900 mb-1">{copy.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{copy.hint}</p>

        <textarea
          className="w-full text-sm border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none"
          rows={4}
          value={comment}
          onChange={(e) => { setComment(e.target.value); setError(''); }}
          placeholder={action === 'reject' ? 'e.g. Page 2 is missing a signature' : 'e.g. Looks good, thank you'}
          autoFocus
        />
        {error && <p className="text-rose-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-lg text-white font-medium disabled:opacity-60 ${copy.confirmClass}`}
          >
            {isSubmitting ? 'Saving…' : copy.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;