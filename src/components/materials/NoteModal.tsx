import React, { useState } from 'react';
import { StudyNote } from '../../types';
import { getSubjectById } from '../../data/subjects';
import {
  X,
  BookOpen,
  Clock,
  Check,
  Copy,
  ChevronRight,
  HelpCircle,
  Sparkles,
  FileText,
  Printer
} from 'lucide-react';

interface NoteModalProps {
  note: StudyNote | null;
  onClose: () => void;
  onTakeQuiz: (subjectId: any) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ note, onClose, onTakeQuiz }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');

  if (!note) return null;

  const subject = getSubjectById(note.subjectId);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleAnswer = (idx: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-indigo-700">{subject?.name || 'Subject'}</span>
              <span aria-hidden="true">·</span>
              <span>{note.chapter}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono text-slate-600">
                <Clock className="w-3 h-3 text-slate-400" />
                {note.readTime}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate mt-0.5">
              {note.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Font size toggle */}
            <div className="hidden sm:flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 rounded-md transition-colors ${fontSize === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded-md transition-colors ${fontSize === 'large' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Large
              </button>
            </div>

            <button
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1.5 p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              title="Print study note"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              aria-label="Close note"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
          {/* Executive Summary */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 text-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              Chapter Abstract
            </h3>
            <p className="leading-relaxed text-slate-700 font-medium">
              {note.summary}
            </p>
          </div>

          {/* Key Concepts List */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-3">
              Core Exam Takeaways
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {note.keyConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700"
                >
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-snug">{concept}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Formulas or Keywords if available */}
          {note.formulasOrKeywords && note.formulasOrKeywords.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-3">
                Key Formulas & Terminology
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {note.formulasOrKeywords.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-900 text-white rounded-xl shadow-xs">
                    <span className="text-xs font-semibold text-indigo-300 block">{item.label}</span>
                    <span className="font-mono text-sm sm:text-base font-bold text-emerald-300 block my-1">
                      {item.value}
                    </span>
                    {item.explanation && (
                      <span className="text-xs text-slate-300 block">{item.explanation}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Snippet if applicable */}
          {note.codeSnippet && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                  {note.codeSnippet.title}
                </h4>
                <button
                  onClick={() => handleCopyCode(note.codeSnippet!.code)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-md">
                <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>example.{note.codeSnippet.language}</span>
                  <span className="uppercase text-[10px] tracking-wider text-indigo-400 font-semibold">{note.codeSnippet.language}</span>
                </div>
                <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-indigo-100">
                  <code>{note.codeSnippet.code}</code>
                </pre>
                <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-xs text-slate-300">
                  <span className="font-semibold text-indigo-300">Explanation: </span>
                  {note.codeSnippet.explanation}
                </div>
              </div>
            </div>
          )}

          {/* Detailed Content Sections */}
          <div className="space-y-5 pt-2">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
              Detailed Study Notes
            </h4>
            {note.contentSections.map((sec, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-100 pb-4 last:border-b-0">
                <h5 className="font-bold text-slate-900 text-base">{sec.heading}</h5>
                {sec.body.map((para, pIdx) => (
                  <p key={pIdx} className="text-slate-700 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Self-Check Practice Questions */}
          {note.practiceQuestions && note.practiceQuestions.length > 0 && (
            <div className="pt-2">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400 mb-3">
                Self-Check Viva / Conceptual Questions
              </h4>
              <div className="space-y-3">
                {note.practiceQuestions.map((pq, idx) => {
                  const isRevealed = revealedAnswers[idx];
                  return (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 flex-1">
                          <span className="text-indigo-600 font-mono mr-2">Q{idx + 1}.</span>
                          {pq.question}
                        </p>
                        <button
                          onClick={() => toggleAnswer(idx)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md transition-colors shrink-0"
                        >
                          {isRevealed ? 'Hide Answer' : 'Show Answer'}
                        </button>
                      </div>
                      {isRevealed && (
                        <div className="mt-3 pt-3 border-t border-slate-200/80 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border">
                          <span className="font-semibold text-emerald-700 block mb-1">Model Answer:</span>
                          {pq.shortAnswer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 shrink-0">
          <span className="text-xs text-slate-500 hidden sm:inline">
            Smart Study Hub · B.Tech CSE Study Repository
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                onClose();
                onTakeQuiz(note.subjectId);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>Practice {subject?.name || 'Subject'} MCQs</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
