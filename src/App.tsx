/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudyMaterialsView } from './components/materials/StudyMaterialsView';
import { QuizZoneView } from './components/quiz/QuizZoneView';
import { StudyPlannerView } from './components/planner/StudyPlannerView';
import { ProgressTrackerView } from './components/progress/ProgressTrackerView';
import { AboutProjectView } from './components/about/AboutProjectView';
import { NoteModal } from './components/materials/NoteModal';
import { TaskModal } from './components/planner/TaskModal';
import { ToastContainer } from './components/common/Toast';
import { StudyTask } from './types';

const MainLayout: React.FC = () => {
  const {
    currentSection,
    activeNoteModal,
    setActiveNoteModal,
    startQuizForSubject,
    addTask,
    updateTask
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<StudyTask | null>(null);

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: StudyTask) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (taskToEdit) {
      updateTask(taskData);
    } else {
      addTask(taskData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Sidebar navigation */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main content wrapper (offset by sidebar on desktop) */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenAddTaskModal={handleOpenAddTask}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentSection === 'dashboard' && (
            <DashboardView onOpenAddTaskModal={handleOpenAddTask} />
          )}
          {currentSection === 'materials' && <StudyMaterialsView />}
          {currentSection === 'quiz' && <QuizZoneView />}
          {currentSection === 'planner' && (
            <StudyPlannerView
              onOpenAddTaskModal={handleOpenAddTask}
              onEditTask={handleEditTask}
            />
          )}
          {currentSection === 'progress' && <ProgressTrackerView />}
          {currentSection === 'about' && <AboutProjectView />}
        </main>

        {/* Quiet footer */}
        <footer className="border-t border-slate-200/80 bg-white py-4 px-6 text-center text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
            <span>
              <strong>Smart Study Hub</strong> · B.Tech CSE College Major Project
            </span>
            <div className="flex items-center gap-2">
              <span>Project Lead: Ashish Sharma</span>
              <span aria-hidden="true">·</span>
              <span>Offline-First (LocalStorage)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Note Reader Modal */}
      <NoteModal
        note={activeNoteModal}
        onClose={() => setActiveNoteModal(null)}
        onTakeQuiz={(subjectId) => startQuizForSubject(subjectId)}
      />

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={taskToEdit}
      />

      {/* Notification Toast Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
