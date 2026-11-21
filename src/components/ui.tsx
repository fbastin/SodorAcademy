import React from 'react';
import { ExternalLink } from 'lucide-react';
import { useLang, withLang, Text } from '../i18n';
import { Station, SiteLink } from '../content/stations';
import { hrefFor, Route } from '../router';

const INK = '#17233d';

// The little engine of the pages for kids (Mathematics/cards/add-subtract.svg),
// in any colour: the logo, the progress train and the engines of the Roundhouse.
export function Engine({ color = '#1565c0', number, size = 48, className = '', title }: {
  color?: string;
  number?: string;
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="2 4 82 54"
      width={size}
      height={(size * 54) / 82}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect x="4" y="12" width="22" height="30" rx="3" fill={color} stroke={INK} strokeWidth="2" />
      <rect x="12" y="17" width="9" height="10" fill="#81d4fa" />
      <rect x="26" y="20" width="40" height="22" fill={color} stroke={INK} strokeWidth="2" />
      <path d="M 40 20 C 40 11, 50 11, 50 20" fill={color} />
      <rect x="56" y="8" width="9" height="13" fill="#212121" />
      <circle cx="70" cy="30" r="11" fill="#bdbdbd" stroke={INK} strokeWidth="2" />
      <circle cx="67" cy="28" r="1.4" fill="#000" />
      <circle cx="74" cy="28" r="1.4" fill="#000" />
      <path d="M 68 34 Q 70 36 72 34" stroke="#000" strokeWidth="1.4" fill="none" />
      {number && (
        <text x="15" y="39" textAnchor="middle" fontSize="10" fontWeight="800" fill="#ffd23f" fontFamily="'Baloo 2','Trebuchet MS',sans-serif">{number}</text>
      )}
      <rect x="4" y="42" width="74" height="5" fill="#c62828" />
      <circle cx="16" cy="50" r="6" fill={color} stroke="#212121" strokeWidth="2" />
      <circle cx="40" cy="50" r="6" fill={color} stroke="#212121" strokeWidth="2" />
      <circle cx="64" cy="50" r="6" fill={color} stroke="#212121" strokeWidth="2" />
    </svg>
  );
}

// A station's icon on its colour, ringed in ink.
export function StationBadge({ station, size = 48 }: { station: Station; size?: number }) {
  const Icon = station.icon;
  return (
    <span
      className="inline-flex items-center justify-center shrink-0 text-white"
      style={{
        width: size, height: size, background: station.color,
        border: `2.5px solid ${INK}`, borderRadius: size / 3.5, boxShadow: `0 3px 0 ${INK}`,
      }}
    >
      <Icon size={size * 0.52} strokeWidth={2.4} />
    </span>
  );
}

// "en anglais", next to a title, when the interface is in French.
export function EnOnly({ enOnly }: { enOnly?: boolean }) {
  const { lang, t } = useLang();
  if (!enOnly || lang !== 'fr') return null;
  return <span className="chip bg-sky! border-ink/40! text-ink/70 font-semibold" lang="fr">{t('english_only')}</span>;
}

// Where we are: the map › the station › the activity. Each step but the last is a link.
export function Crumbs({ items }: { items: { label: string; route?: Route }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-[0.95rem] font-semibold">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 min-w-0">
            {i > 0 && <span aria-hidden="true" className="text-ink/40">›</span>}
            {it.route && i < items.length - 1 ? (
              <a href={hrefFor(it.route)} className="text-[#2464d6] underline-offset-4 hover:underline truncate">{it.label}</a>
            ) : (
              <span aria-current="page" className="text-ink/70 truncate">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// A section heading in small capitals.
export function SectionTitle({ children, id, action }: { children: React.ReactNode; id?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <h2 id={id} className="text-2xl sm:text-[1.7rem] font-extrabold leading-tight flex items-center gap-2.5">{children}</h2>
      {action}
    </div>
  );
}

// A page of the pages for kids on slashbin.net, as a card with its thumbnail.
export function SiteCard({ link }: { link: SiteLink }) {
  const { lang, tr } = useLang();
  return (
    <a href={withLang(link.href, lang)} className="card-ink overflow-hidden flex flex-col text-ink no-underline group">
      <img src={link.card} alt="" loading="lazy" width={800} height={450}
        className="block w-full aspect-video object-cover border-b-[3px] border-ink bg-sky" />
      <span className="p-3.5 sm:p-4 flex flex-col gap-1">
        <span className="font-extrabold text-[1.05rem] leading-snug flex flex-wrap items-center gap-x-2 gap-y-1">
          {tr(link.title)} <EnOnly enOnly={link.enOnly} />
        </span>
        <span className="text-[0.92rem] text-ink/70 leading-snug">{tr(link.desc)}</span>
        <span className="mt-1 text-[0.8rem] font-bold text-[#2464d6] flex items-center gap-1">
          slashbin.net <ExternalLink size={13} aria-hidden="true" />
        </span>
      </span>
    </a>
  );
}

// The way back to the pages for kids on slashbin.net.
export function BackToKids({ className = '' }: { className?: string }) {
  const { lang, t } = useLang();
  return (
    <a href={withLang('/kids.php', lang)} title={t('back_kids_title')}
      className={`text-[0.92rem] font-semibold text-ink/70 hover:text-ink underline-offset-4 hover:underline ${className}`}>
      {t('back_kids')}
    </a>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-10 mt-6 border-t-2 border-dashed border-ink/15 flex flex-wrap items-center justify-between gap-3 text-sm">
      <BackToKids />
      <p className="m-0 text-ink/55">{t('footer')}</p>
    </footer>
  );
}

// A text in the chosen language, as a node.
export function T({ text }: { text: Text }) {
  const { tr } = useLang();
  return <>{tr(text)}</>;
}
