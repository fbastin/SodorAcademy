/// <reference types="vite/client" />
// The French translations of the quiz questions. The banks themselves stay in
// English (localData.ts, questions/*.json); questions/fr/<subject>.json gives, for
// each question id, its text, its options in the same order and its explanation.
// The right answer is found by its position among the options. The English
// station's quiz has no translation: it is there to practise English.
//
// Each subject's file is loaded only when its quiz opens.

export interface FrQuestion { text: string; options: string[]; explanation: string }
export type FrBank = Record<string, FrQuestion>;

const files = import.meta.glob('./questions/fr/*.json', { import: 'default' }) as Record<string, () => Promise<FrBank>>;
const cache: Record<string, Promise<FrBank>> = {};

export function loadFrBank(bank: string): Promise<FrBank> {
  const key = `./questions/fr/${bank.toLowerCase()}.json`;
  if (!files[key]) return Promise.resolve({});
  if (!cache[key]) cache[key] = files[key]().catch(() => ({}));
  return cache[key];
}

export const hasFrBank = (bank: string) => `./questions/fr/${bank.toLowerCase()}.json` in files;
