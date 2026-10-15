import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  User,
  BookOpen,
  CheckCircle2,
  Code2,
  Layers,
  HardDrive,
  Cpu,
  Target,
  Sparkles,
  Award,
  CalendarCheck,
  ShieldCheck,
  Edit2
} from 'lucide-react';

export const AboutProjectView: React.FC = () => {
  const { studentProfile, updateStudentProfile } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState(studentProfile);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentProfile(profileForm);
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Project Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-100">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>B.Tech CSE College Major Project</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Smart Study Hub
            </h2>
            <p className="text-indigo-100 text-sm max-w-xl leading-relaxed">
              A comprehensive academic learning workstation designed to help college students organize course materials, practice chapter-wise MCQs, schedule study milestones, and monitor academic progress.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-center sm:text-right shrink-0">
            <span className="text-[11px] font-semibold text-indigo-200 uppercase tracking-wider block">
              Project Developer & Lead
            </span>
            <span className="text-lg font-bold text-white block mt-0.5">
              {studentProfile.name}
            </span>
            <span className="text-xs text-indigo-200 block">
              {studentProfile.course}
            </span>
          </div>
        </div>
      </div>

      {/* Project Purpose & Key Student Benefits */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">
            Problem Statement & Academic Purpose
          </h3>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Engineering students frequently face cognitive overload during mid-term and end-semester examinations. Course materials are scattered across unsorted PDF links, daily study tasks lack deadline accountability, and students struggle to self-test their theoretical comprehension before campus vivas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Unified Study Repository</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Curated notes for 4 critical B.Tech disciplines (C Programming, Engineering Mathematics, Engineering Physics, and Environmental Studies) with code samples and formula cheat-sheets.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Active Recall & MCQ Testing</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive testing engine with instantaneous feedback and deep explanatory solutions to solidify theoretical retention and prepare for viva examinations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Actionable Daily Planner</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Priority-based study task planner with deadline tracking and completion status saved continuously in the student&apos;s browser.
            </p>
          </div>
        </div>
      </div>

      {/* Developer & Student Profile Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Student Profile Credentials</h3>
            <p className="text-xs text-slate-500">Academic affiliation and project ownership</p>
          </div>
          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleProfileSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Branch</label>
              <input
                type="text"
                value={profileForm.course}
                onChange={(e) => setProfileForm({ ...profileForm, course: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Current Semester</label>
              <input
                type="text"
                value={profileForm.semester}
                onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student ID / Roll No</label>
              <input
                type="text"
                value={profileForm.studentId}
                onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Save Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Project Owner</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{studentProfile.name}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Branch</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{studentProfile.course}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Semester</span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">{studentProfile.semester}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-400 font-semibold uppercase block">Roll Number</span>
              <span className="text-sm font-mono font-bold text-slate-900 block mt-0.5">{studentProfile.studentId}</span>
            </div>
          </div>
        )}
      </div>

      {/* Technical Architecture & Stack */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Technical Architecture & Stack</h3>
          <p className="text-xs text-slate-500">Modern software engineering stack used to build Smart Study Hub</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <Code2 className="w-5 h-5 text-indigo-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">React 19 & TypeScript</h4>
            <p className="text-xs text-slate-500 mt-1">
              Strong typing, component modularity, and declarative state hooks for reliable UI performance.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <Layers className="w-5 h-5 text-blue-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Tailwind CSS v4</h4>
            <p className="text-xs text-slate-500 mt-1">
              Modern responsive utility styling with high-contrast slate surfaces and indigo accents.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <HardDrive className="w-5 h-5 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Local-First Storage</h4>
            <p className="text-xs text-slate-500 mt-1">
              100% offline-compatible data persistence using browser LocalStorage for tasks and quiz records.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <ShieldCheck className="w-5 h-5 text-purple-600 mb-2" />
            <h4 className="font-bold text-sm text-slate-900">Zero-Mock Integrity</h4>
            <p className="text-xs text-slate-500 mt-1">
              No simulated cloud databases or artificial AI promises—honest, blazing-fast client architecture.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <strong className="text-slate-800">Academic Project Verification:</strong> Designed and developed by Ashish Sharma for the Bachelor of Technology in Computer Science and Engineering degree requirements.
        </div>
      </div>
    </div>
  );
};
