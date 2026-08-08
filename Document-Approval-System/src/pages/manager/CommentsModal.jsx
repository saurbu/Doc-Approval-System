// src/components/CommentsModal.jsx
//
// One modal, two modes: approving (comment optional) or rejecting
// (comment required — you can't reject a document without saying why).

import { useState } from 'react';
import './CommentsModal.css';

const COPY = {
  approve: {
    title: 'Approve this document',
    hint: 'Add a note for the employee (optional).',
    confirmLabel: 'Approve',
    required: false
  },
  reject: {
    title: 'Reject this document',
    hint: 'Tell the employee what needs to change.',
    confirmLabel: 'Reject',
    required: true
  }
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
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="modal-eyebrow">{documentTitle}</p>
        <h2 id="modal-title" className="modal-title">{copy.title}</h2>
        <p className="modal-hint">{copy.hint}</p>

        <textarea
          className="modal-textarea"
          value={comment}
          onChange={(e) => { setComment(e.target.value); setError(''); }}
          placeholder={action === 'reject' ? 'e.g. Page 2 is missing a signature' : 'e.g. Looks good, thank you'}
          rows={4}
          autoFocus
        />
        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn btn--${action}`}
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving…' : copy.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
