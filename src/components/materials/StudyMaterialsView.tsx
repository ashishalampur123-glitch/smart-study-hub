import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, getSubjectById } from '../../data/subjects';
import { STUDY_NOTES } from '../../data/notes';
import { SubjectId, StudyNote } from '../../types';
import {
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  Code2,
  Binary,
  Atom,
  Leaf,
  Award,
  Filter,
  FileText
} from 'lucide-react';

export const StudyMaterialsView: React.FC = () => {
  const {
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    searchQuery,
    setSearchQuery,
    setActiveNoteModal,
    startQuizForSubject
  } = useApp();

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

  // Filter notes based on subject filter and search query
  const filteredNotes = STUDY_NOTES.filter((note) => {
    // Subject filter
    if (selectedSubjectFilter !== 'all' && note.subjectId !== selectedSubjectFilter) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const subject = getSubjectById(note.subjectId);
      const inTitle = note.title.toLowerCase().includes(q);
      const inChapter = note.chapter.toLowerCase().includes(q);
      const inSummary = note.summary.toLowerCase().includes(q);
      const inSubject = subject?.name.toLowerCase().includes(q) || false;
      const inConcepts = note.keyConcepts.some((c) => c.toLowerCase().includes(q));
      const inFormulas = note.formulasOrKeywords?.some(
        (f) => f.label.toLowerCase().includes(q) || f.value.toLowerCase().includes(q)
      );

      return inTitle || inChapter || inSummary || inSubject || inConcepts || inFormulas;
    }

    return true;
  });

  const activeSubjectInfo =
    selectedSubjectFilter !== 'all' ? getSubjectById(selectedSubjectFilter) : null;

  return (
    <div className="space-y-6">
      {/* Top Banner / Subject Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Course Notes & Syllabus
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Peer-reviewed high-yield notes with step-by-step algorithms, derivations & exam takeaways
          </p>
        </div>

        {activeSubjectInfo && (
          <button
            onClick={() => startQuizForSubject(activeSubjectInfo.id)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors shrink-0"
          >
            <Award className="w-4 h-4" />
            <span>Practice {activeSubjectInfo.name} Quiz</span>
          </button>
        )}
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Subject Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedSubjectFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSubjectFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Courses ({STUDY_NOTES.length})
          </button>

          {SUBJECTS.map((sub) => {
            const count = STUDY_NOTES.filter((n) => n.subjectId === sub.id).length;
            const isSelected = selectedSubjectFilter === sub.id;

            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubjectFilter(sub.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search input in materials */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter topics & concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Showing counter */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Showing <strong className="font-mono text-slate-900">{filteredNotes.length}</strong> study modules
          {selectedSubjectFilter !== 'all' && ` for ${activeSubjectInfo?.name}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Study Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredNotes.map((note) => {
          const subject = getSubjectById(note.subjectId);
          const Icon = getSubjectIcon(subject?.iconName || '');

          return (
            <div
              key={note.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-sm transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5 font-medium">
                    <span className={`font-semibold ${subject?.color.primary || 'text-slate-700'}`}>
                      {subject?.name}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{note.readTime}</span>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {note.difficulty}
                  </span>
                </div>

                <div className="text-xs text-slate-500 mb-1">{note.chapter}</div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {note.summary}
                </p>

                {/* Key Concepts Preview */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-1.5 mb-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Highlights
                  </div>
                  {note.keyConcepts.slice(0, 2).map((concept, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <span className="text-indigo-600 font-bold shrink-0">•</span>
                      <span className="line-clamp-1">{concept}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveNoteModal(note)}
                  className="flex-1 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Read Full Notes</span>
                </button>
                <button
                  onClick={() => startQuizForSubject(note.subjectId)}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition-colors"
                  title="Practice subject MCQs"
                >
                  <Award className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs max-w-md mx-auto">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No study notes found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            No modules match your current filter &quot;{searchQuery}&quot;. Try clearing your search keyword.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubjectFilter('all');
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
