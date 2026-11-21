import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';

import { Grade, ENGINES, VIDEOS, Video } from './types';
import { apiService, User, setAuthToken } from './services/apiService';
import { STORIES } from './services/storyData';
import { MUSIC_LIBRARY } from './services/musicData';
import { LangProvider, useLang } from './i18n';
import { navigate, useRoute } from './router';
import { STATIONS, stationById, activityById } from './content/stations';
import Navbar from './components/Navbar';
import { Crumbs, EnOnly, Footer } from './components/ui';
import { LoginView, ValidationView, RecoveryView } from './views/AuthViews';
import { SettingsModal, PreferencesModal, SearchModal, AdminModal, VideoModal, LibraryModal, ConcertModal, RewardModal } from './views/Modals';
import HomeView from './views/HomeView';
import StationView from './views/StationView';
import QuizView from './views/QuizView';
import ActivityView from './views/ActivityView';
import SkillExercise from './views/SkillExercise';

// Without an account, the Academy is explored as a guest whose progress is kept in
// this browser. An account keeps it on the server (see server.js).
const ACCOUNT_KEY = 'sodor_academy_user';
const TOKEN_KEY = 'sodor_academy_token';
const GUEST_KEY = 'sodor_academy_guest';

const defaultCounts = () => Object.fromEntries(STATIONS.map(s => [s.bank, 10]));

function withDefaults(u: User): User {
  const stats = { ...u.stats };
  stats.preferences = { ...stats.preferences, questionsPerSubject: { ...defaultCounts(), ...(stats.preferences?.questionsPerSubject || {}) } };
  stats.unlockedMusic = stats.unlockedMusic || ['thomas-theme'];
  stats.videosUnlocked = stats.videosUnlocked || ['welcome'];
  stats.enginesCollected = stats.enginesCollected || [];
  return { ...u, stats };
}

function newGuest(): User {
  return withDefaults({
    id: 'guest',
    name: '',
    stats: {
      score: 0, completedLessons: 0, enginesCollected: [], videosUnlocked: ['welcome'],
      currentGrade: 'Primary', completedStories: [], unlockedMusic: ['thomas-theme'],
    },
  });
}

function readJSON<T>(key: string): T | null {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : null; } catch { return null; }
}
function writeJSON(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage blocked: progress lasts the visit */ }
}

function loadUser(): User {
  const account = readJSON<User>(ACCOUNT_KEY);
  let token: string | null = null;
  try { token = localStorage.getItem(TOKEN_KEY); } catch { /* storage blocked */ }
  if (account && token) {
    setAuthToken(token);
    return withDefaults(account);
  }
  return withDefaults(readJSON<User>(GUEST_KEY) || newGuest());
}

function AppInner() {
  const { t, tr } = useLang();
  const route = useRoute();
  const [user, setUser] = useState<User>(loadUser);
  const [authView, setAuthView] = useState<null | 'login' | 'validation' | 'recovery'>(null);
  const [validation, setValidation] = useState({ name: '', email: '' });
  const [modal, setModal] = useState<null | 'settings' | 'prefs' | 'search' | 'admin' | 'library' | 'concert'>(null);
  const [playing, setPlaying] = useState<Video | null>(null);
  const [reward, setReward] = useState<string | null>(null);

  const isGuest = user.id === 'guest';

  // Keep the user wherever their progress lives: this browser for a guest, the
  // server (and a local copy) for an account.
  const save = async (u: User, sync = true) => {
    setUser(u);
    if (u.id === 'guest') { writeJSON(GUEST_KEY, u); return; }
    writeJSON(ACCOUNT_KEY, u);
    if (sync) {
      try { await apiService.updateProgress(u.id, u.stats); } catch (err) { console.error('Failed to sync progress:', err); }
    }
  };

  const handleLogin = (newUser: User, token: string, isNewUser: boolean) => {
    const u = withDefaults(newUser);
    setAuthToken(token);
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage blocked */ }
    writeJSON(ACCOUNT_KEY, u);
    setUser(u);
    setAuthView(null);
    if (isNewUser) setPlaying(VIDEOS[0]);
  };

  const handleLogout = () => {
    setAuthToken(null);
    try { localStorage.removeItem(ACCOUNT_KEY); localStorage.removeItem(TOKEN_KEY); } catch { /* storage blocked */ }
    setUser(withDefaults(readJSON<User>(GUEST_KEY) || newGuest()));
    setModal(null);
    navigate({});
  };

  const handleUpdateUser = (u: User, newToken?: string) => {
    if (newToken) {
      setAuthToken(newToken);
      try { localStorage.setItem(TOKEN_KEY, newToken); } catch { /* storage blocked */ }
    }
    save(withDefaults(u), false);
  };

  const station = stationById(route.station);
  const activity = activityById(station, route.activity);

  // A lesson, an exercise or a quiz reached its station: points and a reward.
  const handleComplete = async (rewardType: string) => {
    let rewardId = '';
    const stats = { ...user.stats };

    // Finishing both fraction exercises unlocks the party at the station.
    if (activity?.id === 'math-fractions-mult' || activity?.id === 'math-fractions-add') {
      const done = new Set(stats.fractionExercisesCompleted || []);
      done.add(activity.id);
      stats.fractionExercisesCompleted = Array.from(done);
      if (stats.fractionExercisesCompleted.length >= 2 && !stats.videosUnlocked.includes('thomas-sharing')) {
        rewardId = 'thomas-sharing';
        stats.videosUnlocked = [...stats.videosUnlocked, 'thomas-sharing'];
      }
    }

    if (activity?.id === 'eng-stories' && rewardType.startsWith('story-')) {
      stats.completedStories = Array.from(new Set([...(stats.completedStories || []), rewardType]));
      rewardId = 'story-unlocked';
    }

    const lockedMusic = MUSIC_LIBRARY.filter(m => !(stats.unlockedMusic || []).includes(m.id));
    if (lockedMusic.length > 0 && Math.random() > 0.5) {
      const m = lockedMusic[Math.floor(Math.random() * lockedMusic.length)];
      stats.unlockedMusic = [...(stats.unlockedMusic || []), m.id];
      if (!rewardId) rewardId = 'music-unlocked';
    }

    if (!rewardId) {
      const lockedVideos = VIDEOS.filter(v => !(stats.videosUnlocked || []).includes(v.id));
      if (rewardType === 'video' && lockedVideos.length > 0) {
        const v = lockedVideos[Math.floor(Math.random() * lockedVideos.length)];
        rewardId = v.id;
        stats.videosUnlocked = [...stats.videosUnlocked, v.id];
      } else {
        const e = ENGINES[Math.floor(Math.random() * ENGINES.length)];
        rewardId = e.id;
        stats.enginesCollected = Array.from(new Set([...stats.enginesCollected, e.id]));
      }
    }

    stats.score += 100;
    stats.completedLessons += 1;
    await save({ ...user, stats });
    setReward(rewardId);
    navigate({ station: station?.id }, { replace: true });
  };

  const setGrade = (g: Grade) => save({ ...user, stats: { ...user.stats, currentGrade: g } });

  const count = (bank: string) => user.stats.preferences?.questionsPerSubject?.[bank] || 10;

  useEffect(() => { setAuthView(null); }, [route.station, route.activity]);

  let main: React.ReactNode;
  if (authView === 'login') {
    main = (
      <LoginView
        onLogin={handleLogin}
        onShowValidation={(name, email) => { setValidation({ name, email }); setAuthView('validation'); }}
        onShowRecovery={() => setAuthView('recovery')}
        onBack={() => setAuthView(null)}
      />
    );
  } else if (authView === 'validation') {
    main = <ValidationView name={validation.name} email={validation.email} onValidated={() => setAuthView('login')} onCancel={() => setAuthView('login')} />;
  } else if (authView === 'recovery') {
    main = <RecoveryView onCancel={() => setAuthView('login')} />;
  } else if (!station) {
    main = (
      <HomeView
        user={user} isGuest={isGuest} onGrade={setGrade} onOpenPrefs={() => setModal('prefs')} onLogin={() => setAuthView('login')}
        onPlay={setPlaying} onOpenLibrary={() => setModal('library')} onOpenConcert={() => setModal('concert')}
      />
    );
  } else if (!activity) {
    main = <StationView station={station} />;
  } else {
    const back = () => navigate({ station: station.id });
    const score = route.score ? MUSIC_LIBRARY.find(m => m.id === route.score) : null;
    main = (
      <>
        <div className="max-w-5xl mx-auto flex flex-wrap items-start justify-between gap-x-4">
          <Crumbs items={[{ label: t('home'), route: {} }, { label: tr(station.title), route: { station: station.id } }, { label: score ? score.title : tr(activity.title) }]} />
          {activity.kind !== 'quiz' && !activity.practice && <span className="mb-4"><EnOnly enOnly={activity.enOnly} /></span>}
        </div>
        {activity.kind === 'quiz' ? (
          <React.Fragment key={activity.id}>
            <QuizView station={station} activity={activity} grade={user.stats.currentGrade}
              questionsCount={count(station.bank)} onComplete={handleComplete} onCancel={back} />
          </React.Fragment>
        ) : activity.practice ? (
          <React.Fragment key={activity.id}>
            <SkillExercise station={station} activity={activity} grade={user.stats.currentGrade}
              questionsCount={count(station.bank)} onComplete={handleComplete} onBack={back} />
          </React.Fragment>
        ) : (
          <div lang={activity.enOnly ? 'en' : undefined} key={activity.id + (route.score || '')}>
            <ActivityView
              station={station} activity={activity} grade={user.stats.currentGrade}
              questionsCount={count(station.bank)} completedStories={user.stats.completedStories || []} score={score}
              onComplete={handleComplete} onBack={back}
              onNext={() => activity.next && navigate({ station: station.id, activity: activity.next })}
            />
          </div>
        )}
      </>
    );
  }

  const wide = activity?.component === 'Piano' || activity?.component === 'PianoSequence';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        stats={user.stats}
        userName={isGuest ? t('guest_name') : user.name}
        isGuest={isGuest}
        isAdmin={user.isAdmin}
        onLogout={handleLogout}
        onLogin={() => { setModal(null); setAuthView('login'); window.scrollTo({ top: 0 }); }}
        onOpenSettings={() => setModal('settings')}
        onOpenAdmin={() => setModal('admin')}
        onOpenSearch={() => setModal('search')}
      />

      <main className={`${wide ? 'max-w-[98vw]' : 'max-w-6xl'} w-full mx-auto px-3 md:px-6 py-5 md:py-8 flex-1`}>
        {main}
      </main>

      <Footer />

      <AnimatePresence>
        {modal === 'settings' && (
          <SettingsModal user={user} onClose={() => setModal(null)} onUpdateUser={handleUpdateUser} onLogout={handleLogout}
            onLogin={() => { setModal(null); setAuthView('login'); }} />
        )}
        {modal === 'prefs' && <PreferencesModal user={user} onClose={() => setModal(null)} onUpdateUser={u => save(u, false)} />}
        {modal === 'search' && <SearchModal onClose={() => setModal(null)} />}
        {modal === 'admin' && <AdminModal adminId={user.id} onClose={() => setModal(null)} />}
        {modal === 'library' && <LibraryModal stories={STORIES.filter(s => (user.stats.completedStories || []).includes(s.id))} onClose={() => setModal(null)} />}
        {modal === 'concert' && <ConcertModal user={user} onClose={() => setModal(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {reward && <RewardModal reward={reward} onClose={() => setReward(null)} onWatch={setPlaying} />}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
