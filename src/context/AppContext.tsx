import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavSection, SubjectId, StudyTask, QuizAttempt, StudentProfile, StudyNote } from '../types';
import { INITIAL_TASKS } from '../data/initialTasks';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentSection: NavSection;
  setCurrentSection: (section: NavSection) => void;
  selectedSubjectFilter: SubjectId | 'all';
  setSelectedSubjectFilter: (filter: SubjectId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tasks: StudyTask[];
  addTask: (task: Omit<StudyTask, 'id' | 'createdAt'>) => void;
  updateTask: (task: StudyTask) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  quizHistory: QuizAttempt[];
  saveQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'timestamp'>) => void;
  clearQuizHistory: () => void;
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  activeNoteModal: StudyNote | null;
  setActiveNoteModal: (note: StudyNote | null) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  startQuizForSubject: (subjectId?: SubjectId | 'all') => void;
  openMaterialForSubject: (subjectId?: SubjectId | 'all') => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TASKS_KEY = 'smart_study_tasks_v1';
const QUIZ_HISTORY_KEY = 'smart_study_quiz_history_v1';
const PROFILE_KEY = 'smart_study_profile_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSection, setCurrentSection] = useState<NavSection>('dashboard');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeNoteModal, setActiveNoteModal] = useState<StudyNote | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Tasks state with LocalStorage
  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    try {
      const saved = localStorage.getItem(TASKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  // Quiz history state with LocalStorage
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem(QUIZ_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Initial sample attempt for demonstration
    return [
      {
        id: 'initial-attempt-1',
        subjectId: 'c-programming',
        subjectName: 'C Programming',
        timestamp: Date.now() - 86400000 * 2,
        totalQuestions: 5,
        score: 4,
        percentage: 80,
        timeSpentSeconds: 145,
        details: []
      }
    ];
  });

  // Student Profile
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const defaultProfile: StudentProfile = {
      name: 'Ashish Sharma',
      course: 'B.Tech Computer Science & Engineering',
      semester: '2nd Semester',
      college: 'Institute of Engineering & Technology',
      studentId: 'CSE-2024-042',
      dailyGoalHours: 4
    };
    try {
      const saved = localStorage.getItem(PROFILE_KEY);
      if (saved) return { ...defaultProfile, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return defaultProfile;
  });

  // Persist tasks
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  // Persist quiz history
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(quizHistory));
    } catch {
      // ignore
    }
  }, [quizHistory]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(studentProfile));
    } catch {
      // ignore
    }
  }, [studentProfile]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = (taskData: Omit<StudyTask, 'id' | 'createdAt'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast('Study task added to your planner', 'success');
  };

  const updateTask = (updatedTask: StudyTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Task updated successfully', 'success');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed from planner', 'info');
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          return {
            ...t,
            completed: nextState,
            completedAt: nextState ? Date.now() : undefined
          };
        }
        return t;
      })
    );
  };

  const saveQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'timestamp'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now()
    };
    setQuizHistory((prev) => [newAttempt, ...prev]);
    showToast(`Quiz completed! You scored ${attemptData.score}/${attemptData.totalQuestions} (${attemptData.percentage}%)`, 'success');
  };

  const clearQuizHistory = () => {
    setQuizHistory([]);
    try {
      localStorage.removeItem(QUIZ_HISTORY_KEY);
    } catch {
      // ignore
    }
    showToast('Quiz history reset', 'info');
  };

  const updateStudentProfile = (newProps: Partial<StudentProfile>) => {
    setStudentProfile((prev) => ({ ...prev, ...newProps }));
    showToast('Student profile updated', 'success');
  };

  const startQuizForSubject = (subjectId: SubjectId | 'all' = 'all') => {
    setSelectedSubjectFilter(subjectId);
    setCurrentSection('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMaterialForSubject = (subjectId: SubjectId | 'all' = 'all') => {
    setSelectedSubjectFilter(subjectId);
    setCurrentSection('materials');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setQuizHistory([]);
    try {
      localStorage.removeItem(TASKS_KEY);
      localStorage.removeItem(QUIZ_HISTORY_KEY);
    } catch {
      // ignore
    }
    showToast('App data reset to default demo state', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentSection,
        setCurrentSection,
        selectedSubjectFilter,
        setSelectedSubjectFilter,
        searchQuery,
        setSearchQuery,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        quizHistory,
        saveQuizAttempt,
        clearQuizHistory,
        studentProfile,
        updateStudentProfile,
        activeNoteModal,
        setActiveNoteModal,
        toasts,
        showToast,
        removeToast,
        startQuizForSubject,
        openMaterialForSubject,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
