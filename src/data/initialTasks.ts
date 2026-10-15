import { StudyTask } from '../types';

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Review C pointers & pointer arithmetic for Mid-Term exam',
    subjectId: 'c-programming',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    priority: 'high',
    completed: false,
    notes: 'Focus on scaling factor rules and void pointers dereferencing.',
    createdAt: Date.now() - 100000000
  },
  {
    id: 'task-2',
    title: 'Solve 5 Cayley-Hamilton and Eigenvalue numerical problems',
    subjectId: 'engg-maths',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // In 2 days
    priority: 'high',
    completed: true,
    notes: 'Solved all 3x3 characteristic matrix questions from Unit 1.',
    createdAt: Date.now() - 150000000,
    completedAt: Date.now() - 20000000
  },
  {
    id: 'task-3',
    title: 'Practice Newton Rings wavelength formula calculations',
    subjectId: 'engg-physics',
    dueDate: new Date(Date.now() + 259200000).toISOString().split('T')[0], // In 3 days
    priority: 'medium',
    completed: false,
    notes: 'Derive diameter of dark and bright rings.',
    createdAt: Date.now() - 80000000
  },
  {
    id: 'task-4',
    title: 'Prepare seminar slides on E-Waste hazards & Green Computing',
    subjectId: 'env-studies',
    dueDate: new Date(Date.now() + 345600000).toISOString().split('T')[0], // In 4 days
    priority: 'medium',
    completed: false,
    notes: 'Include RoHS directives, heavy metal contamination, and datacenter PUE.',
    createdAt: Date.now() - 60000000
  },
  {
    id: 'task-5',
    title: 'Implement dynamic 2D matrix allocation using malloc() in C lab',
    subjectId: 'c-programming',
    dueDate: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday (overdue/sample)
    priority: 'low',
    completed: true,
    notes: 'Completed in CSE Lab 2. Verified zero memory leaks using valgrind.',
    createdAt: Date.now() - 200000000,
    completedAt: Date.now() - 40000000
  }
];
