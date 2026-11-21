import React, { useEffect, useRef, useState } from 'react';
import { Eraser, Volume2 } from 'lucide-react';
import { Grade } from '../types';
import { playNote } from '../services/audioSynthesis';
import { useLang } from '../i18n';
import ExerciseFrame, { Feedback } from './ExerciseFrame';

// Ear training at Crovan's Gate: three piano notes are played, the child plays them
// back in the same order. The first note is shown, so the ear has something to
// start from; the other two are found by hearing whether the tune goes up or down.
// Primary uses the white keys of one octave (do to do) and small steps; Secondary
// adds the black keys, two octaves and bigger leaps.
//
// Keys are numbered as on an 88-key piano: 0 is the lowest A, 39 middle C.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

const NAMES = {
  fr: ['do', 'do♯', 'ré', 'ré♯', 'mi', 'fa', 'fa♯', 'sol', 'sol♯', 'la', 'la♯', 'si'],
  en: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
};
const SPOKEN = {
  fr: ['do', 'do dièse', 'ré', 'ré dièse', 'mi', 'fa', 'fa dièse', 'sol', 'sol dièse', 'la', 'la dièse', 'si'],
  en: ['C', 'C sharp', 'D', 'D sharp', 'E', 'F', 'F sharp', 'G', 'G sharp', 'A', 'A sharp', 'B'],
};

const MIDDLE_C = 39;
const pitchClass = (k: number) => (k + 9) % 12;
const isBlack = (k: number) => [1, 3, 6, 8, 10].includes(pitchClass(k));
const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

const LEVELS = {
  Primary: { keys: range(MIDDLE_C, MIDDLE_C + 12), blackKeys: false, leap: 4 },     // do to do, white keys, up to 4 white keys apart
  Secondary: { keys: range(MIDDLE_C, MIDDLE_C + 24), blackKeys: true, leap: 7 },   // two octaves, every key, up to 7 semitones apart
};

function makeSequence(grade: Grade, before: number[]): number[] {
  const level = LEVELS[grade] || LEVELS.Primary;
  const pool = level.keys.filter(k => level.blackKeys || !isBlack(k));
  let seq: number[];
  do {
    seq = [pool[rnd(0, pool.length - 1)]];
    while (seq.length < 3) {
      const i = pool.indexOf(seq[seq.length - 1]);
      const j = Math.max(0, Math.min(pool.length - 1, i + rnd(-level.leap, level.leap)));
      if (j !== i) seq.push(pool[j]);
    }
  } while (seq.join() === before.join());
  return seq;
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function PianoSequence({ grade, questionsCount = 10, onComplete, onCancel, color = '#c2368a', place }: Props) {
  const { lang, tr } = useLang();
  const level = LEVELS[grade] || LEVELS.Primary;
  const [seq, setSeq] = useState<number[]>(() => makeSequence(grade, []));
  const [input, setInput] = useState<number[]>([]);
  const [heard, setHeard] = useState(false);          // this tune has been listened to
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number[]>([]);
  const [result, setResult] = useState<null | 'right' | 'wrong'>(null);
  const [nudge, setNudge] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [qKey, setQKey] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const run = useRef(0);                             // a new tune, or leaving, stops the one playing
  const heardOnce = useRef(false);                   // the sound is unlocked: later tunes start by themselves
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      run.current++;
      audioContextRef.current?.close().catch(() => {});
    };
  }, []);

  const sound = (k: number, duration = 0.8) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    playNote(audioContextRef.current, k, 'grand', duration);
    setActive(a => [...a, k]);
    setTimeout(() => { if (alive.current) setActive(a => a.filter(x => x !== k)); }, 300);
  };

  const playTune = async (tune: number[], keepInput = false) => {
    const id = ++run.current;
    setPlaying(true);
    setNudge(false);
    if (!keepInput) setInput([]);
    for (const k of tune) {
      if (run.current !== id) return;
      sound(k);
      await wait(1000);
    }
    if (run.current !== id) return;
    setPlaying(false);
    setHeard(true);
    heardOnce.current = true;
  };

  const next = () => {
    const s = makeSequence(grade, seq);
    run.current++;
    setSeq(s);
    setInput([]);
    setResult(null);
    setHeard(false);
    setPlaying(false);
    setNudge(false);
    setQKey(q => q + 1);
    if (heardOnce.current) setTimeout(() => { if (alive.current) playTune(s); }, 700);
  };

  useEffect(() => { setAnswered(0); next(); }, [grade]);

  const press = (k: number) => {
    if (playing) return;
    sound(k);
    if (result) return;                              // after the answer, the piano is free to play
    if (!heard) { setNudge(true); return; }
    const mine = [...input, k];
    setInput(mine);
    if (mine.length < 3) return;
    if (mine.every((v, i) => v === seq[i])) {
      const n = answered + 1;
      setAnswered(n);
      setResult('right');
      if (n >= questionsCount) setTimeout(() => { if (alive.current) onComplete('engine'); }, 1300);
    } else {
      setResult('wrong');
    }
  };

  // Names: the C at the top of the Primary keyboard is « do aigu », "high C".
  const name = (k: number) => {
    const n = NAMES[lang][pitchClass(k)];
    if (!level.blackKeys && k === MIDDLE_C + 12) return tr({ fr: `${n} aigu`, en: `high ${n}` });
    return n;
  };
  const spoken = (k: number) => {
    const n = SPOKEN[lang][pitchClass(k)];
    if (!level.blackKeys) return k === MIDDLE_C + 12 ? tr({ fr: `${n} aigu`, en: `high ${n}` }) : n;
    return `${n}, ${tr({ fr: 'octave', en: 'octave' })} ${Math.floor((k - MIDDLE_C) / 12) + 1}`;
  };
  const list = (keys: number[]) => keys.map(name).join(', ');

  const feedback: Feedback = result === 'right' ? { ok: true } : result === 'wrong' ? {
    ok: false,
    explain: (
      <div className="space-y-1.5">
        <p className="m-0">{tr({ fr: 'Les notes étaient :', en: 'The notes were:' })} <b>{list(seq)}</b>.</p>
        <p className="m-0">{tr({ fr: 'Tu as joué :', en: 'You played:' })} <b>{list(input)}</b>.</p>
        <p className="m-0 text-ink/80">{tr({
          fr: 'Écoute-les encore : à chaque note, la mélodie monte-t-elle ou descend-elle ? Les touches vertes du piano te montrent le chemin.',
          en: 'Listen to them again: at each note, does the tune go up or down? The green keys on the piano show you the way.',
        })}</p>
        <button onClick={() => playTune(seq, true)} disabled={playing} className="chunky mt-2">
          <Volume2 size={16} /> {tr({ fr: 'Réécouter les notes', en: 'Listen to them again' })}
        </button>
      </div>
    ),
  } : null;

  // Which keys wear a number: the first note before the answer, all three after a mistake.
  const marks = new Map<number, number[]>();
  const shown = result === 'wrong' ? seq : result ? [] : [seq[0]];
  shown.forEach((k, i) => marks.set(k, [...(marks.get(k) || []), i + 1]));

  const keys = level.keys;
  const whites = keys.filter(k => !isBlack(k));
  const w = 100 / whites.length;

  const keyMarks = (k: number) => {
    const m = marks.get(k);
    if (!m) return null;
    return (
      <span className="absolute top-1.5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5" aria-hidden="true">
        {m.map(i => (
          <span key={i} className="w-6 h-6 rounded-full bg-sticker border-2 border-ink text-ink text-[0.8rem] font-extrabold grid place-items-center">{i}</span>
        ))}
      </span>
    );
  };

  const keyLabel = (k: number) => {
    const m = marks.get(k);
    const extra = m ? ` (${tr({ fr: 'note', en: 'note' })} ${m.join(tr({ fr: ' et ', en: ' and ' }))})` : '';
    return spoken(k) + extra;
  };

  // A key sounds as soon as it is pressed; Enter or Space on a focused key does the same.
  const keyEvents = (k: number) => ({
    onPointerDown: (e: React.PointerEvent) => { if (e.button === 0) press(k); },
    onClick: (e: React.MouseEvent) => { if (e.detail === 0) press(k); },
  });

  const slotState = (i: number) => {
    if (input[i] === undefined) return 'empty';
    if (!result) return 'filled';
    return input[i] === seq[i] ? 'right' : 'wrong';
  };

  return (
    <div lang={lang}>
      <ExerciseFrame
        color={color} place={place || 'Crovan’s Gate'}
        label={tr({ fr: 'L’oreille musicale', en: 'Ear training' })}
        answered={answered} total={questionsCount} questionKey={qKey}
        feedback={feedback} onNext={next} onBack={onCancel}
      >
        <h2 className="text-xl sm:text-2xl font-extrabold mb-1.5 leading-snug">
          {tr({ fr: 'Écoute les trois notes, puis joue-les au piano dans le même ordre.', en: 'Listen to the three notes, then play them on the piano in the same order.' })}
        </h2>
        <p className="mb-5 text-[1.05rem] text-ink/80">
          {level.blackKeys
            ? tr({ fr: 'Les touches noires comptent aussi.', en: 'The black keys count too.' })
            : tr({ fr: 'Seulement des touches blanches.', en: 'White keys only.' })}{' '}
          {tr({ fr: 'La première note est', en: 'The first note is' })} <b className="px-1.5 rounded bg-note">{name(seq[0])}</b>.
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <button onClick={() => playTune(seq, !!result)} disabled={playing} className="chunky go big">
            <Volume2 size={20} /> {playing ? tr({ fr: 'J’écoute…', en: 'Listening…' }) : heard ? tr({ fr: 'Réécouter', en: 'Listen again' }) : tr({ fr: 'Écouter les notes', en: 'Listen to the notes' })}
          </button>
          <div className="flex items-center gap-2" aria-label={tr({ fr: 'Ta réponse', en: 'Your answer' })} role="group">
            {[0, 1, 2].map(i => {
              const st = slotState(i);
              return (
                <span key={i} className={`min-w-14 h-12 px-2 rounded-xl border-[3px] border-ink grid place-items-center font-extrabold text-lg
                  ${st === 'empty' ? 'border-dashed border-ink/40! text-ink/35' : st === 'right' ? 'bg-mint' : st === 'wrong' ? 'bg-rose' : 'bg-white'}`}>
                  {input[i] === undefined ? i + 1 : name(input[i])}
                </span>
              );
            })}
          </div>
          <button onClick={() => setInput([])} disabled={!input.length || !!result || playing} className="chunky"
            title={tr({ fr: 'Effacer ma réponse', en: 'Clear my answer' })}>
            <Eraser size={16} /> {tr({ fr: 'Effacer', en: 'Clear' })}
          </button>
        </div>

        <p className="min-h-[1.6rem] mb-2 font-bold text-[1.02rem]" aria-live="polite">
          {nudge && <span className="px-1.5 rounded bg-note">{tr({ fr: 'Appuie d’abord sur « Écouter les notes ».', en: 'Press “Listen to the notes” first.' })}</span>}
          {!nudge && heard && !result && !playing && tr({ fr: `À toi : joue la note ${input.length + 1} sur 3.`, en: `Your turn: play note ${input.length + 1} of 3.` })}
        </p>

        <div className="rounded-2xl border-[3px] border-ink bg-ink p-1.5 sm:p-2 shadow-[0_5px_0_rgba(23,35,61,0.35)] select-none">
          <div className="relative h-40 sm:h-52 flex gap-[3px]">
            {whites.map(k => {
              const on = active.includes(k);
              const reveal = result === 'wrong' && seq.includes(k);
              return (
                <button key={k} {...keyEvents(k)} disabled={playing} aria-label={keyLabel(k)}
                  className={`relative flex-1 h-full rounded-b-xl rounded-t-sm border-2 border-ink flex items-end justify-center pb-2
                    font-extrabold text-ink touch-manipulation transition-colors disabled:cursor-default
                    ${on ? 'bg-sticker' : reveal ? 'bg-mint' : 'bg-white hover:bg-sky'}`}>
                  {keyMarks(k)}
                  <span className="text-[0.7rem] sm:text-base leading-none" aria-hidden="true">{NAMES[lang][pitchClass(k)]}</span>
                </button>
              );
            })}
            {keys.filter(isBlack).map(k => {
              const left = (whites.indexOf(k - 1) + 1) * w;
              const on = active.includes(k);
              const reveal = result === 'wrong' && seq.includes(k);
              const style = { left: `calc(${left}% - ${(w * 0.62) / 2}%)`, width: `${w * 0.62}%` };
              if (!level.blackKeys) {
                return <span key={k} aria-hidden="true" className="absolute top-0 h-[58%] rounded-b-lg bg-ink border-2 border-ink opacity-90" style={style} />;
              }
              return (
                <button key={k} {...keyEvents(k)} disabled={playing} aria-label={keyLabel(k)} style={style}
                  className={`absolute top-0 z-10 h-[58%] rounded-b-lg border-2 border-ink touch-manipulation transition-colors disabled:cursor-default
                    ${on ? 'bg-sticker' : reveal ? 'bg-good' : 'bg-ink hover:bg-[#2a3a5e]'}`}>
                  {keyMarks(k)}
                </button>
              );
            })}
          </div>
        </div>
      </ExerciseFrame>
    </div>
  );
}
