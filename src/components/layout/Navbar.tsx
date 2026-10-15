import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Search, Plus, Award, Calendar, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  onOpenAddTaskModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu, onOpenAddTaskModal }) => {
  const { currentSection, setCurrentSection, searchQuery, setSearchQuery, studentProfile, startQuizForSubject } = useApp();

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Academic Dashboard', subtitle: 'Overview of courses, tasks & recent quiz metrics' },
    materials: { title: 'Study Materials Repository', subtitle: 'High-yield engineering notes, formulas & code samples' },
    quiz: { title: 'MCQ Practice Zone', subtitle: 'Self-assessment quizzes with step-by-step solutions' },
    planner: { title: 'Daily Study Planner', subtitle: 'Organize college deadlines, lab prep & exam milestones' },
    progress: { title: 'Learning Progress Tracker', subtitle: 'Visual performance metrics & study analytics' },
    about: { title: 'About Smart Study Hub', subtitle: 'B.Tech CSE college project specification & design' }
  };

  const currentMeta = sectionTitles[currentSection] || { title: 'Dashboard', subtitle: '' };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim() && currentSection !== 'materials') {
      setCurrentSection('materials');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Smart Study Hub</span>
            <span aria-hidden="true" className="text-slate-300">/</span>
            <span className="text-indigo-600 font-semibold capitalize">{currentSection}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Middle: Quick Search Input */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search notes, formulas, topics (e.g. pointers, eigenvalues)..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs sm:text-sm pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 hover:bg-slate-300 rounded px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => startQuizForSubject('all')}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 transition-colors whitespace-nowrap"
        >
          <Award className="w-3.5 h-3.5 text-indigo-600" />
          <span>Quick Quiz</span>
        </button>

        <button
          onClick={onOpenAddTaskModal}
          className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs shadow-indigo-600/20 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>

        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        <div className="hidden sm:flex items-center gap-2 text-right">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
            AS
          </div>
        </div>
      </div>
    </header>
  );
};
