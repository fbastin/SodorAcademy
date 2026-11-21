import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Settings, User as UserIcon, Lock, Download, Trash2, LogOut, LogIn, Shield, CheckCircle, BookOpen, Music, PlayCircle, X, Volume2, Gauge } from 'lucide-react';
import Modal from '../components/Modal';
import { apiService, User } from '../services/apiService';
import { speak } from '../services/speechService';
import { useLang } from '../i18n';
import { STATIONS } from '../content/stations';
import { hrefFor } from '../router';
import { ENGINES, VIDEOS, Video, Story } from '../types';
import { MUSIC_LIBRARY } from '../services/musicData';
import { Engine, EnOnly, StationBadge } from '../components/ui';

const Title = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <h2 className="text-2xl sm:text-3xl font-extrabold mb-5 flex items-center gap-3 shrink-0 pr-12">{icon}{children}</h2>
);

const Box = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <section className="rounded-2xl border-[2.5px] border-ink/15 bg-sky/50 p-4 sm:p-5">
    <h3 className="font-extrabold mb-3 flex items-center gap-2">{icon}{title}</h3>
    {children}
  </section>
);

const smallInput = 'flex-1 min-w-0 px-3.5 py-2.5 bg-white rounded-xl border-[2.5px] border-ink font-semibold outline-none';

// ---------- Settings ----------

const SET = {
  en: {
    title: 'Settings', guest_title: 'Exploring without an account',
    guest_text: 'Your progress is kept in this browser. With an account, it is kept on the server and follows you on every device.',
    login: 'Log in or create an account', name: 'Name', new_name: 'New name', update: 'Change',
    pin: 'PIN', new_pin: 'New PIN or password', backup: 'Backup',
    backup_text: 'Save your progress, engines and videos in a file, to restore them later or on another device.',
    export: 'Save my progress', del: 'Delete the account', del_text: 'This removes all the progress for good.',
    confirm: 'Yes, delete it', del_warn: 'Save your progress first if you may want it back!',
    name_ok: 'Name changed!', pin_ok: 'PIN changed!', del_fail: 'The account could not be deleted.', logout: 'Log out',
  },
  fr: {
    title: 'Réglages', guest_title: 'Tu explores sans compte',
    guest_text: 'Ta progression est gardée dans ce navigateur. Avec un compte, elle est gardée sur le serveur et te suit sur tous tes appareils.',
    login: 'Se connecter ou créer un compte', name: 'Prénom', new_name: 'Nouveau prénom', update: 'Changer',
    pin: 'Code d’accès', new_pin: 'Nouveau code ou mot de passe', backup: 'Sauvegarde',
    backup_text: 'Enregistre ta progression, tes locomotives et tes vidéos dans un fichier, pour les restaurer plus tard ou sur un autre appareil.',
    export: 'Enregistrer ma progression', del: 'Supprimer le compte', del_text: 'Toute la progression sera effacée pour de bon.',
    confirm: 'Oui, supprimer', del_warn: 'Enregistre d’abord ta progression si tu veux pouvoir la retrouver !',
    name_ok: 'Prénom changé !', pin_ok: 'Code changé !', del_fail: 'Le compte n’a pas pu être supprimé.', logout: 'Se déconnecter',
  },
};

export function SettingsModal({ user, onClose, onUpdateUser, onLogout, onLogin }: {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User, newToken?: string) => void;
  onLogout: () => void;
  onLogin: () => void;
}) {
  const { lang } = useLang();
  const s = SET[lang];
  const [newPin, setNewPin] = useState('');
  const [newName, setNewName] = useState(user.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', ok: true });

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try { await fn(); } catch (err: any) { setMessage({ text: err.message, ok: false }); } finally { setLoading(false); }
  };

  const changeName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || newName === user.name) return;
    run(async () => {
      await apiService.changeName(user.id, newName);
      onUpdateUser({ ...user, name: newName });
      setMessage({ text: s.name_ok, ok: true });
    });
  };

  // The server gives the account a new token when its PIN changes: log in again
  // with the new PIN to get it, so the progress keeps being saved.
  const changePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin) return;
    run(async () => {
      await apiService.changePin(user.id, newPin);
      const fresh = await apiService.login(user.name, newPin);
      onUpdateUser({ ...user, ...fresh }, fresh.token);
      setNewPin('');
      setMessage({ text: s.pin_ok, ok: true });
    });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ ...user, pin: '1234' }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sodor_academy_${user.name.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const remove = () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    run(async () => {
      try { await apiService.deleteAccount(user.id); onLogout(); }
      catch { setMessage({ text: s.del_fail, ok: false }); setConfirmDelete(false); }
    });
  };

  return (
    <Modal title={s.title} onClose={onClose} className="max-w-lg">
      <Title icon={<Settings />}>{s.title}</Title>
      <div className="space-y-4 overflow-y-auto flex-1 pr-1">
        {user.id === 'guest' ? (
          <div className="note-paper text-center">
            <h3 className="font-extrabold text-xl mb-1">{s.guest_title}</h3>
            <p className="mb-4">{s.guest_text}</p>
            <button onClick={onLogin} className="chunky blue"><LogIn size={18} /> {s.login}</button>
          </div>
        ) : (
          <>
            <Box title={s.name} icon={<UserIcon size={18} />}>
              <form onSubmit={changeName} className="flex gap-2">
                <input className={smallInput} placeholder={s.new_name} aria-label={s.new_name} value={newName} onChange={e => setNewName(e.target.value)} required />
                <button type="submit" disabled={loading || newName === user.name} className="chunky blue">{s.update}</button>
              </form>
            </Box>
            <Box title={s.pin} icon={<Lock size={18} />}>
              <form onSubmit={changePin} className="flex gap-2">
                <input type="password" className={smallInput} placeholder={s.new_pin} aria-label={s.new_pin} value={newPin} onChange={e => setNewPin(e.target.value)} required autoComplete="new-password" />
                <button type="submit" disabled={loading} className="chunky blue">{s.update}</button>
              </form>
            </Box>
            <Box title={s.backup} icon={<Download size={18} />}>
              <p className="text-sm text-ink/70 mb-3">{s.backup_text}</p>
              <button onClick={exportData} className="chunky w-full"><Download size={17} /> {s.export}</button>
            </Box>
            <section className="pt-2 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-bad flex items-center gap-2"><Trash2 size={18} /> {s.del}</h3>
                <p className="text-xs text-ink/60">{s.del_text}</p>
              </div>
              <button onClick={remove} disabled={loading} className={`chunky shrink-0 ${confirmDelete ? 'bg-bad! text-white!' : ''}`}>
                {confirmDelete ? s.confirm : s.del}
              </button>
            </section>
            {confirmDelete && <p className="text-xs text-bad font-bold text-center">{s.del_warn}</p>}
          </>
        )}
        {message.text && <p role="status" className={`text-center font-bold text-sm ${message.ok ? 'text-good' : 'text-bad'}`}>{message.text}</p>}
        {user.id !== 'guest' && (
          <button onClick={onLogout} className="chunky w-full"><LogOut size={18} /> {s.logout}</button>
        )}
      </div>
    </Modal>
  );
}

// ---------- Quiz length ----------

export function PreferencesModal({ user, onClose, onUpdateUser }: {
  user: User;
  onClose: () => void;
  onUpdateUser: (updatedUser: User) => void;
}) {
  const { t, tr } = useLang();
  const counts = user.stats.preferences?.questionsPerSubject || {};
  const stations = STATIONS.filter(s => s.activities.some(a => a.kind !== 'lesson'));

  const update = async (bank: string, count: number) => {
    const updated = {
      ...user,
      stats: { ...user.stats, preferences: { ...user.stats.preferences, questionsPerSubject: { ...counts, [bank]: count } } },
    };
    onUpdateUser(updated);
    if (user.id !== 'guest') {
      try { await apiService.updateProgress(user.id, updated.stats); } catch (err) { console.error('Failed to sync settings:', err); }
    }
  };

  return (
    <Modal title={t('prefs_title')} onClose={onClose} className="max-w-lg">
      <Title icon={<Gauge />}>{t('prefs_title')}</Title>
      <p className="text-ink/70 mb-4">{t('prefs_intro')}</p>
      <div className="space-y-2.5 overflow-y-auto flex-1 pr-1">
        {stations.map(st => {
          const count = counts[st.bank] ?? 10;
          return (
            <label key={st.id} className="flex items-center gap-3 bg-white rounded-xl border-[2.5px] border-ink/15 p-3">
              <StationBadge station={st} size={34} />
              <span className="font-bold flex-1 min-w-0 truncate">{tr(st.title)}</span>
              <input type="range" min={3} max={30} value={count} onChange={e => update(st.bank, parseInt(e.target.value, 10))}
                className="w-28 sm:w-36" style={{ accentColor: st.color }} aria-label={tr(st.title)} />
              <span className="w-10 text-center font-extrabold tabular-nums">{count}</span>
            </label>
          );
        })}
      </div>
      <p className="mt-4 text-sm text-ink/55">{t('prefs_saved')}</p>
    </Modal>
  );
}

// ---------- Search ----------

export function SearchModal({ onClose }: { onClose: () => void }) {
  const { t, tr } = useLang();
  const [q, setQ] = useState('');
  const [only, setOnly] = useState<string | null>(null);

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const all = STATIONS.flatMap(st => st.activities.map(a => ({ st, a })));
  const found = all.filter(({ st, a }) => {
    if (only && st.id !== only) return false;
    const hay = norm([tr(a.title), tr(a.desc), tr(st.title), tr(st.place)].join(' '));
    return norm(q).split(/\s+/).every(w => hay.includes(w));
  });
  const tag = (k: string) => k === 'lesson' ? t('lesson_tag') : k === 'quiz' ? t('quiz_tag') : t('exercise_tag');

  return (
    <Modal title={t('topics')} onClose={onClose} className="max-w-2xl">
      <Title icon={<Search />}>{t('topics')}</Title>
      <div className="space-y-3 mb-4 shrink-0">
        <input
          autoFocus type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t('search_placeholder')} aria-label={t('search_placeholder')}
          className="w-full px-4 py-3 bg-white rounded-xl border-[2.5px] border-ink font-semibold outline-none"
        />
        <div className="flex gap-2 overflow-x-auto pb-1" role="group">
          <button onClick={() => setOnly(null)} aria-pressed={!only} className="chunky text-sm py-1! whitespace-nowrap">{t('all_topics')}</button>
          {STATIONS.filter(st => st.activities.length).map(st => (
            <button key={st.id} onClick={() => setOnly(st.id)} aria-pressed={only === st.id} className="chunky text-sm py-1! whitespace-nowrap">{tr(st.title)}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
        {found.map(({ st, a }) => (
          <a key={a.id} href={hrefFor({ station: st.id, activity: a.id })} onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-xl border-[2.5px] border-ink/15 bg-white hover:border-ink no-underline text-ink">
            <StationBadge station={st} size={38} />
            <span className="min-w-0">
              <span className="flex flex-wrap items-center gap-1.5 mb-0.5">
                <span className="chip text-[0.7rem]!" style={{ background: st.color, color: '#fff' }}>{tag(a.kind)}</span>
                <span className="font-extrabold">{tr(a.title)}</span>
                <EnOnly enOnly={a.enOnly} />
              </span>
              <span className="block text-sm text-ink/65 truncate">{tr(a.desc)}</span>
            </span>
          </a>
        ))}
        {found.length === 0 && <p className="py-12 text-center text-ink/50 font-bold">{t('nothing_found')}</p>}
      </div>
    </Modal>
  );
}

// ---------- Admin ----------

export function AdminModal({ adminId, onClose }: { adminId: string; onClose: () => void }) {
  const { lang } = useLang();
  const fr = lang === 'fr';
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiService.getAdminUsers(adminId).then(setUsers).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [adminId]);

  const del = async (u: User) => {
    if (!confirm(fr ? `Supprimer « ${u.name} » ? C’est définitif.` : `Delete "${u.name}"? This cannot be undone.`)) return;
    try { await apiService.deleteUserAsAdmin(adminId, u.id); setUsers(prev => prev.filter(x => x.id !== u.id)); } catch (err: any) { alert(err.message); }
  };
  const validate = async (u: User) => {
    if (!confirm(fr ? `Valider « ${u.name} » à la main ?` : `Validate "${u.name}" by hand?`)) return;
    try { await apiService.validateUserAsAdmin(adminId, u.id); setUsers(prev => prev.map(x => x.id === u.id ? { ...x, isActive: true } : x)); } catch (err: any) { alert(err.message); }
  };

  return (
    <Modal title={fr ? 'Administration' : 'Admin panel'} onClose={onClose} className="max-w-4xl">
      <Title icon={<Shield />}>{fr ? 'Administration' : 'Admin panel'}</Title>
      {loading ? (
        <div className="py-16 flex justify-center"><Engine size={64} className="animate-bounce" /></div>
      ) : error ? (
        <p className="note-paper font-bold text-bad text-center">{error}</p>
      ) : (
        <div className="overflow-auto flex-1">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white">
              <tr className="label-caps border-b-2 border-ink/15">
                <th className="pb-3 pl-2">{fr ? 'Élève' : 'Student'}</th>
                <th className="pb-3">{fr ? 'Courriel' : 'Email'}</th>
                <th className="pb-3 text-center">{fr ? 'Points' : 'Score'}</th>
                <th className="pb-3 text-center">{fr ? 'État' : 'Status'}</th>
                <th className="pb-3 text-right pr-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-ink/10">
                  <td className="py-3 pl-2 font-bold">{u.name} {u.isAdmin && <span className="chip text-[0.65rem]! ml-1">admin</span>}</td>
                  <td className="py-3 text-sm text-ink/65">{u.email || '—'}</td>
                  <td className="py-3 text-center font-extrabold">{u.stats.score}</td>
                  <td className="py-3 text-center">
                    <span className={`chip text-[0.7rem]! ${u.isActive ? 'bg-mint!' : 'bg-rose!'}`}>{u.isActive ? (fr ? 'actif' : 'active') : (fr ? 'en attente' : 'pending')}</span>
                  </td>
                  <td className="py-3 pr-2">
                    {!u.isAdmin && (
                      <span className="flex justify-end gap-1.5">
                        {!u.isActive && <button onClick={() => validate(u)} className="chunky p-0! w-9 h-9" title={fr ? 'Valider' : 'Validate'}><CheckCircle size={17} /></button>}
                        <button onClick={() => del(u)} className="chunky p-0! w-9 h-9" title={fr ? 'Supprimer' : 'Delete'}><Trash2 size={17} /></button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

// ---------- Video ----------

export function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  const { t, tr } = useLang();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[150] flex items-center justify-center bg-ink/90 p-4 md:p-8">
      <div role="dialog" aria-modal="true" aria-label={tr(video.title)} onClick={e => e.stopPropagation()}
        className="relative max-w-5xl w-full aspect-video bg-black rounded-[20px] overflow-hidden border-[3px] border-white/80">
        <button onClick={onClose} aria-label={t('close')} title={t('close')} className="chunky p-0! w-10 h-10 absolute top-3 right-3 z-10">
          <X size={20} />
        </button>
        <video src={`/SodorAcademy/media/${video.filename}`} poster={`/SodorAcademy/media/${video.poster}`} controls autoPlay className="w-full h-full" />
      </div>
    </motion.div>
  );
}

// ---------- Library ----------

export function LibraryModal({ stories, onClose }: { stories: Story[]; onClose: () => void }) {
  const { t } = useLang();
  const [open, setOpen] = useState<Story | null>(null);
  return (
    <Modal title={t('library')} onClose={onClose} className="max-w-4xl">
      <Title icon={<BookOpen className="text-[#e23b2e]" />}>{open ? open.title : t('library')} <EnOnly enOnly /></Title>
      <div className="flex-1 overflow-y-auto pr-1">
        {open ? (
          <article lang="en">
            <div className="flex flex-wrap gap-2 mb-5">
              <button onClick={() => setOpen(null)} className="chunky text-sm">{t('all_stories')}</button>
              <button onClick={() => speak(open.content, 'en')} className="chunky text-sm"><Volume2 size={16} /> {t('read_aloud')}</button>
            </div>
            <div className="text-6xl mb-5" aria-hidden="true">{open.thumbnail}</div>
            <p className="text-lg leading-relaxed whitespace-pre-line">{open.content}</p>
          </article>
        ) : stories.length === 0 ? (
          <div className="py-14 text-center text-ink/55">
            <BookOpen size={44} className="mx-auto mb-3 opacity-30" />
            <p className="font-bold">{t('no_stories')}</p>
            <p className="text-sm mt-1">{t('no_stories_hint')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map(story => (
              <button key={story.id} onClick={() => setOpen(story)} className="card-ink p-5 text-left">
                <span className="flex items-center gap-3 mb-2">
                  <span className="w-12 h-12 rounded-xl bg-rose border-2 border-ink flex items-center justify-center text-2xl shrink-0" aria-hidden="true">{story.thumbnail}</span>
                  <span className="text-lg font-extrabold leading-tight" lang="en">{story.title}</span>
                </span>
                <span className="block text-sm text-ink/70 line-clamp-3" lang="en">{story.content}</span>
                <span className="block mt-2 text-sm font-extrabold text-[#e23b2e]">{t('read_story')}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}

// ---------- Concert Hall ----------

export function ConcertModal({ user, onClose }: { user: User; onClose: () => void }) {
  const { t } = useLang();
  return (
    <Modal title={t('concert')} onClose={onClose} className="max-w-4xl">
      <Title icon={<Music className="text-[#c2368a]" />}>{t('concert')}</Title>
      <p className="text-ink/70 mb-5">{t('concert_intro')}</p>
      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
        {MUSIC_LIBRARY.map(score => {
          const ok = (user.stats.unlockedMusic || []).includes(score.id);
          return ok ? (
            <a key={score.id} href={hrefFor({ score: score.id })} onClick={onClose} className="card-ink p-5 text-center no-underline text-ink">
              <span className="block text-5xl mb-3" aria-hidden="true">{score.thumbnail}</span>
              <span className="block text-lg font-extrabold">{score.title}</span>
              <span className="label-caps">{t('ready')}</span>
            </a>
          ) : (
            <div key={score.id} className="rounded-[20px] border-[3px] border-dashed border-ink/25 p-5 text-center text-ink/45">
              <Lock size={36} className="mx-auto mb-3" />
              <span className="block text-lg font-extrabold">{t('locked_melody')}</span>
              <span className="text-sm">{t('keep_learning')}</span>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}

// ---------- Reward ----------

export function RewardModal({ reward, onClose, onWatch }: { reward: string; onClose: () => void; onWatch: (v: Video) => void }) {
  const { t, tr } = useLang();
  const video = VIDEOS.find(v => v.id === reward);
  const engine = ENGINES.find(e => e.id === reward);

  let body: React.ReactNode;
  if (reward === 'story-unlocked') {
    body = <><BookOpen size={52} className="mx-auto mb-2 text-[#e23b2e]" /><h3 className="text-xl font-extrabold">{t('story_unlocked')}</h3><p className="label-caps">{t('see_library')}</p></>;
  } else if (reward === 'music-unlocked') {
    body = <><Music size={52} className="mx-auto mb-2 text-[#c2368a]" /><h3 className="text-xl font-extrabold">{t('melody_unlocked')}</h3><p className="label-caps">{t('see_concert')}</p></>;
  } else if (video) {
    body = <><img src={`/SodorAcademy/media/${video.poster}`} alt="" className="w-full rounded-xl border-[2.5px] border-ink mb-3" /><h3 className="text-xl font-extrabold">{tr(video.title)}</h3><p className="label-caps">{t('new_video')}</p></>;
  } else {
    body = <><Engine size={110} color={engine?.color} number={engine?.number} className="mx-auto mb-2" /><h3 className="text-xl font-extrabold">{engine?.name}</h3><p className="label-caps">{t('new_engine')}</p></>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/55 p-6">
      <motion.div role="dialog" aria-modal="true" aria-label={t('reward_title')} initial={{ scale: 0.6, y: 40 }} animate={{ scale: 1, y: 0 }}
        className="card-ink p-7 sm:p-9 max-w-sm w-full text-center">
        <div className="sticker-title text-3xl mb-3" style={{ ['--bar' as any]: '#1c7a55' }}>{t('reward_title')}</div>
        <p className="text-ink/70 mb-5">{t('reward_text')}</p>
        <div className="note-paper mb-6">{body}</div>
        <button onClick={() => { onClose(); if (video) onWatch(video); }} className="chunky go big w-full">
          {video ? <><PlayCircle size={20} /> {t('watch_now')}</> : t('add_collection')}
        </button>
      </motion.div>
    </motion.div>
  );
}
