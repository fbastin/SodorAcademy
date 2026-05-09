import { parseMusicXml as libParse } from '../../piano-lib/src/core/parser';
import { MusicScore } from '../../piano-lib/src/types';

export type { MusicScore };
export const parseMusicXml = libParse;
