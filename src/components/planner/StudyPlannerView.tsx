import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyTask, SubjectId, TaskPriority } from '../../types';
import { SUBJECTS, getSubjectById } from '../../data/subjects';
import {
  CalendarCheck2,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  Calendar,
  AlertCircle,
  Clock,
  Sparkles,
  Filter
} from 'lucide-react';

interface StudyPlannerViewProps {
  onOpenAddTaskModal: () => void;
  onEditTask: (task: StudyTask) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  onOpenAddTaskModal,
  onEditTask
}) => {
  const { tasks, toggleTaskComplete, deleteTask } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'dueToday' | 'high' | 'completed'>('all');
  const [plannerSearch, setPlannerSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');

  const getRelativeDueInfo = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''} overdue`,
        badgeColor: 'text-rose-700 bg-rose-50 border-rose-200',
        isOverdue: true,
        isToday: false
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Due Today',
        badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
        isOverdue: false,
        isToday: true
      };
    }
    if (diffDays === 1) {
      return {
        label: 'Due Tomorrow',
        badgeColor: 'text-blue-700 bg-blue-50 border-blue-200',
        isOverdue: false,
        isToday: false
      };
    }
    return {
      label: `Due in ${diffDays} days`,
      badgeColor: 'text-slate-600 bg-slate-50 border-slate-200',
      isOverdue: false,
      isToday: false
    };
  };

  // Filter tasks based on tab, subject, and search
  const filteredTasks = tasks.filter((task) => {
    // Subject filter
    if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) {
      return false;
    }

    // Search query
    if (plannerSearch.trim()) {
      const q = plannerSearch.toLowerCase();
      const inTitle = task.title.toLowerCase().includes(q);
      const inNotes = task.notes?.toLowerCase().includes(q) || false;
      if (!inTitle && !inNotes) return false;
    }

    // Tab filter
    const dueInfo = getRelativeDueInfo(task.dueDate);
    if (activeTab === 'pending') return !task.completed;
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'dueToday') return dueInfo.isToday && !task.completed;
    if (activeTab === 'high') return task.priority === 'high' && !task.completed;

    return true;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && getRelativeDueInfo(t.dueDate).isOverdue).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Schedule & Daily Task Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Organize coursework, problem sets, mid-term revisions, and laboratory assignments
          </p>
        </div>

        <button
          onClick={onOpenAddTaskModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs shadow-indigo-600/20 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Task</span>
        </button>
      </div>

      {/* Task Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 block">Total Scheduled</span>
          <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
            {totalTasks}
          </span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 block">In Progress</span>
          <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block">
            {pendingCount}
          </span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 block">Completed</span>
          <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
            {completedCount}
          </span>
        </div>
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
          <span className="text-xs text-slate-500 block">Overdue</span>
          <span
            className={`text-xl font-bold font-mono mt-1 block ${
              overdueCount > 0 ? 'text-rose-600' : 'text-slate-400'
            }`}
          >
            {overdueCount}
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Tab Group */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: `All (${totalTasks})` },
            { id: 'pending', label: `Pending (${pendingCount})` },
            { id: 'dueToday', label: 'Due Today' },
            { id: 'high', label: 'High Priority' },
            { id: 'completed', label: `Completed (${completedCount})` }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Subject Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Subjects</option>
            {SUBJECTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks..."
              value={plannerSearch}
              onChange={(e) => setPlannerSearch(e.target.value)}
              className="w-full bg-white text-xs pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const subject = getSubjectById(task.subjectId);
          const due = getRelativeDueInfo(task.dueDate);

          const priorityBadge = {
            high: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
            medium: 'bg-amber-50 text-amber-700 border-amber-200',
            low: 'bg-slate-100 text-slate-600 border-slate-200'
          }[task.priority];

          return (
            <div
              key={task.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-50/70 border-slate-200/70 opacity-80'
                  : 'bg-white border-slate-200/90 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <Circle className="w-6 h-6 hover:text-indigo-600" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1 text-xs">
                    <span className="font-semibold text-indigo-700">
                      {subject ? subject.name : 'General Task'}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] ${priorityBadge}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] font-mono ${due.badgeColor}`}>
                      {due.label}
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-bold text-slate-900 leading-snug ${
                      task.completed ? 'line-through text-slate-400 font-normal' : ''
                    }`}
                  >
                    {task.title}
                  </h3>

                  {task.notes && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {task.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Target: {task.dueDate}</span>
                    {task.completed && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-600 font-sans font-medium">Completed</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onEditTask(task)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-md mx-auto">
            <CalendarCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No study tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {plannerSearch
                ? `No tasks matched your search "${plannerSearch}".`
                : 'Your task list is clear for this filter category.'}
            </p>
            <button
              onClick={onOpenAddTaskModal}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Schedule New Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
