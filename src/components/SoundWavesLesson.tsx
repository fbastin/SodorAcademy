import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2 } from 'lucide-react';
import { useLang } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { Engine } from './ui';
import { STATIONS } from '../content/stations';

// Sound waves, for the music station: a sound is a vibration of the air, it takes
// time to travel, its frequency makes it high or low, its amplitude loud or soft,
// the shape of its wave gives its timbre, and every note of the piano has its
// frequency. Most steps have a small lab that plays what it draws.

const INK = '#17233d';
const music = STATIONS.find(s => s.id === 'music')!;

type Shape = 'sine' | 'square' | 'triangle' | 'sawtooth';
const SHAPES: Shape[] = ['sine', 'square', 'triangle', 'sawtooth'];
// As in « une onde sinusoïdale », "a sine wave".
const SHAPE_ADJ: Record<Shape, { fr: string; en: string }> = {
  sine: { fr: 'sinusoïdale', en: 'sine' },
  square: { fr: 'carrée', en: 'square' },
  triangle: { fr: 'triangulaire', en: 'triangle' },
  sawtooth: { fr: 'en dents de scie', en: 'sawtooth' },
};
const SHAPE_NAME: Record<Shape, { fr: string; en: string }> = {
  sine: { fr: 'Sinusoïdale', en: 'Sine' },
  square: { fr: 'Carrée', en: 'Square' },
  triangle: { fr: 'Triangulaire', en: 'Triangle' },
  sawtooth: { fr: 'Dents de scie', en: 'Sawtooth' },
};

// ---------------------------------------------------------------------------
// Sound: one audio context for the lesson, short beeps and tones that can change
// while they play. Square and sawtooth waves sound much louder than a sine wave at
// the same level, so each shape has its own volume, and the whole stays gentle.

const MAX_GAIN = 0.12;
const LOUDNESS: Record<Shape, number> = { sine: 1, triangle: 0.9, square: 0.32, sawtooth: 0.42 };
const level = (amp: number, shape: Shape) => amp * MAX_GAIN * LOUDNESS[shape];

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface Voice { set: (freq: number, amp: number, shape: Shape) => void; stop: () => void }

function startTone(freq: number, amp: number, shape: Shape): Voice | null {
  const c = audio();
  if (!c) return null;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = shape;
  osc.frequency.setValueAtTime(freq, c.currentTime);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(level(amp, shape), c.currentTime + 0.03);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start();
  let stopped = false;
  return {
    set(f, a, s) {
      if (stopped) return;
      try {
        const now = c.currentTime;
        if (osc.type !== s) osc.type = s;
        osc.frequency.setTargetAtTime(f, now, 0.02);
        gain.gain.setTargetAtTime(level(a, s), now, 0.02);
      } catch { /* context closed */ }
    },
    stop() {
      if (stopped) return;
      stopped = true;
      try {
        const now = c.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.06);
        osc.stop(now + 0.08);
        osc.onended = () => { osc.disconnect(); gain.disconnect(); };
      } catch { /* context closed */ }
    },
  };
}

// A short sound; a new one cuts the one before.
let beeping: { voice: Voice; timer: number } | null = null;

function hush() {
  if (!beeping) return;
  clearTimeout(beeping.timer);
  beeping.voice.stop();
  beeping = null;
}

function beep(freq: number, amp: number, shape: Shape = 'sine', seconds = 1.2) {
  hush();
  const voice = startTone(freq, amp, shape);
  if (!voice) return;
  const timer = window.setTimeout(() => {
    voice.stop();
    if (beeping?.voice === voice) beeping = null;
  }, seconds * 1000);
  beeping = { voice, timer };
}

// A tone that plays until it is stopped, and follows its settings while it plays.
function useLiveTone(freq: number, amp: number, shape: Shape) {
  const voice = useRef<Voice | null>(null);
  const [on, setOn] = useState(false);
  useEffect(() => { voice.current?.set(freq, amp, shape); }, [freq, amp, shape]);
  useEffect(() => () => { voice.current?.stop(); voice.current = null; }, []);
  const toggle = () => {
    if (voice.current) {
      voice.current.stop();
      voice.current = null;
      setOn(false);
    } else {
      hush();
      voice.current = startTone(freq, amp, shape);
      setOn(!!voice.current);
    }
  };
  return { on, toggle };
}

// ---------------------------------------------------------------------------
// Drawing.

const reducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
};

// Seconds since `on` became true, frame by frame.
function useClock(on: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      setT(v => v + (now - last) / 1000);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);
  return t;
}

// The curve of a wave over 10 milliseconds: a 300 Hz sound shows 3 vibrations.
const WINDOW = 0.01;

function waveY(shape: Shape, f: number) {
  if (shape === 'sine') return Math.sin(2 * Math.PI * f);
  if (shape === 'square') return f < 0.5 ? 1 : -1;
  if (shape === 'triangle') return f < 0.25 ? 4 * f : f < 0.75 ? 2 - 4 * f : 4 * f - 4;
  return f < 0.5 ? 2 * f : 2 * f - 2;
}

function wavePath(freq: number, amp: number, shape: Shape, phase: number, W: number, mid: number, A: number) {
  const cycles = freq * WINDOW;
  const step = shape === 'sine' ? 3 : 1;
  let d = '';
  for (let x = 0; x <= W; x += step) {
    const u = (x / W) * cycles - phase;
    const y = waveY(shape, u - Math.floor(u));
    d += `${x === 0 ? 'M' : 'L'}${x},${(mid - y * A * amp).toFixed(1)}`;
  }
  return d;
}

function WaveScope({ freq, amp = 0.8, shape = 'sine', moving = false, color, showAmp = false, label }: {
  freq: number;
  amp?: number;
  shape?: Shape;
  moving?: boolean;
  color: string;
  showAmp?: boolean;
  label: string;
}) {
  const { tr } = useLang();
  const t = useClock(moving && !reducedMotion());
  const W = 600, mid = 80, A = 64;
  const crest = (0.25 / (freq * WINDOW)) * W;
  return (
    <svg viewBox="0 0 600 160" className="w-full block rounded-xl border-[3px] border-ink bg-white" role="img" aria-label={label}>
      {Array.from({ length: 9 }, (_, k) => (
        <line key={k} x1={(k + 1) * 60} y1="8" x2={(k + 1) * 60} y2="152" stroke={INK} strokeOpacity="0.08" strokeWidth="2" />
      ))}
      <line x1="0" y1={mid} x2={W} y2={mid} stroke={INK} strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 6" />
      <path d={wavePath(freq, amp, shape, moving ? t * 0.6 : 0, W, mid, A)} fill="none" stroke={color}
        strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
      {showAmp && (
        <g>
          <line x1={crest} y1={mid} x2={crest} y2={mid - A * amp + 4} stroke={INK} strokeWidth="3" />
          <path d={`M ${crest - 7} ${mid - A * amp + 12} L ${crest} ${mid - A * amp + 2} L ${crest + 7} ${mid - A * amp + 12}`}
            fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <text x={crest + 12} y={mid - (A * amp) / 2 + 6} fontSize="18" fontWeight="800" fill={INK}
            paintOrder="stroke" stroke="#fff" strokeWidth="5">{tr({ fr: 'amplitude', en: 'amplitude' })}</text>
        </g>
      )}
      <text x="592" y="148" textAnchor="end" fontSize="15" fontWeight="700" fill={INK} fillOpacity="0.55"
        paintOrder="stroke" stroke="#fff" strokeWidth="4">10 ms</text>
    </svg>
  );
}

// The frame of every small lab.
function Lab({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5 space-y-4">{children}</div>;
}

const Caption = ({ children }: { children: React.ReactNode }) => (
  <p className="m-0 text-[1rem] text-ink/80 leading-snug">{children}</p>
);

function PlayToggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  const { tr } = useLang();
  return (
    <button onClick={onClick} aria-pressed={on} className="chunky go">
      {on ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      {on ? tr({ fr: 'Arrêter le son', en: 'Stop the sound' }) : tr({ fr: 'Jouer le son', en: 'Play the sound' })}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Step 1: bits of air squeezed and spread out as the vibration travels.

function AirWave({ color }: { color: string }) {
  const { tr } = useLang();
  const [on, setOn] = useState(() => !reducedMotion());
  const t = useClock(on);
  const X0 = 150, X1 = 585, cols = 40, rows = 6;
  const k = (2 * Math.PI) / 110;          // a wavelength of 110 px
  const w = k * 70;                       // travelling at 70 px a second: slow motion
  const A = 7;
  const dots: React.ReactNode[] = [];
  for (let c = 0; c < cols; c++) {
    const x0 = X0 + (c * (X1 - X0)) / (cols - 1);
    const x = x0 + A * Math.sin(k * (x0 - X0) - w * t);
    for (let r = 0; r < rows; r++) {
      const jitter = (((c * 7 + r * 13) % 5) - 2) * 1.3;
      dots.push(<circle key={`${c}-${r}`} cx={x.toFixed(1)} cy={44 + r * 15 + jitter} r="2.8" fill={INK} />);
    }
  }
  let curve = '';
  for (let x = X0; x <= X1; x += 3) curve += `${x === X0 ? 'M' : 'L'}${x},${(176 + 20 * Math.cos(k * (x - X0) - w * t)).toFixed(1)}`;

  return (
    <Lab>
      <svg viewBox="0 0 600 210" className="w-full block rounded-xl border-[3px] border-ink bg-white" role="img"
        aria-label={tr({
          fr: 'Thomas siffle : des points représentent l’air ; ils se serrent et s’écartent en vagues qui avancent vers la droite. Dessous, une courbe monte là où l’air est serré.',
          en: 'Thomas whistles: dots stand for the air; they bunch up and spread out in waves moving to the right. Below, a curve rises where the air is squeezed.',
        })}>
        <g transform="translate(4 48)"><Engine size={130} number="1" /></g>
        <text x="70" y="160" textAnchor="middle" fontSize="17" fontWeight="800" fill={INK}>{tr({ fr: 'Thomas siffle', en: 'Thomas whistles' })}</text>
        {dots}
        <line x1={X0} y1="176" x2={X1} y2="176" stroke={INK} strokeOpacity="0.3" strokeWidth="2" strokeDasharray="6 6" />
        <path d={curve} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <text x={X1} y="24" textAnchor="end" fontSize="16" fontWeight="800" fill={INK} fillOpacity="0.7">{tr({ fr: 'vers ton oreille →', en: 'towards your ear →' })}</text>
      </svg>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={() => setOn(v => !v)} aria-pressed={on} className="chunky">
          {on ? <Square size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
          {on ? tr({ fr: 'Pause', en: 'Pause' }) : tr({ fr: 'Animer', en: 'Animate' })}
        </button>
        <Caption>{tr({
          fr: 'Au ralenti : chaque point est un petit bout d’air. Là où les points se serrent, la courbe monte ; là où ils s’écartent, elle descend.',
          en: 'In slow motion: each dot is a tiny bit of air. Where the dots bunch up, the curve goes up; where they spread out, it goes down.',
        })}</Caption>
      </div>
    </Lab>
  );
}

// Step 2: Gordon whistles far away; his steam is seen at once, his whistle heard later.

const SPEED = 343; // metres per second, in air at 20 °C

function GordonFarAway({ color }: { color: string }) {
  const { lang, tr } = useLang();
  const [d, setD] = useState(1000);
  const [state, setState] = useState<'idle' | 'travel' | 'heard'>('idle');
  const [run, setRun] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef(0);
  const delay = d / SPEED;
  const fmt = (x: number, digits = 1) => x.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA', { minimumFractionDigits: digits, maximumFractionDigits: digits });

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!run) return;
    const t0 = performance.now();
    const until = Math.max(delay, 1.6) + 0.1;
    let raf = 0;
    const tick = (now: number) => {
      const e = (now - t0) / 1000;
      setElapsed(Math.min(e, until));
      if (e < until) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  const whistle = () => {
    clearTimeout(timer.current);
    hush();
    audio();                                  // wakes the sound up while the click counts
    setElapsed(0);
    setState('travel');
    setRun(r => r + 1);
    const amp = Math.max(0.3, Math.min(1, 400 / d));
    timer.current = window.setTimeout(() => { beep(300, amp, 'triangle', 1.3); setState('heard'); }, delay * 1000);
  };

  const L = 135, R = 510;
  const front = L + Math.min(1, elapsed / delay) * (R - L);
  const puff = state !== 'idle' && elapsed < 1.6;

  return (
    <Lab>
      <label className="flex flex-wrap items-center gap-3 font-bold">
        {tr({ fr: 'Distance de Gordon :', en: 'Gordon’s distance:' })}
        <input type="range" min={100} max={2000} step={100} value={d} disabled={state === 'travel'}
          onChange={e => { setD(+e.target.value); setState('idle'); }} className="w-48 accent-[#2464d6]" />
        <span className="chip text-base!">{d.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA')} m</span>
      </label>
      <svg viewBox="0 0 600 175" className="w-full block rounded-xl border-[3px] border-ink bg-white" role="img"
        aria-label={tr({
          fr: `Gordon est à ${d} mètres de toi. Son sifflet met ${fmt(delay)} secondes pour arriver jusqu’à toi.`,
          en: `Gordon is ${d} metres away from you. His whistle takes ${fmt(delay)} seconds to reach you.`,
        })}>
        <g transform="translate(8 62)"><Engine size={130} number="4" color="#2464d6" /></g>
        {puff && (
          <g opacity={Math.max(0, 1 - elapsed / 1.6)} fill="#fff" stroke={INK} strokeWidth="2.5">
            <circle cx="98" cy="52" r={9 + elapsed * 6} />
            <circle cx="110" cy="34" r={7 + elapsed * 8} />
            <circle cx="126" cy="20" r={5 + elapsed * 9} />
          </g>
        )}
        {state === 'travel' && [0, 14, 28].map(o => (
          <path key={o} d={`M ${front - o} 58 Q ${front - o + 20} 95 ${front - o} 132`} fill="none" stroke={color}
            strokeWidth="4" strokeLinecap="round" opacity={1 - o / 40} />
        ))}
        <g stroke={INK} strokeWidth="2.5">
          <circle cx="545" cy="70" r="15" fill="#ffd9b3" />
          <rect x="530" y="87" width="30" height="40" rx="9" fill="#ffd23f" />
          <line x1="538" y1="127" x2="536" y2="142" strokeWidth="4" strokeLinecap="round" />
          <line x1="552" y1="127" x2="554" y2="142" strokeWidth="4" strokeLinecap="round" />
        </g>
        <text x="545" y="166" textAnchor="middle" fontSize="17" fontWeight="800" fill={INK}>{tr({ fr: 'toi', en: 'you' })}</text>
        <line x1="140" y1="155" x2="505" y2="155" stroke={INK} strokeWidth="2" strokeDasharray="5 5" />
        <text x="322" y="148" textAnchor="middle" fontSize="16" fontWeight="800" fill={INK}>{d.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA')} m</text>
      </svg>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={whistle} disabled={state === 'travel'} className="chunky go"><Volume2 size={17} /> {tr({ fr: 'Fais siffler Gordon', en: 'Make Gordon whistle' })}</button>
        <p className="m-0 font-bold tabular-nums" aria-live="polite">
          {state === 'idle' && tr({ fr: `Le son mettra ${fmt(delay)} s pour arriver.`, en: `The sound will take ${fmt(delay)} s to arrive.` })}
          {state === 'travel' && tr({ fr: `Le son voyage… ${fmt(Math.min(elapsed, delay))} s`, en: `The sound is travelling… ${fmt(Math.min(elapsed, delay))} s` })}
          {state === 'heard' && <span className="px-1.5 rounded bg-note">{tr({ fr: `Entendu après ${fmt(delay)} s !`, en: `Heard after ${fmt(delay)} s!` })}</span>}
        </p>
      </div>
    </Lab>
  );
}

// Step 3: Thomas's small whistle and Gordon's big one.

function Whistles({ color }: { color: string }) {
  const { lang, tr } = useLang();
  const [who, setWho] = useState<'thomas' | 'gordon'>('thomas');
  const W = {
    thomas: { f: 900, name: 'Thomas', n: '1', size: 64, kind: { fr: 'aigu', en: 'high' } },
    gordon: { f: 300, name: 'Gordon', n: '4', size: 84, kind: { fr: 'grave', en: 'low' } },
  };
  const play = (k: 'thomas' | 'gordon') => { setWho(k); beep(W[k].f, 0.7, 'sine', 1.2); };
  const w = W[who];
  return (
    <Lab>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {(['thomas', 'gordon'] as const).map(k => (
          <button key={k} onClick={() => play(k)} aria-pressed={who === k} className="chunky big flex-col! gap-1! py-3!">
            <span className="h-14 flex items-end"><Engine size={W[k].size} number={W[k].n} color="#2464d6" /></span>
            <span className="leading-tight text-center">{tr({ fr: `Le sifflet de ${W[k].name}`, en: `${W[k].name}’s whistle` })}</span>
            <span className="chip text-sm! bg-white!">{W[k].f} Hz · {tr(W[k].kind)}</span>
          </button>
        ))}
      </div>
      <WaveScope freq={w.f} color={color}
        label={tr({ fr: `L’onde du sifflet de ${w.name} : ${w.f} Hz, ${w.f / 100} vibrations en 10 millisecondes.`, en: `The wave of ${w.name}’s whistle: ${w.f} Hz, ${w.f / 100} vibrations in 10 milliseconds.` })} />
      <Caption>{tr({
        fr: `Le dessin montre 10 millisecondes de son (un centième de seconde). Dans notre exemple, le sifflet de ${w.name} y vibre ${w.f / 100} fois : en une seconde, cela fait ${w.f.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA')} vibrations, donc ${w.f} Hz.`,
        en: `The drawing shows 10 milliseconds of sound (a hundredth of a second). In our example, ${w.name}’s whistle vibrates ${w.f / 100} times in it: in one second that makes ${w.f.toLocaleString('en-CA')} vibrations, so ${w.f} Hz.`,
      })}</Caption>
    </Lab>
  );
}

// Step 4: the same note, softer or louder.

function AmplitudeLab({ color }: { color: string }) {
  const { tr } = useLang();
  const [amp, setAmp] = useState(0.5);
  const tone = useLiveTone(440, amp, 'sine');
  return (
    <Lab>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <PlayToggle on={tone.on} onClick={tone.toggle} />
        <label className="flex items-center gap-2 font-bold">
          <span>{tr({ fr: 'Amplitude :', en: 'Amplitude:' })}</span>
          <span className="text-sm text-ink/70">{tr({ fr: 'doux', en: 'soft' })}</span>
          <input type="range" min={0.1} max={1} step={0.05} value={amp} onChange={e => setAmp(+e.target.value)}
            className="w-40 sm:w-52 accent-[#2464d6]" />
          <span className="text-sm text-ink/70">{tr({ fr: 'fort', en: 'loud' })}</span>
        </label>
      </div>
      <WaveScope freq={440} amp={amp} color={color} showAmp moving={tone.on}
        label={tr({ fr: `Une onde de 440 Hz ; son amplitude est à ${Math.round(amp * 100)} sur 100.`, en: `A 440 Hz wave; its amplitude is ${Math.round(amp * 100)} out of 100.` })} />
      <Caption>{tr({
        fr: 'La fréquence reste à 440 Hz : les bosses sont plus ou moins hautes, mais toujours aussi serrées.',
        en: 'The frequency stays at 440 Hz: the bumps get taller or shorter, but they stay just as close together.',
      })}</Caption>
    </Lab>
  );
}

// Step 5: who hears what, from infrasound to ultrasound (approximate ranges).

function HearingRange() {
  const { lang, tr } = useLang();
  const LO = 10, HI = 200000;
  const pos = (f: number) => ((Math.log10(f) - Math.log10(LO)) / (Math.log10(HI) - Math.log10(LO))) * 100;
  const n = (f: number) => f.toLocaleString(lang === 'fr' ? 'fr-CA' : 'en-CA');
  const rows = [
    { who: { fr: 'L’éléphant', en: 'Elephant' }, lo: 16, hi: 12000, c: '#9aa5b8' },
    { who: { fr: 'Toi', en: 'You' }, lo: 20, hi: 20000, c: '#ffd23f' },
    { who: { fr: 'Le chien', en: 'Dog' }, lo: 65, hi: 45000, c: '#c8925a' },
    { who: { fr: 'La chauve-souris', en: 'Bat' }, lo: 2000, hi: 110000, c: '#7a5cc2' },
  ];
  return (
    <Lab>
      <div className="relative">
        <div className="space-y-2.5">
          {rows.map(r => (
            <div key={r.who.en} className="flex items-center gap-2">
              <span className="w-[7rem] sm:w-[8.5rem] shrink-0 font-bold leading-tight">{tr(r.who)}</span>
              <span className="relative flex-1 h-7 rounded-lg border-2 border-ink bg-white overflow-hidden">
                <span className="absolute inset-y-0 left-0 bg-ink/10" style={{ width: `${pos(20)}%` }} />
                <span className="absolute inset-y-0 right-0 bg-ink/10" style={{ width: `${100 - pos(20000)}%` }} />
                <span className="absolute inset-y-[3px] rounded border-2 border-ink" style={{ left: `${pos(r.lo)}%`, width: `${pos(r.hi) - pos(r.lo)}%`, background: r.c }} />
              </span>
            </div>
          ))}
        </div>
        <div className="relative h-5 mt-1.5 ml-[7.5rem] sm:ml-[9rem] text-[0.78rem] font-bold text-ink/65 tabular-nums" aria-hidden="true">
          {[10, 100, 1000, 10000, 100000].map(f => (
            <span key={f} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${pos(f)}%` }}>{n(f)}</span>
          ))}
        </div>
      </div>
      <ul className="m-0 pl-0 list-none grid sm:grid-cols-2 gap-x-6 gap-y-1 text-[0.95rem]">
        {rows.map(r => (
          <li key={r.who.en}><b>{tr(r.who)}</b>{tr({ fr: ` : environ ${n(r.lo)} à ${n(r.hi)} Hz`, en: `: about ${n(r.lo)} to ${n(r.hi)} Hz` })}</li>
        ))}
      </ul>
      <Caption>{tr({
        fr: `Les zones grisées : à gauche les infrasons (moins de 20 Hz), à droite les ultrasons (plus de ${n(20000)} Hz). Chaque graduation vaut dix fois la précédente.`,
        en: `The grey zones: infrasound on the left (below 20 Hz), ultrasound on the right (above ${n(20000)} Hz). Each mark on the scale is ten times the one before.`,
      })}</Caption>
    </Lab>
  );
}

// Step 6: four shapes, the same note.

function ShapeIcon({ shape }: { shape: Shape }) {
  return (
    <svg viewBox="0 0 600 160" width="44" height="18" aria-hidden="true">
      <path d={wavePath(200, 0.85, shape, 0, 600, 80, 72)} fill="none" stroke="currentColor" strokeWidth="26" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

function ShapesLab({ color }: { color: string }) {
  const { tr } = useLang();
  const [shape, setShape] = useState<Shape>('sine');
  const LIKE: Record<Shape, { fr: string; en: string }> = {
    sine: { fr: 'Très pure, presque comme une flûte.', en: 'Very pure, almost like a flute.' },
    square: { fr: 'Creuse, un peu comme une clarinette, ou la musique des vieux jeux vidéo.', en: 'Hollow, a bit like a clarinet, or the music of old video games.' },
    triangle: { fr: 'Douce, entre la sinusoïdale et la carrée.', en: 'Soft, somewhere between the sine and the square.' },
    sawtooth: { fr: 'Brillante et un peu râpeuse, comme un violon.', en: 'Bright and a little buzzy, like a violin.' },
  };
  const play = (s: Shape) => { setShape(s); beep(330, 0.8, s, 1.2); };
  return (
    <Lab>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {SHAPES.map(s => (
          <button key={s} onClick={() => play(s)} aria-pressed={shape === s} className="chunky flex-col! py-2!">
            <ShapeIcon shape={s} />
            <span>{tr(SHAPE_NAME[s])}</span>
          </button>
        ))}
      </div>
      <WaveScope freq={330} shape={shape} color={color}
        label={tr({ fr: `Une onde ${SHAPE_ADJ[shape].fr} à 330 Hz.`, en: `A ${SHAPE_ADJ[shape].en} wave at 330 Hz.` })} />
      <Caption><b>{tr(SHAPE_NAME[shape])}</b> · {tr(LIKE[shape])}</Caption>
    </Lab>
  );
}

// Step 7: the scale of C, from middle C up to the next C.

const SCALE = [
  { fr: 'do', en: 'C', f: 262 }, { fr: 'ré', en: 'D', f: 294 }, { fr: 'mi', en: 'E', f: 330 }, { fr: 'fa', en: 'F', f: 349 },
  { fr: 'sol', en: 'G', f: 392 }, { fr: 'la', en: 'A', f: 440 }, { fr: 'si', en: 'B', f: 494 }, { fr: 'do', en: 'C', f: 523 },
];

function NotesLab({ color }: { color: string }) {
  const { tr } = useLang();
  const [i, setI] = useState(5);
  const play = (k: number) => { setI(k); beep(SCALE[k].f, 0.7, 'sine', 0.9); };
  const note = SCALE[i];
  return (
    <Lab>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {SCALE.map((s, k) => (
          <button key={k} onClick={() => play(k)} aria-pressed={i === k} className="chunky flex-col! gap-0! px-1! py-2!"
            aria-label={`${tr(s)}, ${s.f} Hz`}>
            <span className="text-lg font-extrabold leading-tight">{tr(s)}</span>
            <span className="text-[0.75rem] font-bold text-ink/65 tabular-nums">{s.f} Hz</span>
          </button>
        ))}
      </div>
      <WaveScope freq={note.f} color={color}
        label={tr({ fr: `La note ${note.fr} : ${note.f} Hz.`, en: `The note ${note.en}: ${note.f} Hz.` })} />
      <Caption>{tr({
        fr: `${note.fr} : ${note.f} vibrations par seconde. Plus la note monte, plus les bosses se serrent.`,
        en: `${note.en}: ${note.f} vibrations per second. The higher the note, the closer together the bumps.`,
      })}</Caption>
    </Lab>
  );
}

// Step 8: everything at once.

function FreeLab({ color }: { color: string }) {
  const { tr } = useLang();
  const [freq, setFreq] = useState(440);
  const [amp, setAmp] = useState(0.6);
  const [shape, setShape] = useState<Shape>('sine');
  const tone = useLiveTone(freq, amp, shape);
  return (
    <Lab>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <PlayToggle on={tone.on} onClick={tone.toggle} />
        <div className="flex flex-wrap gap-2" role="group" aria-label={tr({ fr: 'Forme de l’onde', en: 'Wave shape' })}>
          {SHAPES.map(s => (
            <button key={s} onClick={() => setShape(s)} aria-pressed={shape === s} className="chunky px-2.5! text-[0.95rem]">
              <ShapeIcon shape={s} /> {tr(SHAPE_NAME[s])}
            </button>
          ))}
        </div>
      </div>
      <WaveScope freq={freq} amp={amp} shape={shape} color={color} moving={tone.on}
        label={tr({ fr: `Une onde ${SHAPE_ADJ[shape].fr} à ${freq} Hz.`, en: `A ${SHAPE_ADJ[shape].en} wave at ${freq} Hz.` })} />
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
        <label className="block font-bold">
          <span className="flex justify-between gap-2">
            <span>{tr({ fr: 'Fréquence', en: 'Frequency' })}</span>
            <span className="chip text-sm! tabular-nums">{freq} Hz</span>
          </span>
          <input type="range" min={100} max={1000} step={10} value={freq} onChange={e => setFreq(+e.target.value)} className="w-full accent-[#2464d6]" />
          <span className="flex justify-between text-sm font-semibold text-ink/65"><span>{tr({ fr: 'grave', en: 'low' })}</span><span>{tr({ fr: 'aigu', en: 'high' })}</span></span>
        </label>
        <label className="block font-bold">
          <span className="flex justify-between gap-2">
            <span>{tr({ fr: 'Amplitude', en: 'Amplitude' })}</span>
          </span>
          <input type="range" min={0.1} max={1} step={0.05} value={amp} onChange={e => setAmp(+e.target.value)} className="w-full accent-[#2464d6] mt-1.5" />
          <span className="flex justify-between text-sm font-semibold text-ink/65"><span>{tr({ fr: 'doux', en: 'soft' })}</span><span>{tr({ fr: 'fort', en: 'loud' })}</span></span>
        </label>
      </div>
    </Lab>
  );
}

// ---------------------------------------------------------------------------

function makeSteps(color: string): LessonStep[] {
  return [
    {
      title: { fr: 'Un son, c’est une vibration', en: 'A sound is a vibration' },
      body: {
        fr: 'Quand Thomas siffle, la vapeur fait <b>vibrer</b> l’air de son sifflet : il bouge d’avant en arrière, très vite. Cet air pousse l’air d’à côté, qui pousse le suivant, et ainsi de suite jusqu’à ton oreille. Le son avance comme une vague : c’est une <b>onde sonore</b>.',
        en: 'When Thomas whistles, the steam makes the air in his whistle <b>vibrate</b>: it moves back and forth, very fast. That air pushes the air next to it, which pushes the next bit, and so on, all the way to your ear. The sound moves along like a wave: it is a <b>sound wave</b>.',
      },
      visual: <AirWave color={color} />,
      note: {
        fr: 'L’air ne voyage pas jusqu’à toi : chaque bout d’air vibre presque sur place. C’est la <b>vibration</b> qui avance.',
        en: 'The air does not travel all the way to you: each bit of air just wobbles in place. It is the <b>vibration</b> that moves along.',
      },
    },
    {
      title: { fr: 'Le son prend du temps pour voyager', en: 'Sound takes time to travel' },
      body: {
        fr: 'Le son va vite, mais pas tout de suite : dans l’air, il parcourt environ <b>340 mètres par seconde</b>. La lumière, elle, arrive presque instantanément. Éloigne Gordon, puis fais-le siffler : tu vois sa vapeur tout de suite, mais tu entends son sifflet un peu plus tard, et plus faiblement.',
        en: 'Sound is fast, but not instant: in air it travels about <b>340 metres every second</b>. Light reaches you almost instantly. Move Gordon further away, then make him whistle: you see his steam straight away, but you hear his whistle a little later, and more faintly.',
      },
      visual: <GordonFarAway color={color} />,
      note: {
        fr: 'Le son a besoin de matière pour voyager : l’air, l’eau, ou même l’acier des rails, où il va environ 15 fois plus vite que dans l’air. Dans le vide de l’espace, aucun son ne passe.',
        en: 'Sound needs something to travel through: air, water, or even the steel of the rails, where it goes about 15 times faster than in air. In the emptiness of space, no sound can travel.',
      },
    },
    {
      title: { fr: 'Aigu ou grave : la fréquence', en: 'High or low: frequency' },
      body: {
        fr: 'Le nombre de vibrations en une seconde s’appelle la <b>fréquence</b>. On la mesure en <b>hertz (Hz)</b> : 1 Hz, c’est une vibration par seconde. Le petit sifflet de Thomas vibre vite : il donne un son <b>aigu</b>. Le gros sifflet de Gordon vibre plus lentement : il donne un son <b>grave</b>.',
        en: 'The number of vibrations in one second is called the <b>frequency</b>. It is measured in <b>hertz (Hz)</b>: 1 Hz means one vibration per second. Thomas’s small whistle vibrates fast: it makes a <b>high-pitched</b> sound. Gordon’s big whistle vibrates more slowly: it makes a <b>low-pitched</b> sound.',
      },
      visual: <Whistles color={color} />,
      note: {
        fr: 'Plus la fréquence est grande, plus le son est <b>aigu</b>. Plus elle est petite, plus il est <b>grave</b>.',
        en: 'The higher the frequency, the <b>higher</b> the sound. The lower the frequency, the <b>lower</b> the sound.',
      },
    },
    {
      title: { fr: 'Fort ou doux : l’amplitude', en: 'Loud or soft: amplitude' },
      body: {
        fr: 'Quand Thomas siffle plus fort, l’air vibre davantage : il va plus loin en avant et en arrière. La taille de cette vibration s’appelle l’<b>amplitude</b>. Sur le dessin, c’est la taille des bosses de la courbe. Plus l’amplitude est grande, plus le son est <b>fort</b>. Joue le son et fais glisser le curseur.',
        en: 'When Thomas whistles louder, the air vibrates more: it moves further back and forth. The size of this vibration is called the <b>amplitude</b>. On the drawing, it is how tall the bumps of the curve are. The bigger the amplitude, the <b>louder</b> the sound. Play the sound and move the slider.',
      },
      visual: <AmplitudeLab color={color} />,
      note: {
        fr: 'L’amplitude change le volume, pas la note : un son fort peut être aigu ou grave. Le volume d’un son se mesure en <b>décibels (dB)</b>.',
        en: 'Amplitude changes the loudness, not the note: a loud sound can be high or low. The loudness of a sound is measured in <b>decibels (dB)</b>.',
      },
    },
    {
      title: { fr: 'Ce que tes oreilles entendent', en: 'What your ears can hear' },
      body: {
        fr: 'Tes oreilles entendent les sons d’environ <b>20 Hz</b> (très grave) à <b>20 000 Hz</b> (très aigu). En dessous, ce sont les <b>infrasons</b> : les éléphants s’en servent pour se parler de loin. Au-dessus, ce sont les <b>ultrasons</b> : les chauves-souris s’en servent pour trouver leur chemin dans le noir, et les chiens en entendent une partie.',
        en: 'Your ears hear sounds from about <b>20 Hz</b> (very low) to <b>20,000 Hz</b> (very high). Below that is <b>infrasound</b>: elephants use it to talk to each other from far away. Above that is <b>ultrasound</b>: bats use it to find their way in the dark, and dogs can hear some of it.',
      },
      visual: <HearingRange />,
      note: {
        fr: 'Avec l’âge, on entend moins bien les sons très aigus : les enfants entendent souvent des sons que les adultes n’entendent plus.',
        en: 'As people get older, they hear very high sounds less well: children often hear sounds that grown-ups can no longer hear.',
      },
    },
    {
      title: { fr: 'La forme de l’onde', en: 'The shape of the wave' },
      body: {
        fr: 'Une flûte et un violon peuvent jouer la même note, à la même fréquence, et pourtant on les reconnaît. Ce qui change, c’est la <b>forme</b> de leur onde. Écoute ces quatre formes : elles ont toutes la même fréquence (330 Hz, la note mi), mais pas le même <b>timbre</b>.',
        en: 'A flute and a violin can play the same note, at the same frequency, and yet you can tell them apart. What changes is the <b>shape</b> of their wave. Listen to these four shapes: they all have the same frequency (330 Hz, the note E), but not the same <b>timbre</b>.',
      },
      visual: <ShapesLab color={color} />,
      note: {
        fr: 'La fréquence donne la note, l’amplitude donne le volume, et la forme de l’onde donne le <b>timbre</b> : la « couleur » du son.',
        en: 'Frequency gives the note, amplitude gives the loudness, and the shape of the wave gives the <b>timbre</b>: the “colour” of the sound.',
      },
    },
    {
      title: { fr: 'Chaque note a sa fréquence', en: 'Every note has its frequency' },
      body: {
        fr: 'Les notes de musique sont des fréquences précises. Le <b>la</b> du milieu du piano vibre à <b>440 Hz</b> : les musiciens s’en servent pour accorder leurs instruments. Joue la gamme : à chaque note, la fréquence monte un peu.',
        en: 'Musical notes are exact frequencies. The <b>A</b> in the middle of the piano vibrates at <b>440 Hz</b>: musicians use it to tune their instruments. Play the scale: with each note, the frequency goes up a little.',
      },
      visual: <NotesLab color={color} />,
      note: {
        fr: 'Monter d’une <b>octave</b>, c’est doubler la fréquence : le la suivant, plus aigu, vibre à 880 Hz.',
        en: 'Going up an <b>octave</b> doubles the frequency: the next A up vibrates at 880 Hz.',
      },
    },
    {
      title: { fr: 'Ton laboratoire du son', en: 'Your sound lab' },
      body: {
        fr: 'À toi de jouer ! Choisis une forme d’onde, puis change la fréquence et l’amplitude pendant que le son joue. Essaie de retrouver le sifflet de Thomas (900 Hz) et celui de Gordon (300 Hz).',
        en: 'Your turn! Pick a wave shape, then change the frequency and the amplitude while the sound plays. Try to find Thomas’s whistle (900 Hz) and Gordon’s (300 Hz).',
      },
      visual: <FreeLab color={color} />,
    },
  ];
}

export default function SoundWavesLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  const { lang } = useLang();
  const c = color || music.color;
  const [steps] = useState(() => makeSteps(c));

  // Leaving the lesson silences it.
  useEffect(() => () => {
    hush();
    const old = ctx;
    ctx = null;
    window.setTimeout(() => { try { old?.close(); } catch { /* already closed */ } }, 150);
  }, []);

  return (
    <div lang={lang}>
      <LessonPlayer
        title={{ fr: 'Les ondes sonores', en: 'Sound Waves' }}
        color={c}
        steps={steps}
        links={music.links}
        onStartExercise={onStartExercise}
        onCancel={onCancel}
      />
    </div>
  );
}
