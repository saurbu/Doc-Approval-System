import React from 'react';

const STYLES = {
  approved: 'text-emerald-700 bg-emerald-50 border-emerald-600 -rotate-3',
  rejected: 'text-rose-700 bg-rose-50 border-rose-600 -rotate-3',
  pending: 'text-amber-700 bg-amber-50 border-amber-500 border-dashed rotate-0',
};

const LABELS = { approved: 'Approved', rejected: 'Rejected', pending: 'Pending' };

const StatusStamp = ({ status }) => (
  <span
    className={`inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded border-2 ${STYLES[status] || ''}`}
  >
    {LABELS[status] || status}
  </span>
);

export default StatusStamp;