// backend/controllers/managerController.js
//
// Owned by Member 2. Manager login/JWT itself is NOT rebuilt here — it reuses
// the shared /api/auth/login + authMiddleware that Member 3 already pushed.
// This file only covers what's actually Member 2's: reviewing and deciding on
// documents, and keeping their history.
//
// Confirmed from the real repo (backend/models, update branch):
// - role enum ["Admin", "Employee", "Manager"] on both his models — capitalized,
//   exactly as used below.
// - There are TWO separate models: User.js (mongoose.model("user", ...),
//   name/email/password/role/isActive only) and employee.js
//   (mongoose.model("employee", ...), same fields + number/empId/department).
//   Employee and Manager accounts (per his sample login data) live in
//   "employee" — populate calls below use that shape.
//   CONFIRM WITH SAURAV whether User.js is Admin-only, or whether accounts
//   can land in either collection.
// - Document.js exists in the repo but is EMPTY (0 bytes) — Member 4 hasn't
//   built it yet. The import below will break until he pushes real content;
//   check with him before you rely on this file working.

import Document from '../models/Document.js'; // owned by Member 4 — currently an empty file in the repo, confirm before relying on this
import createNotification from '../utils/createNotification.js';

const MANAGER_ROLE = 'Manager'; // confirmed against the real User.js / employee.js role enum

/**
 * GET /api/manager/documents/pending
 * Returns documents awaiting this manager's review.
 */
const getPendingDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { status: 'pending' };

    const [documents, total] = await Promise.all([
      Document.find(filter)
        .populate('uploadedBy', 'name email empId department') // matches the "employee" model's real fields
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Document.countDocuments(filter)
    ]);

    res.status(200).json({
      documents,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load pending documents', error: err.message });
  }
};

/**
 * PATCH /api/manager/documents/:id/approve
 * body: { comment?: string }
 */
const approveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment = '' } = req.body;

    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (document.status !== 'pending') {
      return res.status(400).json({ message: `Document is already ${document.status}` });
    }

    document.status = 'approved';
    document.approvalHistory.push({
      actor: req.user.id,
      action: 'approved',
      comment,
      timestamp: new Date()
    });

    await document.save();

    await createNotification({
      userId: document.uploadedBy,
      message: `Your document "${document.title}" has been approved.`,
      type: 'document_approved',
      relatedDocument: document._id
    });

    res.status(200).json({ message: 'Document approved', document });
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve document', error: err.message });
  }
};

/**
 * PATCH /api/manager/documents/:id/reject
 * body: { comment: string }  <- required, a rejection needs a reason
 */
const rejectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'A comment is required when rejecting a document' });
    }

    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    if (document.status !== 'pending') {
      return res.status(400).json({ message: `Document is already ${document.status}` });
    }

    document.status = 'rejected';
    document.approvalHistory.push({
      actor: req.user.id,
      action: 'rejected',
      comment,
      timestamp: new Date()
    });

    await document.save();

    await createNotification({
      userId: document.uploadedBy,
      message: `Your document "${document.title}" was rejected: ${comment}`,
      type: 'document_rejected',
      relatedDocument: document._id
    });

    res.status(200).json({ message: 'Document rejected', document });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject document', error: err.message });
  }
};

/**
 * POST /api/manager/documents/:id/comment
 * Adds a remark without changing the document's status
 * (e.g. "please re-upload page 2" while still under review).
 */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const document = await Document.findById(id);
    if (!document) return res.status(404).json({ message: 'Document not found' });

    document.approvalHistory.push({
      actor: req.user.id,
      action: 'commented',
      comment,
      timestamp: new Date()
    });

    await document.save();
    res.status(200).json({ message: 'Comment added', document });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

/**
 * GET /api/manager/documents/:id/history
 */
const getApprovalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id)
      .populate('approvalHistory.actor', 'name role') // whoever acted — likely refs "employee", confirm with Member 4's schema
      .select('title status approvalHistory');

    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.status(200).json({
      title: document.title,
      status: document.status,
      history: document.approvalHistory
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load approval history', error: err.message });
  }
};

export {
  getPendingDocuments,
  approveDocument,
  rejectDocument,
  addComment,
  getApprovalHistory
};
