// backend/models/Notification.js
//
// Owned by Member 2. userId refs whichever collection actually holds
// Employee/Manager accounts. CONFIRMED from the real repo (backend/models,
// update branch): there are TWO separate models —
//   - User.js      -> mongoose.model("user", ...)      — name/email/password/role/isActive only
//   - employee.js  -> mongoose.model("employee", ...)  — same + number/empId/department
// Saurav's sample login data (empId, department) matches employee.js, so
// Managers and Employees live in the "employee" collection, not "user".
// CONFIRM WITH SAURAV: is User.js only for Admin login? If so this ref is
// correct. If accounts can also land in "user", ask him to reconcile the two.
//
// relatedDocument refs Member 4's Document model — his Document.js exists
// in the repo but is currently EMPTY (0 bytes, confirmed). Nothing to
// verify there yet; re-check once he's pushed content.

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employee', // matches mongoose.model("employee", empSchema) — confirm with Saurav per note above
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['document_submitted', 'document_approved', 'document_rejected', 'general'],
      default: 'general'
    },
    relatedDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document', // Document.js exists but is empty — confirm model name string once Member 4 writes it
      default: null
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

// Speeds up the most common query: "unread notifications for this user"
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
