import React, { useEffect, useRef, useState } from 'react';
import { Grade } from '../types';
import { speak } from '../services/speechService';
import { useLang, Text } from '../i18n';
import ExerciseFrame, { Feedback, answerClass } from './ExerciseFrame';
import { WorldMap, ContinentId, OceanId, CONTINENT_NAMES, OCEAN_NAMES } from './ContinentsLesson';

// The continents challenge: questions on the continents and the oceans, and maps on
// which one continent is coloured in, to recognise. Each answer has an id, the same in
// both languages. A run goes through the questions without repeating one; Primary
// gets the easier ones first.

interface Props {
  grade: Grade;
  questionsCount?: number;
  onComplete: (reward: string) => void;
  onCancel: () => void;
  color?: string;
  place?: string;
}

interface Option { id: string; label: Text }
interface Question {
  id: string;
  level: 1 | 2;        // 1: easier (Primary first), 2: harder
  text: Text;
  options: Option[];
  answer: string;      // the id of the right option
  explain: Text;       // shown after a wrong answer, under the right one
  map?: ContinentId;   // a map with this continent coloured in
}

const c = (...ids: ContinentId[]): Option[] => ids.map(id => ({ id, label: CONTINENT_NAMES[id] }));
const o = (...ids: OceanId[]): Option[] => ids.map(id => ({ id, label: OCEAN_NAMES[id] }));
const nums = (...ns: number[]): Option[] => ns.map(n => ({ id: String(n), label: String(n) }));
const PAIR: Record<string, Option> = {
  americas: { id: 'americas', label: { fr: 'Amérique du Nord et Amérique du Sud', en: 'North and South America' } },
  africaAsia: { id: 'africaAsia', label: { fr: 'Afrique et Asie', en: 'Africa and Asia' } },
  europeAsia: { id: 'europeAsia', label: { fr: 'Europe et Asie', en: 'Europe and Asia' } },
  australiaAsia: { id: 'australiaAsia', label: { fr: 'Australie et Asie', en: 'Australia and Asia' } },
  europeAfrica: { id: 'europeAfrica', label: { fr: 'Europe et Afrique', en: 'Europe and Africa' } },
};

const QUESTIONS: Question[] = [
  {
    id: 'q1', level: 1,
    text: { fr: 'Quel est le plus grand continent du monde ?', en: 'Which is the largest continent in the world?' },
    options: c('africa', 'asia', 'europe', 'northAmerica'), answer: 'asia',
    explain: {
      fr: 'L’Asie est le plus grand continent, et le plus peuplé : presque 6 humains sur 10 y vivent. Le mont Everest s’y trouve.',
      en: 'Asia is the largest continent, and the one with the most people: almost 6 people out of 10 live there. Mount Everest is there too.',
    },
  },
  {
    id: 'q2', level: 1,
    text: { fr: 'Sur quel continent se trouve la forêt amazonienne ?', en: 'Which continent is the Amazon rainforest on?' },
    options: c('africa', 'southAmerica', 'australia', 'asia'), answer: 'southAmerica',
    explain: {
      fr: 'La forêt amazonienne couvre une grande partie de l’Amérique du Sud, surtout au Brésil. C’est la plus grande forêt tropicale du monde. Ce continent a aussi la cordillère des Andes.',
      en: 'The Amazon rainforest covers a large part of South America, mostly in Brazil. It is the largest tropical rainforest in the world. This continent also has the Andes mountains.',
    },
  },
  {
    id: 'q3', level: 1,
    text: { fr: 'Quel continent est aussi un pays ?', en: 'Which continent is also a country?' },
    options: c('antarctica', 'australia', 'europe', 'africa'), answer: 'australia',
    explain: {
      fr: 'L’Australie est à la fois un pays et un continent. Avec la Nouvelle-Zélande et les îles du Pacifique, on parle aussi de l’Océanie.',
      en: 'Australia is both a country and a continent. Together with New Zealand and the Pacific islands, it is also called Oceania.',
    },
  },
  {
    id: 'q4', level: 1,
    text: { fr: 'Quel est le continent le plus froid, couvert de glace ?', en: 'Which is the coldest continent, covered in ice?' },
    options: c('europe', 'northAmerica', 'antarctica', 'asia'), answer: 'antarctica',
    explain: {
      fr: 'L’Antarctique, autour du pôle Sud, est couvert d’une couche de glace qui dépasse 4 km d’épaisseur par endroits. On y trouve bien plus de manchots que d’humains !',
      en: 'Antarctica, around the South Pole, is covered by a sheet of ice more than 4 km thick in places. You will find far more penguins than people there!',
    },
  },
  {
    id: 'q5', level: 1,
    text: { fr: 'Quel continent est célèbre pour ses lions, ses éléphants et ses girafes ?', en: 'Which continent is famous for its lions, elephants and giraffes?' },
    options: c('africa', 'southAmerica', 'australia', 'europe'), answer: 'africa',
    explain: {
      fr: 'Les savanes d’Afrique abritent des lions, des éléphants, des zèbres… Les girafes ne vivent à l’état sauvage qu’en Afrique. C’est le deuxième plus grand continent.',
      en: 'Africa’s savannahs are home to lions, elephants, zebras… Wild giraffes live only in Africa. It is the second-largest continent.',
    },
  },
  {
    id: 'q6', level: 1,
    text: { fr: 'L’île de Sodor et la Grande-Bretagne font partie de quel continent ?', en: 'The Island of Sodor and Great Britain are part of which continent?' },
    options: c('northAmerica', 'europe', 'asia', 'africa'), answer: 'europe',
    explain: {
      fr: 'Sodor est une petite île de la mer d’Irlande, entre l’Angleterre et l’île de Man. Comme la Grande-Bretagne, elle fait partie de l’Europe.',
      en: 'Sodor is a small island in the Irish Sea, between England and the Isle of Man. Like Great Britain, it is part of Europe.',
    },
  },
  {
    id: 'q7', level: 1,
    text: { fr: 'Sur quel continent se trouvent le Canada et les États-Unis ?', en: 'Which continent are Canada and the United States on?' },
    options: c('southAmerica', 'europe', 'northAmerica', 'australia'), answer: 'northAmerica',
    explain: {
      fr: 'Le Canada, les États-Unis et le Mexique sont les trois plus grands pays d’Amérique du Nord. Le Canada est le deuxième plus grand pays du monde.',
      en: 'Canada, the United States and Mexico are the three biggest countries in North America. Canada is the second-largest country in the world.',
    },
  },
  {
    id: 'q8', level: 1,
    text: { fr: 'Combien y a-t-il de continents ?', en: 'How many continents are there?' },
    options: nums(5, 6, 7, 8), answer: '7',
    explain: {
      fr: 'On compte 7 continents : l’Afrique, l’Amérique du Nord, l’Amérique du Sud, l’Antarctique, l’Asie, l’Australie et l’Europe.',
      en: 'There are 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America and South America.',
    },
  },
  {
    id: 'q9', level: 1,
    text: { fr: 'Quel est le plus petit continent ?', en: 'Which is the smallest continent?' },
    options: c('europe', 'australia', 'antarctica', 'southAmerica'), answer: 'australia',
    explain: {
      fr: 'L’Australie est le plus petit continent. C’est un continent-île, entouré d’eau de tous les côtés. L’Europe vient juste après.',
      en: 'Australia is the smallest continent. It is an island continent, with water all around it. Europe comes next.',
    },
  },
  {
    id: 'q10', level: 1,
    text: { fr: 'Sur quel continent se trouve le désert du Sahara ?', en: 'Which continent is the Sahara Desert on?' },
    options: c('asia', 'africa', 'australia', 'northAmerica'), answer: 'africa',
    explain: {
      fr: 'Le Sahara couvre le nord de l’Afrique. C’est le plus grand désert chaud du monde, presque aussi grand que la Chine ou les États-Unis !',
      en: 'The Sahara covers the north of Africa. It is the largest hot desert in the world, almost as big as China or the United States!',
    },
  },
  {
    id: 'q11', level: 2,
    text: { fr: 'Quel continent compte le plus de pays ?', en: 'Which continent has the most countries?' },
    options: c('africa', 'asia', 'europe', 'southAmerica'), answer: 'africa',
    explain: {
      fr: 'L’Afrique compte 54 pays : c’est le record ! L’Asie en a un peu moins de 50.',
      en: 'Africa has 54 countries: that is the record! Asia has a little under 50.',
    },
  },
  {
    id: 'q12', level: 2,
    text: { fr: 'Le Nil, souvent présenté comme le plus long fleuve du monde, coule sur quel continent ?', en: 'The Nile, often called the longest river in the world, flows across which continent?' },
    options: c('africa', 'asia', 'europe', 'australia'), answer: 'africa',
    explain: {
      fr: 'Le Nil traverse l’est de l’Afrique du sud vers le nord, sur environ 6 650 km, et se jette dans la mer Méditerranée, en Égypte. L’Amazone, en Amérique du Sud, est presque aussi long.',
      en: 'The Nile crosses eastern Africa from south to north, for about 6,650 km, and flows into the Mediterranean Sea in Egypt. The Amazon, in South America, is almost as long.',
    },
  },
  {
    id: 'q13', level: 1,
    text: { fr: 'Le mont Everest, la plus haute montagne du monde, est sur quel continent ?', en: 'Mount Everest, the highest mountain in the world, is on which continent?' },
    options: c('asia', 'africa', 'europe', 'antarctica'), answer: 'asia',
    explain: {
      fr: 'L’Everest (8 849 m) est en Asie, dans l’Himalaya, à la frontière entre le Népal et la Chine.',
      en: 'Everest (8,849 m) is in Asia, in the Himalayas, on the border between Nepal and China.',
    },
  },
  {
    id: 'q14', level: 2,
    text: { fr: 'Quel continent n’a aucun habitant permanent ?', en: 'Which continent has no permanent population?' },
    options: c('antarctica', 'australia', 'africa', 'asia'), answer: 'antarctica',
    explain: {
      fr: 'Personne ne vit en Antarctique pour toujours. Des scientifiques viennent travailler dans des stations de recherche pour quelques mois, parfois un an, puis d’autres prennent la relève.',
      en: 'Nobody lives in Antarctica for good. Scientists come to work in research stations for a few months, sometimes a year, then others take over.',
    },
  },
  {
    id: 'q15', level: 2,
    text: { fr: 'La Grande-Bretagne, l’Irlande et Sodor sont dans quel océan ?', en: 'Great Britain, Ireland and Sodor lie in which ocean?' },
    options: o('atlantic', 'pacific', 'indian', 'arctic'), answer: 'atlantic',
    explain: {
      fr: 'Ces îles sont dans l’océan Atlantique, le deuxième plus grand océan. La mer d’Irlande, autour de Sodor, en fait partie.',
      en: 'These islands lie in the Atlantic Ocean, the second-largest ocean. The Irish Sea, around Sodor, is part of it.',
    },
  },
  {
    id: 'q16', level: 1,
    text: { fr: 'Sur quel continent les kangourous et les koalas vivent-ils à l’état sauvage ?', en: 'Kangaroos and koalas live in the wild on which continent?' },
    options: c('australia', 'africa', 'southAmerica', 'europe'), answer: 'australia',
    explain: {
      fr: 'Kangourous et koalas sont des marsupiaux : leurs petits grandissent dans une poche, sur le ventre de leur mère. Les koalas sauvages ne vivent qu’en Australie.',
      en: 'Kangaroos and koalas are marsupials: their babies grow up in a pouch on their mother’s tummy. Wild koalas live only in Australia.',
    },
  },
  {
    id: 'q17', level: 2,
    text: { fr: 'L’isthme de Panama, une étroite bande de terre, relie quels continents ?', en: 'The Isthmus of Panama, a narrow strip of land, joins which two continents?' },
    options: [PAIR.americas, PAIR.africaAsia, PAIR.europeAsia, PAIR.australiaAsia], answer: 'americas',
    explain: {
      fr: 'L’isthme de Panama relie l’Amérique du Nord à l’Amérique du Sud. Le canal de Panama le traverse : les bateaux passent de l’Atlantique au Pacifique sans faire le tour de l’Amérique du Sud.',
      en: 'The Isthmus of Panama joins North America to South America. The Panama Canal cuts through it: ships go from the Atlantic to the Pacific without sailing round South America.',
    },
  },
  {
    id: 'q18', level: 1,
    text: { fr: 'La Grande Muraille de Chine, le plus long mur du monde, est sur quel continent ?', en: 'The Great Wall of China, the longest wall in the world, is on which continent?' },
    options: c('asia', 'africa', 'europe', 'northAmerica'), answer: 'asia',
    explain: {
      fr: 'La Grande Muraille est en Chine, en Asie. Avec toutes ses parties, elle mesure plus de 20 000 km. On l’a construite pour protéger le nord de la Chine.',
      en: 'The Great Wall is in China, in Asia. With all its parts, it is more than 20,000 km long. It was built to guard the north of China.',
    },
  },
  {
    id: 'q19', level: 2,
    text: { fr: 'Les fjords de Norvège et les Alpes se trouvent sur quel continent ?', en: 'Norway’s fjords and the Alps are on which continent?' },
    options: c('europe', 'africa', 'asia', 'antarctica'), answer: 'europe',
    explain: {
      fr: 'Les fjords sont de longues baies creusées par les glaciers, en Norvège. Les Alpes passent par la France, la Suisse, l’Italie et l’Autriche. Tout cela est en Europe.',
      en: 'Fjords are long bays carved out by glaciers, in Norway. The Alps run through France, Switzerland, Italy and Austria. All of this is in Europe.',
    },
  },
  {
    id: 'q20', level: 2,
    text: { fr: 'La cordillère des Andes, la plus longue chaîne de montagnes sur la terre ferme, longe quel continent ?', en: 'The Andes, the longest mountain range on land, run down which continent?' },
    options: c('southAmerica', 'asia', 'africa', 'australia'), answer: 'southAmerica',
    explain: {
      fr: 'Les Andes longent toute la côte ouest de l’Amérique du Sud, du Venezuela jusqu’au sud du Chili et de l’Argentine : environ 7 000 km !',
      en: 'The Andes run all along the west coast of South America, from Venezuela to the far south of Chile and Argentina: about 7,000 km!',
    },
  },
  {
    id: 'q21', level: 1,
    text: { fr: 'Quel est le plus grand océan ?', en: 'Which is the largest ocean?' },
    options: o('atlantic', 'pacific', 'indian', 'arctic'), answer: 'pacific',
    explain: {
      fr: 'Le Pacifique couvre presque un tiers de la Terre : il est plus grand que toutes les terres du monde réunies !',
      en: 'The Pacific covers almost a third of the Earth: it is bigger than all the land in the world put together!',
    },
  },
  {
    id: 'q22', level: 1,
    text: { fr: 'Combien y a-t-il d’océans ?', en: 'How many oceans are there?' },
    options: nums(3, 4, 5, 7), answer: '5',
    explain: {
      fr: 'Il y a 5 océans : le Pacifique, l’Atlantique, l’Indien, l’Austral et l’Arctique. Ils se touchent tous et forment un seul grand océan mondial.',
      en: 'There are 5 oceans: the Pacific, the Atlantic, the Indian, the Southern and the Arctic. They all touch and make one big world ocean.',
    },
  },
  {
    id: 'q23', level: 2,
    text: { fr: 'Quel océan entoure l’Antarctique ?', en: 'Which ocean surrounds Antarctica?' },
    options: o('southern', 'arctic', 'indian', 'pacific'), answer: 'southern',
    explain: {
      fr: 'L’océan Austral fait le tour de l’Antarctique. L’océan Arctique, lui, est tout au nord, autour du pôle Nord.',
      en: 'The Southern Ocean goes all the way round Antarctica. The Arctic Ocean is far to the north, around the North Pole.',
    },
  },
  {
    id: 'q24', level: 2,
    text: { fr: 'Quel est le plus petit océan ?', en: 'Which is the smallest ocean?' },
    options: o('indian', 'arctic', 'atlantic', 'southern'), answer: 'arctic',
    explain: {
      fr: 'L’océan Arctique, autour du pôle Nord, est le plus petit. Une grande partie est couverte de glace, surtout en hiver.',
      en: 'The Arctic Ocean, around the North Pole, is the smallest. Much of it is covered in ice, especially in winter.',
    },
  },
  {
    id: 'q25', level: 2,
    text: { fr: 'Les monts Oural marquent la frontière entre quels continents ?', en: 'The Ural Mountains mark the border between which two continents?' },
    options: [PAIR.europeAsia, PAIR.africaAsia, PAIR.americas, PAIR.europeAfrica], answer: 'europeAsia',
    explain: {
      fr: 'L’Europe et l’Asie forment une seule grande masse de terre. On place la frontière entre les deux le long des monts Oural, en Russie. La Russie est donc à cheval sur deux continents.',
      en: 'Europe and Asia make one big piece of land. The border between them is placed along the Ural Mountains, in Russia. So Russia lies on two continents.',
    },
  },
  {
    id: 'q26', level: 2,
    text: { fr: 'Quel océan se trouve entre l’Afrique et l’Australie ?', en: 'Which ocean lies between Africa and Australia?' },
    options: o('indian', 'pacific', 'atlantic', 'arctic'), answer: 'indian',
    explain: {
      fr: 'L’océan Indien baigne l’est de l’Afrique, le sud de l’Asie et l’ouest de l’Australie. C’est le troisième plus grand océan.',
      en: 'The Indian Ocean washes the east of Africa, the south of Asia and the west of Australia. It is the third-largest ocean.',
    },
  },
  {
    id: 'q27', level: 2,
    text: { fr: 'Quel est le seul continent traversé à la fois par l’équateur et par les deux tropiques ?', en: 'Which is the only continent crossed by the equator and by both tropics?' },
    options: c('africa', 'southAmerica', 'asia', 'australia'), answer: 'africa',
    explain: {
      fr: 'L’équateur traverse le centre de l’Afrique, le tropique du Cancer passe dans le Sahara et le tropique du Capricorne dans le sud du continent.',
      en: 'The equator crosses the middle of Africa, the Tropic of Cancer runs through the Sahara and the Tropic of Capricorn through the south of the continent.',
    },
  },
  {
    id: 'q28', level: 2,
    text: { fr: 'Depuis le sud de l’Espagne, quel continent voit-on de l’autre côté du détroit de Gibraltar ?', en: 'From the south of Spain, which continent can you see across the Strait of Gibraltar?' },
    options: c('africa', 'asia', 'northAmerica', 'southAmerica'), answer: 'africa',
    explain: {
      fr: 'Le détroit de Gibraltar ne fait qu’environ 14 km de large. De l’autre côté, c’est le Maroc, en Afrique.',
      en: 'The Strait of Gibraltar is only about 14 km wide. On the other side is Morocco, in Africa.',
    },
  },
  {
    id: 'q29', level: 1,
    text: { fr: 'Les montagnes Rocheuses sont sur quel continent ?', en: 'The Rocky Mountains are on which continent?' },
    options: c('northAmerica', 'europe', 'africa', 'australia'), answer: 'northAmerica',
    explain: {
      fr: 'Les Rocheuses traversent l’ouest du Canada et des États-Unis, en Amérique du Nord, sur plus de 4 500 km.',
      en: 'The Rockies run through the west of Canada and the United States, in North America, for more than 4,500 km.',
    },
  },
  {
    id: 'q30', level: 1,
    text: { fr: 'Les grandes pyramides de Gizeh, en Égypte, sont sur quel continent ?', en: 'The great pyramids of Giza, in Egypt, are on which continent?' },
    options: c('africa', 'asia', 'europe', 'southAmerica'), answer: 'africa',
    explain: {
      fr: 'L’Égypte est au nord-est de l’Afrique, au bord du Nil. Les pyramides de Gizeh ont plus de 4 500 ans.',
      en: 'Egypt is in the north-east of Africa, beside the Nile. The pyramids of Giza are more than 4,500 years old.',
    },
  },
];

// Where each continent is, for the map questions.
const WHERE: Record<ContinentId, Text> = {
  northAmerica: {
    fr: 'C’est l’Amérique du Nord, en haut à gauche : le Canada, les États-Unis, le Mexique… et le Groenland, tout en haut.',
    en: 'It is North America, top left: Canada, the United States, Mexico… and Greenland, right at the top.',
  },
  southAmerica: {
    fr: 'C’est l’Amérique du Sud, sous l’Amérique du Nord. Elle a la forme d’un cornet de glace pointé vers le bas.',
    en: 'It is South America, below North America. It is shaped like an ice-cream cone pointing down.',
  },
  europe: {
    fr: 'C’est l’Europe, en haut au milieu, collée à l’Asie. C’est là que se trouve Sodor !',
    en: 'It is Europe, at the top in the middle, joined to Asia. That is where Sodor is!',
  },
  africa: {
    fr: 'C’est l’Afrique, au milieu de la carte, sous l’Europe. L’équateur la traverse.',
    en: 'It is Africa, in the middle of the map, below Europe. The equator crosses it.',
  },
  asia: {
    fr: 'C’est l’Asie, le plus grand continent, en haut à droite.',
    en: 'It is Asia, the largest continent, at the top on the right.',
  },
  australia: {
    fr: 'C’est l’Australie, en bas à droite, entre l’océan Indien et l’océan Pacifique.',
    en: 'It is Australia, bottom right, between the Indian and Pacific Oceans.',
  },
  antarctica: {
    fr: 'C’est l’Antarctique, tout en bas, autour du pôle Sud. Il est couvert de glace.',
    en: 'It is Antarctica, right at the bottom, around the South Pole. It is covered in ice.',
  },
};

const CONTINENT_IDS = Object.keys(WHERE) as ContinentId[];

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

const mapQuestion = (id: ContinentId): Question => ({
  id: `map-${id}`, level: 1,
  text: { fr: 'Quel continent est en couleur sur la carte ?', en: 'Which continent is coloured in on the map?' },
  options: c(id, ...shuffle(CONTINENT_IDS.filter(k => k !== id)).slice(0, 3)),
  answer: id, explain: WHERE[id], map: id,
});

// A run: every question once, in a random order (easier ones first for Primary),
// with the answers shuffled. `avoid` keeps the last question of a run from opening the next.
function deal(grade: Grade, avoid?: string): Question[] {
  const all = [...QUESTIONS, ...CONTINENT_IDS.map(mapQuestion)];
  const deck = grade === 'Primary'
    ? [...shuffle(all.filter(q => q.level === 1)), ...shuffle(all.filter(q => q.level === 2))]
    : shuffle(all);
  if (deck.length > 1 && deck[0].id === avoid) deck.push(deck.shift()!);
  return deck.map(q => ({ ...q, options: shuffle(q.options) }));
}

export default function ContinentsExercise({ grade, questionsCount = 5, onComplete, onCancel, color, place }: Props) {
  const { lang, tr } = useLang();
  const fr = lang === 'fr';
  const [deck, setDeck] = useState<Question[]>(() => deal(grade));
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [answered, setAnswered] = useState(0);
  const [key, setKey] = useState(0);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    setDeck(deal(grade)); setPos(0); setPicked(null); setKey(k => k + 1);
  }, [grade]);

  const q = deck[pos];
  const right = q.options.find(x => x.id === q.answer)!;

  const next = () => {
    if (pos + 1 < deck.length) setPos(pos + 1);
    else { setDeck(deal(grade, q.id)); setPos(0); }
    setPicked(null);
    setKey(k => k + 1);
  };

  const answer = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === q.answer) {
      const n = answered + 1;
      setAnswered(n);
      if (n >= questionsCount) setTimeout(() => onComplete('engine'), 1300);
    }
  };

  const feedback: Feedback = !picked ? null : picked === q.answer ? { ok: true } : {
    ok: false,
    explain: (
      <>
        <p className="m-0 mb-1.5">{tr({ fr: 'La bonne réponse : ', en: 'The right answer: ' })}<b>{tr(right.label)}</b>.</p>
        <p className="m-0">{tr(q.explain)}</p>
      </>
    ),
  };

  const listen = () => speak(`${tr(q.text)} ${q.options.map(x => tr(x.label)).join(', ')}.`, lang);

  return (
    <ExerciseFrame
      color={color} place={place || 'Peel Godred'}
      label={fr ? 'Le défi des continents' : 'The Continents Challenge'}
      answered={answered} total={questionsCount} questionKey={key}
      onListen={listen} feedback={feedback} onNext={next} onBack={onCancel}
    >
      <h2 className="text-xl sm:text-2xl font-extrabold mb-5 leading-snug">{tr(q.text)}</h2>
      {q.map && (
        <div className="mb-5">
          <WorldMap lang={lang} highlight={[q.map]} labels={!!picked}
            label={tr({ fr: 'Carte du monde : un continent est en couleur', en: 'World map: one continent is coloured in' })} />
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {q.options.map(opt => {
          const state = !picked ? 'idle' : opt.id === q.answer ? 'right' : opt.id === picked ? 'picked-wrong' : 'other';
          return (
            <button key={opt.id} onClick={() => answer(opt.id)} disabled={!!picked}
              className={`${answerClass(state)} leading-snug text-center`}>
              {tr(opt.label)}
            </button>
          );
        })}
      </div>
    </ExerciseFrame>
  );
}
