import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Train, Trophy, Star, Shield, Layout, BookOpen, Calculator, RotateCcw, LogOut, User as UserIcon, Lock } from 'lucide-react';
import { Grade, Subject, Question, UserStats, SUBJECTS, ENGINES } from './types';
import { generateQuestion } from './services/questionService';
import { apiService, User } from './services/apiService';

// --- Components ---

const Navbar = ({ stats, userName, onLogout }: { stats: UserStats; userName: string; onLogout: () => void }) => (
  <nav className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-sodor-blue rounded-lg flex items-center justify-center text-white shadow-lg relative overflow-hidden group">
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
      </div>
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

const LoginView = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegistering) {
        const user = await apiService.register(name, pin);
        onLogin(user);
      } else {
        const user = await apiService.login(name, pin);
        onLogin(user);
      }
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

          {error && <p className="text-red-500 font-bold text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Log In')}
          </button>
        </form>

        <button
          onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
          className="mt-6 text-slate-400 font-bold hover:text-sodor-blue transition-colors text-sm"
        >
          {isRegistering ? 'Already have an account? Log In' : "New student? Create an account"}
        </button>
      </motion.div>
    </div>
  );
};

const SubjectCard = ({ subject, onClick }: { subject: Subject; onClick: () => void; key?: string }) => {
  const Icon = subject.icon;
  return (
    <motion.button
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center p-6 bg-white rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-sodor-blue transition-all group text-center"
    >
      <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
        <Icon size={32} />
      </div>
      <h3 className="font-bold text-lg mb-1">{subject.name}</h3>
      <p className="text-sm text-slate-500">{subject.description}</p>
    </motion.button>
  );
};

const ExerciseView = ({ subject, grade, onComplete, onCancel }: { 
  subject: Subject; 
  grade: Grade; 
  onComplete: (reward: string) => void;
  onCancel: () => void;
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);

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
      setProgress(prev => Math.min(prev + 34, 100));
      if (progress >= 66) {
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
    <div className="max-w-3xl mx-auto py-12 px-6">
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
            <span className="inline-block px-3 py-1 rounded-full bg-sodor-blue/10 text-sodor-blue text-xs font-bold mb-4 uppercase tracking-wider">
              {subject.name} • {grade}
            </span>
            <h2 className="text-2xl font-extrabold mb-8 leading-tight">
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
                      : 'bg-slate-50 border-transparent text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  {option}
                  {selectedAnswer === option && (
                    <span className="text-xl">
                      {isCorrect ? '🚂' : '❌'}
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

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [showReward, setShowReward] = useState<string | null>(null);

  // Load user from localStorage on start
  useEffect(() => {
    const savedUser = localStorage.getItem('sodor_academy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('sodor_academy_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('sodor_academy_user');
  };

  const handleLessonComplete = async (rewardType: string) => {
    if (!user) return;

    const randomEngine = ENGINES[Math.floor(Math.random() * ENGINES.length)];
    const newStats = {
      ...user.stats,
      score: user.stats.score + 100,
      completedLessons: user.stats.completedLessons + 1,
      enginesCollected: Array.from(new Set([...user.stats.enginesCollected, randomEngine.id]))
    };

    const updatedUser = { ...user, stats: newStats };
    setUser(updatedUser);
    localStorage.setItem('sodor_academy_user', JSON.stringify(updatedUser));

    try {
      await apiService.updateProgress(user.id, newStats);
    } catch (err) {
      console.error('Failed to sync progress:', err);
    }

    setShowReward(randomEngine.id);
    setActiveSubject(null);
  };

  const updateGrade = async (grade: Grade) => {
    if (!user) return;
    const newStats = { ...user.stats, currentGrade: grade };
    const updatedUser = { ...user, stats: newStats };
    setUser(updatedUser);
    localStorage.setItem('sodor_academy_user', JSON.stringify(updatedUser));
    
    try {
      await apiService.updateProgress(user.id, newStats);
    } catch (err) {
      console.error('Failed to sync grade:', err);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <LoginView onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans">
      <Navbar stats={user.stats} userName={user.name} onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!activeSubject ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-16">
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
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                  The most useful engines are those who never stop learning. Which track will you take today?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {SUBJECTS.map(subject => (
                  <SubjectCard 
                    key={subject.id} 
                    subject={subject} 
                    onClick={() => setActiveSubject(subject)} 
                  />
                ))}
              </div>

              {/* Reward Gallery */}
              <div className="mt-24">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black flex items-center gap-3">
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
              <ExerciseView 
                subject={activeSubject} 
                grade={user.stats.currentGrade} 
                onComplete={handleLessonComplete}
                onCancel={() => setActiveSubject(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
                You've reached the station. You've earned a new engine for your collection!
              </p>
              
              <div className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
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
                  Newly Collected
                </p>
              </div>

              <button
                onClick={() => setShowReward(null)}
                className="w-full py-4 bg-sodor-blue text-white rounded-2xl font-bold shadow-lg shadow-sodor-blue/30 hover:bg-blue-700 transition-all active:scale-95"
              >
                Add to Roundhouse
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
