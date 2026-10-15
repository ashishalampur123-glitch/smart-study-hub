import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';
import {
  LayoutDashboard,
  BookOpenCheck,
  Award,
  CalendarCheck2,
  TrendingUp,
  Info,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentSection, setCurrentSection, tasks, quizHistory, studentProfile } = useApp();

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  const navItems: { id: NavSection; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'materials', label: 'Study Materials', icon: BookOpenCheck, badge: '4 Subjects' },
    { id: 'quiz', label: 'Quiz Zone', icon: Award, badge: 'MCQs' },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck2, badge: pendingTasksCount > 0 ? pendingTasksCount : undefined },
    { id: 'progress', label: 'Progress Tracker', icon: TrendingUp },
    { id: 'about', label: 'About Project', icon: Info }
  ];

  const handleNavClick = (section: NavSection) => {
    setCurrentSection(section);
    onClose();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-16 px-5 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-slate-900 tracking-tight text-base block leading-none">Smart Study Hub</span>
              <span className="text-[11px] text-indigo-600 font-semibold tracking-wide uppercase mt-1 block">B.Tech CSE Project</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Menu Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                      isActive
                        ? 'bg-indigo-200/60 text-indigo-800 font-semibold'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Academic Status
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-medium">Active Tasks</span>
              <span className="font-mono tabular-nums text-slate-900 font-semibold">
                {tasks.filter((t) => t.completed).length}/{tasks.length}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${tasks.length > 0 ? (tasks.filter((t) => t.completed).length / tasks.length) * 100 : 0}%`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
              <span>Quizzes taken</span>
              <span className="font-mono tabular-nums font-medium text-slate-700">{quizHistory.length}</span>
            </div>
          </div>
        </div>

        {/* Project Owner Footer */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-700 to-purple-600 text-white font-semibold text-xs flex items-center justify-center shrink-0 shadow-xs">
              AS
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 truncate">{studentProfile.name}</p>
              <p className="text-xs text-slate-500 truncate">{studentProfile.course}</p>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200/60 pt-2">
            <span>Project Lead</span>
            <span className="font-medium text-indigo-600">Ashish Sharma</span>
          </div>
        </div>
      </aside>
    </>
  );
};
