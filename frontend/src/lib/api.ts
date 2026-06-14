import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
});
console.log('API Base URL:', api.defaults.baseURL);
export type Status = 'open' | 'in_progress' | 'resolved' | 'closed';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  issueId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Analysis {
  id: string;
  issueId: string;
  content: string;
  createdAt: string;
}

// Issues
export const issuesApi = {
  getAll: (params?: { search?: string; status?: string; priority?: string }) =>
    api.get<Issue[]>('/issues', { params }).then(r => r.data),
  getOne: (id: string) => api.get<Issue>(`/issues/${id}`).then(r => r.data),
  create: (data: Partial<Issue>) => api.post<Issue>('/issues', data).then(r => r.data),
  update: (id: string, data: Partial<Issue>) => api.put<Issue>(`/issues/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/issues/${id}`),
};

// Comments
export const commentsApi = {
  getAll: (issueId: string) => api.get<Comment[]>(`/issues/${issueId}/comments`).then(r => r.data),
  create: (issueId: string, data: { content: string; author: string }) =>
    api.post<Comment>(`/issues/${issueId}/comments`, data).then(r => r.data),
};

// Analysis
export const analysisApi = {
  getAll: (issueId: string) => api.get<Analysis[]>(`/issues/${issueId}/analysis`).then(r => r.data),
  generate: (issueId: string) => api.post<Analysis>(`/issues/${issueId}/analysis`).then(r => r.data),
};
