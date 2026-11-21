import React from 'react';
import { BookOpen, PenLine, Trophy, ArrowRight, ExternalLink } from 'lucide-react';
import { useLang } from '../i18n';
import { Station, Activity, ActivityKind } from '../content/stations';
import { hrefFor } from '../router';
import { Crumbs, EnOnly, SiteCard, StationBadge, SectionTitle } from '../components/ui';

const KIND_ICON: Record<ActivityKind, React.ReactNode> = {
  lesson: <BookOpen size={20} />,
  exercise: <PenLine size={20} />,
  quiz: <Trophy size={20} />,
};

function ActivityCard({ station, activity }: { station: Station; activity: Activity }) {
  const { tr } = useLang();
  return (
    <a href={hrefFor({ station: station.id, activity: activity.id })} className="card-ink p-4 sm:p-5 flex items-start gap-3.5 no-underline text-ink group">
      <span className="w-11 h-11 rounded-xl border-[2.5px] border-ink flex items-center justify-center shrink-0"
        style={{ background: activity.kind === 'lesson' ? '#fff3b0' : activity.kind === 'quiz' ? '#ffd23f' : '#e7eef7' }}>
        {KIND_ICON[activity.kind]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-extrabold text-[1.1rem] leading-snug flex flex-wrap items-center gap-x-2 gap-y-1">
          {tr(activity.title)} <EnOnly enOnly={activity.enOnly} />
        </span>
        <span className="block text-[0.95rem] text-ink/70 leading-snug mt-0.5">{tr(activity.desc)}</span>
      </span>
      <ArrowRight size={20} className="shrink-0 mt-1 text-ink/35 group-hover:text-ink transition-colors" aria-hidden="true" />
    </a>
  );
}

export default function StationView({ station }: { station: Station }) {
  const { t, tr } = useLang();
  const groups: { kind: ActivityKind; title: string }[] = [
    { kind: 'lesson', title: t('lessons') },
    { kind: 'exercise', title: t('exercises') },
    { kind: 'quiz', title: t('quiz') },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <Crumbs items={[{ label: t('home'), route: {} }, { label: tr(station.title) }]} />

      <header className="flex items-start gap-4 mb-2">
        <StationBadge station={station} size={64} />
        <div className="min-w-0">
          <h1 className="sticker-title text-3xl sm:text-4xl" style={{ ['--bar' as any]: station.color }}>{tr(station.title)}</h1>
          <p className="mt-3 mb-0 font-bold text-ink/70">{tr(station.place)}</p>
          <p className="m-0 text-[1.05rem] text-ink/80">{tr(station.desc)}</p>
        </div>
      </header>

      {groups.map(g => {
        const items = station.activities.filter(a => a.kind === g.kind);
        if (!items.length) return null;
        return (
          <section key={g.kind} aria-labelledby={`sec-${g.kind}`} className="mt-9">
            <SectionTitle id={`sec-${g.kind}`}>{g.title}</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              {items.map(a => <React.Fragment key={a.id}><ActivityCard station={station} activity={a} /></React.Fragment>)}
            </div>
          </section>
        );
      })}

      {station.links.length > 0 && (
        <section aria-labelledby="sec-site" className="mt-9">
          <SectionTitle id="sec-site"><ExternalLink size={24} aria-hidden="true" /> {t('on_site')}</SectionTitle>
          <p className="-mt-2 mb-4 text-ink/70">{t('on_site_intro')}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {station.links.map(l => <React.Fragment key={l.href}><SiteCard link={l} /></React.Fragment>)}
          </div>
        </section>
      )}

      <a href="#/" className="mt-12 mx-auto block w-fit font-bold text-ink/65 hover:text-ink no-underline">{t('all_stations')}</a>
    </div>
  );
}
