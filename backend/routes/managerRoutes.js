// backend/routes/managerRoutes.js
//
// Mount this in your main server.js as: app.use('/api/manager', managerRoutes)
//
// `protect` and `restrictTo` come from the SHARED middleware Member 3 already
// built — don't recreate auth logic here. Adjust the import path below to
// wherever it actually lives in the repo once you pull.

import express from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js'; // shared — confirm path after pulling
import {
  getPendingDocuments,
  approveDocument,
  rejectDocument,
  addComment,
  getApprovalHistory
} from '../controllers/managerController.js';

const router = express.Router();

router.use(protect, restrictTo('Manager')); // confirmed against Saurav's User.js role enum

router.get('/documents/pending', getPendingDocuments);
router.patch('/documents/:id/approve', approveDocument);
router.patch('/documents/:id/reject', rejectDocument);
router.post('/documents/:id/comment', addComment);
router.get('/documents/:id/history', getApprovalHistory);

export default router;
