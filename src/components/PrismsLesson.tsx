import React, { useState } from 'react';
import { Lang, frTypo } from '../i18n';
import LessonPlayer, { LessonStep } from './LessonPlayer';
import { STATIONS } from '../content/stations';

// Prisms and pyramids: faces, edges and vertices; the prism and its two bases; the
// pyramid and its apex; counting from the base; Euler's F + V − E = 2. The solids are
// drawn here in 3D (hidden edges dotted), next to a few pictures from media/.

const INK = '#17233d';
const math = STATIONS.find(s => s.id === 'math')!;
const MEDIA = '/SodorAcademy/media/';

type Kind = 'prism' | 'pyramid';
type Mark = 'plain' | 'faces' | 'edges' | 'vertices' | 'bases' | 'apex';
interface P3 { x: number; y: number; z: number }

const fr_ = (lang: Lang) => lang === 'fr';
// A text in the chosen language, with French spacing before : ; ! ?
const say = (lang: Lang, fr: string, en: string) => (lang === 'fr' ? frTypo(fr) : en);
const dot = (a: P3, b: P3) => a.x * b.x + a.y * b.y + a.z * b.z;
const unit = (a: P3) => { const l = Math.hypot(a.x, a.y, a.z) || 1; return { x: a.x / l, y: a.y / l, z: a.z / l }; };

// The eye looks from the front and a little from above; the light comes from the front left.
const EL = 0.42;
const VIEW: P3 = { x: 0, y: -Math.cos(EL), z: Math.sin(EL) };
const LIGHT = unit({ x: -0.45, y: -0.55, z: 0.7 });

// A prism or a pyramid on a regular base with n sides: its vertices, faces and edges,
// which faces the eye can see, and the drawing of each vertex on the page.
function geometry(kind: Kind, n: number, { stretch = 1, height, lying = false }: { stretch?: number; height?: number; lying?: boolean } = {}) {
  const h = height ?? (kind === 'prism' ? 1.3 : 1.6);
  const yaw = lying ? -0.55 : 0.38;
  const place = (a: number, b: number, t: number): P3 => {
    // Standing: the base lies flat and the solid rises along z. Lying: the base stands up, like the end of a roof.
    const p = lying ? { x: t - h / 2, y: a, z: b + 0.5 } : { x: a, y: b, z: t };
    return { x: p.x * Math.cos(yaw) - p.y * Math.sin(yaw), y: p.x * Math.sin(yaw) + p.y * Math.cos(yaw), z: p.z };
  };
  // An edge of the base faces the eye; for a triangle, a corner does, so that two sides show.
  const start = lying ? Math.PI / 2 : n === 3 ? -Math.PI / 2 : -Math.PI / 2 - Math.PI / n;
  const corner = (i: number) => {
    const phi = start + (2 * Math.PI * i) / n;
    return [stretch * Math.cos(phi), Math.sin(phi)];
  };
  const verts: P3[] = [];
  const faces: { pts: number[]; base: boolean }[] = [];
  const edges: { a: number; b: number; faces: number[] }[] = [];
  const nx = (i: number) => (i + 1) % n;
  const pv = (i: number) => (i + n - 1) % n;

  for (let i = 0; i < n; i++) { const [a, b] = corner(i); verts.push(place(a, b, 0)); }
  if (kind === 'prism') {
    for (let i = 0; i < n; i++) { const [a, b] = corner(i); verts.push(place(a, b, h)); }
    faces.push({ pts: [...Array(n).keys()], base: true });
    faces.push({ pts: [...Array(n).keys()].map(i => n + i), base: true });
    for (let i = 0; i < n; i++) faces.push({ pts: [i, nx(i), n + nx(i), n + i], base: false });
    for (let i = 0; i < n; i++) {
      edges.push({ a: i, b: nx(i), faces: [0, 2 + i] });
      edges.push({ a: n + i, b: n + nx(i), faces: [1, 2 + i] });
      edges.push({ a: i, b: n + i, faces: [2 + pv(i), 2 + i] });
    }
  } else {
    verts.push(place(0, 0, h));
    faces.push({ pts: [...Array(n).keys()], base: true });
    for (let i = 0; i < n; i++) faces.push({ pts: [i, nx(i), n], base: false });
    for (let i = 0; i < n; i++) {
      edges.push({ a: i, b: nx(i), faces: [0, 1 + i] });
      edges.push({ a: i, b: n, faces: [1 + pv(i), 1 + i] });
    }
  }

  const mid = (ids: number[]) => ids.reduce((s, i) => ({ x: s.x + verts[i].x / ids.length, y: s.y + verts[i].y / ids.length, z: s.z + verts[i].z / ids.length }), { x: 0, y: 0, z: 0 });
  const centre = mid([...verts.keys()]);
  const normals = faces.map(f => {
    let m: P3 = { x: 0, y: 0, z: 0 };
    f.pts.forEach((pi, k) => {
      const p = verts[pi], q = verts[f.pts[(k + 1) % f.pts.length]];
      m = { x: m.x + (p.y - q.y) * (p.z + q.z), y: m.y + (p.z - q.z) * (p.x + q.x), z: m.z + (p.x - q.x) * (p.y + q.y) };
    });
    const c = mid(f.pts);
    const out = dot(m, { x: c.x - centre.x, y: c.y - centre.y, z: c.z - centre.z }) < 0 ? { x: -m.x, y: -m.y, z: -m.z } : m;
    return unit(out);
  });
  const visible = normals.map(nm => dot(nm, VIEW) > 1e-6);
  const proj = verts.map(p => [p.x, -(p.z * Math.cos(EL)) - p.y * Math.sin(EL)]);
  const edgeSeen = edges.map(e => e.faces.some(f => visible[f]));
  const vertSeen = verts.map((_, i) => faces.some((f, k) => visible[k] && f.pts.includes(i)));
  return { verts, faces, edges, normals, visible, proj, edgeSeen, vertSeen };
}

const PALETTE = ['#ffd23f', '#8fd3ff', '#ff9eb1', '#a6e3a1', '#c9b6ff', '#ffb870', '#9ee6dc', '#f7a8e0', '#d6e68a', '#ffcf9e'];

function Solid({ kind, n, stretch, height, lying, mark = 'plain', hue = 212, lang, title, className = '' }: {
  kind: Kind; n: number; stretch?: number; height?: number; lying?: boolean;
  mark?: Mark; hue?: number; lang: Lang; title: string; className?: string;
}) {
  const g = geometry(kind, n, { stretch, height, lying });
  const S = 90;
  const pts = g.proj.map(([x, y]) => [x * S, y * S]);
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const pad = 12, top = mark === 'apex' ? 34 : pad;
  const box = [Math.min(...xs) - pad, Math.min(...ys) - top, Math.max(...xs) - Math.min(...xs) + 2 * pad, Math.max(...ys) - Math.min(...ys) + top + pad];
  const poly = (ids: number[]) => ids.map(i => `${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)}`).join(' ');
  const light = (k: number) => Math.max(0, dot(g.normals[k], LIGHT));
  const fill = (k: number) => {
    if (mark === 'faces') return PALETTE[k % PALETTE.length];
    if (mark === 'bases' && g.faces[k].base) return `hsl(46, 100%, ${60 + 14 * light(k)}%)`;
    return `hsl(${hue}, ${hue < 60 ? 55 : 70}%, ${70 + 20 * light(k)}%)`;
  };
  const red = mark === 'edges';
  const apex = kind === 'pyramid' ? n : -1;

  return (
    <svg viewBox={box.map(v => v.toFixed(1)).join(' ')} className={`block ${className}`}
      role={title ? 'img' : undefined} aria-label={title || undefined} aria-hidden={title ? undefined : true}>
      {/* With the bases marked, the hidden base shows through the sides. */}
      {mark === 'bases' && g.faces.map((f, k) => f.base && !g.visible[k] && <polygon key={`b${k}`} points={poly(f.pts)} fill={fill(k)} />)}
      {g.faces.map((f, k) => g.visible[k] && (
        <polygon key={k} points={poly(f.pts)} fill={fill(k)} fillOpacity={mark === 'bases' && !f.base ? 0.6 : 1} />
      ))}
      {g.edges.map((e, k) => !g.edgeSeen[k] && (
        <line key={`h${k}`} x1={pts[e.a][0]} y1={pts[e.a][1]} x2={pts[e.b][0]} y2={pts[e.b][1]}
          stroke={red ? '#e23b2e' : INK} strokeWidth={red ? 3 : 2} strokeDasharray="6 5" strokeLinecap="round" opacity={red ? 0.9 : 0.55} />
      ))}
      {g.edges.map((e, k) => g.edgeSeen[k] && (
        <line key={`e${k}`} x1={pts[e.a][0]} y1={pts[e.a][1]} x2={pts[e.b][0]} y2={pts[e.b][1]}
          stroke={red ? '#e23b2e' : INK} strokeWidth={red ? 5 : 3} strokeLinecap="round" />
      ))}
      {pts.map(([x, y], i) => {
        if (mark === 'vertices') {
          return g.vertSeen[i]
            ? <circle key={`v${i}`} cx={x} cy={y} r={7} fill="#ffd23f" stroke={INK} strokeWidth={2.5} />
            : <circle key={`v${i}`} cx={x} cy={y} r={6} fill="#fff" stroke={INK} strokeWidth={2} strokeDasharray="3 2" />;
        }
        if (i === apex && mark === 'apex') return <circle key={`v${i}`} cx={x} cy={y} r={8} fill="#e23b2e" stroke={INK} strokeWidth={2.5} />;
        return g.vertSeen[i] ? <circle key={`v${i}`} cx={x} cy={y} r={3.2} fill={INK} /> : null;
      })}
      {mark === 'apex' && (
        <text x={pts[apex][0]} y={pts[apex][1] - 15} textAnchor="middle" fontSize={17} fontWeight={800} fill="#b3261e">apex</text>
      )}
    </svg>
  );
}

// ---- Words and counts ---------------------------------------------------------

const ADJ: Record<number, { fr: string; en: string }> = {
  3: { fr: 'triangulaire', en: 'triangular' }, 4: { fr: 'carrée', en: 'square' }, 5: { fr: 'pentagonale', en: 'pentagonal' },
  6: { fr: 'hexagonale', en: 'hexagonal' }, 7: { fr: 'heptagonale', en: 'heptagonal' }, 8: { fr: 'octogonale', en: 'octagonal' },
};

function solidName(kind: Kind, n: number, lang: Lang) {
  if (fr_(lang)) return `${kind === 'prism' ? 'Prisme' : 'Pyramide'} à base ${ADJ[n].fr}`;
  const adj = ADJ[n].en[0].toUpperCase() + ADJ[n].en.slice(1);
  return kind === 'prism' ? `${adj} prism` : n === 4 ? 'Square-based pyramid' : `${adj} pyramid`;
}

const counts = (kind: Kind, n: number) => kind === 'prism' ? { f: n + 2, e: 3 * n, v: 2 * n } : { f: n + 1, e: 2 * n, v: n + 1 };

const WORDS = {
  fr: { f: 'faces', e: 'arêtes', v: 'sommets' },
  en: { f: 'faces', e: 'edges', v: 'vertices' },
};

const describe = (kind: Kind, n: number, lang: Lang) => {
  const c = counts(kind, n), w = WORDS[lang];
  return say(lang, `${solidName(kind, n, lang)} : `, `${solidName(kind, n, lang)}: `) + `${c.f} ${w.f}, ${c.e} ${w.e}, ${c.v} ${w.v}`;
};

function Counts({ f, e, v, lang }: { f: number; e: number; v: number; lang: Lang }) {
  const w = WORDS[lang];
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <span className="chip text-base! bg-[#8fd3ff]!">{f} {w.f}</span>
      <span className="chip text-base! bg-rose!">{e} {w.e}</span>
      <span className="chip text-base! bg-sticker!">{v} {w.v}</span>
    </div>
  );
}

// A picture from media/, framed in ink.
function Picture({ src, alt, caption }: { src: string; alt: string; caption: React.ReactNode }) {
  return (
    <figure className="m-0 flex flex-col">
      <img src={MEDIA + src} alt={alt} loading="lazy" width={1024} height={1024}
        className="block w-full aspect-square object-cover rounded-2xl border-[3px] border-ink bg-white" />
      <figcaption className="mt-2 text-center font-bold leading-snug">{caption}</figcaption>
    </figure>
  );
}

// A drawn solid, framed the same way.
function Framed({ children, caption }: { children: React.ReactNode; caption: React.ReactNode }) {
  return (
    <figure className="m-0 flex flex-col">
      <div className="aspect-square rounded-2xl border-[3px] border-ink bg-white flex items-center justify-center p-4">{children}</div>
      <figcaption className="mt-2 text-center font-bold leading-snug">{caption}</figcaption>
    </figure>
  );
}

// ---- Step 1: faces, edges and vertices of a crate -------------------------------

function CrateParts({ lang }: { lang: Lang }) {
  const fr = fr_(lang);
  const [mark, setMark] = useState<'faces' | 'edges' | 'vertices'>('faces');
  const g = geometry('prism', 4, { stretch: 1.45, height: 1 });
  const seen = { faces: g.visible.filter(Boolean).length, edges: g.edgeSeen.filter(Boolean).length, vertices: g.vertSeen.filter(Boolean).length };
  const total = { faces: g.faces.length, edges: g.edges.length, vertices: g.verts.length };
  const hid = total[mark] - seen[mark];
  const lines = {
    faces: fr
      ? `${total.faces} faces : tu en vois ${seen.faces}, les ${hid} autres sont cachées derrière et dessous.`
      : `${total.faces} faces: you can see ${seen.faces}; the other ${hid} are hidden at the back and underneath.`,
    edges: fr
      ? `${total.edges} arêtes : ${seen.edges} se voient, les ${hid} en pointillés sont cachées.`
      : `${total.edges} edges: ${seen.edges} can be seen; the ${hid} dotted ones are hidden.`,
    vertices: fr
      ? `${total.vertices} sommets : ${seen.vertices} se voient, ${hid} ${hid > 1 ? 'sont cachés' : 'est caché'} derrière.`
      : `${total.vertices} vertices: ${seen.vertices} can be seen, ${hid} ${hid > 1 ? 'are' : 'is'} hidden at the back.`,
  };
  const buttons: { id: 'faces' | 'edges' | 'vertices'; fr: string; en: string }[] = [
    { id: 'faces', fr: 'Les faces', en: 'Faces' },
    { id: 'edges', fr: 'Les arêtes', en: 'Edges' },
    { id: 'vertices', fr: 'Les sommets', en: 'Vertices' },
  ];
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5">
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label={fr ? 'Ce qu’on montre' : 'What to show'}>
        {buttons.map(b => (
          <button key={b.id} onClick={() => setMark(b.id)} aria-pressed={mark === b.id} className="chunky">{fr ? b.fr : b.en}</button>
        ))}
      </div>
      <div className="bg-white rounded-xl border-[2.5px] border-ink p-3 flex justify-center">
        <Solid kind="prism" n={4} stretch={1.45} height={1} hue={30} mark={mark} lang={lang} className="w-full max-w-sm"
          title={fr ? 'Une caisse en forme de pavé droit' : 'A crate shaped like a cuboid'} />
      </div>
      <p className="m-0 mt-3 text-lg font-bold" aria-live="polite">{fr ? frTypo(lines[mark]) : lines[mark]}</p>
    </div>
  );
}

// ---- Step 5: count from the base -------------------------------------------------

function BaseIcon({ n }: { n: number }) {
  const pts = [...Array(n).keys()].map(i => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    return `${(12 + 10 * Math.cos(a)).toFixed(1)},${(12 + 10 * Math.sin(a)).toFixed(1)}`;
  }).join(' ');
  return <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden="true"><polygon points={pts} fill="#ffd23f" stroke={INK} strokeWidth={2} strokeLinejoin="round" /></svg>;
}

function Explorer({ lang }: { lang: Lang }) {
  const fr = fr_(lang);
  const [kind, setKind] = useState<Kind>('prism');
  const [n, setN] = useState(6);
  const c = counts(kind, n), w = WORDS[lang];
  const rows = kind === 'prism'
    ? [
      { k: 'f', value: c.f, how: fr ? `2 bases + ${n} rectangles` : `2 bases + ${n} rectangles` },
      { k: 'e', value: c.e, how: fr ? `${n} en bas + ${n} en haut + ${n} debout` : `${n} at the bottom + ${n} at the top + ${n} standing up` },
      { k: 'v', value: c.v, how: fr ? `${n} en bas + ${n} en haut` : `${n} at the bottom + ${n} at the top` },
    ]
    : [
      { k: 'f', value: c.f, how: fr ? `1 base + ${n} triangles` : `1 base + ${n} triangles` },
      { k: 'e', value: c.e, how: fr ? `${n} autour de la base + ${n} jusqu’à l’apex` : `${n} round the base + ${n} up to the apex` },
      { k: 'v', value: c.v, how: fr ? `${n} autour de la base + l’apex` : `${n} round the base + the apex` },
    ];
  const tint: Record<string, string> = { f: 'bg-[#8fd3ff]', e: 'bg-rose', v: 'bg-sticker' };
  return (
    <div className="rounded-2xl border-[3px] border-ink bg-sky p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2 mb-2" role="group" aria-label={fr ? 'Le solide' : 'The solid'}>
        <span className="label-caps mr-1">{fr ? 'Le solide' : 'Solid'}</span>
        {(['prism', 'pyramid'] as Kind[]).map(k => (
          <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k} className="chunky">
            {k === 'prism' ? (fr ? 'Prisme' : 'Prism') : (fr ? 'Pyramide' : 'Pyramid')}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4" role="group" aria-label={fr ? 'Nombre de côtés de la base' : 'Number of sides of the base'}>
        <span className="label-caps mr-1">{fr ? 'Côtés de la base' : 'Sides of the base'}</span>
        {[3, 4, 5, 6, 7, 8].map(k => (
          <button key={k} onClick={() => setN(k)} aria-pressed={n === k} className="chunky px-2.5!"
            aria-label={fr ? `Base à ${k} côtés` : `Base with ${k} sides`}>
            <BaseIcon n={k} /> {k}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 items-center">
        <div className="bg-white rounded-xl border-[2.5px] border-ink p-3 flex justify-center">
          <Solid kind={kind} n={n} mark="bases" lang={lang} className="w-full max-w-[260px] max-h-[260px]" title={describe(kind, n, lang)} />
        </div>
        <div>
          <p className="m-0 mb-3 text-xl font-extrabold">{solidName(kind, n, lang)}</p>
          <ul className="m-0 p-0 list-none space-y-2.5" aria-live="polite">
            {rows.map(r => (
              <li key={r.k} className="flex items-center gap-3">
                <span className={`shrink-0 w-14 h-12 rounded-xl border-[2.5px] border-ink flex items-center justify-center text-2xl font-extrabold tabular-nums ${tint[r.k]}`}>{r.value}</span>
                <span className="leading-snug"><b>{w[r.k as 'f' | 'e' | 'v']}</b><br /><span className="text-ink/75">{r.how}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---- Step 6: Euler's formula ------------------------------------------------------

function EulerTable({ lang }: { lang: Lang }) {
  const fr = fr_(lang);
  const solids: { kind: Kind; n: number; stretch?: number }[] = [
    { kind: 'prism', n: 3 }, { kind: 'prism', n: 4, stretch: 1.4 }, { kind: 'prism', n: 6 },
    { kind: 'pyramid', n: 3 }, { kind: 'pyramid', n: 4 }, { kind: 'pyramid', n: 6 },
  ];
  const head = fr ? ['Solide', 'F', 'S', 'A', 'F + S − A'] : ['Solid', 'F', 'V', 'E', 'F + V − E'];
  return (
    <div className="overflow-x-auto rounded-2xl border-[3px] border-ink bg-white">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{fr ? 'Faces, sommets et arêtes de six solides' : 'Faces, vertices and edges of six solids'}</caption>
        <thead className="bg-sky">
          <tr>
            {head.map((h, k) => <th key={k} scope="col" className={`px-3 py-2 font-extrabold border-b-[3px] border-ink ${k ? 'text-center' : ''}`}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {solids.map(s => {
            const c = counts(s.kind, s.n);
            const name = s.kind === 'prism' && s.n === 4 ? (fr ? 'Pavé droit' : 'Cuboid') : solidName(s.kind, s.n, lang);
            return (
              <tr key={`${s.kind}${s.n}`} className="border-t-2 border-ink/15">
                <th scope="row" className="px-3 py-1.5 font-bold">
                  <span className="flex items-center gap-2.5">
                    <Solid kind={s.kind} n={s.n} stretch={s.stretch} lang={lang} className="w-12 h-10 shrink-0" title="" />
                    {name}
                  </span>
                </th>
                <td className="px-3 text-center font-bold tabular-nums">{c.f}</td>
                <td className="px-3 text-center font-bold tabular-nums">{c.v}</td>
                <td className="px-3 text-center font-bold tabular-nums">{c.e}</td>
                <td className="px-3 text-center font-bold tabular-nums whitespace-nowrap">{c.f} + {c.v} − {c.e} = <b className="px-1.5 rounded bg-note">2</b></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---- The lesson ---------------------------------------------------------------

const STEPS: LessonStep[] = [
  {
    title: { fr: 'Faces, arêtes et sommets', en: 'Faces, edges and vertices' },
    body: {
      fr: 'Au port, Thomas attend une grande caisse. Une caisse est un <b>solide</b> : une forme en trois dimensions, qu’on pourrait prendre dans ses mains. Ses surfaces plates sont ses <b>faces</b>. Deux faces se touchent le long d’une <b>arête</b>. Les arêtes se rejoignent en un coin pointu : un <b>sommet</b>. Appuie sur les boutons pour les voir.',
      en: 'At the docks, Thomas is waiting for a big crate. A crate is a <b>solid</b>: a 3D shape you could hold in your hands. Its flat surfaces are its <b>faces</b>. Two faces meet along an <b>edge</b>. Edges meet at a pointed corner: a <b>vertex</b> (more than one are <b>vertices</b>). Press the buttons to see them.',
    },
    visual: lang => <CrateParts lang={lang} />,
    note: {
      fr: '<b>Face</b> : une surface plate. <b>Arête</b> : la ligne où deux faces se rencontrent. <b>Sommet</b> : le coin où des arêtes se rejoignent.',
      en: '<b>Face</b>: a flat surface. <b>Edge</b>: the line where two faces meet. <b>Vertex</b>: the corner where edges meet.',
    },
  },
  {
    title: { fr: 'Le prisme : deux bases jumelles', en: 'The prism: two twin bases' },
    body: {
      fr: 'Un <b>prisme</b> a deux faces identiques, l’une en face de l’autre, comme des jumelles : ce sont ses <b>bases</b>. Des rectangles les relient tout autour. La caisse que soulève la grue est un prisme dont les bases sont des rectangles. On l’appelle un <b>prisme à base rectangulaire</b>, ou un <b>pavé droit</b>.',
      en: 'A <b>prism</b> has two identical faces opposite each other, like twins: these are its <b>bases</b>. Rectangles join them all the way round. The crate the crane is lifting is a prism with rectangles for bases. It is called a <b>rectangular prism</b>, or a <b>cuboid</b>.',
    },
    visual: lang => {
      return (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-3">
            <Picture src="math_rect_prism_1780968225402.png"
              alt={say(lang, 'Un pavé droit dessiné : ses sommets s’appellent A, B, C, D en bas et A′, B′, C′, D′ en haut ; trois arêtes cachées sont en pointillés.', 'A drawing of a cuboid: its vertices are called A, B, C, D at the bottom and A′, B′, C′, D′ at the top; three hidden edges are dotted.')}
              caption={say(lang, 'Les arêtes cachées sont en pointillés.', 'Hidden edges are dotted.')} />
            <Picture src="cargo_crate_1780967967201.png"
              alt={say(lang, 'Au port, une grue soulève une grande caisse en bois au-dessus de Thomas.', 'At the docks, a crane lifts a big wooden crate above Thomas.')}
              caption={say(lang, 'Au port, une caisse en forme de pavé droit.', 'At the docks, a crate shaped like a cuboid.')} />
          </div>
          <Counts f={6} e={12} v={8} lang={lang} />
        </div>
      );
    },
    note: {
      fr: 'Un prisme prend le nom de la forme de ses bases. Un pavé droit a <b>6 faces</b>, <b>12 arêtes</b> et <b>8 sommets</b>.',
      en: 'A prism is named after the shape of its bases. A cuboid has <b>6 faces</b>, <b>12 edges</b> and <b>8 vertices</b>.',
    },
  },
  {
    title: { fr: 'Le prisme à base triangulaire', en: 'The triangular prism' },
    body: {
      fr: 'Regarde le toit du grand dépôt des locomotives. Au bout, tu vois un triangle ; à l’autre bout, il y a le même. Entre les deux, le toit est fait de rectangles. C’est un <b>prisme à base triangulaire</b>, couché sur le côté. Ses deux bases sont les triangles des deux bouts.',
      en: 'Look at the roof of the big engine shed. At one end you can see a triangle, and the other end has the same one. In between, the roof is made of rectangles. It is a <b>triangular prism</b>, lying on its side. Its two bases are the triangles at each end.',
    },
    visual: lang => {
      return (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto mb-3">
            <Framed caption={say(lang, 'Les deux bases, en jaune, sont des triangles.', 'The two bases, in yellow, are triangles.')}>
              <Solid kind="prism" n={3} lying height={2.3} mark="bases" lang={lang} className="w-full"
                title={say(lang, 'Un prisme à base triangulaire couché ; ses deux bases triangulaires sont en jaune', 'A triangular prism lying down; its two triangular bases are in yellow')} />
            </Framed>
            <Picture src="tidmouth_roof_1780967977392.png"
              alt={say(lang, 'Un grand dépôt de locomotives dont le toit est un prisme à base triangulaire ; Thomas, Percy et leurs amis attendent devant.', 'A big engine shed whose roof is a triangular prism; Thomas, Percy and their friends wait in front.')}
              caption={say(lang, 'Le toit du dépôt.', 'The roof of the shed.')} />
          </div>
          <Counts f={5} e={9} v={6} lang={lang} />
        </div>
      );
    },
    note: {
      fr: 'Prisme à base triangulaire : <b>5 faces</b> (2 triangles et 3 rectangles), <b>9 arêtes</b> et <b>6 sommets</b>.',
      en: 'Triangular prism: <b>5 faces</b> (2 triangles and 3 rectangles), <b>9 edges</b> and <b>6 vertices</b>.',
    },
  },
  {
    title: { fr: 'La pyramide : une pointe tout en haut', en: 'The pyramid: a point at the top' },
    body: {
      fr: 'Une <b>pyramide</b> n’a qu’une seule base. Sur chaque côté de la base se dresse un triangle. Tous les triangles se rejoignent en haut, en un même sommet : l’<b>apex</b>. Comme le prisme, la pyramide prend le nom de sa base : à base triangulaire, carrée, hexagonale…',
      en: 'A <b>pyramid</b> has only one base. On each side of the base stands a triangle. All the triangles meet at the top, at one vertex: the <b>apex</b>. Like a prism, a pyramid is named after its base: triangular, square-based, hexagonal…',
    },
    visual: lang => {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Framed caption={say(lang, 'À base carrée : 5 faces, 8 arêtes, 5 sommets.', 'Square-based: 5 faces, 8 edges, 5 vertices.')}>
            <Solid kind="pyramid" n={4} mark="apex" lang={lang} className="w-full" title={describe('pyramid', 4, lang)} />
          </Framed>
          <Picture src="math_tri_pyramid_1780968253312.png"
            alt={say(lang, 'Une pyramide à base triangulaire : la base BCD et l’apex A.', 'A triangular pyramid: the base BCD and the apex A.')}
            caption={say(lang, 'À base triangulaire : 4 faces, 6 arêtes, 4 sommets.', 'Triangular: 4 faces, 6 edges, 4 vertices.')} />
          <Picture src="math_hexagonal_pyramid_1780969264106.png"
            alt={say(lang, 'Une pyramide à base hexagonale : la base ABCDEF et l’apex V.', 'A hexagonal pyramid: the base ABCDEF and the apex V.')}
            caption={say(lang, 'À base hexagonale : 7 faces, 12 arêtes, 7 sommets.', 'Hexagonal: 7 faces, 12 edges, 7 vertices.')} />
        </div>
      );
    },
    note: {
      fr: 'Les grandes pyramides d’Égypte sont des pyramides à base carrée. La pyramide à base triangulaire a un autre nom : le <b>tétraèdre</b>.',
      en: 'The great pyramids of Egypt are square-based pyramids. The triangular pyramid has another name: the <b>tetrahedron</b>.',
    },
  },
  {
    title: { fr: 'Compter grâce à la base', en: 'Counting from the base' },
    body: {
      fr: 'Pas besoin de compter un par un : il suffit de connaître le nombre de côtés de la base. Choisis un solide et une base, et regarde comment on fait le calcul.',
      en: 'No need to count one by one: all you need is the number of sides of the base. Pick a solid and a base, and see how the sum works.',
    },
    visual: lang => <Explorer lang={lang} />,
    note: {
      fr: 'Pour une base à <b>n</b> côtés. Prisme : n + 2 faces, 3 × n arêtes, 2 × n sommets. Pyramide : n + 1 faces, 2 × n arêtes, n + 1 sommets.',
      en: 'For a base with <b>n</b> sides. Prism: n + 2 faces, 3 × n edges, 2 × n vertices. Pyramid: n + 1 faces, 2 × n edges, n + 1 vertices.',
    },
  },
  {
    title: { fr: 'Le secret d’Euler', en: 'Euler’s secret' },
    body: {
      fr: 'Un défi pour les plus grands : prends n’importe quel prisme ou n’importe quelle pyramide. Additionne ses faces et ses sommets, puis enlève ses arêtes. Tu trouves toujours <b>2</b> ! Le mathématicien suisse Leonhard Euler l’a découvert il y a plus de 250 ans.',
      en: 'A challenge for older explorers: take any prism or any pyramid. Add up its faces and its vertices, then take away its edges. You always get <b>2</b>! The Swiss mathematician Leonhard Euler discovered this more than 250 years ago.',
    },
    visual: lang => <EulerTable lang={lang} />,
    note: {
      fr: '<b>F + S − A = 2</b> : faces plus sommets moins arêtes égale 2.',
      en: '<b>F + V − E = 2</b>: faces plus vertices minus edges equals 2.',
    },
  },
];

const LINKS = math.links.filter(l => l.href.includes('shapes/shapes.html') || l.href.includes('/Practice/'));

export default function PrismsLesson({ onCancel, onStartExercise, color }: {
  onCancel: () => void;
  onStartExercise?: () => void;
  color?: string;
  place?: string;
}) {
  return (
    <LessonPlayer
      title={{ fr: 'Les prismes et les pyramides', en: 'Prisms and Pyramids' }}
      color={color ?? math.color}
      steps={STEPS}
      links={LINKS}
      onStartExercise={onStartExercise}
      onCancel={onCancel}
    />
  );
}
