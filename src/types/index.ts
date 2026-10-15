export type SubjectId = 'c-programming' | 'engg-maths' | 'engg-physics' | 'env-studies';

export type NavSection = 'dashboard' | 'materials' | 'quiz' | 'planner' | 'progress' | 'about';

export interface Subject {
  id: SubjectId;
  name: string;
  code: string;
  description: string;
  iconName: string;
  color: {
    primary: string;
    light: string;
    border: string;
    badge: string;
    gradient: string;
  };
  semester: string;
  credits: number;
}

export interface StudyNote {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapter: string;
  readTime: string;
  difficulty: 'Core' | 'Intermediate' | 'Advanced';
  summary: string;
  keyConcepts: string[];
  formulasOrKeywords?: { label: string; value: string; explanation?: string }[];
  codeSnippet?: {
    title: string;
    language: string;
    code: string;
    explanation: string;
  };
  contentSections: {
    heading: string;
    body: string[];
  }[];
  practiceQuestions?: {
    question: string;
    shortAnswer: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  subjectId: SubjectId;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  subjectId: SubjectId | 'all';
  subjectName: string;
  timestamp: number;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  details: {
    questionId: string;
    questionText: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface StudyTask {
  id: string;
  title: string;
  subjectId: SubjectId | 'general';
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  completed: boolean;
  notes?: string;
  createdAt: number;
  completedAt?: number;
}

export interface StudentProfile {
  name: string;
  course: string;
  semester: string;
  college: string;
  studentId: string;
  dailyGoalHours: number;
}
