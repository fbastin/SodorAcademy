import { MusicScore } from "../types";

export const MUSIC_LIBRARY: MusicScore[] = [
  {
    id: 'thomas-theme',
    title: 'Thomas & Friends Theme',
    thumbnail: '🚂',
    notes: [
      // Main melody line (approximate indices for the famous theme)
      // C4=39, D4=41, E4=43, F4=44, G4=46, A4=48, B4=50, C5=51
      { keyIndex: 51, time: 0.0, duration: 0.2 }, // C5
      { keyIndex: 51, time: 0.3, duration: 0.2 }, // C5
      { keyIndex: 48, time: 0.6, duration: 0.2 }, // A4
      { keyIndex: 44, time: 0.9, duration: 0.2 }, // F4
      { keyIndex: 46, time: 1.2, duration: 0.4 }, // G4
      
      { keyIndex: 51, time: 1.8, duration: 0.2 }, // C5
      { keyIndex: 51, time: 2.1, duration: 0.2 }, // C5
      { keyIndex: 48, time: 2.4, duration: 0.2 }, // A4
      { keyIndex: 44, time: 2.7, duration: 0.2 }, // F4
      { keyIndex: 46, time: 3.0, duration: 0.4 }, // G4
      
      { keyIndex: 51, time: 3.6, duration: 0.2 }, // C5
      { keyIndex: 48, time: 3.9, duration: 0.2 }, // A4
      { keyIndex: 46, time: 4.2, duration: 0.2 }, // G4
      { keyIndex: 44, time: 4.5, duration: 0.2 }, // F4
      { keyIndex: 43, time: 4.8, duration: 0.4 }, // E4
      
      { keyIndex: 41, time: 5.4, duration: 0.2 }, // D4
      { keyIndex: 44, time: 5.7, duration: 0.2 }, // F4
      { keyIndex: 41, time: 6.0, duration: 0.2 }, // D4
      { keyIndex: 39, time: 6.3, duration: 0.4 }, // C4
    ]
  },
  {
    id: 'percy-theme',
    title: 'Percy\'s Post Train',
    thumbnail: '✉️',
    notes: [
      { keyIndex: 43, time: 0.0, duration: 0.2 }, // E4
      { keyIndex: 46, time: 0.3, duration: 0.2 }, // G4
      { keyIndex: 43, time: 0.6, duration: 0.2 }, // E4
      { keyIndex: 46, time: 0.9, duration: 0.4 }, // G4
      { keyIndex: 51, time: 1.5, duration: 0.2 }, // C5
      { keyIndex: 48, time: 1.8, duration: 0.2 }, // A4
      { keyIndex: 46, time: 2.1, duration: 0.4 }, // G4
    ]
  }
];
