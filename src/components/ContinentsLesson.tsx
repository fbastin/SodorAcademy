import React from 'react';
import { Lang, Text, pick } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { STATIONS } from '../content/stations';

// The seven continents and the five oceans, on a very simple map of the world drawn
// here (an equirectangular sketch, one flat colour per continent). The map is also
// used by the continents exercise (ContinentsExercise.tsx).

const INK = '#17233d';
const geography = STATIONS.find(s => s.id === 'geography')!;

export type ContinentId = 'northAmerica' | 'southAmerica' | 'europe' | 'africa' | 'asia' | 'australia' | 'antarctica';
export type OceanId = 'pacific' | 'atlantic' | 'indian' | 'southern' | 'arctic';

export const CONTINENT_NAMES: Record<ContinentId, { fr: string; en: string }> = {
  northAmerica: { fr: 'Amérique du Nord', en: 'North America' },
  southAmerica: { fr: 'Amérique du Sud', en: 'South America' },
  europe: { fr: 'Europe', en: 'Europe' },
  africa: { fr: 'Afrique', en: 'Africa' },
  asia: { fr: 'Asie', en: 'Asia' },
  australia: { fr: 'Australie', en: 'Australia' },
  antarctica: { fr: 'Antarctique', en: 'Antarctica' },
};

export const OCEAN_NAMES: Record<OceanId, { fr: string; en: string }> = {
  pacific: { fr: 'Océan Pacifique', en: 'Pacific Ocean' },
  atlantic: { fr: 'Océan Atlantique', en: 'Atlantic Ocean' },
  indian: { fr: 'Océan Indien', en: 'Indian Ocean' },
  southern: { fr: 'Océan Austral', en: 'Southern Ocean' },
  arctic: { fr: 'Océan Arctique', en: 'Arctic Ocean' },
};

const COLORS: Record<ContinentId, string> = {
  northAmerica: '#f39c38',
  southAmerica: '#6cc070',
  europe: '#a77bdb',
  africa: '#f7d04a',
  asia: '#e85d75',
  australia: '#c48a52',
  antarctica: '#ffffff',
};
const SEA = '#bfe2f6';
const MUTED = '#d9d2c3';

// ---- The outlines, as [longitude, latitude, longitude, latitude, …] ----------------

// The border between Europe and Asia, from the Arctic down the Urals to the Black Sea.
const URALS = [60, 69, 60, 65, 59, 60, 59.5, 55, 57, 51.5, 51.5, 47.5, 48, 46, 47, 43.5, 43.5, 43, 40, 43.5];

const OUTLINES: Record<ContinentId, number[][]> = {
  northAmerica: [
    [-166, 68.4, -163, 70.4, -156.5, 71.3, -151, 70.4, -141, 69.7, -136, 69, -128, 70.2, -121, 69.5, -115, 68.6, -108, 68.3, -101, 67.8,
      -96, 68.2, -90, 68.8, -86, 66.5, -90.5, 63.3, -94.2, 59, -92.5, 57, -88, 56.3, -82.3, 55.1, -82.2, 52.3, -79.6, 51.3, -78.8, 54,
      -76.8, 56.3, -77.8, 58.8, -77.6, 60.8, -78, 62.4, -73, 62.3, -70, 61, -69, 58.7, -64.7, 60.3, -61.5, 56.5, -57.6, 54.5, -55.7, 52.2,
      -57.2, 51.4, -60, 50.3, -64.5, 50.3, -66.6, 49.6, -64.2, 48.7, -65.3, 47.8, -64.6, 46.3, -61.5, 45.6, -60.3, 46.6, -59.8, 45.9,
      -63.5, 44.6, -65.9, 43.8, -66.4, 45.1, -67.5, 44.6, -70.2, 43.6, -70.6, 41.8, -71.8, 41.3, -74, 40.6, -74.4, 39.4, -75, 38.2,
      -76.3, 37, -75.5, 35.2, -77.8, 34, -80.8, 32.1, -81.4, 30.4, -80.1, 26.8, -80.6, 25.2, -81.8, 26.4, -82.7, 28, -83.7, 29.9,
      -85.4, 29.7, -88, 30.4, -89.4, 30.1, -89.3, 29.1, -90.9, 29.1, -94, 29.6, -97.2, 27.7, -97.5, 25.4, -97.7, 22.2, -97.2, 20.5,
      -96.1, 19.1, -94.5, 18.2, -92, 18.6, -90.5, 19.7, -90.3, 21, -87.2, 21.5, -87.5, 19.5, -88.2, 17, -88.4, 15.9, -85.9, 15.9,
      -83.3, 15, -83.6, 11.4, -82.4, 9.4, -81.1, 8.8, -79.5, 9.6, -77.4, 8.6, -77.9, 7.2, -78.4, 8.3, -79.6, 8.9, -80.4, 7.4, -82.3, 8.2,
      -83.7, 8.7, -85.7, 9.9, -85.8, 11.2, -87.6, 13, -89.9, 13.6, -92.2, 14.5, -94.4, 16.1, -96.5, 15.7, -99.7, 16.7, -102.2, 17.9,
      -105.2, 19.9, -105.6, 21.6, -106.5, 23.2, -108.7, 25.4, -110.7, 27.8, -112.8, 30.2, -114.7, 31.7, -113.5, 29.3, -112.2, 26.8,
      -110.7, 24.3, -109.5, 23.1, -110.2, 23.5, -112.1, 24.8, -114, 27.3, -115.4, 29.7, -117.1, 32.5, -118.5, 34, -120.6, 34.6,
      -122.4, 37.2, -123.8, 39.6, -124.4, 42.5, -124, 46.2, -124.7, 48.4, -126.5, 49.8, -128.2, 51, -130, 54, -131.6, 55.5, -134, 58.2,
      -136.6, 58.5, -139.9, 59.7, -143.8, 60.1, -146.6, 60.8, -149.4, 59.8, -151.8, 59.3, -154, 58.4, -157, 57.3, -160.5, 55.9,
      -163.5, 54.9, -162, 55.8, -159, 57.2, -157.5, 58.6, -160.5, 58.7, -162.2, 59.9, -164.8, 60.4, -165.4, 61.8, -165, 62.7,
      -161, 64.3, -163.5, 64.6, -166.4, 64.6, -168, 65.6, -164.5, 66.5, -162.2, 66.1, -163.8, 67.2, -165.5, 68],
    // Greenland, Baffin, Victoria and Ellesmere islands, Newfoundland, Cuba, Hispaniola
    [-73, 78.2, -66, 80.5, -60, 82, -45, 82.8, -33, 83.6, -22, 82.5, -18, 80, -18.5, 77, -21, 74, -22.5, 71, -26, 68.5, -32, 68.2,
      -37, 65.7, -40.5, 64.5, -42, 61, -43.5, 60, -46, 60.7, -48.5, 61.5, -50.5, 63.5, -51.8, 65.5, -53.2, 67.5, -53.5, 70, -54.5, 71.5,
      -56, 73.5, -58.5, 75.5, -63, 76.3, -69, 76.5, -71, 77.5],
    [-88.5, 73.6, -80, 73.7, -76, 72.6, -71.5, 71, -68, 70, -66.5, 68.4, -62, 66.8, -63.5, 65.6, -65.3, 64.6, -64.7, 63.4, -68.5, 62.9,
      -71.5, 62.8, -74.5, 64.5, -77.5, 65.4, -73.7, 67.6, -76.5, 69.2, -81, 70, -85.6, 69.9, -89, 71.3],
    [-119, 71.4, -116, 73.3, -108, 72.9, -102.5, 71.7, -101.5, 69.8, -105, 68.9, -110, 68.8, -115.5, 69, -118, 70],
    [-92, 81, -85, 82.4, -73, 83, -62, 82.4, -68, 80.6, -75, 79.3, -79, 77, -88, 76.5, -91, 78],
    [-59.4, 47.6, -55.6, 51.6, -53.5, 49.3, -52.6, 47.5, -53.6, 46.6, -55.9, 46.9, -57.5, 47.6],
    [-84.9, 21.9, -82, 23.2, -79.5, 22.6, -77.2, 21.6, -74.1, 20.2, -77.7, 19.8, -78.5, 21.1, -80.5, 21.8, -82.5, 22.3, -84, 22],
    [-74.4, 19.9, -72.8, 19.9, -70, 19.8, -68.3, 18.6, -70.2, 18.2, -71.7, 17.7, -74.4, 18.4],
  ],
  southAmerica: [
    [-77.9, 7.2, -76.8, 8.6, -75.5, 10.5, -73, 11.4, -71.3, 12.4, -70.2, 11.6, -68.3, 10.5, -66, 10.6, -63, 10.7, -61.8, 10.6,
      -60.8, 8.6, -59, 8, -57, 6, -54, 5.8, -51.6, 4.2, -50, 1.8, -49.9, 0.3, -48.4, -1.2, -46, -1, -44.3, -2.4, -41.8, -2.8, -38.5, -3.7,
      -37.1, -4.8, -35.2, -5.5, -34.8, -7.6, -35.3, -9.4, -37.2, -11.3, -38.5, -13, -39.1, -17.6, -40.7, -20.8, -41.8, -22.9, -43.2, -23,
      -44.9, -23.4, -48.5, -26.3, -48.8, -28.6, -50.5, -30.8, -53.4, -33.8, -54.9, -34.9, -57.3, -36.4, -57.6, -38.1, -62.2, -38.9,
      -62.3, -40.6, -65, -40.9, -64.5, -42.4, -65.3, -44.5, -67.6, -46.4, -66, -47.5, -68.4, -50, -69.2, -51.6, -68.4, -52.4, -67.5, -54.5,
      -69.5, -55.3, -71.8, -54.4, -74.5, -52, -75.4, -49, -74.6, -46.5, -73.8, -43.5, -73.7, -41.5, -73.5, -38, -72.6, -35.3, -71.6, -33,
      -71.5, -29.8, -71, -25.7, -70.4, -23.5, -70.2, -18.4, -71.4, -17.6, -76, -14.2, -77.1, -12, -78.8, -8.6, -79.9, -6.7, -81.3, -4.7,
      -80.1, -3.4, -80.9, -2.2, -80.4, -0.4, -80, 0.9, -78.9, 1.4, -77.3, 3.9, -77.5, 6.5],
  ],
  europe: [
    [...URALS,
      37.3, 44.7, 36.5, 45.3, 35.5, 45.1, 33.5, 44.5, 32.5, 45.4, 33.5, 46, 31.5, 46.6, 30.5, 46.4, 29.6, 45.2, 28.6, 44, 27.9, 42.6,
      28, 41.6, 29, 41.1, 26.6, 40.6, 26, 40.8, 24, 40.5, 23.5, 40, 22.6, 40.5, 23, 39, 24, 38.2, 23.2, 37.6, 23.2, 36.4, 22.4, 36.5,
      21.7, 36.8, 21.1, 37.8, 21.5, 38.3, 20.7, 39, 20, 39.7, 19.4, 41.8, 18.5, 42.5, 16, 43.5, 15.2, 44.3, 13.6, 45.7, 12.4, 45.4,
      12.3, 44.3, 13.6, 43.5, 14.2, 42.4, 16, 41.9, 17, 41.1, 18.5, 40.1, 17.2, 40.4, 16.5, 39.7, 17.1, 39, 16.1, 38, 15.6, 38.3, 15.7, 40,
      14.6, 40.6, 13, 41.2, 12, 41.9, 11.1, 42.4, 10.5, 43.3, 9.8, 44.1, 8.8, 44.4, 7.5, 43.8, 6.5, 43.1, 4.8, 43.4, 3.3, 43.2, 3.2, 41.9,
      2.2, 41.4, 0.8, 40.7, 0, 39.5, 0.2, 38.7, -0.7, 37.6, -2.1, 36.7, -4.4, 36.7, -5.6, 36, -6.3, 36.6, -7.4, 37.2, -8.9, 37, -8.8, 38.5,
      -9.5, 38.7, -8.8, 40.5, -8.9, 42, -9.3, 43, -8, 43.7, -5.7, 43.6, -3.8, 43.5, -1.8, 43.4, -1.3, 44.5, -1.2, 46, -2.2, 47.1,
      -4.7, 47.9, -4.8, 48.4, -3, 48.8, -1.6, 48.7, -1.9, 49.7, -1.2, 49.4, 0.2, 49.5, 1.6, 50.4, 2.5, 51.1, 4.2, 51.4, 4.8, 52.9,
      6.8, 53.4, 8.6, 53.6, 8.6, 55, 8.1, 56.6, 10.6, 57.7, 10.3, 56.5, 10.6, 55, 10, 54.4, 11, 54, 13, 54.4, 14.3, 53.9, 16.5, 54.5,
      18.5, 54.7, 19.9, 54.4, 21.1, 55.7, 21.1, 56.9, 22.6, 57.6, 24.3, 57.2, 23.5, 58.4, 23.4, 59.2, 26, 59.6, 28.1, 59.5, 30.2, 59.9,
      29, 60.2, 26.5, 60.5, 24, 60.2, 22.5, 60.1, 21.4, 61.1, 21.5, 63, 24.5, 64.9, 25.5, 65, 24.2, 65.8, 22.3, 65.6, 21.2, 64.6,
      19.5, 63.5, 17.7, 62.6, 17.2, 61.5, 18.3, 60.5, 18.9, 59.8, 18.1, 59.3, 16.7, 58.2, 16.5, 57, 15.8, 56.1, 14.3, 55.5, 12.9, 55.4,
      12.6, 56.2, 11.8, 57.7, 11.1, 59, 10.6, 59.9, 10.1, 59, 8, 58.1, 5.6, 58.9, 5, 60.5, 5.1, 61.9, 6, 62.5, 8, 63.3, 10, 64, 12.4, 65.8,
      14.3, 67.3, 15.5, 68.3, 17.5, 69.5, 20, 70, 23.5, 70.6, 25.8, 71.1, 28.5, 70.9, 31, 70.3, 33, 69.4, 36.5, 69, 41, 67.7, 44, 66.4,
      44.2, 68.4, 49, 68, 53.5, 68.9, 58, 68.8],
    // Great Britain, Ireland, Iceland, Sicily
    [-5.7, 50.1, -4.2, 50.4, -3, 50.7, -1.3, 50.8, 1.4, 51.2, 0.9, 51.8, 1.7, 52.6, 0.3, 53.5, -0.1, 54.1, -1.3, 54.8, -1.6, 55.6,
      -2.6, 56.1, -1.8, 57.5, -3.4, 57.7, -3, 58.6, -5, 58.6, -5.7, 57.6, -5.6, 56.4, -5.2, 55.5, -4.9, 54.8, -3.6, 54.9, -3.4, 54.4,
      -3, 53.9, -3.1, 53.3, -4.6, 53.3, -4.3, 52.8, -4.1, 52.3, -5.2, 51.8, -4.2, 51.6, -3.2, 51.5, -4.2, 51.2, -5, 50.6],
    [-6.2, 55.2, -7.3, 55.4, -8.5, 55.1, -10, 54.2, -9.9, 53.4, -9.5, 52.6, -10.4, 51.9, -9.6, 51.5, -8, 51.8, -6.4, 52.2, -6, 53,
      -6.2, 54, -5.5, 54.5],
    [-24.3, 65.6, -22, 66.4, -18.5, 66.2, -15, 66.5, -13.6, 65.1, -14.8, 64.3, -18.7, 63.4, -22.6, 63.8, -22, 64.6, -24, 64.9],
    [12.4, 38.1, 15.6, 38.3, 15.1, 36.7, 12.6, 37.6],
  ],
  africa: [
    [-5.9, 35.8, -2.2, 35.1, 1.2, 36.5, 3.5, 36.8, 6.6, 37.1, 9.8, 37.3, 11.1, 36.9, 10.5, 35.6, 10.8, 34.7, 10.2, 33.9, 11.2, 33.3,
      12.5, 32.8, 15.3, 32.3, 17.5, 31, 19.2, 30.3, 20.1, 31.2, 20.1, 32.3, 21.6, 32.9, 23.2, 32.2, 25.2, 31.6, 27.4, 31.4, 29.9, 31.3,
      32.3, 31.2, 32.55, 29.9, 32.7, 28.6, 33.9, 26.8, 35.6, 23.9, 37.2, 21, 37.4, 18.9, 38.7, 17.5, 39.7, 15.5, 41.6, 13.6, 43.2, 11.6,
      44.5, 10.4, 47.4, 11.2, 51.2, 11.8, 51.1, 10.4, 49.8, 7.5, 48, 4.6, 46.4, 2.3, 42.5, -0.4, 41.5, -1.8, 39.7, -4.1, 38.8, -6.5,
      39.5, -8.5, 40.4, -10.5, 40.6, -14.6, 39.5, -16.6, 36.9, -18, 35.1, -20, 35.4, -22.1, 35.5, -24.1, 32.9, -25.9, 32.6, -28.3,
      31.1, -29.8, 28.5, -32.4, 25.6, -33.9, 22.1, -34.1, 20, -34.8, 18.4, -34.2, 18.2, -32.4, 17, -29.2, 15.2, -27, 14.5, -22.9,
      13.1, -20.2, 11.8, -17.3, 12.2, -14, 13.6, -11, 13.2, -8.8, 12.3, -6.1, 11.8, -4.4, 9.3, -1.4, 8.7, -0.7, 9.4, 0.4, 9.8, 2.6,
      9.7, 4, 8.7, 4.5, 7.2, 4.4, 6, 4.3, 5, 5.8, 3.4, 6.4, 1.3, 6.1, -1, 5.2, -2.9, 5, -4.8, 5.2, -7.5, 4.4, -9.3, 5.5, -11.2, 6.9,
      -13.2, 8.5, -14.8, 10.4, -16.5, 12.2, -17.2, 14.7, -16.5, 16, -16.4, 19.5, -17.1, 20.9, -16.4, 22.8, -14.9, 25.8, -13, 27.7,
      -11.2, 28.2, -9.8, 29.9, -9.8, 31.5, -8.5, 33.3, -6.8, 34.1],
    // Madagascar
    [49.3, -12, 50.4, -15.4, 49.6, -17.3, 48.6, -20.5, 47.1, -24.9, 45.2, -25.5, 43.7, -23.3, 43.3, -21.6, 44.4, -19.7, 44.1, -17,
      46.3, -15.8, 47.9, -13.6],
  ],
  asia: [
    [40, 43.5, 41.6, 41.6, 37, 41.1, 35.1, 42, 33, 41.9, 31, 41.2, 29.1, 41.1, 27.5, 40.4, 26.2, 40.1, 26.7, 38.4, 27.3, 37, 28.3, 36.7,
      30.5, 36.4, 32.5, 36.1, 34.6, 36.8, 36, 36.6, 35.8, 35.2, 35.5, 33.9, 34.9, 32.5, 34.3, 31.3, 32.3, 31.2, 32.55, 29.9, 33.6, 28.2,
      34.2, 27.8, 34.9, 29.5, 35.2, 28, 36.6, 25.8, 38.1, 24.1, 39.2, 21.5, 40.8, 19, 42.7, 15.5, 43.4, 12.7, 45, 12.8, 48.7, 14,
      52.2, 15.6, 55.4, 17.4, 56.8, 18.7, 57.8, 19.4, 59.8, 22.4, 58.6, 23.6, 56.4, 24.9, 56.3, 26.3, 55.5, 25.4, 54, 24.1, 51.6, 24.3,
      50.8, 25.2, 50.2, 26.4, 49.6, 27.1, 48.5, 28.4, 48.3, 29.9, 50.2, 30.1, 51, 28.8, 52.5, 27.5, 54.3, 26.6, 56.5, 27.1, 57.4, 25.7,
      61.6, 25.2, 66.6, 25.4, 67.4, 24, 68.6, 23.2, 70.3, 22.9, 69, 22.4, 70.9, 20.8, 72.6, 21.3, 72.8, 19, 73.4, 16.5, 74.6, 13.6,
      75.8, 11, 76.4, 9.3, 77.5, 8.1, 78.2, 8.9, 79.3, 10.3, 79.9, 12.5, 80.1, 15.4, 81.2, 16.3, 82.3, 17, 84.3, 18.8, 86.6, 20.3,
      87.3, 21.6, 88.6, 21.8, 90, 22, 91.4, 22.6, 92, 21.2, 92.4, 20.6, 93.6, 19.3, 94.4, 16.2, 95.4, 15.8, 97.2, 16.7, 97.7, 15,
      98.6, 12.8, 98.4, 10, 98.3, 8.1, 99.6, 6.6, 100.3, 5.3, 101.3, 2.9, 103.5, 1.3, 104.2, 1.4, 103.4, 4.2, 103, 5.5, 102.2, 6.2,
      101.3, 6.9, 100.4, 7.4, 99.9, 9.2, 99.2, 10.4, 99.9, 12.6, 100.5, 13.5, 101.6, 12.6, 102.5, 12, 103.5, 10.6, 104.6, 10.4, 105, 8.6,
      106.7, 10.4, 107.9, 11.3, 109.2, 11.7, 109.3, 13.7, 108.8, 15.4, 107.5, 16.8, 106.4, 18.2, 105.8, 19.2, 106.7, 20.7, 108, 21.5,
      109.8, 21.5, 110.3, 20.3, 111, 21.5, 113.5, 22.3, 116, 22.9, 117.6, 23.9, 119.4, 25.4, 120.3, 27.2, 121.9, 29.9, 121.4, 31.6,
      120.8, 32.6, 119.4, 34.6, 120.6, 36.1, 122.5, 36.9, 121.2, 37.6, 119, 37.2, 117.8, 38.4, 118.9, 39.2, 121, 40.8, 122.2, 40.5,
      121.2, 39, 124.3, 39.9, 125.2, 38.9, 126.2, 37.5, 126.5, 34.6, 127.6, 34.6, 129.2, 35.1, 129.4, 36.5, 128.6, 38.3, 127.5, 39.7,
      129.6, 40.9, 130.6, 42.4, 132, 43.2, 133.2, 42.8, 135.3, 43.9, 137.4, 45.6, 139.2, 47.8, 140.4, 50, 140.9, 51.8, 141.4, 53.2,
      139.2, 54.2, 137.2, 54, 135.3, 54.7, 138.5, 56.8, 141.3, 58.8, 143.3, 59.4, 148.5, 59.3, 152, 59.1, 154.3, 59.5, 156.7, 61.5,
      160.2, 61.7, 157.5, 58, 156.7, 51, 158.7, 52.9, 160, 54.5, 162.1, 56.2, 163.3, 58, 164.8, 59.8, 166.3, 60.4, 170.3, 60,
      172.8, 61.4, 176.3, 62.4, 178.8, 63.1, 180, 65.2, 180, 68.9, 176, 69.8, 170.5, 70.1, 166, 69.6, 160.5, 70, 156, 71.1, 150.5, 71.5,
      146, 72.4, 140, 72.5, 135, 71.6, 129.5, 71.5, 128, 72.9, 122.5, 73.1, 113.5, 73.4, 112, 74.4, 107.5, 76.6, 104.3, 77.7, 100, 76.5,
      96, 76.1, 88.5, 75.5, 86.5, 74.3, 82, 72.9, 78, 72.3, 73.5, 72.7, 69, 73, 68.2, 70.8, 66.5, 69.6, 63, 69.6, ...URALS],
    // Japan (Honshu with Kyushu, then Hokkaido), Taiwan, Sri Lanka, Sumatra, Java, Borneo, Luzon, Mindanao
    [129.7, 33.5, 130.5, 31.2, 131.6, 31.6, 132, 33.2, 133.6, 33.5, 134.7, 33.8, 135.8, 33.5, 136.9, 34.3, 138.8, 34.6, 139.8, 34.9,
      140.9, 35.7, 140.8, 37.5, 141.1, 38.4, 142, 39.6, 141.4, 41.4, 140, 40.6, 140, 39.4, 139.4, 38.1, 138.5, 37.3, 136.9, 37.1,
      136.7, 36.3, 135.4, 35.6, 133.2, 35.5, 131.8, 34.6, 130.9, 34.2],
    [140, 41.5, 140.4, 42.6, 141.2, 43.3, 141.6, 45.4, 143.3, 44.3, 145.3, 44.3, 145.5, 43.3, 143.8, 42.2, 141.5, 42.6, 140.9, 41.8],
    [120.1, 23.1, 121, 25, 121.9, 25, 121.6, 23, 120.8, 21.9],
    [79.8, 8.2, 80.2, 9.8, 81.4, 8.6, 81.8, 7, 81, 6.1, 80.1, 6.2],
    [95.3, 5.6, 97.7, 5.1, 100.4, 2.2, 103.4, -0.6, 104.4, -1.8, 106, -3.2, 105.8, -5.8, 104.6, -5.9, 102.3, -4, 100.4, -1, 98.8, 1.7,
      96.3, 3.8],
    [105.2, -6.8, 106.7, -6, 108.3, -6.3, 110.4, -6.9, 112.6, -6.9, 114.5, -7.8, 114.4, -8.6, 111, -8.3, 108, -7.8, 106.4, -7.4],
    [109, 1.4, 109.6, 2, 111.3, 2.6, 113, 3.3, 115.5, 5.3, 116.8, 7, 117.7, 6, 119.2, 5.3, 117.7, 4.2, 118, 2.3, 117.8, 0.8, 117.4, -0.5,
      116.5, -2.4, 116.2, -3.9, 114.6, -3.9, 113, -3.2, 111.7, -3, 110.2, -2.9, 110, -1.5, 109.1, -0.4],
    [120.6, 18.5, 122.2, 18.5, 122.4, 17, 121.6, 15.6, 122.6, 14.2, 124, 13.9, 124.2, 12.6, 123.3, 13, 121.8, 13.8, 120.6, 14.3,
      120.1, 15.6, 120.3, 16.8],
    [122, 7, 123.6, 7.9, 124.3, 8.6, 125.4, 9.8, 126.6, 7.3, 126.2, 6.3, 125.4, 5.6, 124.1, 6.4],
  ],
  australia: [
    [113.6, -22, 113.3, -24.6, 114.2, -26.3, 115, -29.5, 115.7, -31.7, 115, -33.6, 115.6, -34.4, 117.9, -35.1, 120, -33.9, 123.6, -33.9,
      126, -32.3, 129, -31.6, 131.2, -31.5, 134.2, -32.7, 135.6, -34.8, 137.8, -32.6, 137, -35.2, 138.5, -34.2, 138.2, -35.6, 139.6, -37,
      140.9, -38, 143.5, -38.8, 144.9, -37.9, 146.4, -39.1, 148, -37.8, 150, -37.4, 150.8, -34.6, 151.3, -33.8, 152.5, -32, 153.6, -28.6,
      153.2, -25.9, 151.2, -23.6, 149.4, -21.5, 146.3, -19, 145.4, -16.4, 145.3, -14.9, 143.6, -14, 143.5, -12.6, 142.5, -10.7,
      141.6, -12.6, 141.6, -15.5, 140.8, -17.4, 139.3, -17.4, 137.4, -15.9, 135.5, -14.9, 136.6, -13.2, 136.7, -12.2, 134, -11.9,
      132.6, -11.5, 131, -12.2, 130, -13.1, 129.6, -14.9, 127.9, -14.5, 126, -14.1, 125, -15.4, 123.6, -16.6, 122.2, -17.9, 121.1, -19.5,
      118.8, -20.3, 116.7, -20.6, 114.6, -21.8],
    // Tasmania, New Zealand, New Guinea
    [144.6, -40.7, 148.3, -40.9, 148.3, -42.2, 147.3, -43.3, 146, -43.6, 145.2, -42.1],
    [172.7, -34.4, 174.3, -35.5, 174.9, -36.9, 175.9, -37.4, 177, -37.9, 178.5, -37.7, 177.9, -39.2, 176.9, -39.6, 176.2, -40.9,
      175.2, -41.6, 174.6, -41.3, 175.2, -40.2, 174.4, -39.6, 173.8, -39.3, 174.7, -38.1, 174.5, -37, 173.3, -35.6],
    [172.7, -40.5, 174.3, -41.7, 173.6, -42.8, 173, -43.8, 171.3, -44.4, 170.6, -45.9, 169, -46.6, 166.5, -46.1, 166.8, -45.2, 168.3, -44,
      170.5, -42.9, 171.6, -41.7],
    [131, -1.3, 132.8, -0.5, 134.1, -0.9, 135.5, -3.3, 137.5, -1.5, 140, -2.3, 141, -2.6, 144.5, -3.8, 145.8, -5.1, 147.6, -6.1,
      147.9, -8, 149.3, -9.6, 150.2, -10.6, 148.2, -10.1, 146.3, -8.7, 144.4, -7.6, 143.4, -9, 142.4, -9.2, 141, -9.1, 139.6, -8.2,
      138.3, -8.4, 138.1, -7.2, 137.7, -5.2, 135.3, -4.4, 133.8, -3.8, 132.3, -2.7, 131.3, -1.5],
  ],
  antarctica: [
    [-180, -78.3, -165, -78.2, -158, -77.3, -150, -76.6, -140, -75.2, -130, -74.3, -120, -73.6, -110, -74.3, -100, -73.2, -90, -72.6,
      -80, -73.2, -73, -70.5, -67, -67.5, -63, -65, -57, -63.4, -60, -64.5, -62.3, -66.5, -61.5, -69, -61, -72, -60, -75, -55, -77.5,
      -50, -77.8, -40, -78.2, -34, -77.4, -28, -76, -20, -73.5, -12, -71.5, 0, -70.2, 10, -70, 20, -70.1, 30, -69.5, 40, -68.8, 50, -67,
      60, -67.2, 70, -69.3, 80, -67.4, 90, -66.4, 100, -66, 110, -66, 120, -66.6, 130, -66.2, 140, -66.8, 150, -68.5, 160, -70.2,
      170, -71.5, 165, -74.5, 164, -77.5, 175, -78.2, 180, -78.3, 180, -90, -180, -90],
  ],
};

const CASPIAN = [46.8, 44.5, 47.5, 45.6, 49.2, 46.4, 51.5, 47, 53.2, 46.6, 53.1, 45.2, 51.3, 44.5, 51.3, 43.2, 52.6, 42.2, 52.9, 41.1,
  53.9, 40.6, 53.9, 38.9, 53.9, 37.3, 51.6, 36.8, 50.3, 37.3, 49.1, 37.6, 48.9, 38.4, 49.4, 40.2, 49.9, 40.5, 49.1, 41.2, 48.2, 42,
  47.5, 43, 47.4, 44.2];

// Equirectangular: 1000 × 500 for the whole globe; the view leaves out the poles.
const X = (lon: number) => ((lon + 180) * 1000) / 360;
const Y = (lat: number) => ((90 - lat) * 1000) / 360;
const toPath = (flat: number[]) => {
  let d = '';
  for (let i = 0; i < flat.length; i += 2) d += `${i ? 'L' : 'M'}${X(flat[i]).toFixed(1)} ${Y(flat[i + 1]).toFixed(1)}`;
  return d + 'Z';
};
const toLine = (flat: number[]) => toPath(flat).slice(0, -1);
const PATHS = Object.fromEntries(
  (Object.keys(OUTLINES) as ContinentId[]).map(id => [id, OUTLINES[id].map(toPath).join(' ')]),
) as Record<ContinentId, string>;

const LABEL_AT: Record<ContinentId, [number, number]> = {
  northAmerica: [-102, 50], southAmerica: [-58, -16], europe: [22, 54], africa: [20, 6],
  asia: [95, 52], australia: [134, -25], antarctica: [40, -75],
};
const OCEAN_AT: Record<OceanId, [number, number]> = {
  pacific: [-140, 2], atlantic: [-42, 28], indian: [78, -22], southern: [-112, -57], arctic: [15, 77],
};
const OCEAN_RANK: OceanId[] = ['pacific', 'atlantic', 'indian', 'southern', 'arctic'];

// Two lines for the long names, so they fit inside their continent.
function nameLines(id: ContinentId | OceanId, lang: Lang): string[] {
  const n = (CONTINENT_NAMES as Record<string, { fr: string; en: string }>)[id] ?? OCEAN_NAMES[id as OceanId];
  const s = pick(n, lang);
  if (id === 'northAmerica' || id === 'southAmerica') return lang === 'fr' ? ['Amérique', s.slice(9)] : s.split(' ');
  if (id in OCEAN_NAMES) return lang === 'fr' ? ['Océan', s.slice(6)] : s.split(' ');
  return [s];
}

export interface MapMark {
  kind: 'peak' | 'dot' | 'river' | 'range' | 'area';
  at: number[];                  // [lon, lat], or a line of them for a river or a range
  label: Text;
  labelAt?: [number, number];
  anchor?: 'start' | 'middle' | 'end';
}

const halo = { paintOrder: 'stroke' as const, stroke: '#fff', strokeWidth: 4.5, strokeLinejoin: 'round' as const };

export function WorldMap({ lang, highlight, labels = true, oceans = false, lines = false, sodor = false, marks = [], label, className = '' }: {
  lang: Lang;
  highlight?: ContinentId[];     // the continents in colour (all of them when left out)
  labels?: boolean;              // the names of the continents in colour
  oceans?: boolean | 'ranked';   // the names of the oceans, numbered by size when 'ranked'
  lines?: boolean;               // the equator and the two tropics
  sodor?: boolean;               // where the Island of Sodor is
  marks?: MapMark[];
  label?: string;                // the accessible name, when the default would give away an answer
  className?: string;
}) {
  const fr = lang === 'fr';
  const ids = Object.keys(OUTLINES) as ContinentId[];
  const lit = (id: ContinentId) => !highlight || highlight.includes(id);
  const shown = ids.filter(lit);
  const aria = label ?? (fr
    ? `Carte du monde : ${highlight ? shown.map(id => CONTINENT_NAMES[id].fr).join(', ') || 'les océans' : 'les sept continents'}`
    : `World map: ${highlight ? shown.map(id => CONTINENT_NAMES[id].en).join(', ') || 'the oceans' : 'the seven continents'}`);

  const textAt = (lon: number, lat: number, rows: string[], size: number, extra: React.SVGProps<SVGTextElement> = {}) => (
    <text x={X(lon)} y={Y(lat) - ((rows.length - 1) * size * 0.55)} textAnchor="middle" fontSize={size} fontWeight={800} fill={INK} style={halo} {...extra}>
      {rows.map((r, k) => <tspan key={k} x={extra.x ?? X(lon)} dy={k ? size * 1.05 : 0}>{r}</tspan>)}
    </text>
  );

  return (
    <svg viewBox="0 12 1000 468" className={`block w-full h-auto rounded-2xl border-[3px] border-ink ${className}`} role="img" aria-label={aria}
      style={{ background: SEA }}>
      {ids.map(id => (
        <path key={id} d={PATHS[id]} fill={lit(id) ? COLORS[id] : MUTED} stroke={INK} strokeWidth={1.4} strokeLinejoin="round"
          opacity={lit(id) ? 1 : 0.9} />
      ))}
      <path d={toPath(CASPIAN)} fill={SEA} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />

      {lines && [0, 23.44, -23.44].map((lat, k) => (
        <g key={lat}>
          <line x1={0} x2={1000} y1={Y(lat)} y2={Y(lat)} stroke={k ? '#2c6e9b' : '#c0392b'} strokeWidth={k ? 1.6 : 2.2} strokeDasharray="8 6" opacity={0.8} />
          <text x={8} y={Y(lat) - 5} fontSize={13} fontWeight={700} fill={k ? '#1d4f73' : '#a02c20'} style={halo}>
            {[fr ? 'équateur' : 'equator', fr ? 'tropique du Cancer' : 'Tropic of Cancer', fr ? 'tropique du Capricorne' : 'Tropic of Capricorn'][k]}
          </text>
        </g>
      ))}


      {oceans && OCEAN_RANK.map((o, k) => {
        const [lon, lat] = OCEAN_AT[o];
        const rows = nameLines(o, lang);
        const cx = X(lon) - Math.max(...rows.map(r => r.length)) * 4.3 - 16;
        return (
          <g key={o}>
            {oceans === 'ranked' && (
              <g>
                <circle cx={cx} cy={Y(lat)} r={12} fill="#ffd23f" stroke={INK} strokeWidth={2} />
                <text x={cx} y={Y(lat) + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill={INK}>{k + 1}</text>
              </g>
            )}
            {textAt(lon, lat, rows, 15, { fill: '#174a73', fontStyle: 'italic', fontWeight: 700 })}
          </g>
        );
      })}

      {marks.map((m, k) => {
        const pts = m.at;
        const [lon, lat] = m.labelAt ?? [pts[0], pts[1]];
        const anchor = m.anchor ?? 'middle';
        return (
          <g key={k}>
            {m.kind === 'river' && <path d={toLine(pts)} fill="none" stroke="#1f6fc5" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round" />}
            {m.kind === 'range' && <path d={toLine(pts)} fill="none" stroke="#6b4423" strokeWidth={4.5} strokeDasharray="7 4" strokeLinecap="round" strokeLinejoin="round" />}
            {m.kind === 'peak' && <path d={`M${X(pts[0])} ${Y(pts[1]) - 9} l7 12 h-14 z`} fill="#6b4423" stroke="#fff" strokeWidth={1.5} />}
            {m.kind === 'dot' && <circle cx={X(pts[0])} cy={Y(pts[1])} r={4.5} fill="#e23b2e" stroke="#fff" strokeWidth={1.5} />}
            <text x={X(lon)} y={Y(lat)} textAnchor={anchor} fontSize={14} fontWeight={800} fill={INK}
              fontStyle={m.kind === 'area' ? 'italic' : undefined} style={halo}>{pick(m.label, lang)}</text>
          </g>
        );
      })}

      {sodor && (
        <g>
          <path d={`M${X(-17)} ${Y(48.5)} L${X(-4.6)} ${Y(53.9)}`} stroke={INK} strokeWidth={1.5} />
          <circle cx={X(-4.3)} cy={Y(54.3)} r={5} fill="#e23b2e" stroke="#fff" strokeWidth={2} />
          <text x={X(-17.5)} y={Y(47)} textAnchor="end" fontSize={15} fontWeight={800} fill="#b3261e" style={halo}>Sodor</text>
        </g>
      )}

      {labels && shown.map(id => (
        <React.Fragment key={id}>{textAt(LABEL_AT[id][0], LABEL_AT[id][1], nameLines(id, lang), 17)}</React.Fragment>
      ))}
    </svg>
  );
}

// ---- The lesson ---------------------------------------------------------------

const NILE = [33.2, 0.4, 32.5, 3.5, 31.6, 9.5, 32.5, 15.6, 33.8, 17.6, 32.5, 21.5, 32.9, 24.1, 31.2, 30, 31, 31.3];
const AMAZON = [-77, -4.5, -73, -4.2, -69, -3.6, -65, -3.4, -60, -3.1, -55, -2.3, -51.5, -1.2, -50, -0.2];
const ANDES = [-71, 9, -75.5, 4, -78.3, -1.5, -76.5, -9, -71, -15.5, -68.3, -22, -69.8, -30, -70.8, -38, -72, -45, -73, -50];

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Sept continents, cinq océans', en: 'Seven continents, five oceans' },
    body: {
      fr: 'Vue de l’espace, la Terre est surtout bleue : l’eau couvre plus des deux tiers de sa surface. La terre ferme forme sept grands morceaux : les <b>continents</b>. Les îles sont rattachées au continent voisin. Ainsi, l’île de Sodor, où roule Thomas, fait partie de l’<b>Europe</b>.',
      en: 'Seen from space, the Earth is mostly blue: water covers more than two thirds of its surface. The dry land makes seven big pieces: the <b>continents</b>. Islands belong to the continent next to them. So the Island of Sodor, where Thomas runs, is part of <b>Europe</b>.',
    },
    visual: lang => <WorldMap lang={lang} oceans sodor />,
    note: {
      fr: 'Les 7 continents : l’Afrique, l’Amérique du Nord, l’Amérique du Sud, l’Antarctique, l’Asie, l’Australie et l’Europe.',
      en: 'The 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America and South America.',
    },
  },
  {
    title: { fr: 'L’Asie et l’Europe', en: 'Asia and Europe' },
    body: {
      fr: 'L’<b>Asie</b> est le plus grand continent, et le plus peuplé : presque 6 humains sur 10 y vivent. On y trouve le mont <b>Everest</b> (8 849 m), la plus haute montagne du monde, à la frontière entre le Népal et la Chine. L’<b>Europe</b> est collée à l’Asie : on place la frontière le long des monts <b>Oural</b>. L’Europe est petite, mais pleine de pays et de chemins de fer.',
      en: '<b>Asia</b> is the largest continent, and the one with the most people: almost 6 people out of 10 live there. It has <b>Mount Everest</b> (8,849 m), the highest mountain in the world, on the border between Nepal and China. <b>Europe</b> is joined to Asia: the border is placed along the <b>Ural Mountains</b>. Europe is small, but full of countries and railways.',
    },
    visual: lang => (
      <WorldMap lang={lang} highlight={['asia', 'europe']} sodor marks={[
        { kind: 'peak', at: [86.9, 28], label: 'Everest', labelAt: [86.9, 21] },
        { kind: 'range', at: URALS.slice(0, 10), label: { fr: 'Oural', en: 'Urals' }, labelAt: [63, 61], anchor: 'start' },
      ]} />
    ),
    note: {
      fr: 'Le premier chemin de fer public tiré par des locomotives à vapeur a ouvert en Angleterre, en 1825.',
      en: 'The first public railway worked by steam engines opened in England, in 1825.',
    },
  },
  {
    title: { fr: 'L’Afrique', en: 'Africa' },
    body: {
      fr: 'L’<b>Afrique</b> est le deuxième plus grand continent. Elle compte <b>54 pays</b>, plus que tout autre continent. Au nord s’étend le <b>Sahara</b>, le plus grand désert chaud du monde. Le <b>Nil</b>, souvent présenté comme le plus long fleuve du monde, coule du sud vers le nord jusqu’à la mer Méditerranée. Dans les savanes vivent des lions, des éléphants et des girafes.',
      en: '<b>Africa</b> is the second-largest continent. It has <b>54 countries</b>, more than any other continent. In the north lies the <b>Sahara</b>, the largest hot desert in the world. The <b>Nile</b>, often called the longest river in the world, flows from south to north into the Mediterranean Sea. Lions, elephants and giraffes live on the savannahs.',
    },
    visual: lang => (
      <WorldMap lang={lang} highlight={['africa']} lines marks={[
        { kind: 'area', at: [5, 24], label: 'Sahara' },
        { kind: 'river', at: NILE, label: { fr: 'Nil', en: 'Nile' }, labelAt: [35, 18.5], anchor: 'start' },
      ]} />
    ),
    note: {
      fr: 'L’Afrique est le seul continent traversé à la fois par l’équateur et par les deux tropiques.',
      en: 'Africa is the only continent crossed by the equator and by both tropics.',
    },
  },
  {
    title: { fr: 'Les deux Amériques', en: 'The two Americas' },
    body: {
      fr: 'L’<b>Amérique du Nord</b> va du Canada au Panama, en passant par les États-Unis et le Mexique. Le Groenland, la plus grande île du monde, en fait partie. L’<b>Amérique du Sud</b> abrite la <b>forêt amazonienne</b>, la plus grande forêt tropicale du monde, et la cordillère des <b>Andes</b>, la plus longue chaîne de montagnes sur la terre ferme. Les deux continents se tiennent par une étroite bande de terre : l’isthme de <b>Panama</b>.',
      en: '<b>North America</b> stretches from Canada to Panama, through the United States and Mexico. Greenland, the largest island in the world, is part of it. <b>South America</b> has the <b>Amazon rainforest</b>, the largest tropical rainforest in the world, and the <b>Andes</b>, the longest mountain range on land. The two continents hold hands through a narrow strip of land: the Isthmus of <b>Panama</b>.',
    },
    visual: lang => (
      <WorldMap lang={lang} highlight={['northAmerica', 'southAmerica']} marks={[
        { kind: 'river', at: AMAZON, label: { fr: 'Amazone', en: 'Amazon' }, labelAt: [-63, 1] },
        { kind: 'range', at: ANDES, label: 'Andes', labelAt: [-75.5, -26], anchor: 'end' },
        { kind: 'dot', at: [-80, 8.8], label: 'Panama', labelAt: [-86, 4], anchor: 'end' },
      ]} />
    ),
    note: {
      fr: 'Le canal de Panama, ouvert en 1914, coupe cet isthme : les bateaux passent de l’Atlantique au Pacifique sans faire le tour de l’Amérique du Sud.',
      en: 'The Panama Canal, opened in 1914, cuts through this isthmus: ships go from the Atlantic to the Pacific without sailing all the way round South America.',
    },
  },
  {
    title: { fr: 'L’Australie et l’Antarctique', en: 'Australia and Antarctica' },
    body: {
      fr: 'L’<b>Australie</b> est le plus petit continent, et c’est aussi un pays. Les kangourous et les koalas y vivent en liberté. Avec la Nouvelle-Zélande et les îles du Pacifique, on parle de l’<b>Océanie</b>. Tout au sud, l’<b>Antarctique</b> est le continent le plus froid, le plus venteux et le plus sec. Il est presque entièrement couvert de glace.',
      en: '<b>Australia</b> is the smallest continent, and it is also a country. Kangaroos and koalas live there in the wild. Together with New Zealand and the Pacific islands, it is called <b>Oceania</b>. Far to the south, <b>Antarctica</b> is the coldest, windiest and driest continent. It is almost completely covered in ice.',
    },
    visual: lang => <WorldMap lang={lang} highlight={['australia', 'antarctica']} />,
    note: {
      fr: 'Personne n’habite l’Antarctique pour toujours : seuls des scientifiques y séjournent, dans des stations de recherche. Les manchots, eux, y sont chez eux !',
      en: 'Nobody lives in Antarctica for good: only scientists stay there, in research stations. Penguins, though, are right at home!',
    },
  },
  {
    title: { fr: 'Les cinq océans', en: 'The five oceans' },
    body: {
      fr: 'Les bateaux qui quittent le port de Brendam, à Sodor, naviguent sur l’océan <b>Atlantique</b>. Il y a cinq océans. Du plus grand au plus petit : le <b>Pacifique</b>, l’<b>Atlantique</b>, l’<b>Indien</b>, l’<b>Austral</b>, autour de l’Antarctique, et l’<b>Arctique</b>, autour du pôle Nord. Ils se touchent tous : ensemble, ils forment un seul grand océan mondial.',
      en: 'The ships leaving Brendam Docks, on Sodor, sail on the <b>Atlantic</b> Ocean. There are five oceans. From the largest to the smallest: the <b>Pacific</b>, the <b>Atlantic</b>, the <b>Indian</b>, the <b>Southern</b> Ocean around Antarctica, and the <b>Arctic</b> around the North Pole. They all touch: together they make one big world ocean.',
    },
    visual: lang => <WorldMap lang={lang} highlight={[]} oceans="ranked" sodor />,
    note: {
      fr: 'Le Pacifique est si grand que toutes les terres du monde y tiendraient !',
      en: 'The Pacific is so big that all the land in the world would fit inside it!',
    },
  },
];

export default function ContinentsLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  return (
    <LessonPlayer
      title={{ fr: 'Les 7 continents', en: 'The 7 Continents' }}
      color={color ?? geography.color}
      steps={STEPS}
      links={geography.links}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
