import React, { useState, useEffect } from 'react';
import { StudyTask, SubjectId, TaskPriority } from '../../types';
import { SUBJECTS } from '../../data/subjects';
import { X, Calendar, AlertCircle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<StudyTask, 'id' | 'createdAt'> | StudyTask) => void;
  initialTask?: StudyTask | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask
}) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId | 'general'>('c-programming');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setSubjectId(initialTask.subjectId);
      setDueDate(initialTask.dueDate);
      setPriority(initialTask.priority);
      setNotes(initialTask.notes || '');
    } else {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      setTitle('');
      setSubjectId('c-programming');
      setDueDate(tomorrowStr);
      setPriority('medium');
      setNotes('');
    }
    setError('');
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title or objective.');
      return;
    }
    if (!dueDate) {
      setError('Please select a target deadline.');
      return;
    }

    if (initialTask) {
      onSave({
        ...initialTask,
        title: title.trim(),
        subjectId,
        dueDate,
        priority,
        notes: notes.trim()
      });
    } else {
      onSave({
        title: title.trim(),
        subjectId,
        dueDate,
        priority,
        completed: false,
        notes: notes.trim()
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              {initialTask ? 'Edit Study Task' : 'Add New Study Task'}
            </h3>
            <p className="text-xs text-slate-500">
              Schedule academic milestones, problem sets & lab revisions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Practice 10 pointer questions, Revise Laplace transforms..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              autoFocus
            />
          </div>

          {/* Subject selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Subject
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                {SUBJECTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
                <option value="general">General / Exam Prep</option>
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Deadline *
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => {
                const isSelected = priority === p;
                const colors = {
                  low: 'text-slate-700 border-slate-200',
                  medium: 'text-amber-700 border-amber-200',
                  high: 'text-rose-700 border-rose-200'
                };
                const activeBgs = {
                  low: 'bg-slate-100 border-slate-400 font-bold',
                  medium: 'bg-amber-50 border-amber-400 font-bold',
                  high: 'bg-rose-50 border-rose-400 font-bold'
                };

                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs capitalize transition-all text-center ${
                      isSelected ? activeBgs[p] : `bg-white hover:bg-slate-50 ${colors[p]}`
                    }`}
                  >
                    {p} Priority
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Notes & Sub-Tasks (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Add key chapter references, exercise numbers, or lab objectives..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs shadow-indigo-600/20 transition-colors"
            >
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
