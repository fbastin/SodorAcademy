import React from 'react';
import { useLang } from '../i18n';
import { STATIONS } from '../content/stations';
import { hrefFor } from '../router';

// The map of Sodor, with each station where its landmark is on the drawing.
export default function SodorMap() {
  const { tr } = useLang();
  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-[22px] border-[3px] border-ink shadow-[0_8px_0_#17233d] bg-[#d9c9a3]">
      {/* A JPEG of media/Sodor Island.png (2.8 MB as PNG); lazy, so a phone, where the
          map is hidden, does not download it. */}
      <img
        src="/SodorAcademy/media/sodor-island.jpg"
        width={1408}
        height={768}
        loading="lazy"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-3 sm:inset-4">
        {STATIONS.map(station => {
          const Icon = station.icon;
          const label = `${tr(station.title)} – ${tr(station.place)}`;
          return (
            <a
              key={station.id}
              href={hrefFor({ station: station.id })}
              aria-label={label}
              title={label}
              className="absolute flex flex-col items-center no-underline group"
              style={{ left: `${station.x}%`, top: `${station.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <span
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white border-[2.5px] border-ink shadow-[0_3px_0_#17233d] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5"
                style={{ background: station.color }}
              >
                <Icon size={24} strokeWidth={2.4} />
              </span>
              <span className="mt-1 px-2 py-0.5 rounded-lg bg-white border-2 border-ink text-center leading-tight shadow-[0_2px_0_#17233d]">
                <span className="block text-[11px] lg:text-[13px] font-extrabold text-ink whitespace-nowrap">{tr(station.title)}</span>
                <span className="block text-[9px] lg:text-[10px] font-semibold text-ink/60 whitespace-nowrap">{tr(station.place)}</span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
