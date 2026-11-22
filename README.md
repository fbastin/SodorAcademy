# Sodor Academy

An interactive educational platform for children set in the Thomas & Friends universe.

Sodor Academy is part of the pages for kids on slashbin.net (`/kids.php`) and follows
their programme and their look. It speaks French and English.

## How it is organised

- **Stations** (`src/content/stations.ts`): one per subject, placed on the map of Sodor.
  A station lists its lessons, exercises and quiz, and links to the pages of slashbin.net
  on the same topics (physics, chemistry, maths activities, the programming course, the
  Practice Room). An activity still written in English only is marked `enOnly`.
- **Languages** (`src/i18n.tsx`): `?lang=fr|en`, then the last choice, then the site's
  `lang` cookie, then the browser. A text in both languages is `{ fr, en }`.
- **Addresses** (`src/router.ts`): each screen has its own `#/station/<id>/<activity>`
  address, so the browser's Back button works and the site can link to a station.
- **Exercises from the Practice Room** (`src/practice/bank.ts`, `src/views/SkillExercise.tsx`):
  activities with a `practice` topic load the skill files of `/Practice/` (the same
  generators, levels and explanations as the Practice Room) and play them on the rails
  of Sodor. They need the site's `/Practice/` and `/vendor/highlight.js/`.
- **Lessons and exercises**: lessons are steps given to `src/components/LessonPlayer.tsx`
  (see `src/lessons/` and `src/components/*Lesson.tsx`); exercises draw their question
  inside `src/components/ExerciseFrame.tsx`. The music theory lessons
  (`src/lessons/MusicLessons.tsx`) draw their staves with the Practice Room's engraver,
  `window.MUSIC_STAFF` from `/Practice/skills-musique.js`, loaded with the exercises.
- **Quiz questions**: the banks are in English (`src/services/localData.ts`,
  `src/services/questions/*.json`); `src/services/questions/fr/<subject>.json` translates
  each question by its id, options in the same order (the right answer is found by its
  position). The English station's quiz and the stories stay in English on purpose.
- **Look** (`src/index.css`): the style of the activities of the pages for kids — a dotted
  sky, dark ink, white cards ringed in ink and sticker buttons (`card-ink`, `chunky`,
  `sticker-title`, `note-paper`).
- **Progress**: without an account it is kept in the browser; with an account (name, PIN
  and a parent's email, `server.js`) on the server.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app in development mode:
   `npm run dev`
3. Or run the production build locally:
   `npm run build && npm start`

## Deployment

### On your own server (slashbin.net)

Apache proxies `/SodorAcademy` to `server.js` (port 3000), which serves `dist/`, `media/`
and the API. After a change, `npm run lint && npm run build`: the new `dist/` is live at
once; restart `server.js` only when `server.js` itself changed.

### GitHub Pages
This repository is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

## Piano

`piano-lib/` is a copy of [SodorPiano](https://github.com/fbastin/SodorPiano). To bring in a newer version, run `scripts/sync-piano.sh [path to SodorPiano]` (default `../SodorPiano`), then `npm run build`. The synced revision is recorded in `piano-lib/VERSION`.
