import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../data/subjects';
import { STUDY_NOTES } from '../../data/notes';
import { QUIZ_QUESTIONS } from '../../data/quizzes';
import { QuizAttempt } from '../../types';
import {
  TrendingUp,
  Award,
  CheckCircle2,
  BookOpen,
  Calendar,
  RotateCcw,
  Download,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  BarChart3
} from 'lucide-react';

export const ProgressTrackerView: React.FC = () => {
  const { tasks, quizHistory, clearQuizHistory, resetAllData, studentProfile } = useApp();
  const [selectedAttemptForModal, setSelectedAttemptForModal] = useState<QuizAttempt | null>(null);

  // Overall Task Progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Quiz Performance
  const totalQuizzes = quizHistory.length;
  const avgQuizScore =
    totalQuizzes > 0
      ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
      : 0;

  const highestQuizScore =
    totalQuizzes > 0 ? Math.max(...quizHistory.map((q) => q.percentage)) : 0;

  // Academic Readiness Score (composite calculation: 50% task completion + 50% quiz score)
  const readinessScore = Math.min(100, Math.round(taskCompletionRate * 0.4 + (totalQuizzes > 0 ? avgQuizScore * 0.6 : 30)));

  // Export study data report
  const handleExportData = () => {
    const report = {
      student: studentProfile,
      generatedAt: new Date().toISOString(),
      summary: {
        taskCompletionRate: `${taskCompletionRate}%`,
        totalTasks,
        completedTasks,
        totalQuizzesTaken: totalQuizzes,
        averageQuizScore: `${avgQuizScore}%`,
        readinessScore: `${readinessScore}%`
      },
      tasks,
      quizHistory
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SmartStudyHub_Report_${studentProfile.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Performance & Learning Progress
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Continuous analytics computed from your daily study tasks and MCQ practice assessments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Index */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-indigo-950 text-white shadow-sm">
          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider block">
            Overall Readiness Index
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {readinessScore}%
            </span>
            <span className="text-xs text-indigo-200">Exam Ready</span>
          </div>
          <div className="mt-3 w-full bg-indigo-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-400 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${readinessScore}%` }}
            />
          </div>
        </div>

        {/* Task Completion */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Task Completion Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {taskCompletionRate}%
            </span>
            <span className="text-xs text-slate-500">
              ({completedTasks}/{totalTasks} Done)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${taskCompletionRate}%` }}
            />
          </div>
        </div>

        {/* Average Quiz Accuracy */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Average MCQ Accuracy
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {totalQuizzes > 0 ? `${avgQuizScore}%` : 'N/A'}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              High: {highestQuizScore}%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${avgQuizScore}%` }}
            />
          </div>
        </div>

        {/* Quizzes Taken */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Assessments Completed
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-900">
              {totalQuizzes}
            </span>
            <span className="text-xs text-slate-500">Self-evaluations</span>
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Across 4 semester subjects
          </div>
        </div>
      </div>

      {/* Subject-Wise Mastery Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Subject-wise Course Progress & Coverage
          </h3>
          <p className="text-xs text-slate-500">
            Task execution and study note availability per engineering discipline
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {SUBJECTS.map((sub) => {
            const subTasks = tasks.filter((t) => t.subjectId === sub.id);
            const subCompleted = subTasks.filter((t) => t.completed).length;
            const subNotes = STUDY_NOTES.filter((n) => n.subjectId === sub.id);
            const subQuestions = QUIZ_QUESTIONS.filter((q) => q.subjectId === sub.id);

            // Calculation
            const taskRate = subTasks.length > 0 ? Math.round((subCompleted / subTasks.length) * 100) : 0;
            const subQuizzes = quizHistory.filter((q) => q.subjectId === sub.id);
            const subAvgQuiz =
              subQuizzes.length > 0
                ? Math.round(subQuizzes.reduce((a, b) => a + b.percentage, 0) / subQuizzes.length)
                : null;

            return (
              <div key={sub.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">{sub.code}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{sub.name}</h4>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-bold text-indigo-700">
                      {subAvgQuiz !== null ? `${subAvgQuiz}% Quiz` : 'No quiz yet'}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Task Completion</span>
                    <span className="font-mono font-medium">
                      {subCompleted}/{subTasks.length} ({taskRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${taskRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-slate-200/60">
                  <span>{subNotes.length} Note Units</span>
                  <span aria-hidden="true">·</span>
                  <span>{subQuestions.length} Practice MCQs</span>
                  <span aria-hidden="true">·</span>
                  <span>{subQuizzes.length} Attempts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quiz History Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Assessment Attempt History
            </h3>
            <p className="text-xs text-slate-500">
              Audit log of self-assessment attempts saved in your local browser
            </p>
          </div>

          {quizHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Clear all stored quiz assessment records?')) {
                  clearQuizHistory();
                }
              }}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {quizHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Subject / Test</th>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3 text-right">Score</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {quizHistory.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-900">{attempt.subjectName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-xs">
                      {new Date(attempt.timestamp).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {attempt.score}/{attempt.totalQuestions}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span
                        className={`font-bold ${
                          attempt.percentage >= 75
                            ? 'text-emerald-600'
                            : attempt.percentage >= 50
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {attempt.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {attempt.details && attempt.details.length > 0 ? (
                        <button
                          onClick={() => setSelectedAttemptForModal(attempt)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                        >
                          Review Answers
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500">
            <Award className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No assessment history recorded</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete a quiz in Quiz Zone to track your accuracy metrics here.
            </p>
          </div>
        )}
      </div>

      {/* Review Modal for Past Quiz */}
      {selectedAttemptForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {selectedAttemptForModal.subjectName} · Assessment Review
                </h4>
                <p className="text-xs text-slate-500 font-mono">
                  Score: {selectedAttemptForModal.score}/{selectedAttemptForModal.totalQuestions} ({selectedAttemptForModal.percentage}%)
                </p>
              </div>
              <button
                onClick={() => setSelectedAttemptForModal(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-200 px-2.5 py-1 rounded-md"
              >
                Close
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedAttemptForModal.details.map((d, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs sm:text-sm ${
                    d.isCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">Q{idx + 1}</span>
                    <span className={`font-bold ${d.isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {d.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 mb-2">{d.questionText}</p>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="font-bold text-indigo-700">Explanation: </span>
                    {d.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reset System Option */}
      <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <span>Smart Study Hub uses browser LocalStorage for all client-side data persistence.</span>
        <button
          onClick={() => {
            if (window.confirm('Reset all demo study tasks and quiz logs to initial default state?')) {
              resetAllData();
            }
          }}
          className="text-slate-600 hover:text-rose-600 underline font-medium"
        >
          Reset Demo State
        </button>
      </div>
    </div>
  );
};
