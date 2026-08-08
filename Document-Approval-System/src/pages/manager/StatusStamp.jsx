// src/components/StatusStamp.jsx
//
// The one signature element of this module: reviewed documents get an
// ink-stamp badge, like a real approval stamp on paper. Used in the
// Pending Documents table and the Approval Timeline.

import './StatusStamp.css';

const LABELS = {
  approved: 'Approved',
  rejected: 'Rejected',
  pending: 'Pending'
};

const StatusStamp = ({ status }) => {
  const label = LABELS[status] || status;
  return (
    <span className={`stamp stamp--${status}`} role="status">
      {label}
    </span>
  );
};

export default StatusStamp;
