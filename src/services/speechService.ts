// Reads a text aloud, with a voice of its language. The lessons and quizzes still
// written in English only are read in English whatever the interface language.
//
// Browsers load their voices late: Chrome's first getVoices() is empty, and an
// utterance without a voice then falls back on the default voice, often an English
// one, which reads French with an English accent. So the voices are awaited, and a
// voice of the right language is always chosen when the browser has one: the
// preferred regions first (fr-CA, then fr-FR; en-CA, en-GB, en-US), then any voice of
// the language. Long texts are read sentence by sentence, as Chrome often stops a long
// utterance after about fifteen seconds.

type SpeechLang = 'fr' | 'en';

const PREFERRED: Record<SpeechLang, string[]> = { fr: ['fr-ca', 'fr-fr'], en: ['en-ca', 'en-gb', 'en-us'] };
const FALLBACK_TAG: Record<SpeechLang, string> = { fr: 'fr-FR', en: 'en-GB' };
// Names of the better voices of the usual systems (network or neural voices).
const GOOD_NAME = /google|natural|neural|premium|enhanced|siri|online/i;

const tagOf = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();

let voices: SpeechSynthesisVoice[] = [];
let loading: Promise<SpeechSynthesisVoice[]> | null = null;

function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  voices = synth.getVoices();
  if (voices.length) return Promise.resolve(voices);
  if (!loading) {
    loading = new Promise(resolve => {
      const done = () => { voices = synth.getVoices(); resolve(voices); };
      synth.addEventListener?.('voiceschanged', done, { once: true });
      setTimeout(done, 1500);   // some browsers never send the event
    });
    loading.then(list => { if (!list.length) loading = null; });
  }
  return loading;
}
if (typeof window !== 'undefined' && 'speechSynthesis' in window) loadVoices();

// The best voice for a language, or none if the browser has no voice of it.
export function pickVoice(list: SpeechSynthesisVoice[], lang: SpeechLang): SpeechSynthesisVoice | undefined {
  const ofLang = list.filter(v => tagOf(v).split('-')[0] === lang);
  const region = (v: SpeechSynthesisVoice) => { const i = PREFERRED[lang].indexOf(tagOf(v)); return i < 0 ? PREFERRED[lang].length : i; };
  const score = (v: SpeechSynthesisVoice) => region(v) * 4 + (GOOD_NAME.test(v.name) ? 0 : 2) + (v.default ? 0 : 1);
  return ofLang.sort((a, b) => score(a) - score(b))[0];
}

// Sentences, grouped up to about 220 characters; a longer sentence is cut at its commas.
export function chunks(text: string, max = 220): string[] {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.!?…]+(?:[.!?…]+|$)/g) ?? [clean];
  const pieces = sentences.flatMap(s => (s.length <= max ? [s] : s.match(/[^,;:]+(?:[,;:]+|$)/g) ?? [s]));
  const out: string[] = [];
  for (const p of pieces.map(x => x.trim()).filter(Boolean)) {
    if (out.length && (out[out.length - 1] + ' ' + p).length <= max) out[out.length - 1] += ' ' + p;
    else out.push(p);
  }
  return out;
}

let turn = 0;   // a newer request, or a stop, makes an older one give up

export const speak = (text: string, lang: SpeechLang = 'en') => {
  if (!('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  const mine = ++turn;
  synth.cancel();
  loadVoices().then(list => {
    if (mine !== turn) return;
    const voice = pickVoice(list, lang);
    synth.cancel();
    for (const piece of chunks(text)) {
      const u = new SpeechSynthesisUtterance(piece);
      u.lang = voice ? voice.lang.replace('_', '-') : FALLBACK_TAG[lang];
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.1;
      synth.speak(u);
    }
  });
};

// Stops the reading, including one still waiting for the voices.
export const stopSpeaking = () => {
  turn++;
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};
