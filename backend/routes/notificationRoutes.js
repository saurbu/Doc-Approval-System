// backend/routes/notificationRoutes.js
//
// Mount this in your main server.js as: app.use('/api/notifications', notificationRoutes)
//
// No restrictTo() here — any logged-in user (employee, manager, or admin)
// reads and manages only their OWN notifications, scoped by req.user.id
// inside the controller.

import express from 'express';
import { protect } from '../middleware/authMiddleware.js'; // shared — confirm path after pulling
import { getNotifications, markAsRead, markAllAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);

export default router;
