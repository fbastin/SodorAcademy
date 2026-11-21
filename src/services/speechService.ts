// Reads a text aloud, with a voice of its language. The lessons and quizzes still
// written in English only are read in English whatever the interface language.
export const speak = (text: string, lang: 'fr' | 'en' = 'en') => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === 'fr' ? 'fr-CA' : 'en-GB';
  const voice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith(lang));
  if (voice) utterance.voice = voice;
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  window.speechSynthesis.speak(utterance);
};
