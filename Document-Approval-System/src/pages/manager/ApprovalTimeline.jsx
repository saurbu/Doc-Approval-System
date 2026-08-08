import React from 'react';
import StatusStamp from './StatusStamp';

// Expects entries shaped like:
// { actor: { name, role }, action: 'approved'|'rejected'|'commented', comment, timestamp }

const STAMP_STATUS = { approved: 'approved', rejected: 'rejected', commented: null };

const ApprovalTimeline = ({ history = [] }) => {
  if (history.length === 0) {
    return <p className="text-sm text-gray-400">No decisions have been recorded on this document yet.</p>;
  }

  return (
    <ol className="relative">
      {history.map((entry, i) => (
        <li key={i} className="flex gap-3 pb-6 relative">
          {i !== history.length - 1 && (
            <span className="absolute left-[5px] top-4 bottom-0 w-px bg-gray-200" />
          )}
          <span className="w-[11px] h-[11px] rounded-full bg-violet-500 mt-1 flex-shrink-0 z-10" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">{entry.actor?.name || 'Unknown'}</span>
              {STAMP_STATUS[entry.action] && <StatusStamp status={STAMP_STATUS[entry.action]} />}
              {entry.action === 'commented' && (
                <span className="text-[11px] uppercase tracking-wide text-gray-400 border border-gray-200 rounded px-2 py-0.5">
                  Comment
                </span>
              )}
            </div>
            {entry.comment && <p className="text-sm text-gray-600 italic mb-1">"{entry.comment}"</p>}
            <time className="text-xs text-gray-400">
              {new Date(entry.timestamp).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ApprovalTimeline;