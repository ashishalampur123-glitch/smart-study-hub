import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../data/subjects';
import { STUDY_NOTES } from '../../data/notes';
import { QUIZ_QUESTIONS } from '../../data/quizzes';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Calendar,
  Sparkles,
  ChevronRight,
  Code2,
  Binary,
  Atom,
  Leaf,
  AlertCircle
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddTaskModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddTaskModal }) => {
  const {
    studentProfile,
    setCurrentSection,
    tasks,
    toggleTaskComplete,
    quizHistory,
    startQuizForSubject,
    openMaterialForSubject,
    setActiveNoteModal
  } = useApp();

  // Metrics computation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalQuizzes = quizHistory.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
      : 0;

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return Code2;
      case 'Binary':
        return Binary;
      case 'Atom':
        return Atom;
      case 'Leaf':
        return Leaf;
      default:
        return BookOpen;
    }
  };

  const getRelativeDueLabel = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Overdue', color: 'text-rose-600 font-semibold' };
    if (diffDays === 0) return { label: 'Due Today', color: 'text-amber-600 font-semibold' };
    if (diffDays === 1) return { label: 'Due Tomorrow', color: 'text-blue-600' };
    return { label: `Due in ${diffDays} days`, color: 'text-slate-500' };
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-indigo-200 text-xs font-semibold tracking-wider uppercase">
            <span>{studentProfile.course}</span>
            <span aria-hidden="true">·</span>
            <span>{studentProfile.semester}</span>
            <span aria-hidden="true">·</span>
            <span>ID: {studentProfile.studentId}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            Welcome back, {studentProfile.name}!
          </h2>

          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed max-w-2xl">
            Here is your daily B.Tech engineering briefing. You have{' '}
            <span className="font-bold text-white underline decoration-indigo-300">
              {pendingTasks.length} pending study tasks
            </span>{' '}
            and 4 active course repositories ready for exam preparation and MCQ practice.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => startQuizForSubject('all')}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs sm:text-sm hover:bg-indigo-50 shadow-sm transition-all flex items-center gap-2"
            >
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Take Daily MCQ Quiz</span>
            </button>
            <button
              onClick={onOpenAddTaskModal}
              className="px-4 py-2.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-white border border-indigo-400/40 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule Study Task</span>
            </button>
          </div>
        </div>

        {/* Decorative background subtle glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tasks completion */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Planner Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({completedTasks}/{totalTasks} done)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Average Quiz Accuracy */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Quiz Accuracy</span>
            <Award className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalQuizzes > 0 ? `${avgQuizScore}%` : 'N/A'}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {totalQuizzes > 0 ? `${totalQuizzes} attempts` : 'No attempts yet'}
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${avgQuizScore}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Subject Notes Repository */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Study Notes</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {STUDY_NOTES.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">in-depth units</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 truncate">
            Across 4 core B.Tech subjects
          </div>
        </div>

        {/* Metric 4: MCQ Question Bank */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Question Bank</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">viva & exam MCQs</span>
          </div>
          <div className="mt-3 text-xs text-emerald-600 font-medium flex items-center gap-1">
            <span>Verified solutions & explanations</span>
          </div>
        </div>
      </div>

      {/* Section: 4 Core Subject Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Core B.Tech Semester Subjects
            </h3>
            <p className="text-xs text-slate-500">
              Browse study modules or take subject-specific practice tests
            </p>
          </div>
          <button
            onClick={() => setCurrentSection('materials')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
          >
            <span>View All Notes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUBJECTS.map((sub) => {
            const Icon = getSubjectIcon(sub.iconName);
            const notesForSub = STUDY_NOTES.filter((n) => n.subjectId === sub.id);
            const questionsForSub = QUIZ_QUESTIONS.filter((q) => q.subjectId === sub.id);

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl ${sub.color.light} ${sub.color.primary} flex items-center justify-center border ${sub.color.border} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <span>{sub.code}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sub.credits} Credits</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                          {sub.name}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {sub.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 py-2 border-y border-slate-100 mb-4">
                    <span>
                      <strong className="text-slate-800 font-mono">{notesForSub.length}</strong> Study Units
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      <strong className="text-slate-800 font-mono">{questionsForSub.length}</strong> MCQs
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{sub.semester}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => openMaterialForSubject(sub.id)}
                    className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 text-xs font-semibold transition-colors text-center"
                  >
                    Read Notes
                  </button>
                  <button
                    onClick={() => startQuizForSubject(sub.id)}
                    className="py-2 px-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition-colors text-center shadow-xs"
                  >
                    Practice Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Upcoming Study Tasks & Recent Quiz Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Pending Tasks Widget */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Priority Tasks</h4>
                <p className="text-xs text-slate-500">Upcoming study milestones and assignments</p>
              </div>
              <button
                onClick={() => setCurrentSection('planner')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Go to Planner
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {pendingTasks.slice(0, 4).map((task) => {
                const due = getRelativeDueLabel(task.dueDate);
                const sub = SUBJECTS.find((s) => s.id === task.subjectId);

                return (
                  <div key={task.id} className="py-3 flex items-start gap-3 group">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 w-5 h-5 rounded-md border border-slate-300 hover:border-indigo-600 flex items-center justify-center transition-colors text-white hover:text-indigo-600 shrink-0"
                      aria-label="Mark task done"
                    >
                      {task.completed && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs mt-1">
                        <span className="text-slate-500">{sub?.name || 'General'}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className={due.color}>{due.label}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {pendingTasks.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">All caught up!</p>
                  <p className="text-xs text-slate-500 mt-0.5">No pending study tasks remaining.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onOpenAddTaskModal}
              className="w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:border-indigo-400 hover:bg-slate-50 transition-colors text-center"
            >
              + Add Another Task to Planner
            </button>
          </div>
        </div>

        {/* Right: Recent Quiz Summary */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Quiz Performance</h4>
                <p className="text-xs text-slate-500">Recent self-assessment attempts</p>
              </div>
              <button
                onClick={() => setCurrentSection('progress')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Full Analytics
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {quizHistory.slice(0, 4).map((attempt) => (
                <div key={attempt.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                      {attempt.subjectName}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(attempt.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-sm font-bold ${
                        attempt.percentage >= 75
                          ? 'text-emerald-600'
                          : attempt.percentage >= 50
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {attempt.percentage}%
                    </span>
                    <span className="text-xs text-slate-400 block font-mono">
                      {attempt.score}/{attempt.totalQuestions}
                    </span>
                  </div>
                </div>
              ))}

              {quizHistory.length === 0 && (
                <div className="py-8 text-center text-slate-500">
                  <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">No quizzes taken yet</p>
                  <p className="text-xs text-slate-500 mt-0.5">Test your knowledge to track improvement.</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => startQuizForSubject('all')}
              className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors text-center"
            >
              Start Mixed Subject Mock Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
