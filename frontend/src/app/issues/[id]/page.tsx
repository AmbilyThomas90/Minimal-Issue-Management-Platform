'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { issuesApi, commentsApi, analysisApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft, Sparkles, MessageSquare, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState({ content: '', author: '' });

  const { data: issue } = useQuery({ queryKey: ['issue', id], queryFn: () => issuesApi.getOne(id) });
  const { data: comments = [] } = useQuery({ queryKey: ['comments', id], queryFn: () => commentsApi.getAll(id) });
  const { data: analyses = [] } = useQuery({ queryKey: ['analyses', id], queryFn: () => analysisApi.getAll(id) });

  const addComment = useMutation({
    mutationFn: () => commentsApi.create(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] });
      setComment({ content: '', author: '' });
      toast.success('Comment added!');
    },
  });

  const generateAnalysis = useMutation({
    mutationFn: () => analysisApi.generate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses', id] });
      toast.success('AI analysis generated!');
    },
  });

  const deleteIssue = useMutation({
    mutationFn: () => issuesApi.delete(id),
    onSuccess: () => { router.push('/'); toast.success('Issue deleted'); },
  });

  const updateStatus = useMutation({
    mutationFn: (status: string) => issuesApi.update(id, { status: status as any }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issue', id] }),
  });

  if (!issue) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 text-sm">
          <ArrowLeft size={16} /> Back to Issues
        </Link>

        {/* Issue Header */}
        <div className="bg-white rounded-2xl border p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-gray-900">{issue.title}</h1>
            <button onClick={() => deleteIssue.mutate()} className="text-red-400 hover:text-red-600 p-1">
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex gap-3 mt-3">
            <select
              value={issue.status}
              onChange={e => updateStatus.mutate(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <span className="text-sm text-gray-500 py-1">Priority: <strong>{issue.priority}</strong></span>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{issue.description}</p>
          <p className="text-xs text-gray-400 mt-4">Created {new Date(issue.createdAt).toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comments */}
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare size={18} className="text-gray-500" />
              <h2 className="font-semibold">Discussion ({comments.length})</h2>
            </div>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet</p>}
              {comments.map(c => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-600">{c.author}</p>
                  <p className="text-sm text-gray-700 mt-1">{c.content}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(c.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <input
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                value={comment.author}
                onChange={e => setComment({ ...comment, author: e.target.value })}
              />
              <textarea
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Add a comment..."
                rows={3}
                value={comment.content}
                onChange={e => setComment({ ...comment, content: e.target.value })}
              />
              <button
                onClick={() => addComment.mutate()}
                disabled={!comment.content || !comment.author}
                className="w-full bg-gray-900 text-white rounded-lg py-2 text-sm hover:bg-gray-700 disabled:opacity-50"
              >
                {addComment.isPending ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-white rounded-2xl border p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-purple-500" />
                <h2 className="font-semibold">AI Analysis</h2>
              </div>
              <button
                onClick={() => generateAnalysis.mutate()}
                disabled={generateAnalysis.isPending}
                className="flex items-center gap-1 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-purple-700 disabled:opacity-60"
              >
                <Sparkles size={12} />
                {generateAnalysis.isPending ? 'Analyzing...' : 'Generate Analysis'}
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-4">
              {analyses.length === 0 && (
                <p className="text-sm text-gray-400">No analysis yet. Click "Generate Analysis" to get AI insights.</p>
              )}
              {analyses.map(a => (
                <div key={a.id} className="bg-purple-50 rounded-xl p-4">
                  <p className="text-xs text-purple-400 mb-2">{new Date(a.createdAt).toLocaleString()}</p>
                  <div className="prose prose-sm prose-purple max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {a.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}