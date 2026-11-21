import { useEffect, useState } from 'react';

// Each screen has its own address after the #, so the browser's Back button
// works, a page can be bookmarked, and the pages for kids on slashbin.net can
// link straight to a station:
//   #/                       the map of Sodor
//   #/station/<station>      a station: its lessons, exercises, quiz and links
//   #/station/<station>/<id> a lesson, an exercise or the quiz of that station
//   #/piano/<score>          the grand piano, playing a melody of the Concert Hall

export interface Route {
  station?: string;
  activity?: string;
  score?: string;
}

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  if (parts[0] === 'station' && parts[1]) return { station: parts[1], activity: parts[2] };
  if (parts[0] === 'piano') return { station: 'music', activity: 'mus-piano', score: parts[1] };
  return {};
}

export function hrefFor(route: Route): string {
  if (route.score) return `#/piano/${encodeURIComponent(route.score)}`;
  if (!route.station) return '#/';
  return `#/station/${encodeURIComponent(route.station)}` + (route.activity ? `/${encodeURIComponent(route.activity)}` : '');
}

// replace: the new address takes the place of the current one in the history, so
// Back does not return to a finished quiz.
export function navigate(route: Route, { replace = false } = {}) {
  const href = hrefFor(route);
  if (window.location.hash !== href) {
    if (replace) window.location.replace(href);
    else window.location.hash = href;
  }
  window.scrollTo({ top: 0 });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}
