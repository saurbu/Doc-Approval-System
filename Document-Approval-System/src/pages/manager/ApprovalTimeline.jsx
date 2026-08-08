// src/components/ApprovalTimeline.jsx
//
// Renders a document's approvalHistory as a vertical ledger.
// Expects history entries shaped like:
// { actor: { name, role }, action: 'approved'|'rejected'|'commented', comment, timestamp }

import StatusStamp from './StatusStamp';
import './ApprovalTimeline.css';

const STAMP_STATUS = { approved: 'approved', rejected: 'rejected', commented: null };

const ApprovalTimeline = ({ history = [] }) => {
  if (history.length === 0) {
    return <p className="timeline-empty">No decisions have been recorded on this document yet.</p>;
  }

  return (
    <ol className="timeline">
      {history.map((entry, i) => (
        <li key={i} className="timeline-entry">
          <div className="timeline-marker" />
          <div className="timeline-body">
            <div className="timeline-row">
              <span className="timeline-actor">{entry.actor?.name || 'Unknown'}</span>
              {STAMP_STATUS[entry.action] && <StatusStamp status={STAMP_STATUS[entry.action]} />}
              {entry.action === 'commented' && <span className="timeline-tag">Comment</span>}
            </div>
            {entry.comment && <p className="timeline-comment">"{entry.comment}"</p>}
            <time className="timeline-time">
              {new Date(entry.timestamp).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ApprovalTimeline;
