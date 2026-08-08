// services/managerApi.js
import api from './api';

export const fetchPendingDocuments = (page = 1, limit = 10) =>
  api.get(`/manager/documents/pending?page=${page}&limit=${limit}`);

export const approveDocument = (id, comment = '') =>
  api.patch(`/manager/documents/${id}/approve`, { comment });

export const rejectDocument = (id, comment) =>
  api.patch(`/manager/documents/${id}/reject`, { comment });

export const addComment = (id, comment) =>
  api.post(`/manager/documents/${id}/comment`, { comment });

export const fetchApprovalHistory = (id) =>
  api.get(`/manager/documents/${id}/history`);
