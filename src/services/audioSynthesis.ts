import { PianoAudio, SOUND_PRESETS as PRESETS } from '../../piano-lib/src/core/audio';
import { SoundType } from '../../piano-lib/src/types';

const pianoAudio = new PianoAudio();

export type { SoundType };
export const SOUND_PRESETS = PRESETS;

export const playNote = (
  audioContext: AudioContext, // Kept for compatibility with existing component calls
  keyIndex: number,
  soundType: SoundType = 'grand',
  duration = 1.2
) => {
  // The new PianoAudio manages its own context or we can pass one
  // For simplicity and matching the lib's internal management:
  pianoAudio.playNote(keyIndex, soundType, duration);
  return true;
};
