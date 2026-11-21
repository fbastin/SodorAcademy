import React from 'react';
import { BookOpen, Music, PlayCircle, Lock, Gauge, LogIn, ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';
import { User } from '../services/apiService';
import { Grade, VIDEOS, ENGINES, Video } from '../types';
import { STORIES } from '../services/storyData';
import { MUSIC_LIBRARY } from '../services/musicData';
import { STATIONS } from '../content/stations';
import { hrefFor } from '../router';
import SodorMap from '../components/SodorMap';
import { Engine, StationBadge, SectionTitle, BackToKids } from '../components/ui';

const Count = ({ a, b }: { a: number; b: number }) => {
  const { t } = useLang();
  return <span className="chip text-sm!" title={t('unlocked_of', a, b)}>{a}/{b}</span>;
};

export default function HomeView({ user, isGuest, onGrade, onOpenPrefs, onLogin, onPlay, onOpenLibrary, onOpenConcert }: {
  user: User;
  isGuest: boolean;
  onGrade: (g: Grade) => void;
  onOpenPrefs: () => void;
  onLogin: () => void;
  onPlay: (v: Video) => void;
  onOpenLibrary: () => void;
  onOpenConcert: () => void;
}) {
  const { t, tr } = useLang();
  const st = user.stats;
  const videos = VIDEOS.filter(v => (st.videosUnlocked || []).includes(v.id)).length;
  const stories = STORIES.filter(s => (st.completedStories || []).includes(s.id)).length;
  const melodies = MUSIC_LIBRARY.filter(m => (st.unlockedMusic || []).includes(m.id)).length;
  const engines = ENGINES.filter(e => st.enginesCollected.includes(e.id)).length;

  return (
    <div>
      <BackToKids className="inline-block mb-3" />

      <header className="text-center mb-7">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-2">
          {isGuest ? t('welcome_guest') : t('welcome_back', user.name)}
        </h1>
        <p className="text-[1.05rem] sm:text-lg text-ink/75 max-w-2xl mx-auto mb-5">{t('pick_station')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="flex items-center gap-2" role="group" aria-label={t('level')}>
            <span className="label-caps">{t('level')}</span>
            {(['Primary', 'Secondary'] as Grade[]).map(g => (
              <button key={g} onClick={() => onGrade(g)} aria-pressed={st.currentGrade === g} className="chunky">
                {g === 'Primary' ? t('primary') : t('secondary')}
              </button>
            ))}
          </div>
          <button onClick={onOpenPrefs} className="chunky"><Gauge size={18} aria-hidden="true" /> {t('lesson_length')}</button>
        </div>
      </header>

      {isGuest && (
        <div className="note-paper max-w-2xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 flex-1 min-w-[14rem]">{t('guest_note')}</p>
          <button onClick={onLogin} className="chunky text-sm"><LogIn size={16} aria-hidden="true" /> {t('login')}</button>
        </div>
      )}

      <div className="hidden sm:block mb-10">
        <SodorMap />
      </div>

      <section aria-labelledby="stations-title">
        <SectionTitle id="stations-title">{t('stations')}</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STATIONS.map(s => {
            const n = s.activities.length;
            return (
              <a key={s.id} href={hrefFor({ station: s.id })} className="card-ink p-4 flex items-center gap-3.5 no-underline text-ink group">
                <StationBadge station={s} size={54} />
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold text-lg leading-tight">{tr(s.title)}</span>
                  <span className="block text-sm text-ink/65 truncate">{tr(s.place)}</span>
                  <span className="block text-[0.78rem] font-bold text-ink/50 mt-0.5">
                    {[n ? t('activities_n', n) : '', s.links.length ? t('site_pages_n', s.links.length) : ''].filter(Boolean).join(' · ')}
                  </span>
                </span>
                <ArrowRight size={20} className="shrink-0 text-ink/35 group-hover:text-ink transition-colors" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="cinema-title">
        <SectionTitle id="cinema-title"><PlayCircle size={26} aria-hidden="true" /> {t('cinema')} <Count a={videos} b={VIDEOS.length} /></SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VIDEOS.map(v => {
            const ok = (st.videosUnlocked || []).includes(v.id);
            return ok ? (
              <button key={v.id} onClick={() => onPlay(v)} className="card-ink overflow-hidden text-left group">
                <span className="relative block">
                  <img src={`/SodorAcademy/media/${v.poster}`} alt="" loading="lazy" className="block w-full aspect-video object-cover border-b-[3px] border-ink" />
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-sticker border-[2.5px] border-ink flex items-center justify-center shadow-[0_3px_0_#17233d] group-hover:scale-110 transition-transform">
                      <PlayCircle size={30} />
                    </span>
                  </span>
                </span>
                <span className="block p-3.5">
                  <span className="block font-extrabold leading-tight">{tr(v.title)}</span>
                  <span className="block text-sm text-ink/65">{tr(v.description)}</span>
                </span>
              </button>
            ) : (
              <div key={v.id} className="rounded-[20px] border-[3px] border-dashed border-ink/25 overflow-hidden text-ink/45">
                <span className="relative block">
                  <img src={`/SodorAcademy/media/${v.poster}`} alt="" loading="lazy" className="block w-full aspect-video object-cover grayscale opacity-30 blur-[2px]" />
                  <Lock size={30} className="absolute inset-0 m-auto" />
                </span>
                <span className="block p-3.5">
                  <span className="block font-extrabold leading-tight">{tr(v.title)}</span>
                  <span className="block text-sm">{t('locked_video')}</span>
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-12 grid lg:grid-cols-2 gap-12 lg:gap-8">
        <section aria-labelledby="library-title">
          <SectionTitle id="library-title" action={<button onClick={onOpenLibrary} className="chunky text-sm">{t('open')}</button>}>
            <BookOpen size={26} className="text-[#e23b2e]" aria-hidden="true" /> {t('library')} <Count a={stories} b={STORIES.length} />
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STORIES.slice(0, 4).map(story => {
              const ok = (st.completedStories || []).includes(story.id);
              return (
                <button key={story.id} onClick={onOpenLibrary}
                  className={ok ? 'card-ink p-3 min-h-[7rem] flex flex-col items-center justify-center text-center' : 'rounded-[20px] border-[3px] border-dashed border-ink/25 p-3 min-h-[7rem] flex flex-col items-center justify-center text-center text-ink/45'}>
                  {ok ? <span className="text-3xl mb-1" aria-hidden="true">{story.thumbnail}</span> : <Lock size={24} className="mb-1" />}
                  <span className="font-bold text-sm leading-tight" lang={ok ? 'en' : undefined}>{ok ? story.title : t('locked_story')}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="concert-title">
          <SectionTitle id="concert-title" action={<button onClick={onOpenConcert} className="chunky text-sm">{t('open')}</button>}>
            <Music size={26} className="text-[#c2368a]" aria-hidden="true" /> {t('concert')} <Count a={melodies} b={MUSIC_LIBRARY.length} />
          </SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MUSIC_LIBRARY.slice(0, 4).map(score => {
              const ok = (st.unlockedMusic || []).includes(score.id);
              return ok ? (
                <a key={score.id} href={hrefFor({ score: score.id })} className="card-ink p-3 min-h-[7rem] flex flex-col items-center justify-center text-center no-underline text-ink">
                  <span className="text-3xl mb-1" aria-hidden="true">{score.thumbnail}</span>
                  <span className="font-bold text-sm leading-tight">{score.title}</span>
                </a>
              ) : (
                <button key={score.id} onClick={onOpenConcert} className="rounded-[20px] border-[3px] border-dashed border-ink/25 p-3 min-h-[7rem] flex flex-col items-center justify-center text-center text-ink/45">
                  <Lock size={24} className="mb-1" />
                  <span className="font-bold text-sm leading-tight">{t('locked_melody')}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <section className="mt-12" aria-labelledby="roundhouse-title">
        <SectionTitle id="roundhouse-title">{t('roundhouse')} <Count a={engines} b={ENGINES.length} /></SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {ENGINES.map(e => {
            const ok = st.enginesCollected.includes(e.id);
            return (
              <div key={e.id} title={ok ? tr(e.description) : t('collect_hint')}
                className={ok ? 'card-ink p-4 flex flex-col items-center text-center' : 'rounded-[20px] border-[3px] border-dashed border-ink/25 p-4 flex flex-col items-center text-center'}>
                <Engine size={80} color={ok ? e.color : '#9aa5b8'} number={e.number} className={ok ? '' : 'opacity-40'} />
                <span className={`mt-2 font-extrabold ${ok ? '' : 'text-ink/45'}`}>{e.name}</span>
                <span className={`label-caps text-[0.7rem]! ${ok ? 'text-good!' : ''}`}>{ok ? t('collected') : t('locked')}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
