// services/notificationApi.js
import api from './api';

export const fetchNotifications = (page = 1, unreadOnly = false) =>
  api.get(`/notifications?page=${page}${unreadOnly ? '&unreadOnly=true' : ''}`);

export const markNotificationRead = (id) =>
  api.patch(`/notifications/${id}/read`);

export const markAllNotificationsRead = () =>
  api.patch(`/notifications/read-all`);
