import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, Trophy, Star, Shield, Layout, BookOpen, Calculator, RotateCcw, LogOut, User as UserIcon, Lock, PlayCircle, X, Settings, Download, Upload, Trash2, Music, Mail, CheckCircle, ArrowRight, Compass, Activity, Search, Volume2 } from 'lucide-react';

import { Grade, Subject, Question, UserStats, SUBJECTS, ENGINES, VIDEOS, Video, Exercise } from './types';
import { speak } from './services/speechService';
import { generateQuestion } from './services/questionService';
import { apiService, User } from './services/apiService';
import SodorMap from './components/SodorMap';
import FractionMultiplication from './components/FractionMultiplication';
import FractionAddition from './components/FractionAddition';
import SimpleFractionAddition from './components/SimpleFractionAddition';
import FractionIntegerAddition from './components/FractionIntegerAddition';
import FractionAdditionLesson from './components/FractionAdditionLesson';
import LCMLesson from './components/LCMLesson';
import LCMExercise from './components/LCMExercise';
import StoryExercise from './components/StoryExercise';
import ForceLesson from './components/ForceLesson';
import Piano from './components/Piano';
import PianoSequence from './components/PianoSequence';
import { STORIES } from './services/storyData';
import { MUSIC_LIBRARY } from './services/musicData';
import { MusicScore } from './types';

// --- Components ---

const Navbar = ({ stats, userName, isAdmin, onLogout, onOpenSettings, onOpenAdmin, onOpenTopics }: { 
  stats: UserStats; 
  userName: string; 
  isAdmin?: boolean;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenTopics: () => void;
}) => (
  <nav className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenTopics}
        className="w-10 h-10 bg-sodor-blue rounded-lg flex items-center justify-center text-white shadow-lg relative overflow-hidden group"
      >
        <motion.div
          animate={{ y: [-5, -15], x: [0, 5], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "easeOut" }}
          className="absolute top-1 right-2 w-1.5 h-1.5 bg-white/40 rounded-full blur-[1px]"
        />
        <motion.div
          animate={{ y: [-2, -10], x: [0, -3], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="absolute top-2 right-3 w-1 h-1 bg-white/30 rounded-full blur-[1px]"
        />
        <Train size={24} className="relative z-10" />
      </motion.button>
      <span className="font-extrabold text-xl tracking-tight text-sodor-blue uppercase hidden md:inline">Sodor Academy</span>
    </div>
    
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
        <UserIcon size={16} className="text-slate-500" />
        <span className="font-bold text-slate-700 text-sm">{userName}</span>
      </div>
      <div className="flex items-center gap-2 bg-sodor-gold/10 px-3 py-1.5 rounded-full border border-sodor-gold/20">
        <Star size={18} className="text-sodor-gold fill-sodor-gold" />
        <span className="font-bold text-sodor-gold">{stats.score}</span>
      </div>
      <div className="flex items-center gap-2 bg-sodor-blue/10 px-3 py-1.5 rounded-full border border-sodor-blue/20">
        <Trophy size={18} className="text-sodor-blue" />
        <span className="font-bold text-sodor-blue">{stats.enginesCollected.length}</span>
      </div>
      
      <div className="h-8 w-[1px] bg-slate-200 mx-1" />
      
      {isAdmin && (
        <button 
          onClick={onOpenAdmin}
          className="p-2 text-sodor-blue hover:scale-110 transition-all"
          title="Admin Panel"
        >
          <Shield size={20} />
        </button>
      )}

      <button 
        onClick={onOpenSettings}
        className="p-2 text-slate-400 hover:text-sodor-blue transition-colors"
        title="Settings"
      >
        <Settings size={20} />
      </button>
      <button 
        onClick={onLogout}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </div>
  </nav>
);

const ValidationView = ({ name, email, onValidated, onCancel }: { 
  name: string;
  email: string; 
  onValidated: () => void;
  onCancel: () => void;
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.validateEmail(name, email, code);
      onValidated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 text-center"
      >
        <div className="w-20 h-20 bg-sodor-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
          <Mail size={48} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-900">Check Your Email</h2>
        <p className="text-slate-500 mb-8 font-medium">
          We've sent a 6-digit validation code to <span className="text-sodor-blue font-bold">{email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="6-Digit Code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full text-center tracking-[1em] text-2xl py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-black"
            required
          />
          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Validating...' : 'Validate Account'}
          </button>
        </form>

        <button
          onClick={onCancel}
          className="mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
        >
          Back to Login
        </button>
      </motion.div>
    </div>
  );
};

const RecoveryView = ({ onCancel }: { onCancel: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPin, setNewPin] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.requestRecovery(name, email);
      setStep('reset');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await apiService.resetPin(name, email, code, newPin);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-3xl font-black mb-2 text-slate-900">PIN Reset!</h2>
          <p className="text-slate-500 mb-8 font-medium">Your PIN has been successfully updated. You can now log in with your new PIN.</p>
          <button
            onClick={onCancel}
            className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95"
          >
            Back to Login
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 text-center"
      >
        <div className="w-20 h-20 bg-sodor-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
          <Shield size={48} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-900">Recover Account</h2>
        <p className="text-slate-500 mb-8 font-medium">
          {step === 'request' ? 'Enter your email to receive a recovery code.' : 'Enter the code and your new PIN.'}
        </p>

        <form onSubmit={step === 'request' ? handleRequest : handleReset} className="space-y-4">
          {step === 'request' && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step === 'reset'}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold disabled:opacity-50"
              required
            />
          </div>

          {step === 'reset' && (
            <>
              <input
                type="text"
                placeholder="6-Digit Code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full text-center tracking-[0.5em] text-xl py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-black"
                required
              />
              <div className="relative text-left">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="password"
                  placeholder="New PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
                  required
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (step === 'request' ? 'Send Code' : 'Reset PIN')}
          </button>
        </form>

        <button
          onClick={onCancel}
          className="mt-6 text-slate-400 font-bold hover:text-slate-600 transition-colors text-sm"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

const LoginView = ({ onLogin, onShowValidation, onShowRecovery, onGuestLogin }: { 
  onLogin: (user: User, pin: string, isNewUser: boolean) => void;
  onShowValidation: (name: string, email: string) => void;
  onShowRecovery: () => void;
  onGuestLogin: () => void;
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        const user = await apiService.register(name, pin, email);
        onShowValidation(name, email);
      } else {
        const user = await apiService.login(name, pin);
        onLogin(user, pin, false);
      }
    } catch (err: any) {
      if (err.type === 'VALIDATION_REQUIRED') {
        onShowValidation(err.userName || name, err.email);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        const user = await apiService.importData(data);
        onLogin(user, data.pin, false);
      } catch (err) {
        setError('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-100 text-center"
      >
        <div className="w-20 h-20 bg-sodor-blue rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg">
          <Train size={48} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-slate-900">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-slate-500 mb-8 font-medium">
          {isRegistering ? 'Join the academy to start your journey.' : 'Login to continue your learning journey.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Child's Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
              required
            />
          </div>
          {isRegistering && (
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="Parent's Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
                required={isRegistering}
              />
            </div>
          )}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Simple PIN or Password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
              required
            />
          </div>

          {!isRegistering && (
            <div className="text-right">
              <button 
                type="button"
                onClick={onShowRecovery}
                className="text-xs font-bold text-slate-400 hover:text-sodor-blue transition-colors"
              >
                Forgot PIN?
              </button>
            </div>
          )}

          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-4">
          <button
            onClick={onGuestLogin}
            className="w-full py-4 bg-white text-sodor-blue border-2 border-sodor-blue/20 rounded-2xl font-bold hover:bg-sodor-blue/5 transition-all active:scale-95"
          >
            Continue as Guest
          </button>

          <button
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-slate-400 font-bold hover:text-sodor-blue transition-colors text-sm"
          >
            {isRegistering ? 'Already have an account? Log In' : "New student? Create an account"}
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <div className="h-[1px] flex-1 bg-slate-100" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Or</span>
            <div className="h-[1px] flex-1 bg-slate-100" />
          </div>

          <label className="cursor-pointer flex items-center justify-center gap-2 text-slate-500 hover:text-sodor-blue transition-colors text-sm font-bold">
            <Upload size={16} />
            Restore from Backup
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </motion.div>
    </div>
  );
};

const TopicsModal = ({ onClose, onSelectTopic }: { 
  onClose: () => void;
  onSelectTopic: (subject: Subject, exercise: Exercise) => void;
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allTopics = SUBJECTS.flatMap(subject => 
    (subject.exercises || []).map(exercise => ({
      subject,
      exercise,
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      isLesson: exercise.type === 'lesson'
    }))
  );

  const filteredTopics = allTopics.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                         t.subject.name.toLowerCase().includes(search.toLowerCase()) ||
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || t.subject.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 md:p-10 max-w-2xl w-full max-h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-6 text-slate-900 flex items-center gap-3 shrink-0">
          <Search className="text-sodor-blue" />
          Academy Topics
        </h2>

        <div className="space-y-4 mb-6 shrink-0">
          {/* Category Selector */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${!selectedCategory 
                  ? 'bg-sodor-blue text-white shadow-lg shadow-sodor-blue/20' 
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
              `}
            >
              All Topics
            </button>
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedCategory(s.id)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2
                  ${selectedCategory === s.id 
                    ? `${s.color} text-white shadow-lg` 
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}
                `}
              >
                <s.icon size={14} />
                {s.name}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search for a lesson or adventure..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-sodor-blue focus:bg-white transition-all outline-none font-bold"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {filteredTopics.map(({ subject, exercise, isLesson }) => (
            <button
              key={exercise.id}
              onClick={() => onSelectTopic(subject, exercise)}
              className="w-full p-4 rounded-2xl border-2 border-slate-50 hover:border-sodor-blue/20 hover:bg-slate-50 transition-all text-left flex items-center justify-between group"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${subject.color} text-white`}>
                    {subject.name}
                  </span>
                  {isLesson && (
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                      (L) Lesson
                    </span>
                  )}
                </div>
                <h3 className="font-black text-slate-900 group-hover:text-sodor-blue transition-colors">{exercise.name}</h3>
                <p className="text-xs text-slate-500 font-medium line-clamp-1">{exercise.description}</p>
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-sodor-blue transition-all group-hover:translate-x-1" size={20} />
            </button>
          ))}
          
          {filteredTopics.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              <Search size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold">No topics found matching your search.</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
const SettingsModal = ({ user, pin, onClose, onUpdateUser, onLogout }: { 
  user: User; 
  pin: string;
  onClose: () => void;
  onUpdateUser: (updatedUser: User, newPin?: string) => void;
  onLogout: () => void;
}) => {
  const [newPin, setNewPin] = useState('');
  const [newName, setNewName] = useState(user.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChangePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin) return;
    setLoading(true);
    try {
      await apiService.changePin(user.id, newPin);
      onUpdateUser(user, newPin);
      setMessage({ text: 'PIN updated successfully!', type: 'success' });
      setNewPin('');
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangeName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newName === user.name) return;
    setLoading(true);
    try {
      await apiService.changeName(user.id, newName);
      const updatedUser = { ...user, name: newName };
      onUpdateUser(updatedUser);
      setMessage({ text: 'Name updated successfully!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataToExport = {
      ...user,
      pin: pin
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sodor_academy_${user.name.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setLoading(true);
    try {
      await apiService.deleteAccount(user.id);
      onLogout();
    } catch (err: any) {
      setMessage({ text: 'Failed to delete account.', type: 'error' });
      setConfirmDelete(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 md:p-10 max-w-lg w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3 shrink-0">
          <Settings className="text-sodor-blue" />
          Account Settings
        </h2>

        <div className="space-y-8 overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {user.id === 'guest' ? (
            <section className="bg-sodor-blue/5 p-8 rounded-3xl border-2 border-dashed border-sodor-blue/20 text-center">
              <UserIcon size={48} className="mx-auto text-sodor-blue mb-4 opacity-50" />
              <h3 className="font-bold text-slate-900 mb-2 text-xl">Guest Explorer</h3>
              <p className="text-sm text-slate-500 mb-6 font-medium">
                You are currently exploring as a guest. To save your progress, collect engines forever, and sync with other devices, please create a free account!
              </p>
              <button
                onClick={onLogout}
                className="px-8 py-3 bg-sodor-blue text-white rounded-xl font-bold shadow-lg shadow-sodor-blue/20 hover:bg-blue-700 transition-all"
              >
                Sign Up / Log In
              </button>
            </section>
          ) : (
            <>
              {/* Change Name Section */}
              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <UserIcon size={18} className="text-sodor-blue" />
                  Update Profile Name
                </h3>
                <form onSubmit={handleChangeName} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="New Student Name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-transparent focus:border-sodor-blue outline-none font-bold text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || newName === user.name}
                    className="px-6 py-3 bg-sodor-blue text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    Update
                  </button>
                </form>
              </section>

              {/* Change PIN Section */}
              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-sodor-blue" />
                  Change Security PIN
                </h3>
                <form onSubmit={handleChangePin} className="flex gap-2">
                  <input
                    type="password"
                    placeholder="New PIN or Password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-transparent focus:border-sodor-blue outline-none font-bold text-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-sodor-blue text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    Update
                  </button>
                </form>
              </section>

              {/* Backup & Restore Section */}
              <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Download size={18} className="text-sodor-blue" />
                  Data Portability
                </h3>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  Export your progress, collected engines, and unlocked videos to a file. You can use this file to restore your account on another device or after deletion.
                </p>
                <button
                  onClick={handleExport}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white text-sodor-blue border-2 border-sodor-blue/20 rounded-xl font-bold text-sm hover:bg-sodor-blue/5 transition-all"
                >
                  <Download size={18} />
                  Export My Academy Data
                </button>
              </section>

              {/* Danger Zone */}
              <section className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-red-600 flex items-center gap-2">
                      <Trash2 size={18} />
                      Delete Account
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      This will permanently remove all your progress.
                    </p>
                  </div>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      confirmDelete 
                        ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    {confirmDelete ? 'Confirm Deletion' : 'Delete'}
                  </button>
                </div>
                {confirmDelete && (
                  <p className="mt-2 text-[10px] text-red-500 font-bold text-center animate-pulse">
                    Make sure you have exported your data first if you want to restore it later!
                  </p>
                )}
              </section>
            </>
          )}

          {message.text && (
            <p className={`text-center font-bold text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {message.text}
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const LessonPreferencesModal = ({ user, onClose, onUpdateUser }: { 
  user: User; 
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}) => {
  const [questionsPerSubject, setQuestionsPerSubject] = useState(user.stats.preferences?.questionsPerSubject || {});

  const handleUpdateQuestions = async (subject: string, count: number) => {
    const updatedQuestions = { ...questionsPerSubject, [subject]: count };
    setQuestionsPerSubject(updatedQuestions);
    
    const updatedUser = { 
      ...user, 
      stats: { 
        ...user.stats, 
        preferences: { 
          ...user.stats.preferences, 
          questionsPerSubject: updatedQuestions 
        } 
      } 
    };
    onUpdateUser(updatedUser);
    
    if (user.id !== 'guest') {
      try {
        await apiService.updateProgress(user.id, updatedUser.stats);
      } catch (err) {
        console.error('Failed to sync settings:', err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 md:p-10 max-w-lg w-full max-h-[90vh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3 shrink-0">
          <Compass className="text-sodor-gold" />
          Lesson Preferences
        </h2>

        <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
          <section className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Calculator size={18} className="text-sodor-blue" />
              Questions per Lesson
            </h3>
            <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
              Adjust how many questions you want for each station. Less questions for a quick trip, or more for a long haul!
            </p>
            <div className="space-y-3">
              {Object.entries(questionsPerSubject).map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-sm font-bold text-slate-700">{subject}</span>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="3"
                      max="20"
                      value={count}
                      onChange={(e) => handleUpdateQuestions(subject, parseInt(e.target.value))}
                      className="w-28 accent-sodor-blue h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="w-10 h-10 bg-sodor-blue/10 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-black text-sodor-blue">{count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-8 p-6 bg-sodor-blue/5 rounded-3xl border border-sodor-blue/10">
            <h4 className="font-bold text-sodor-blue mb-2 flex items-center gap-2">
              <Activity size={16} />
              Training Tip
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Settings are saved automatically to your profile. Changes take effect on your next station visit!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminModal = ({ adminId, onClose }: { adminId: string; onClose: () => void }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAdminUsers(adminId);
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (targetId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete user "${name}"? This cannot be undone.`)) return;
    
    try {
      await apiService.deleteUserAsAdmin(adminId, targetId);
      setUsers(prev => prev.filter(u => u.id !== targetId));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleValidateUser = async (targetId: string, name: string) => {
    if (!confirm(`Are you sure you want to manually validate user "${name}"?`)) return;
    
    try {
      await apiService.validateUserAsAdmin(adminId, targetId);
      setUsers(prev => prev.map(u => u.id === targetId ? { ...u, isActive: true } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 md:p-10 max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3">
          <Shield className="text-sodor-blue" />
          Admin Control Panel
        </h2>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Train size={48} className="text-sodor-blue animate-bounce" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold text-center my-10 border border-red-100">
            {error}
          </div>
        ) : (
          <div className="overflow-auto flex-1 custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-black uppercase tracking-widest">
                  <th className="pb-4 pl-2">Student</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4 text-center">Score</th>
                  <th className="pb-4 text-center">Status</th>
                  <th className="pb-4 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sodor-blue/10 flex items-center justify-center text-sodor-blue font-bold text-xs">
                          {u.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">{u.name}</span>
                        {u.isAdmin && <span className="px-2 py-0.5 bg-sodor-blue text-white text-[10px] font-black rounded uppercase">Admin</span>}
                      </div>
                    </td>
                    <td className="py-4 font-medium text-slate-500 text-sm">
                      {u.email || <span className="italic text-slate-300">No email</span>}
                    </td>
                    <td className="py-4 text-center">
                      <span className="font-black text-sodor-blue">{u.stats.score}</span>
                    </td>
                    <td className="py-4 text-center">
                      {u.isActive ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase">Active</span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-400 text-[10px] font-black rounded uppercase">Pending</span>
                      )}
                    </td>
                    <td className="py-4 text-right pr-2">
                      {!u.isAdmin && (
                        <div className="flex items-center justify-end gap-1">
                          {!u.isActive && (
                            <button
                              onClick={() => handleValidateUser(u.id, u.name)}
                              className="p-2 text-slate-300 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Validate User"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const VideoModal = ({ video, onClose }: { video: Video; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
  >
    <div className="relative max-w-5xl w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-[160] p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
      >
        <X size={24} />
      </button>
      <video 
        src={`/SodorAcademy/media/${video.filename}`}
        controls
        autoPlay
        className="w-full h-full"
      />
    </div>
  </motion.div>
);


const ExerciseView = ({ subject, grade, questionsCount = 10, onComplete, onCancel }: { 
  subject: Subject; 
  grade: Grade; 
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  useEffect(() => {
    loadNext();
  }, [subject, grade]);

  const loadNext = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    try {
      const q = await generateQuestion(subject.name, grade);
      setQuestion(q);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    const correct = answer === question?.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      const newProgress = Math.min((newQuestionsAnswered / questionsCount) * 100, 100);
      setProgress(newProgress);
      if (newQuestionsAnswered >= questionsCount) {
        setTimeout(() => onComplete(question?.rewardType || 'engine'), 1500);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <motion.div 
          animate={{ x: [-20, 20, -20] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sodor-blue"
        >
          <Train size={64} strokeWidth={1} />
        </motion.div>
        <p className="text-slate-500 font-medium animate-pulse italic">Stoking the fire... generating lesson...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4">
      {/* Progress Track */}
      <div className="mb-12 relative">
        <div className="h-4 w-full bg-slate-200 rounded-full train-track overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-sodor-blue"
          />
        </div>
        <motion.div 
          animate={{ left: `${progress}%` }}
          className="absolute -top-6 -ml-4 text-sodor-blue transition-all"
        >
          <Train size={32} />
        </motion.div>
        <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
          <span>Tidmouth Sheds</span>
          <span>Knapford Station</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question?.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="engine-glass rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-2 h-full bg-sodor-blue" />
            <div className="flex justify-between items-start mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-sodor-blue/10 text-sodor-blue text-xs font-bold uppercase tracking-wider">
                {subject.name} • {grade}
              </span>
              <button 
                onClick={() => question && speak(question.text)}
                className="p-2 bg-slate-100 hover:bg-sodor-blue/10 text-slate-400 hover:text-sodor-blue rounded-full transition-colors"
                title="Listen to question"
              >
                <Volume2 size={18} />
              </button>
            </div>
            
            <h2 className={`text-xl font-extrabold mb-8 leading-tight ${grade === 'Primary' ? 'text-sodor-blue' : 'text-indigo-700'}`}>
              {question?.text}
            </h2>

            <div className="grid gap-4">
              {question?.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`
                    p-5 rounded-2xl text-left font-bold border-2 transition-all flex items-center justify-between
                    ${selectedAnswer === option 
                      ? (isCorrect ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700')
                      : (selectedAnswer && option === question?.correctAnswer ? 'bg-green-50 border-green-500 text-green-700' : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100')
                    }
                  `}
                >
                  {option}
                  {(selectedAnswer === option || (selectedAnswer && option === question?.correctAnswer)) && (
                    <span className="text-xl">
                      {option === question?.correctAnswer ? '🚂' : '❌'}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>

            {isCorrect === false && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex flex-col gap-2"
              >
                <p className="text-red-700 font-bold">Cinders and Ashes!</p>
                <p className="text-slate-600 text-sm">{question?.explanation}</p>
                <button 
                  onClick={loadNext}
                  className="mt-2 text-red-600 flex items-center gap-1 font-bold text-sm hover:underline"
                >
                  <RotateCcw size={14} /> Try another track
                </button>
              </motion.div>
            )}

            {isCorrect === true && progress < 100 && (
               <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={loadNext}
                className="mt-8 w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-colors"
               >
                 Next Station
               </motion.button>
            )}
        </motion.div>
      </AnimatePresence>
      
      <button 
        onClick={onCancel}
        className="mt-8 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors"
      >
        Return to Roundhouse
      </button>
    </div>
  );
};

const SubjectSelectionView = ({ subject, onSelectExercise, onCancel }: { 
  subject: Subject; 
  onSelectExercise: (exercise: Exercise) => void;
  onCancel: () => void;
}) => {
  const lessons = subject.exercises?.filter(e => e.type === 'lesson') || [];
  const exercises = subject.exercises?.filter(e => e.type !== 'lesson') || [];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <div className={`w-20 h-20 ${subject.color} rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg`}>
          <subject.icon size={40} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-4">{subject.name} Station</h2>
        <p className="text-lg text-slate-500 font-medium">Start a lesson or join an adventure at {subject.station}!</p>
      </div>

      {lessons.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-2">
            <BookOpen size={14} className="text-blue-600" />
            Academy Lessons
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {lessons.map(exercise => (
              <motion.button
                key={exercise.id}
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => onSelectExercise(exercise)}
                className="bg-white p-8 rounded-[32px] border-2 border-blue-100 shadow-xl text-left group transition-all hover:border-blue-400/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <ArrowRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={24} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{exercise.name}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{exercise.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 px-2">
          <PlayCircle size={14} className="text-emerald-600" />
          Station Adventures
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          {exercises.map(exercise => (
            <motion.button
              key={exercise.id}
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => onSelectExercise(exercise)}
              className="bg-white p-8 rounded-[32px] border-2 border-slate-100 shadow-xl text-left group transition-all hover:border-sodor-blue/20"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-sodor-blue/10 rounded-2xl flex items-center justify-center text-sodor-blue group-hover:bg-sodor-blue group-hover:text-white transition-colors">
                  <PlayCircle size={24} />
                </div>
                <ArrowRight className="text-slate-300 group-hover:text-sodor-blue transition-colors" size={24} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{exercise.name}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{exercise.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      <button 
        onClick={onCancel}
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors"
      >
        Return to Sodor Map
      </button>
    </div>
  );
};

const LibraryModal = ({ stories, onClose }: {
  stories: import('./types').Story[];
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6"
  >
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      className="bg-white rounded-[40px] p-8 md:p-10 max-w-4xl w-full max-h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
      >
        <X size={24} />
      </button>

      <h2 className="text-3xl font-black mb-8 text-slate-900 flex items-center gap-3 shrink-0">
        <BookOpen className="text-red-600" />
        The Library
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {stories.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-bold">No stories unlocked yet.</p>
            <p className="text-sm mt-2">Complete story adventures to add them to your library!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map(story => (
              <div
                key={story.id}
                className="bg-slate-50 p-6 rounded-3xl border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center text-3xl">
                    {story.thumbnail}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{story.title}</h3>
                </div>
                <p className="text-sm text-slate-600 font-medium leading-relaxed line-clamp-4">
                  {story.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);

const MusicLibraryModal = ({ user, onClose, onSelectMusic }: {
  user: User; 
  onClose: () => void;
  onSelectMusic: (score: MusicScore) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-6"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[40px] p-8 md:p-12 max-w-5xl w-full h-[85vh] shadow-2xl relative overflow-hidden flex flex-col"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
          <div className="mb-12">
            <h2 className="text-4xl font-black text-slate-900 flex items-center gap-4">
              <Music size={40} className="text-pink-600" />
              Sodor Concert Hall
            </h2>
            <p className="text-slate-500 font-medium mt-2">Listen to and perform classical engine melodies on the grand piano.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MUSIC_LIBRARY.map(score => {
              const isUnlocked = (user.stats.unlockedMusic || []).includes(score.id);
              return (
                <button
                  key={score.id}
                  onClick={() => isUnlocked && onSelectMusic(score)}
                  className={`bg-slate-50 p-8 rounded-[32px] border-2 transition-all text-left group flex flex-col items-center text-center
                    ${isUnlocked 
                      ? 'hover:border-pink-600/20 hover:bg-white hover:shadow-xl border-transparent' 
                      : 'border-dashed border-slate-200 opacity-40 cursor-not-allowed'}
                  `}
                >
                  <div className="text-6xl mb-6 grayscale-0">{isUnlocked ? score.thumbnail : '🔒'}</div>
                  <h3 className={`text-xl font-black mb-2 transition-colors ${isUnlocked ? 'text-slate-900 group-hover:text-pink-600' : 'text-slate-400'}`}>
                    {isUnlocked ? score.title : 'Locked Melody'}
                  </h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                    {isUnlocked ? 'Ready to Perform' : 'Keep learning to unlock'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPin, setCurrentPin] = useState<string>('');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [showReward, setShowReward] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<Video | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showTopics, setShowTopics] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showMusicLibrary, setShowMusicLibrary] = useState(false);
  const [selectedMusicScore, setSelectedMusicScore] = useState<MusicScore | null>(null);
  
  const [authView, setAuthView] = useState<'login' | 'validation' | 'recovery'>('login');
  const [validationEmail, setValidationEmail] = useState('');
  const [recoveryName, setRecoveryName] = useState('');

  const GUEST_USER: User = {
    id: 'guest',
    name: 'Guest Explorer',
    stats: {
      score: 0,
      completedLessons: 0,
      enginesCollected: [],
      videosUnlocked: ['welcome'],
      currentGrade: 'Primary',
      completedStories: [],
      unlockedMusic: ['thomas-theme'],
      preferences: {
        questionsPerSubject: {
          'Mathematics': 10,
          'English': 10,
          'Science': 10,
          'History': 10,
          'Geography': 10,
          'Music': 10
        }
      }
    }
  };

  // Load user from localStorage on start
  useEffect(() => {
    const savedUser = localStorage.getItem('sodor_academy_user');
    const savedPin = localStorage.getItem('sodor_academy_pin');
    if (savedUser && savedPin) {
      let loadedUser = JSON.parse(savedUser);
      // Ensure preferences exist
      if (!loadedUser.stats.preferences) {
        loadedUser.stats.preferences = {
          questionsPerSubject: {
            'Mathematics': 10,
            'English': 10,
            'Science': 10,
            'History': 10,
            'Geography': 10,
            'Music': 10
          }
        };
      }
      if (!loadedUser.stats.unlockedMusic) {
        loadedUser.stats.unlockedMusic = ['thomas-theme'];
      }
      setUser(loadedUser);
      setCurrentPin(savedPin);
    }
  }, []);

  const handleLogin = (newUser: User, pin: string, isNewUser: boolean) => {
    setUser(newUser);
    setCurrentPin(pin);
    localStorage.setItem('sodor_academy_user', JSON.stringify(newUser));
    localStorage.setItem('sodor_academy_pin', pin);
    if (isNewUser) {
      setPlayingVideo(VIDEOS.find(v => v.id === 'welcome') || null);
    }
  };

  const handleGuestLogin = () => {
    setUser(GUEST_USER);
    setCurrentPin('');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPin('');
    localStorage.removeItem('sodor_academy_user');
    localStorage.removeItem('sodor_academy_pin');
    setAuthView('login');
  };

  const handleUpdateUser = (updatedUser: User, newPin?: string) => {
    setUser(updatedUser);
    localStorage.setItem('sodor_academy_user', JSON.stringify(updatedUser));
    if (newPin) {
      setCurrentPin(newPin);
      localStorage.setItem('sodor_academy_pin', newPin);
    }
  };
  const handleLessonComplete = async (rewardType: string) => {
    if (!user) return;

    let rewardId = '';
    let newStats = { ...user.stats };

    // Track fraction exercises specifically
    if (activeExercise?.id === 'math-fractions-mult' || activeExercise?.id === 'math-fractions-add') {
      const completed = new Set(newStats.fractionExercisesCompleted || []);
      completed.add(activeExercise.id);
      newStats.fractionExercisesCompleted = Array.from(completed);

      // Special unlock for completing both fraction exercises
      if (newStats.fractionExercisesCompleted.length >= 2 && !newStats.videosUnlocked.includes('thomas-sharing')) {
        rewardId = 'thomas-sharing';
        newStats.videosUnlocked = [...newStats.videosUnlocked, 'thomas-sharing'];
        rewardType = 'video'; // Force video reward for this special milestone
      }
    }

    // Story completion handling
    if (activeExercise?.id === 'eng-stories' && typeof rewardType === 'string' && rewardType.startsWith('story-')) {
      const storyId = rewardType;
      const completed = new Set(newStats.completedStories || []);
      completed.add(storyId);
      newStats.completedStories = Array.from(completed);
      rewardId = 'story-unlocked'; // Generic flag for story reward UI
    }

    // Unlock new music score
    const lockedMusic = MUSIC_LIBRARY.filter(m => !(newStats.unlockedMusic || []).includes(m.id));
    if (lockedMusic.length > 0 && Math.random() > 0.5) { // 50% chance to unlock music per lesson
      const randomMusic = lockedMusic[Math.floor(Math.random() * lockedMusic.length)];
      newStats.unlockedMusic = [...(newStats.unlockedMusic || []), randomMusic.id];
      if (!rewardId) rewardId = 'music-unlocked';
    }

    if (!rewardId) {
      if (rewardType === 'video') {
        const lockedVideos = VIDEOS.filter(v => !(newStats.videosUnlocked || []).includes(v.id));
        if (lockedVideos.length > 0) {
          const randomVideo = lockedVideos[Math.floor(Math.random() * lockedVideos.length)];
          rewardId = randomVideo.id;
          newStats.videosUnlocked = Array.from(new Set([...(newStats.videosUnlocked || []), randomVideo.id]));
        }
      } else {
        const randomEngine = ENGINES[Math.floor(Math.random() * ENGINES.length)];
        rewardId = randomEngine.id;
        newStats.enginesCollected = Array.from(new Set([...user.stats.enginesCollected, randomEngine.id]));
      }
    }

    newStats.score += 100;
    newStats.completedLessons += 1;

    const updatedUser = { ...user, stats: newStats };
    setUser(updatedUser);
    
    if (user.id !== 'guest') {
      localStorage.setItem('sodor_academy_user', JSON.stringify(updatedUser));

      try {
        await apiService.updateProgress(user.id, newStats);
      } catch (err) {
        console.error('Failed to sync progress:', err);
      }
    }

    setShowReward(rewardId);
    setActiveSubject(null);
    setActiveExercise(null);
  };

  const updateGrade = async (grade: Grade) => {
    if (!user) return;
    const newStats = { ...user.stats, currentGrade: grade };
    const updatedUser = { ...user, stats: newStats };
    setUser(updatedUser);
    
    if (user.id !== 'guest') {
      localStorage.setItem('sodor_academy_user', JSON.stringify(updatedUser));
      
      try {
        await apiService.updateProgress(user.id, newStats);
      } catch (err) {
        console.error('Failed to sync grade:', err);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {authView === 'login' && (
          <LoginView 
            onLogin={handleLogin} 
            onShowValidation={(name, email) => { 
              setRecoveryName(name); // reuse state for simplicity or add a dedicated one
              setValidationEmail(email); 
              setAuthView('validation'); 
            }}
            onShowRecovery={() => setAuthView('recovery')}
            onGuestLogin={handleGuestLogin}
          />
        )}
        {authView === 'validation' && (
          <ValidationView 
            name={recoveryName}
            email={validationEmail} 
            onValidated={() => setAuthView('login')} 
            onCancel={() => setAuthView('login')} 
          />
        )}
        {authView === 'recovery' && (
          <RecoveryView onCancel={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <Navbar 
        stats={user.stats} 
        userName={user.name} 
        isAdmin={user.isAdmin}
        onLogout={handleLogout} 
        onOpenSettings={() => setShowSettings(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenTopics={() => {
          setSelectedMusicScore(null);
          setShowTopics(true);
        }}
      />

      <main className={`${(activeExercise?.component === 'Piano' || activeExercise?.component === 'PianoSequence') ? 'max-w-[98vw]' : 'max-w-6xl'} mx-auto px-2 md:px-6 py-12 transition-all duration-500`}>
        <AnimatePresence mode="wait">
          {!activeSubject ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="inline-flex gap-4 p-1 bg-slate-200 rounded-2xl mb-8"
                >
                  <button 
                    onClick={() => updateGrade('Primary')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${user.stats.currentGrade === 'Primary' ? 'bg-white text-sodor-blue shadow-sm' : 'text-slate-500'}`}
                  >
                    Primary School
                  </button>
                  <button 
                    onClick={() => updateGrade('Secondary')}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${user.stats.currentGrade === 'Secondary' ? 'bg-white text-sodor-blue shadow-sm' : 'text-slate-500'}`}
                  >
                    Secondary Academy
                  </button>
                </motion.div>
                
                <h1 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">
                  Welcome back, <span className="text-sodor-blue">{user.name}</span>!
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium mb-12">
                  Select a station on the map to start your next adventure!
                </p>

                <SodorMap 
                  onSelectSubject={(subject) => setActiveSubject(subject)} 
                  onOpenPreferences={() => setShowPreferences(true)}
                />
              </div>

              {/* Video Gallery */}
              <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900">
                    <PlayCircle className="text-sodor-blue" />
                    Sodor Cinema
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {VIDEOS.map(video => {
                    const isUnlocked = (user.stats.videosUnlocked || []).includes(video.id);
                    return (
                      <motion.button
                        key={video.id}
                        whileHover={isUnlocked ? { y: -5 } : {}}
                        onClick={() => isUnlocked && setPlayingVideo(video)}
                        className={`text-left rounded-3xl overflow-hidden border-2 transition-all group
                          ${isUnlocked 
                            ? 'bg-white shadow-lg border-slate-100' 
                            : 'bg-slate-100 border-transparent opacity-40'}
                        `}
                      >
                        <div className={`aspect-video flex items-center justify-center text-4xl bg-slate-200 relative`}>
                          {video.thumbnail}
                          {isUnlocked && (
                            <div className="absolute inset-0 bg-sodor-blue/0 group-hover:bg-sodor-blue/10 transition-colors flex items-center justify-center">
                              <PlayCircle size={48} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <h4 className="font-extrabold text-lg mb-1">{video.title}</h4>
                          <p className="text-sm text-slate-500 line-clamp-2">
                            {isUnlocked ? video.description : 'Unlock this video by learning!'}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Story Library Preview */}
              <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900">
                    <BookOpen className="text-red-600" />
                    The Library
                  </h2>
                  <button 
                    onClick={() => setShowLibrary(true)}
                    className="text-sm font-bold text-red-600 hover:underline uppercase tracking-widest"
                  >
                    Open Library
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {STORIES.slice(0, 4).map(story => {
                    const isUnlocked = (user.stats.completedStories || []).includes(story.id);
                    return (
                      <button
                        key={story.id}
                        onClick={() => isUnlocked && setShowLibrary(true)}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center group
                          ${isUnlocked 
                            ? 'bg-white shadow-lg border-red-100 hover:border-red-600/20' 
                            : 'bg-slate-100 border-transparent opacity-40 grayscale'}
                        `}
                      >
                        <div className="text-4xl mb-4">{isUnlocked ? story.thumbnail : '🔒'}</div>
                        <h4 className="font-extrabold text-sm mb-1 leading-tight">{isUnlocked ? story.title : 'Locked Story'}</h4>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Music Library Preview */}
              <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900">
                    <Music className="text-pink-600" />
                    Concert Hall
                  </h2>
                  <button 
                    onClick={() => setShowMusicLibrary(true)}
                    className="text-sm font-bold text-pink-600 hover:underline uppercase tracking-widest"
                  >
                    Open Library
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {MUSIC_LIBRARY.slice(0, 4).map(score => {
                    const isUnlocked = (user.stats.unlockedMusic || []).includes(score.id);
                    return (
                      <button
                        key={score.id}
                        onClick={() => isUnlocked && setShowMusicLibrary(true)}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center group
                          ${isUnlocked 
                            ? 'bg-white shadow-lg border-pink-100 hover:border-pink-600/20' 
                            : 'bg-slate-100 border-transparent opacity-40 grayscale'}
                        `}
                      >
                        <div className="text-4xl mb-4">{isUnlocked ? score.thumbnail : '🔒'}</div>
                        <h4 className="font-extrabold text-sm mb-1 leading-tight">{isUnlocked ? score.title : 'Locked Melody'}</h4>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reward Gallery */}
              <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900">
                    <Layout className="text-sodor-blue" />
                    The Roundhouse
                  </h2>
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Your Collection
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {ENGINES.map(engine => {
                    const isCollected = user.stats.enginesCollected.includes(engine.id);
                    return (
                      <div 
                        key={engine.id}
                        className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center text-center group
                          ${isCollected 
                            ? 'bg-white shadow-lg border-sodor-blue/20' 
                            : 'bg-slate-100 border-transparent opacity-40 grayscale'}
                        `}
                      >
                        <div 
                          className="w-12 h-12 rounded-full mb-4 flex items-center justify-center text-2xl shadow-inner border border-white/50"
                          style={{ backgroundColor: engine.color }}
                        >
                          🚂
                        </div>
                        <h4 className="font-extrabold text-sm mb-1">{engine.name}</h4>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                          {isCollected ? 'Collected' : 'Locked'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="exercise"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {activeSubject.exercises && !activeExercise ? (
                <SubjectSelectionView 
                  subject={activeSubject} 
                  onSelectExercise={(ex) => setActiveExercise(ex)} 
                  onCancel={() => setActiveSubject(null)}
                />
              ) : activeExercise?.id === 'eng-stories' ? (
                <StoryExercise 
                  grade={user.stats.currentGrade}
                  completedStories={user.stats.completedStories || []}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['English'] || 10}
                  onComplete={(storyId) => handleLessonComplete(storyId)}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'FractionMultiplication' ? (
                <FractionMultiplication 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Mathematics'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'FractionAddition' ? (
                <FractionAddition 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Mathematics'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'SimpleFractionAddition' ? (
                <SimpleFractionAddition 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Mathematics'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'FractionIntegerAddition' ? (
                <FractionIntegerAddition 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Mathematics'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'FractionAdditionLesson' ? (
                <FractionAdditionLesson 
                  onCancel={() => setActiveExercise(null)}
                  onStartExercise={() => {
                    const exercise = activeSubject.exercises?.find(e => e.id === 'math-fractions-add');
                    if (exercise) setActiveExercise(exercise);
                  }}
                />
              ) : activeExercise?.component === 'LCMLesson' ? (
                <LCMLesson 
                  onCancel={() => setActiveExercise(null)}
                  onStartExercise={() => {
                    const exercise = activeSubject.exercises?.find(e => e.id === 'math-lcm');
                    if (exercise) setActiveExercise(exercise);
                  }}
                />
              ) : activeExercise?.component === 'LCMExercise' ? (
                <LCMExercise 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Mathematics'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : activeExercise?.component === 'ForceLesson' ? (
                <ForceLesson 
                  onCancel={() => setActiveExercise(null)}
                  onStartExercise={() => {
                    const exercise = activeSubject.exercises?.find(e => e.id === 'sci-force-exercise');
                    if (exercise) setActiveExercise(exercise);
                  }}
                />
              ) : activeExercise?.component === 'Piano' ? (
                <Piano 
                  autoPlayScore={selectedMusicScore} 
                  onCancel={() => { setActiveExercise(null); setSelectedMusicScore(null); }} 
                />
              ) : activeExercise?.component === 'PianoSequence' ? (                <PianoSequence 
                  grade={user.stats.currentGrade}
                  questionsCount={user.stats.preferences?.questionsPerSubject?.['Music'] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => setActiveExercise(null)}
                />
              ) : (
                <ExerciseView 
                  subject={activeSubject} 
                  grade={user.stats.currentGrade} 
                  questionsCount={user.stats.preferences?.questionsPerSubject?.[activeSubject.name] || 10}
                  onComplete={handleLessonComplete}
                  onCancel={() => activeSubject.exercises ? setActiveExercise(null) : setActiveSubject(null)}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            user={user}
            pin={currentPin}
            onClose={() => setShowSettings(false)}
            onUpdateUser={handleUpdateUser}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <LessonPreferencesModal 
            user={user}
            onClose={() => setShowPreferences(false)}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </AnimatePresence>

      {/* Topics List Modal */}
      <AnimatePresence>
        {showTopics && (
          <TopicsModal 
            onClose={() => setShowTopics(false)}
            onSelectTopic={(subject, exercise) => {
              setActiveSubject(subject);
              setActiveExercise(exercise);
              setShowTopics(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Music Library Modal */}
      <AnimatePresence>
        {showMusicLibrary && user && (
          <MusicLibraryModal 
            user={user}
            onClose={() => setShowMusicLibrary(false)}
            onSelectMusic={(score) => {
              setSelectedMusicScore(score);
              setShowMusicLibrary(false);
              const musicStation = SUBJECTS.find(s => s.id === 'music');
              const pianoExercise = musicStation?.exercises?.find(e => e.component === 'Piano');
              if (musicStation && pianoExercise) {
                setActiveSubject(musicStation);
                setActiveExercise(pianoExercise);
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Admin Modal */}
      <AnimatePresence>
        {showAdmin && user && (
          <AdminModal 
            adminId={user.id}
            onClose={() => setShowAdmin(false)} 
          />
        )}
      </AnimatePresence>

      {/* Library Modal */}
      <AnimatePresence>
        {showLibrary && user && (
          <LibraryModal 
            stories={STORIES.filter(s => (user.stats.completedStories || []).includes(s.id))}
            onClose={() => setShowLibrary(false)} 
          />
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <VideoModal 
            video={playingVideo} 
            onClose={() => setPlayingVideo(null)} 
          />
        )}
      </AnimatePresence>

      {/* Reward Modal */}
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-sodor-blue/40 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[40px] p-12 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-sodor-gold/10 to-transparent pointer-events-none" />
              <div className="text-7xl mb-8 animate-bounce">🏆</div>
              <h2 className="text-3xl font-black mb-2">Well Done!</h2>
              <p className="text-slate-500 mb-8 font-medium">
                You've reached the station. You've earned a reward!
              </p>
              
              <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
                {showReward === 'story-unlocked' ? (
                  <>
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg border-2 border-white bg-red-600 text-white">
                      <BookOpen size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-red-600">
                      Story Unlocked!
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Check your Library
                    </p>
                  </>
                ) : showReward === 'music-unlocked' ? (
                  <>
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg border-2 border-white bg-pink-600 text-white">
                      <Music size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-pink-600">
                      Melody Unlocked!
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Visit the Concert Hall
                    </p>
                  </>
                ) : VIDEOS.some(v => v.id === showReward) ? (
                  <>
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg border-2 border-white bg-sodor-blue text-white">
                      <PlayCircle size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-sodor-blue">
                      {VIDEOS.find(v => v.id === showReward)?.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                      New Video Unlocked
                    </p>
                  </>
                ) : (
                  <>
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg border-2 border-white"
                      style={{ backgroundColor: ENGINES.find(e => e.id === showReward)?.color }}
                    >
                      🚂
                    </div>
                    <h3 className="text-xl font-bold text-sodor-blue">
                      {ENGINES.find(e => e.id === showReward)?.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Newly Collected Engine
                    </p>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  const videoId = showReward;
                  setShowReward(null);
                  const video = VIDEOS.find(v => v.id === videoId);
                  if (video) setPlayingVideo(video);
                }}
                className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95"
              >
                {VIDEOS.some(v => v.id === showReward) ? 'Watch Now' : 'Add to Collection'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
