import { Subject } from '../types';

export const SUBJECTS: Subject[] = [
  {
    id: 'c-programming',
    name: 'C Programming',
    code: 'CSE-101',
    description: 'Foundations of procedural programming, memory pointers, bitwise logic, structures, and low-level system interactions.',
    iconName: 'Code2',
    color: {
      primary: 'text-blue-600',
      light: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      gradient: 'from-blue-600 to-indigo-600'
    },
    semester: '1st & 2nd Sem',
    credits: 4
  },
  {
    id: 'engg-maths',
    name: 'Engineering Mathematics',
    code: 'MTH-102',
    description: 'Matrices, Eigenvalues, multivariable calculus, Laplace transforms, and probability distributions for computing.',
    iconName: 'Binary',
    color: {
      primary: 'text-indigo-600',
      light: 'bg-indigo-50',
      border: 'border-indigo-200',
      badge: 'bg-indigo-100 text-indigo-700',
      gradient: 'from-indigo-600 to-violet-600'
    },
    semester: '1st & 2nd Sem',
    credits: 4
  },
  {
    id: 'engg-physics',
    name: 'Engineering Physics',
    code: 'PHY-103',
    description: 'Wave optics, laser physics, quantum mechanics, energy band theory of semiconductors, and superconductivity.',
    iconName: 'Atom',
    color: {
      primary: 'text-violet-600',
      light: 'bg-violet-50',
      border: 'border-violet-200',
      badge: 'bg-violet-100 text-violet-700',
      gradient: 'from-violet-600 to-purple-600'
    },
    semester: '1st Sem',
    credits: 3
  },
  {
    id: 'env-studies',
    name: 'Environmental Studies',
    code: 'EVS-104',
    description: 'Ecosystem ecology, sustainable development, pollution control, e-waste hazards, and environmental legislation.',
    iconName: 'Leaf',
    color: {
      primary: 'text-teal-600',
      light: 'bg-teal-50',
      border: 'border-teal-200',
      badge: 'bg-teal-100 text-teal-700',
      gradient: 'from-teal-600 to-emerald-600'
    },
    semester: '2nd Sem',
    credits: 2
  }
];

export const getSubjectById = (id: string): Subject | undefined => {
  return SUBJECTS.find(s => s.id === id);
};
