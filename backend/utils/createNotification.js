// backend/utils/createNotification.js
//
// Small reusable helper so notification-creation logic lives in one place.
// Call this instead of writing `new Notification(...)` inline wherever a
// notification needs to be fired — keeps the message wording consistent.

import Notification from '../models/Notification.js';

/**
 * @param {Object} params
 * @param {string} params.userId - who the notification is for
 * @param {string} params.message - human-readable text
 * @param {string} params.type - one of the Notification enum values
 * @param {string} [params.relatedDocument] - Document _id, if applicable
 */
const createNotification = async ({ userId, message, type = 'general', relatedDocument = null }) => {
  try {
    const notification = await Notification.create({
      userId,
      message,
      type,
      relatedDocument
    });
    return notification;
  } catch (err) {
    // A failed notification should never break the approve/reject flow itself —
    // log it and move on rather than throwing.
    console.error('createNotification failed:', err.message);
    return null;
  }
};

export default createNotification;
