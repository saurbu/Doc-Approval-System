// backend/controllers/notificationController.js
// Owned by Member 2. These same endpoints are used by Member 1's employee
// notification bell too — the routes are generic (any logged-in user's
// own notifications), not manager-specific.

import Notification from '../models/Notification.js';

/**
 * GET /api/notifications
 * Returns the logged-in user's notifications, newest first.
 */
const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    if (unreadOnly === 'true') filter.isRead = false;

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments({ userId: req.user.id, isRead: false }),
      Notification.countDocuments(filter)
    ]);

    res.status(200).json({ notifications, unreadCount, total, page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load notifications', error: err.message });
  }
};

/**
 * PATCH /api/notifications/:id/read
 */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // scoped to the requester — can't mark someone else's
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.status(200).json({ notification });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err.message });
  }
};

/**
 * PATCH /api/notifications/read-all
 */
const markAllAsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: 'All notifications marked as read', modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notifications', error: err.message });
  }
};

export { getNotifications, markAsRead, markAllAsRead };
