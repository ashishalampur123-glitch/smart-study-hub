import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QUIZ_QUESTIONS } from '../../data/quizzes';
import { SUBJECTS, getSubjectById } from '../../data/subjects';
import { SubjectId, QuizQuestion, QuizAttempt } from '../../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart2,
  BookOpenCheck
} from 'lucide-react';

export const QuizZoneView: React.FC = () => {
  const {
    selectedSubjectFilter,
    setSelectedSubjectFilter,
    saveQuizAttempt,
    setCurrentSection
  } = useApp();

  // Screen states: 'setup' | 'active' | 'result'
  const [screen, setScreen] = useState<'setup' | 'active' | 'result'>('setup');
  const [quizSubject, setQuizSubject] = useState<SubjectId | 'all'>(selectedSubjectFilter);
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');

  // Active quiz state
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showPracticeAnswer, setShowPracticeAnswer] = useState<Record<number, boolean>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Result state
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  // Keep quizSubject in sync if selectedSubjectFilter changes externally
  useEffect(() => {
    if (screen === 'setup') {
      setQuizSubject(selectedSubjectFilter);
    }
  }, [selectedSubjectFilter, screen]);

  // Elapsed timer for active quiz
  useEffect(() => {
    let timer: any;
    if (screen === 'active') {
      timer = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [screen]);

  // Start the quiz
  const handleStartQuiz = () => {
    let questionsPool = QUIZ_QUESTIONS;
    if (quizSubject !== 'all') {
      questionsPool = QUIZ_QUESTIONS.filter((q) => q.subjectId === quizSubject);
    }

    if (questionsPool.length === 0) {
      questionsPool = QUIZ_QUESTIONS;
    }

    // Shuffle slightly for freshness
    const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());

    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowPracticeAnswer({});
    setStartTime(Date.now());
    setElapsedTime(0);
    setScreen('active');
  };

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
    if (quizMode === 'practice') {
      setShowPracticeAnswer((prev) => ({ ...prev, [questionIdx]: true }));
    }
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    const details = activeQuestions.map((q, idx) => {
      const userChoice = userAnswers[idx] !== undefined ? userAnswers[idx] : -1;
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) score += 1;

      return {
        questionId: q.id,
        questionText: q.question,
        userAnswer: userChoice,
        correctAnswer: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);

    const subjectMeta = quizSubject !== 'all' ? getSubjectById(quizSubject) : null;
    const subjectName = subjectMeta ? subjectMeta.name : 'All Subjects Mixed';

    const attemptData = {
      subjectId: quizSubject,
      subjectName,
      totalQuestions: total,
      score,
      percentage,
      timeSpentSeconds: elapsedTime,
      details
    };

    saveQuizAttempt(attemptData);
    setLastAttempt({
      ...attemptData,
      id: `attempt-${Date.now()}`,
      timestamp: Date.now()
    });
    setScreen('result');
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- SCREEN 1: SETUP ---
  if (screen === 'setup') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <span>B.Tech Evaluation Engine</span>
              <span aria-hidden="true">·</span>
              <span>Computer Science & Engineering</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Interactive MCQ Practice & Assessment
            </h2>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Test your conceptual clarity across C Programming, Engineering Mathematics, Engineering Physics, and Environmental Studies.
            </p>
          </div>

          {/* Subject Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Subject Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setQuizSubject('all')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quizSubject === 'all'
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">All Subjects Mixed</div>
                <div className="text-xs text-slate-500 mt-1">
                  Comprehensive semester mock test covering all 4 engineering disciplines.
                </div>
                <div className="mt-2 text-[11px] font-mono font-semibold text-indigo-600">
                  {QUIZ_QUESTIONS.length} Questions Pool
                </div>
              </button>

              {SUBJECTS.map((sub) => {
                const isSelected = quizSubject === sub.id;
                const count = QUIZ_QUESTIONS.filter((q) => q.subjectId === sub.id).length;

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setQuizSubject(sub.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-900">{sub.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {sub.description}
                    </div>
                    <div className="mt-2 text-[11px] font-mono font-semibold text-indigo-600">
                      {count} Focused MCQs
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Select Assessment Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setQuizMode('practice')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quizMode === 'practice'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Practice Mode (Instant Feedback)</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Shows whether your chosen option is correct immediately with full step-by-step explanatory notes.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setQuizMode('exam')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  quizMode === 'exam'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="font-bold text-sm text-slate-900">Exam Simulation Mode</div>
                <p className="text-xs text-slate-500 mt-1">
                  Realistic exam environment with running timer. Answers and explanations are presented only after final submission.
                </p>
              </button>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Results and scores will be stored in your browser LocalStorage.
            </div>
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 2: ACTIVE QUIZ ---
  if (screen === 'active') {
    const currentQuestion = activeQuestions[currentIndex];
    const userChoice = userAnswers[currentIndex];
    const isAnswered = userChoice !== undefined;
    const showExplanation = quizMode === 'practice' && showPracticeAnswer[currentIndex];
    const subject = getSubjectById(currentQuestion.subjectId);

    const answeredCount = Object.keys(userAnswers).length;
    const isLastQuestion = currentIndex === activeQuestions.length - 1;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Quiz Progress & Timer Header */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-semibold text-indigo-700">{subject?.name}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{quizMode} Mode</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
              Question <span className="font-mono text-indigo-600">{currentIndex + 1}</span> of{' '}
              <span className="font-mono">{activeQuestions.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatSeconds(elapsedTime)}</span>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to exit the quiz? Current progress will not be saved.')) {
                  setScreen('setup');
                }
              }}
              className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>

        {/* Current Question Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Topic: {currentQuestion.topic}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, optIdx) => {
              const isSelected = userChoice === optIdx;
              const isCorrectOption = optIdx === currentQuestion.correctIndex;

              let optionStyle =
                'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';

              if (quizMode === 'practice' && showExplanation) {
                if (isCorrectOption) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-1 ring-rose-500';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-semibold ring-1 ring-indigo-600';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(currentIndex, optIdx)}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${optionStyle}`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm leading-relaxed flex-1">{option}</span>

                  {quizMode === 'practice' && showExplanation && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  {quizMode === 'practice' && showExplanation && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Practice Mode Explanation Box */}
          {showExplanation && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm animate-in fade-in duration-200 ${
                userChoice === currentQuestion.correctIndex
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {userChoice === currentQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct Answer!</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>Explanation & Solution:</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-xs text-slate-400 font-mono">
              {answeredCount}/{activeQuestions.length} Answered
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={!isAnswered && answeredCount === 0}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Submit Assessment</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- SCREEN 3: RESULT SUMMARY ---
  if (screen === 'result' && lastAttempt) {
    const isPassing = lastAttempt.percentage >= 60;
    const isDistinction = lastAttempt.percentage >= 80;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Result Banner Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-center space-y-4">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white ${
              isDistinction
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/20'
                : isPassing
                ? 'bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-indigo-500/20'
                : 'bg-gradient-to-tr from-rose-600 to-amber-600 shadow-rose-500/20'
            } shadow-md`}
          >
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assessment Report · {lastAttempt.subjectName}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {isDistinction
                ? 'Outstanding Achievement!'
                : isPassing
                ? 'Proficient & Passed'
                : 'Needs Targeted Revision'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Test completed in {formatSeconds(lastAttempt.timeSpentSeconds)}. Record saved to your Progress Tracker.
            </p>
          </div>

          {/* Big Score Box */}
          <div className="inline-flex items-center gap-6 p-4 px-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 block">Total Score</span>
              <span className="text-3xl font-extrabold font-mono text-slate-900">
                {lastAttempt.score}/{lastAttempt.totalQuestions}
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <span className="text-xs text-slate-500 block">Accuracy</span>
              <span
                className={`text-3xl font-extrabold font-mono ${
                  isDistinction
                    ? 'text-emerald-600'
                    : isPassing
                    ? 'text-indigo-600'
                    : 'text-rose-600'
                }`}
              >
                {lastAttempt.percentage}%
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                setScreen('setup');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake / Try Another Subject</span>
            </button>
            <button
              onClick={() => setCurrentSection('progress')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <span>View Overall Progress Tracker</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Detailed Question-by-Question Solution Review
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              {lastAttempt.score} of {lastAttempt.totalQuestions} Correct
            </span>
          </div>

          <div className="space-y-6">
            {lastAttempt.details.map((item, idx) => {
              const question = activeQuestions.find((q) => q.id === item.questionId);
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    item.isCorrect
                      ? 'border-emerald-200 bg-emerald-50/30'
                      : 'border-rose-200 bg-rose-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Question {idx + 1}
                    </span>
                    {item.isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>Incorrect</span>
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-bold text-slate-900 mb-3">{item.questionText}</p>

                  <div className="space-y-1.5 text-xs">
                    {question?.options.map((opt, oIdx) => {
                      const isUser = item.userAnswer === oIdx;
                      const isCorrect = item.correctAnswer === oIdx;

                      let cls = 'p-2.5 rounded-lg border text-slate-700 ';
                      if (isCorrect) {
                        cls += 'bg-emerald-100/80 border-emerald-300 font-semibold text-emerald-950';
                      } else if (isUser && !isCorrect) {
                        cls += 'bg-rose-100/80 border-rose-300 text-rose-950';
                      } else {
                        cls += 'bg-white border-slate-200/80 text-slate-500';
                      }

                      return (
                        <div key={oIdx} className={cls}>
                          <span className="font-mono font-bold mr-2">
                            {String.fromCharCode(65 + oIdx)}.
                          </span>
                          {opt}
                          {isCorrect && (
                            <span className="ml-2 text-[10px] font-bold text-emerald-800 uppercase">
                              (Correct Answer)
                            </span>
                          )}
                          {isUser && !isCorrect && (
                            <span className="ml-2 text-[10px] font-bold text-rose-800 uppercase">
                              (Your Choice)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Solution explanation */}
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200/90 text-xs text-slate-700">
                    <span className="font-bold text-indigo-700 block mb-0.5">
                      Conceptual Solution:
                    </span>
                    {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
