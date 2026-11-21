import React from 'react';
import { Search, Settings, LogOut, LogIn, Shield, Star } from 'lucide-react';
import { useLang } from '../i18n';
import { UserStats } from '../types';
import { Engine } from './ui';

export default function Navbar({ stats, userName, isGuest, isAdmin, onLogout, onLogin, onOpenSettings, onOpenAdmin, onOpenSearch }: {
  stats: UserStats;
  userName: string;
  isGuest: boolean;
  isAdmin?: boolean;
  onLogout: () => void;
  onLogin: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenSearch: () => void;
}) {
  const { lang, setLang, t } = useLang();
  const iconBtn = 'chunky p-0! w-10 h-10 shrink-0';

  return (
    <header className="sticky top-0 z-50 bg-sky/95 backdrop-blur border-b-[3px] border-ink">
      <nav className="max-w-6xl mx-auto h-16 px-3 md:px-6 flex items-center gap-2 sm:gap-3">
        <a href="#/" className="flex items-center gap-2 shrink-0 no-underline text-ink" title={t('home')}>
          <span className="w-11 h-11 rounded-xl bg-white border-[2.5px] border-ink shadow-[0_3px_0_#17233d] flex items-center justify-center">
            <Engine size={34} number="1" />
          </span>
          <span className="font-extrabold text-xl tracking-tight hidden lg:inline">Sodor Academy</span>
        </a>

        <button onClick={onOpenSearch} className="chunky flex-1 max-w-xs justify-start! font-semibold! text-ink/70 min-w-0" title={t('search')}>
          <Search size={17} className="shrink-0" aria-hidden="true" />
          <span className="truncate"><span className="sm:hidden">{t('search_short')}</span><span className="hidden sm:inline">{t('search')}</span></span>
        </button>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <span className="chip text-sm! py-0.5! bg-note! hidden sm:inline-flex" title={t('points')}>
            <Star size={15} className="fill-[#ffb703] text-ink" aria-hidden="true" /> {stats.score}
          </span>
          <span className="chip text-sm! py-0.5! hidden md:inline-flex max-w-[11rem]" title={userName}>
            <span className="truncate">{userName}</span>
          </span>

          <button
            onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
            className={`${iconBtn} w-12! text-[0.95rem]`}
            aria-label={t('lang_label')}
            title={t('lang_label')}
          >
            {t('lang_btn')}
          </button>

          {isAdmin && (
            <button onClick={onOpenAdmin} className={iconBtn} title={t('admin')} aria-label={t('admin')}>
              <Shield size={19} />
            </button>
          )}
          <button onClick={onOpenSettings} className={iconBtn} title={t('settings')} aria-label={t('settings')}>
            <Settings size={19} />
          </button>
          {isGuest ? (
            <button onClick={onLogin} className="chunky go h-10 shrink-0" title={t('login')}>
              <LogIn size={18} aria-hidden="true" /><span className="hidden sm:inline">{t('login')}</span>
            </button>
          ) : (
            <button onClick={onLogout} className={iconBtn} title={t('logout')} aria-label={t('logout')}>
              <LogOut size={19} />
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
