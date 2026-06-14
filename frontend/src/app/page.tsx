'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi, Issue } from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Search, Filter } from 'lucide-react';

// COMMENT STATE
const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-700',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function Home() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', status: 'open' });

  const queryClient = useQueryClient();

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ['issues', search, status, priority],
    queryFn: () => issuesApi.getAll({ search, status, priority }),
  });

// ADD COMMENT MUTATION
  const createMutation = useMutation({
    mutationFn: issuesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      setShowCreate(false);
      setForm({ title: '', description: '', priority: 'medium', status: 'open' });
      toast.success('Issue created!');
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Issues</h1>
            <p className="text-gray-500 text-sm mt-1">{issues.length} total</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} /> New Issue
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 flex-1 min-w-48 bg-white border rounded-lg px-3 py-2">
            <Search size={16} className="text-gray-400" />
            <input
              className="outline-none text-sm w-full"
              placeholder="Search issues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="border bg-white rounded-lg px-3 py-2 text-sm" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select className="border bg-white rounded-lg px-3 py-2 text-sm" value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        {/* Issues List */}
        {isLoading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : issues.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No issues found. Create your first one!</div>
        ) : (
          <div className="space-y-3">
            {issues.map((issue: Issue) => (
              <Link key={issue.id} href={`/issues/${issue.id}`}>
                <div className="bg-white border rounded-xl p-4 hover:shadow-sm transition cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="font-semibold text-gray-900">{issue.title}</h2>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{issue.description}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${PRIORITY_COLORS[issue.priority]}`}>
                        {issue.priority}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[issue.status]}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{new Date(issue.createdAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
              <h2 className="font-bold text-lg mb-4">Create New Issue</h2>
              <div className="space-y-3">
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Issue title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the issue..."
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <div className="flex gap-3">
                  <select className="flex-1 border rounded-lg px-3 py-2 text-sm" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                  <select className="flex-1 border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowCreate(false)} className="flex-1 border rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={() => createMutation.mutate(form as any)}
                  disabled={!form.title || !form.description}
                  className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Issue'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}