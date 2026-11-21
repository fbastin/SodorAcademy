import { Question, Grade } from '../types';

export const LOCAL_QUESTIONS: Record<string, Record<Grade, Question[]>> = {
  'Mathematics': {
    'Primary': [
      {
        id: 'math-p-1',
        text: 'Thomas needs to deliver 5 trucks of coal to Knapford and 3 trucks to Wellsworth. How many trucks is he pulling in total?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '5 + 3 = 8.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-2',
        text: 'Percy started with 10 mail bags. He dropped off 4 at Ffarquhar. How many mail bags does he have left?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '10 - 4 = 6.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-3',
        text: 'James has 12 coaches. If he leaves 5 at the platform, how many coaches is he pulling now?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '7',
        explanation: '12 - 5 = 7.',
        rewardType: 'coin'
      },
      {
        id: 'math-p-4',
        text: 'There are 4 engines in Tidmouth Sheds and 3 engines at Knapford Station. How many engines are there altogether?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '7',
        explanation: '4 + 3 = 7.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-5',
        text: 'Annie has 8 seats and Clarabel has 8 seats. How many seats do Thomas\'s coaches have in total?',
        options: ['12', '14', '16', '18'],
        correctAnswer: '16',
        explanation: '8 + 8 = 16.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-6',
        text: 'Thomas takes 6 passengers to each of 3 stations. How many passengers does he carry in total?',
        options: ['12', '16', '18', '20'],
        correctAnswer: '18',
        explanation: '6 × 3 = 18.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-7',
        text: 'Percy delivers 12 parcels to 4 shops, the same number to each shop. How many parcels does each shop get?',
        options: ['2', '3', '4', '6'],
        correctAnswer: '3',
        explanation: '12 ÷ 4 = 3.',
        rewardType: 'coin'
      },
      {
        id: 'math-p-8',
        text: 'Diesel delivered 25 trucks of coal on Monday and 15 on Tuesday. How many trucks did he deliver altogether?',
        options: ['30', '35', '40', '45'],
        correctAnswer: '40',
        explanation: '25 + 15 = 40.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-9',
        text: 'Harvey the Crane lifts 9 loads in the morning and 9 loads in the afternoon. How many loads does he lift in total?',
        options: ['16', '17', '18', '19'],
        correctAnswer: '18',
        explanation: '9 + 9 = 18.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-10',
        text: 'Toby has 14 passengers and 6 get off at the station. How many passengers are left?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: '14 - 6 = 8.',
        rewardType: 'coin'
      },
      {
        id: 'math-p-11',
        text: 'Six trucks each have 2 wheels on one side. How many wheels can you see on one side?',
        options: ['10', '12', '14', '16'],
        correctAnswer: '12',
        explanation: '6 × 2 = 12.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-12',
        text: 'James\'s coaches have 48 wheels in total. If each coach has 8 wheels, how many coaches does he have?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '6',
        explanation: '48 ÷ 8 = 6.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-13',
        text: 'A ticket costs 20 pence. If Thomas sells 5 tickets, how much money does he collect?',
        options: ['60p', '80p', '£1', '£2'],
        correctAnswer: '£1',
        explanation: '5 × 20p = 100p = £1.',
        rewardType: 'coin'
      },
      {
        id: 'math-p-14',
        text: 'Gordon has 20 passengers. Half of them get off at Wellsworth. How many passengers stay on the train?',
        options: ['5', '8', '10', '12'],
        correctAnswer: '10',
        explanation: 'Half of 20 is 10.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-15',
        text: 'At Brendam Docks, 3 cranes each load 4 containers onto a ship. How many containers are loaded in total?',
        options: ['10', '12', '14', '16'],
        correctAnswer: '12',
        explanation: '3 × 4 = 12.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-16',
        text: 'The clock at Knapford strikes 7 times at 7 o\'clock and 3 times at 3 o\'clock. How many strikes is that altogether?',
        options: ['9', '10', '11', '12'],
        correctAnswer: '10',
        explanation: '7 + 3 = 10.',
        rewardType: 'coin'
      },
      {
        id: 'math-p-17',
        text: 'Diesel has 30 wagons. He drops off 12 at the scrapyard. How many wagons does he have left?',
        options: ['16', '17', '18', '19'],
        correctAnswer: '18',
        explanation: '30 - 12 = 18.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-18',
        text: 'Thomas pulls 2 brake vans, 3 trucks of coal and 4 carriages. How many vehicles is he pulling in total?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '9',
        explanation: '2 + 3 + 4 = 9.',
        rewardType: 'engine'
      },
      {
        id: 'math-p-19',
        text: 'If Thomas can visit 2 stations in one hour, how many stations can he visit in 5 hours?',
        options: ['8', '9', '10', '12'],
        correctAnswer: '10',
        explanation: '5 × 2 = 10.',
        rewardType: 'badge'
      },
      {
        id: 'math-p-20',
        text: 'There are 18 passengers on the platform and they get into 2 coaches equally. How many passengers are in each coach?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '9',
        explanation: '18 ÷ 2 = 9.',
        rewardType: 'coin'
      }
    ],
    'Secondary': [
      {
        id: 'math-s-1',
        text: 'Gordon is traveling at 60 miles per hour. If he maintains this speed, how far will he travel in 45 minutes?',
        options: ['40 miles', '45 miles', '50 miles', '55 miles'],
        correctAnswer: '45 miles',
        explanation: 'At 60 mph, he travels 1 mile per minute. So in 45 minutes, he travels 45 miles.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-2',
        text: 'A train ticket costs £15. If there is a 20% discount for children, how much does a child ticket cost?',
        options: ['£10', '£12', '£13', '£14'],
        correctAnswer: '£12',
        explanation: '20% of £15 is £3. £15 - £3 = £12.',
        rewardType: 'badge'
      },
      {
        id: 'math-s-3',
        text: 'Henry\'s tender holds 5000 gallons of water. If he uses 250 gallons every 10 miles, how many miles can he travel before he is empty?',
        options: ['100 miles', '150 miles', '200 miles', '250 miles'],
        correctAnswer: '200 miles',
        explanation: '5000 / 250 = 20 segments of 10 miles each. 20 * 10 = 200 miles.',
        rewardType: 'coin'
      },
      {
        id: 'math-s-4',
        text: 'Henry pulls 12 coaches that each weigh 5 tonnes. What is the total weight of the coaches?',
        options: ['50 tonnes', '55 tonnes', '60 tonnes', '75 tonnes'],
        correctAnswer: '60 tonnes',
        explanation: '12 × 5 = 60 tonnes.',
        rewardType: 'coin'
      },
      {
        id: 'math-s-5',
        text: 'The Fat Controller spends 2/5 of £100 on repairing Thomas. How much is that?',
        options: ['£20', '£30', '£40', '£50'],
        correctAnswer: '£40',
        explanation: '2/5 of 100 = 40.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-6',
        text: 'A train leaves Tidmouth at 9:30 and arrives at Knapford at 10:05. How long is the journey?',
        options: ['25 minutes', '30 minutes', '35 minutes', '45 minutes'],
        correctAnswer: '35 minutes',
        explanation: '10:05 - 9:30 = 35 minutes.',
        rewardType: 'badge'
      },
      {
        id: 'math-s-7',
        text: 'Signalman Charlie checks 3,600 signals in an 8-hour shift. How many signals does he check per hour?',
        options: ['400', '425', '450', '500'],
        correctAnswer: '450',
        explanation: '3600 ÷ 8 = 450.',
        rewardType: 'coin'
      },
      {
        id: 'math-s-8',
        text: 'Gordon travels 30 miles in 40 minutes. What is his average speed in miles per hour?',
        options: ['40 mph', '45 mph', '50 mph', '55 mph'],
        correctAnswer: '45 mph',
        explanation: '30 miles in 2/3 of an hour = 30 × 3/2 = 45 mph.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-9',
        text: 'A platform ticket costs £2.50. If Percy sells 8 tickets, how much money does he collect?',
        options: ['£16', '£18', '£20', '£22'],
        correctAnswer: '£20',
        explanation: '8 × £2.50 = £20.',
        rewardType: 'badge'
      },
      {
        id: 'math-s-10',
        text: 'The express has 96 wheels. If it has 12 coaches, and all coaches have the same number of wheels, how many wheels does each coach have?',
        options: ['6', '7', '8', '9'],
        correctAnswer: '8',
        explanation: '96 ÷ 12 = 8.',
        rewardType: 'coin'
      },
      {
        id: 'math-s-11',
        text: 'In 5 journeys, Thomas carried 10, 12, 8, 15 and 10 passengers. What is the average number of passengers?',
        options: ['10', '11', '12', '13'],
        correctAnswer: '11',
        explanation: '(10 + 12 + 8 + 15 + 10) ÷ 5 = 55 ÷ 5 = 11.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-12',
        text: 'Tidmouth Sheds is painted in the ratio 2 parts red to 3 parts blue. If 20 litres of red paint are used, how much blue paint is needed?',
        options: ['25 litres', '30 litres', '35 litres', '40 litres'],
        correctAnswer: '30 litres',
        explanation: 'The ratio 2:3 means the blue is 3/2 of the red, so 3/2 × 20 = 30 litres.',
        rewardType: 'badge'
      },
      {
        id: 'math-s-13',
        text: 'The station yard is a rectangle 40 metres long and 25 metres wide. What is its area?',
        options: ['800 m²', '900 m²', '1000 m²', '1200 m²'],
        correctAnswer: '1000 m²',
        explanation: '40 × 25 = 1000 m².',
        rewardType: 'coin'
      },
      {
        id: 'math-s-14',
        text: 'A ticket price rises from £20 to £25. What is the percentage increase?',
        options: ['20%', '25%', '30%', '40%'],
        correctAnswer: '25%',
        explanation: 'The increase is £5, which is 25% of £20.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-15',
        text: 'Two engines leave Tidmouth in opposite directions. Gordon travels at 60 mph and Percy at 40 mph. After 1 hour, how far apart are they?',
        options: ['60 miles', '80 miles', '100 miles', '120 miles'],
        correctAnswer: '100 miles',
        explanation: '60 + 40 = 100 miles, because they move apart in opposite directions.',
        rewardType: 'badge'
      },
      {
        id: 'math-s-16',
        text: 'Thomas\'s tank holds 90 litres of water. If he uses 15 litres per mile, how far can he travel before running out?',
        options: ['4 miles', '5 miles', '6 miles', '9 miles'],
        correctAnswer: '6 miles',
        explanation: '90 ÷ 15 = 6 miles.',
        rewardType: 'coin'
      },
      {
        id: 'math-s-17',
        text: 'The mean load of 4 trucks is 5 tonnes. If three trucks weigh 4, 6 and 5 tonnes, what does the fourth truck weigh?',
        options: ['3 tonnes', '4 tonnes', '5 tonnes', '6 tonnes'],
        correctAnswer: '5 tonnes',
        explanation: 'Total load is 4 × 5 = 20 tonnes; 20 - (4 + 6 + 5) = 5 tonnes.',
        rewardType: 'engine'
      },
      {
        id: 'math-s-18',
        text: 'Gordon\'s Hill has a 1 in 20 gradient. For every 20 horizontal metres, how many metres does the track rise?',
        options: ['1 m', '2 m', '5 m', '10 m'],
        correctAnswer: '1 m',
        explanation: 'A 1 in 20 gradient rises 1 metre for every 20 metres travelled.',
        rewardType: 'badge'
      }
    ]
  },
  'English': {
    'Primary': [
      {
        id: 'eng-p-1',
        text: 'Which of these is a naming word (noun)?',
        options: ['Puff', 'Thomas', 'Fast', 'Quickly'],
        correctAnswer: 'Thomas',
        explanation: 'Thomas is a proper noun.',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-2',
        text: 'What is the opposite of "fast"?',
        options: ['Quick', 'Slow', 'Shiny', 'Red'],
        correctAnswer: 'Slow',
        explanation: 'The antonym of fast is slow.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-3',
        text: 'Which word describes James\'s paint?',
        options: ['Splendid', 'He', 'Runs', 'And'],
        correctAnswer: 'Splendid',
        explanation: 'Splendid is an adjective.',
        rewardType: 'engine'
      },
      {
        id: 'eng-p-4',
        text: 'Which of these is a doing word (verb)?',
        options: ['Puff', 'Steam', 'Smoke', 'Track'],
        correctAnswer: 'Puff',
        explanation: 'Puff is an action, so it is a verb.',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-5',
        text: 'What is the plural of "box"?',
        options: ['Boxes', 'Box', 'Boxer', 'Boxing'],
        correctAnswer: 'Boxes',
        explanation: 'We add -es to words that end in x.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-6',
        text: 'Which sentence is written correctly?',
        options: ['thomas is a tank engine.', 'Thomas is a tank engine.', 'thomas Is a tank engine.', 'thomas is a tank engine'],
        correctAnswer: 'Thomas is a tank engine.',
        explanation: 'Sentences start with a capital letter and end with a full stop.',
        rewardType: 'engine'
      },
      {
        id: 'eng-p-7',
        text: 'What is the opposite of "loud"?',
        options: ['Quiet', 'Shiny', 'Heavy', 'Fast'],
        correctAnswer: 'Quiet',
        explanation: 'Loud and quiet are opposites (antonyms).',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-8',
        text: 'Which word best fits the sentence: "Thomas ____ to Knapford yesterday."',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 'went',
        explanation: 'Went is the past tense of the verb go.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-9',
        text: 'Which word means the same as "big"?',
        options: ['Large', 'Small', 'Tiny', 'Wee'],
        correctAnswer: 'Large',
        explanation: 'Big and large are synonyms.',
        rewardType: 'engine'
      },
      {
        id: 'eng-p-10',
        text: 'Which word is spelled correctly?',
        options: ['Engin', 'Engine', 'Enjine', 'Engene'],
        correctAnswer: 'Engine',
        explanation: 'E-n-g-i-n-e is the correct spelling.',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-11',
        text: 'Which sentence uses the apostrophe correctly?',
        options: ['Sam\'s trucks are full.', 'Sams\' truck\'s are full.', 'Sams trucks are full.', 'Sams truck\'s are full.'],
        correctAnswer: 'Sam\'s trucks are full.',
        explanation: 'Sam\'s shows that the trucks belong to Sam.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-12',
        text: 'Which word is an adjective?',
        options: ['Red', 'Run', 'Quickly', 'Under'],
        correctAnswer: 'Red',
        explanation: 'Red describes a noun, so it is an adjective.',
        rewardType: 'engine'
      },
      {
        id: 'eng-p-13',
        text: 'Which word comes first in alphabetical order?',
        options: ['Crane', 'Coal', 'Coupling', 'Crash'],
        correctAnswer: 'Coal',
        explanation: 'Coal, coupling, crane, then crash come in dictionary order.',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-14',
        text: 'Which of these is a question?',
        options: ['Thomas is red.', 'Peep peep!', 'Where is Percy?', 'Go faster.'],
        correctAnswer: 'Where is Percy?',
        explanation: 'A question ends with a question mark.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-15',
        text: 'Which word is a pronoun that stands for Thomas?',
        options: ['He', 'Red', 'Engine', 'Track'],
        correctAnswer: 'He',
        explanation: 'We use the pronoun he instead of repeating Thomas.',
        rewardType: 'engine'
      },
      {
        id: 'eng-p-16',
        text: 'What is the past tense of "run"?',
        options: ['Ran', 'Runned', 'Running', 'Runs'],
        correctAnswer: 'Ran',
        explanation: 'Run becomes ran in the past tense.',
        rewardType: 'badge'
      },
      {
        id: 'eng-p-17',
        text: 'Which word rhymes with "train"?',
        options: ['Rain', 'Road', 'Track', 'Truck'],
        correctAnswer: 'Rain',
        explanation: 'Train and rain end with the same sound.',
        rewardType: 'coin'
      },
      {
        id: 'eng-p-18',
        text: 'Which word is the position word in this sentence: "Percy is beside the signal box."?',
        options: ['Percy', 'Signal', 'Beside', 'Box'],
        correctAnswer: 'Beside',
        explanation: 'Beside tells us where Percy is.',
        rewardType: 'engine'
      }
    ],
    'Secondary': [
      {
        id: 'eng-s-1',
        text: 'In the sentence "Gordon boasted about his speed," what is the verb?',
        options: ['Gordon', 'Boasted', 'About', 'Speed'],
        correctAnswer: 'Boasted',
        explanation: 'Boasted functions as the verb.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-2',
        text: 'Which of these is a synonym for "industrious"?',
        options: ['Lazy', 'Hard-working', 'Fast', 'Shiny'],
        correctAnswer: 'Hard-working',
        explanation: 'Industrious is synonymous with hard-working.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-3',
        text: 'Which is the direct object in the sentence "Duck pulled the trucks up the hill"?',
        options: ['Duck', 'Trucks', 'Hill', 'Up'],
        correctAnswer: 'Trucks',
        explanation: 'The trucks receive the action of the verb.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-4',
        text: 'Which sentence is written in the passive voice?',
        options: ['Gordon pulled the express.', 'The express was pulled by Gordon.', 'Gordon pulls the express.', 'Gordon will pull the express.'],
        correctAnswer: 'The express was pulled by Gordon.',
        explanation: 'In the passive voice, the subject receives the action.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-5',
        text: 'Identify the subordinate clause in: "When the whistle blew, the passengers boarded."',
        options: ['The passengers boarded', 'When the whistle blew', 'The whistle', 'Boarded'],
        correctAnswer: 'When the whistle blew',
        explanation: 'This clause cannot stand alone as a complete sentence.',
        rewardType: 'engine'
      },
      {
        id: 'eng-s-6',
        text: 'Which sentence contains a metaphor?',
        options: ['Thomas is as fast as lightning.', 'The whistle peeped loudly.', 'The engine is a fiery dragon.', 'Steam rose like a cloud.'],
        correctAnswer: 'The engine is a fiery dragon.',
        explanation: 'It compares an engine to a dragon without using like or as.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-7',
        text: 'Which word has a silent letter?',
        options: ['Brake', 'Signal', 'Island', 'Coal'],
        correctAnswer: 'Island',
        explanation: 'The s in island is silent.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-8',
        text: 'What is the collective noun for a group of trains?',
        options: ['A fleet', 'A pack', 'A flock', 'A herd'],
        correctAnswer: 'A fleet',
        explanation: 'A fleet is a group of vehicles, such as trains.',
        rewardType: 'engine'
      },
      {
        id: 'eng-s-9',
        text: 'What does the idiom "to let off steam" mean?',
        options: ['To release built-up pressure or relax', 'To get angry deliberately', 'To blow a whistle', 'To speed up'],
        correctAnswer: 'To release built-up pressure or relax',
        explanation: 'Letting off steam means releasing built-up energy or frustration.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-10',
        text: 'Which pair is an example of homophones?',
        options: ['Station / stationer', 'Knight / night', 'Engine / engined', 'Brakes / braked'],
        correctAnswer: 'Knight / night',
        explanation: 'Homophones sound the same but differ in spelling and meaning.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-11',
        text: 'Which word means the same as "courageous"?',
        options: ['Brave', 'Afraid', 'Timid', 'Lazy'],
        correctAnswer: 'Brave',
        explanation: 'Courageous and brave are synonyms.',
        rewardType: 'engine'
      },
      {
        id: 'eng-s-12',
        text: 'What is the antonym of "ancient"?',
        options: ['Modern', 'Old', 'Elderly', 'Antique'],
        correctAnswer: 'Modern',
        explanation: 'Ancient and modern are opposites.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-13',
        text: 'What does the prefix "sub-" mean in the word "subway"?',
        options: ['Over', 'Under', 'Beside', 'Through'],
        correctAnswer: 'Under',
        explanation: 'The prefix sub- means under or below.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-14',
        text: 'Identify the infinitive phrase in: "James loves to pull the express."',
        options: ['Loves to pull', 'To pull the express', 'The express', 'James loves'],
        correctAnswer: 'To pull the express',
        explanation: 'An infinitive phrase begins with to followed by a verb.',
        rewardType: 'engine'
      },
      {
        id: 'eng-s-15',
        text: 'Which sentence uses correct punctuation for a quotation?',
        options: ['"Peep peep" said Thomas.', '"Peep peep," said Thomas.', '"Peep peep." said Thomas,', '"Peep peep, said Thomas."'],
        correctAnswer: '"Peep peep," said Thomas.',
        explanation: 'The comma goes inside the closing quotation marks.',
        rewardType: 'badge'
      },
      {
        id: 'eng-s-16',
        text: 'Which word is an adverb in the sentence "The train crept cautiously along the line"?',
        options: ['Crept', 'Cautiously', 'Line', 'Train'],
        correctAnswer: 'Cautiously',
        explanation: 'Cautiously describes how the train crept.',
        rewardType: 'coin'
      },
      {
        id: 'eng-s-17',
        text: 'Which sentence uses a semi-colon correctly?',
        options: ['The shed held six engines; each one was fast.', 'The shed held six engines; each, one was fast.', 'Six engines; the shed held them.', 'Six engines the shed; held them.'],
        correctAnswer: 'The shed held six engines; each one was fast.',
        explanation: 'A semi-colon joins two closely related clauses.',
        rewardType: 'engine'
      }
    ]
  },
  'Science': {
    'Primary': [
      {
        id: 'sci-p-1',
        text: 'What is a force?',
        options: ['A push or a pull', 'A type of engine', 'A station on Sodor', 'Coal and water'],
        correctAnswer: 'A push or a pull',
        explanation: 'A force is simply pushing or pulling something to make it move!',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-2',
        text: 'What pulling force keeps Thomas and his coaches on the tracks?',
        options: ['Magnetism', 'Gravity', 'Wind', 'Steam'],
        correctAnswer: 'Gravity',
        explanation: 'Gravity pulls everything toward the center of the Earth, keeping engines on the rails!',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-3',
        text: 'If Thomas pushes a heavy truck with more force, what happens?',
        options: ['It goes slower', 'It stops', 'It goes faster', 'It changes color'],
        correctAnswer: 'It goes faster',
        explanation: 'More force means more acceleration, so the truck goes faster!',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-4',
        text: 'What force slows Thomas down when he is on a rough track?',
        options: ['Friction', 'Gravity', 'Happiness', 'Steam'],
        correctAnswer: 'Friction',
        explanation: 'Friction is a force that acts in the opposite direction of motion, slowing things down.',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-5',
        text: 'Some engines use magnets to connect to trucks. Is magnetism a force?',
        options: ['Yes', 'No', 'Only on Tuesdays', 'Only for Percy'],
        correctAnswer: 'Yes',
        explanation: 'Magnetism is a non-contact force that can pull or push objects!',
        rewardType: 'coin'
      },
      {
        id: 'sci-p-6',
        text: 'Why does Gordon need more force to go up a hill?',
        options: ['Gravity pulls him down', 'The hill is slippery', 'He is sleepy', 'Wind is pushing him'],
        correctAnswer: 'Gravity pulls him down',
        explanation: 'Gravity pulls Gordon toward the Earth, making it harder to climb up!',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-7',
        text: 'Does a heavy coal truck need more force to move than an empty one?',
        options: ['More force', 'Less force', 'The same force', 'No force'],
        correctAnswer: 'More force',
        explanation: 'Heavier objects have more mass and need more force to start moving!',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-8',
        text: 'If two engines pull a truck in opposite directions with the same force, does it move?',
        options: ['Yes, it goes left', 'Yes, it goes right', 'No, it stays still', 'It flies up'],
        correctAnswer: 'No, it stays still',
        explanation: 'When forces are balanced, the object does not change its motion!',
        rewardType: 'coin'
      },
      {
        id: 'sci-p-9',
        text: 'If Thomas pulls harder than Percy in a tug-of-war, what happens?',
        options: ['They stay still', 'They move toward Thomas', 'They move toward Percy', 'The rope turns blue'],
        correctAnswer: 'They move toward Thomas',
        explanation: 'The unbalanced force makes them move in the direction of the stronger pull!',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-10',
        text: 'What do we call the force of air pushing against a fast engine?',
        options: ['Air resistance', 'Gravity', 'Friction', 'Magnetism'],
        correctAnswer: 'Air resistance',
        explanation: 'Air resistance is a type of friction that occurs when objects move through the air.',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-11',
        text: 'When an engine uses brakes, what force are they increasing?',
        options: ['Gravity', 'Friction', 'Speed', 'Steam'],
        correctAnswer: 'Friction',
        explanation: 'Brakes push against the wheels to create friction and stop the engine.',
        rewardType: 'coin'
      },
      {
        id: 'sci-p-12',
        text: 'If an engine travels a long distance in a short time, they have high...',
        options: ['Weight', 'Speed', 'Gravity', 'Mass'],
        correctAnswer: 'Speed',
        explanation: 'Speed is how fast an object covers a distance.',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-13',
        text: 'A force can change an engine\'s speed and its...',
        options: ['Color', 'Name', 'Direction', 'Whistle'],
        correctAnswer: 'Direction',
        explanation: 'Forces can make things speed up, slow down, or turn!',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-14',
        text: 'What does a buffer on a truck use to push back when hit?',
        options: ['A spring', 'Glue', 'Water', 'Coal'],
        correctAnswer: 'A spring',
        explanation: 'Springs inside buffers compress to absorb the force of a bump!',
        rewardType: 'coin'
      },
      {
        id: 'sci-p-15',
        text: 'What gives a steam engine the energy to move?',
        options: ['Burning coal', 'Batteries', 'Wind', 'Singing'],
        correctAnswer: 'Burning coal',
        explanation: 'Burning coal boils the water in the boiler, and the steam pushes the pistons. The water carries the energy, but the coal provides it.',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-16',
        text: 'A see-saw is a simple machine. What is the point it turns on called?',
        options: ['Pivot or Fulcrum', 'The Middle', 'The Seat', 'The Ground'],
        correctAnswer: 'Pivot or Fulcrum',
        explanation: 'The pivot or fulcrum is the fixed point that a lever turns around.',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-17',
        text: 'What simple machine might Harvey the Crane use to lift things?',
        options: ['A Pulley', 'A Hammer', 'A Ruler', 'A Screwdriver'],
        correctAnswer: 'A Pulley',
        explanation: 'Pulleys use wheels and ropes to make lifting heavy objects easier!',
        rewardType: 'coin'
      },
      {
        id: 'sci-p-18',
        text: 'What is the amount of \'stuff\' in a truck called?',
        options: ['Weight', 'Mass', 'Size', 'Volume'],
        correctAnswer: 'Mass',
        explanation: 'Mass is the measure of how much matter is in an object.',
        rewardType: 'engine'
      },
      {
        id: 'sci-p-19',
        text: 'Thomas\'s wheels need grip to climb a hill. Where is the friction greater: on dry rails sprinkled with sand, or on rails covered in wet leaves?',
        options: ['Dry rails with sand', 'Rails with wet leaves', 'Both the same', 'Neither'],
        correctAnswer: 'Dry rails with sand',
        explanation: 'Sand is rough, so it gives the wheels more grip. Wet leaves make a slippery layer and the wheels spin.',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-20',
        text: 'What do we call the measure of gravity\'s pull on an object?',
        options: ['Mass', 'Weight', 'Speed', 'Volume'],
        correctAnswer: 'Weight',
        explanation: 'Weight is the force of gravity acting on an object\'s mass.',
        rewardType: 'coin'
      }
    ],
    'Secondary': [
      {
        id: 'sci-s-1',
        text: 'Which formula represents Newton\'s Second Law of Motion?',
        options: ['E = mc²', 'F = ma', 'A = πr²', 'V = IR'],
        correctAnswer: 'F = ma',
        explanation: 'Force equals Mass times Acceleration. This explains how objects move!',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-2',
        text: 'What is the approximate acceleration due to gravity on Earth?',
        options: ['1.62 m/s²', '3.72 m/s²', '9.81 m/s²', '24.79 m/s²'],
        correctAnswer: '9.81 m/s²',
        explanation: 'On Earth, objects accelerate downwards at about 9.81 meters per second squared.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-3',
        text: 'Why do a heavy engine and a light coach fall at the same speed (ignoring air resistance)?',
        options: ['Gravity doesn\'t pull on light things', 'Heavy things are easier to move', 'Gravity pulls harder on heavy things, but they have more mass to move', 'They don\'t fall at the same speed'],
        correctAnswer: 'Gravity pulls harder on heavy things, but they have more mass to move',
        explanation: 'The extra pull of gravity on the heavy object is perfectly balanced by the extra effort needed to move its larger mass!',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-4',
        text: 'Newton\'s First Law states an object at rest will stay at rest unless acted on by...',
        options: ['A balanced force', 'An unbalanced force', 'A friend', 'Magic'],
        correctAnswer: 'An unbalanced force',
        explanation: 'An object will not change its motion unless a net force acts upon it.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-5',
        text: 'Newton\'s Third Law states: For every action, there is an equal and opposite...',
        options: ['Reaction', 'Acceleration', 'Engine', 'Sound'],
        correctAnswer: 'Reaction',
        explanation: 'Forces always come in pairs. If you push a wall, it pushes back with equal force!',
        rewardType: 'coin'
      },
      {
        id: 'sci-s-6',
        text: 'If Gordon (heavy) and Percy (light) are going the same speed, who is harder to stop?',
        options: ['Gordon', 'Percy', 'Both the same', 'Neither'],
        correctAnswer: 'Gordon',
        explanation: 'Gordon has more mass and therefore more momentum at the same speed.',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-7',
        text: 'What is the unit of the coefficient of friction (μ)?',
        options: ['Newtons', 'Joules', 'No unit (dimensionless)', 'Kilograms'],
        correctAnswer: 'No unit (dimensionless)',
        explanation: 'The coefficient of friction is a ratio of two forces, so the units cancel out.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-8',
        text: 'If Thomas pushes a truck with 100N but it doesn\'t move, how much work is done?',
        options: ['100 Joules', '10 Joules', '0 Joules', '1 Joule'],
        correctAnswer: '0 Joules',
        explanation: 'Work = Force x Displacement. If the displacement is zero, the work is zero!',
        rewardType: 'coin'
      },
      {
        id: 'sci-s-9',
        text: 'What is the rate of doing work called?',
        options: ['Force', 'Energy', 'Power', 'Momentum'],
        correctAnswer: 'Power',
        explanation: 'Power is work divided by time, measured in Watts.',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-10',
        text: 'If an engine doubles its speed, its kinetic energy (1/2 mv²) increases by...',
        options: ['2 times', '3 times', '4 times', '8 times'],
        correctAnswer: '4 times',
        explanation: 'Kinetic energy is proportional to the square of the velocity (v²).',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-11',
        text: 'Where does a truck have the most gravitational potential energy (mgh)?',
        options: ['At the bottom of Gordon\'s Hill', 'In the middle of the hill', 'At the top of Gordon\'s Hill', 'In the shed'],
        correctAnswer: 'At the top of Gordon\'s Hill',
        explanation: 'Potential energy is proportional to height (h).',
        rewardType: 'coin'
      },
      {
        id: 'sci-s-12',
        text: 'What is speed in a specific direction called?',
        options: ['Acceleration', 'Velocity', 'Momentum', 'Displacement'],
        correctAnswer: 'Velocity',
        explanation: 'Velocity is a vector quantity that describes both speed and direction.',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-13',
        text: 'What force keeps an engine on a curved track?',
        options: ['Centripetal force', 'Centrifugal force', 'Gravity', 'Steam'],
        correctAnswer: 'Centripetal force',
        explanation: 'Centripetal force pulls an object toward the center of its circular path.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-14',
        text: 'What is the tendency of an object to resist changes in its motion?',
        options: ['Gravity', 'Friction', 'Inertia', 'Weight'],
        correctAnswer: 'Inertia',
        explanation: 'Inertia is directly related to an object\'s mass.',
        rewardType: 'coin'
      },
      {
        id: 'sci-s-15',
        text: 'What is the change in velocity over time called?',
        options: ['Speed', 'Acceleration', 'Work', 'Power'],
        correctAnswer: 'Acceleration',
        explanation: 'Acceleration is the rate at which velocity changes.',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-16',
        text: 'What is the straight-line distance between start and finish points called?',
        options: ['Distance', 'Displacement', 'Path', 'Journey'],
        correctAnswer: 'Displacement',
        explanation: 'Displacement is a vector quantity representing the change in position.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-17',
        text: 'Is mass a scalar or a vector quantity?',
        options: ['Scalar', 'Vector', 'Neither', 'Both'],
        correctAnswer: 'Scalar',
        explanation: 'Scalars have magnitude only; vectors have magnitude and direction.',
        rewardType: 'coin'
      },
      {
        id: 'sci-s-18',
        text: 'Is force a scalar or a vector quantity?',
        options: ['Scalar', 'Vector', 'Neither', 'Both'],
        correctAnswer: 'Vector',
        explanation: 'Force has both a magnitude (how strong) and a direction.',
        rewardType: 'engine'
      },
      {
        id: 'sci-s-19',
        text: 'When air resistance equals the weight of a falling object, it reaches...',
        options: ['Zero speed', 'Terminal velocity', 'Infinite speed', 'The ground'],
        correctAnswer: 'Terminal velocity',
        explanation: 'At terminal velocity, the forces are balanced and acceleration is zero.',
        rewardType: 'badge'
      },
      {
        id: 'sci-s-20',
        text: 'Force divided by the area over which it is applied equals...',
        options: ['Work', 'Power', 'Pressure', 'Energy'],
        correctAnswer: 'Pressure',
        explanation: 'Pressure (P = F/A) explains why narrow wheels can sink into soft ground!',
        rewardType: 'coin'
      }
    ]
  },
  'Geography': {
    'Primary': [
      {
        id: 'geo-p-1',
        text: 'Where do the engines sleep at night?',
        options: ['The Airport', 'Tidmouth Sheds', 'The Docks', 'The Library'],
        correctAnswer: 'Tidmouth Sheds',
        explanation: 'Tidmouth Sheds serves as the primary terminal and residence.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-2',
        text: 'Where do the big ships bring goods to Sodor?',
        options: ['Brendam Docks', 'Blue Mountain', 'The Farm', 'The Woods'],
        correctAnswer: 'Brendam Docks',
        explanation: 'Brendam Docks is the shipping port where Cranky operates.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-3',
        text: 'Which of these is a body of water surrounding Sodor?',
        options: ['The Irish Sea', 'The Sahara Desert', 'The Amazon River', 'The Moon'],
        correctAnswer: 'The Irish Sea',
        explanation: 'Sodor is situated within the Irish Sea.',
        rewardType: 'engine'
      },
      {
        id: 'geo-p-4',
        text: 'How many continents are there in the world?',
        options: ['5', '6', '7', '8'],
        correctAnswer: '7',
        explanation: 'Earth comprises 7 distinct continents.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-5',
        text: 'Which continent is the coldest and covered in ice?',
        options: ['Asia', 'Africa', 'Antarctica', 'Australia'],
        correctAnswer: 'Antarctica',
        explanation: 'Antarctica occupies the South Pole and features sub-zero temperatures.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-6',
        text: 'Which ocean is the biggest and deepest?',
        options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
        correctAnswer: 'Pacific',
        explanation: 'The Pacific is the largest and deepest ocean.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-7',
        text: 'Sodor sits in the Irish Sea. Which country is nearest to it?',
        options: ['England', 'Spain', 'Egypt', 'Canada'],
        correctAnswer: 'England',
        explanation: 'Sodor lies in the Irish Sea, close to the north-west coast of England.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-8',
        text: 'Which continent is the hottest?',
        options: ['Asia', 'Africa', 'Europe', 'Antarctica'],
        correctAnswer: 'Africa',
        explanation: 'Africa has some of the highest temperatures on Earth.',
        rewardType: 'engine'
      },
      {
        id: 'geo-p-9',
        text: 'What is the capital city of England?',
        options: ['Manchester', 'London', 'Dublin', 'Cardiff'],
        correctAnswer: 'London',
        explanation: 'London is the capital of England and of the United Kingdom.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-10',
        text: 'Which of these is a river?',
        options: ['River Thames', 'Mount Snowdon', 'Lake Windermere', 'The Irish Sea'],
        correctAnswer: 'River Thames',
        explanation: 'The River Thames flows through London.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-11',
        text: 'What does a compass show you?',
        options: ['The directions', 'The weather', 'The population', 'The time'],
        correctAnswer: 'The directions',
        explanation: 'A compass needle points north and helps you find directions.',
        rewardType: 'engine'
      },
      {
        id: 'geo-p-12',
        text: 'Which continent has the most people?',
        options: ['Africa', 'Asia', 'Europe', 'South America'],
        correctAnswer: 'Asia',
        explanation: 'Asia is home to China and India, the most populated countries.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-13',
        text: 'Which is the smallest ocean?',
        options: ['Pacific', 'Atlantic', 'Indian', 'Arctic'],
        correctAnswer: 'Arctic',
        explanation: 'The Arctic Ocean is the smallest and coldest ocean.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-14',
        text: 'Which country lies south of England, across the English Channel?',
        options: ['France', 'Scotland', 'Wales', 'Ireland'],
        correctAnswer: 'France',
        explanation: 'France lies across the English Channel from England.',
        rewardType: 'engine'
      },
      {
        id: 'geo-p-15',
        text: 'What do we call a round model of the Earth?',
        options: ['A globe', 'A map', 'A compass', 'A plan'],
        correctAnswer: 'A globe',
        explanation: 'A globe is a sphere-shaped model of the Earth.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-16',
        text: 'Which of these is a large lake near Sodor, in England\'s Lake District?',
        options: ['Lake Windermere', 'The Dead Sea', 'Lake Victoria', 'Loch Ness'],
        correctAnswer: 'Lake Windermere',
        explanation: 'Windermere is the largest lake in England, close to Sodor.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-17',
        text: 'Which season in the UK has the warmest weather?',
        options: ['Summer', 'Winter', 'Autumn', 'Spring'],
        correctAnswer: 'Summer',
        explanation: 'Summer is the warmest season in the United Kingdom.',
        rewardType: 'engine'
      },
      {
        id: 'geo-p-18',
        text: 'What is the invisible line around the middle of the Earth called?',
        options: ['Equator', 'Pole', 'Horizon', 'Meridian'],
        correctAnswer: 'Equator',
        explanation: 'The Equator divides the Earth into north and south halves.',
        rewardType: 'badge'
      },
      {
        id: 'geo-p-19',
        text: 'Where would you find the highest mountain in the UK?',
        options: ['Scotland (Ben Nevis)', 'London', 'Sodor', 'Ireland'],
        correctAnswer: 'Scotland (Ben Nevis)',
        explanation: 'Ben Nevis in Scotland is the highest mountain in the UK.',
        rewardType: 'coin'
      },
      {
        id: 'geo-p-20',
        text: 'Egypt and Nigeria are both countries on which continent?',
        options: ['Africa', 'Asia', 'Europe', 'Australia'],
        correctAnswer: 'Africa',
        explanation: 'Egypt and Nigeria are both on the African continent.',
        rewardType: 'engine'
      }
    ],
    'Secondary': [
      {
        id: 'geo-s-1',
        text: 'Which of these is a famous landmark on the Isle of Sodor?',
        options: ['The London Eye', 'The Blue Mountain Quarry', 'The Eiffel Tower', 'Mount Everest'],
        correctAnswer: 'The Blue Mountain Quarry',
        explanation: 'The Blue Mountain Quarry is a key location on the Isle of Sodor.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-2',
        text: 'What is the name of the main railway on Sodor?',
        options: ['North Western Railway', 'Great Western Railway', 'Southern Railway', 'London Underground'],
        correctAnswer: 'North Western Railway',
        explanation: 'The North Western Railway is the main railway system on Sodor.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-3',
        text: 'Which is the largest continent by land area?',
        options: ['Africa', 'Asia', 'North America', 'Europe'],
        correctAnswer: 'Asia',
        explanation: 'Asia is the largest continent, covering about 30% of Earth\'s land area.',
        rewardType: 'engine'
      },
      {
        id: 'geo-s-4',
        text: 'In which continent would you find the Amazon Rainforest?',
        options: ['Africa', 'Asia', 'South America', 'Australia'],
        correctAnswer: 'South America',
        explanation: 'The Amazon Rainforest is located in South America.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-5',
        text: 'Which of these energy sources is renewable?',
        options: ['Wind', 'Coal', 'Oil', 'Gas'],
        correctAnswer: 'Wind',
        explanation: 'Wind energy is renewable because it never runs out.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-6',
        text: 'The Prime Meridian (0°) passes through which place in the UK?',
        options: ['Greenwich, London', 'Manchester', 'Bristol', 'Edinburgh'],
        correctAnswer: 'Greenwich, London',
        explanation: 'The Prime Meridian is marked at the Royal Observatory in Greenwich.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-7',
        text: 'Into roughly how many time zones is the world divided?',
        options: ['12', '18', '24', '48'],
        correctAnswer: '24',
        explanation: 'The Earth is divided into roughly 24 time zones.',
        rewardType: 'engine'
      },
      {
        id: 'geo-s-8',
        text: 'Which statement about a desert is true?',
        options: ['It receives very little rainfall', 'It is always hot', 'It is always covered in sand', 'It is always cold'],
        correctAnswer: 'It receives very little rainfall',
        explanation: 'Deserts are defined by low rainfall, not always by heat or sand.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-9',
        text: 'What is the large-scale clearing of forests called?',
        options: ['Deforestation', 'Irrigation', 'Urbanisation', 'Erosion'],
        correctAnswer: 'Deforestation',
        explanation: 'Deforestation is the clearing of forests on a large scale.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-10',
        text: 'The increase in the number of people living in towns and cities is called...',
        options: ['Urbanisation', 'Suburbanisation', 'Migration', 'Deforestation'],
        correctAnswer: 'Urbanisation',
        explanation: 'Urbanisation is the growth of towns and cities.',
        rewardType: 'engine'
      },
      {
        id: 'geo-s-11',
        text: 'Which natural hazard is most likely in a region where two tectonic plates meet?',
        options: ['Earthquakes', 'Droughts', 'Tornadoes', 'Blizzards'],
        correctAnswer: 'Earthquakes',
        explanation: 'Tectonic plate boundaries are where earthquakes most often happen.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-12',
        text: 'What does the word "weather" describe?',
        options: ['Daily atmospheric conditions', 'Climate over 30 years', 'Rock types', 'Population patterns'],
        correctAnswer: 'Daily atmospheric conditions',
        explanation: 'Weather is the short-term, day-to-day condition of the atmosphere.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-13',
        text: 'Which of these is a non-renewable resource?',
        options: ['Coal', 'Wind', 'Solar', 'Hydro'],
        correctAnswer: 'Coal',
        explanation: 'Coal takes millions of years to form, so it is non-renewable.',
        rewardType: 'engine'
      },
      {
        id: 'geo-s-14',
        text: 'Which type of line on a map joins places of equal height?',
        options: ['Contour line', 'Latitude', 'Longitude', 'Isotherm'],
        correctAnswer: 'Contour line',
        explanation: 'Contour lines connect points of equal elevation above sea level.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-15',
        text: 'What does sustainable development mean?',
        options: ['Meeting today\'s needs without harming future generations', 'Building more roads and cars', 'Using resources until they run out', 'Only thinking about today'],
        correctAnswer: 'Meeting today\'s needs without harming future generations',
        explanation: 'Sustainable development balances today\'s needs with those of the future.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-16',
        text: 'The UK shares its only land border with which country?',
        options: ['Ireland', 'France', 'Belgium', 'Norway'],
        correctAnswer: 'Ireland',
        explanation: 'The UK shares a land border only with the Republic of Ireland.',
        rewardType: 'engine'
      },
      {
        id: 'geo-s-17',
        text: 'The long-term rise in global temperatures is called...',
        options: ['Climate change', 'Tidal waves', 'Urban heat', 'Seasonal change'],
        correctAnswer: 'Climate change',
        explanation: 'Climate change refers to long-term shifts in global temperatures and weather.',
        rewardType: 'badge'
      },
      {
        id: 'geo-s-18',
        text: 'What is the commercial heart of a city, full of offices and shops, called?',
        options: ['Central Business District (CBD)', 'National Park', 'Airport', 'Reservoir'],
        correctAnswer: 'Central Business District (CBD)',
        explanation: 'The CBD is the central commercial area of a city.',
        rewardType: 'coin'
      },
      {
        id: 'geo-s-19',
        text: 'What is water stored underground in porous rocks called?',
        options: ['Groundwater', 'Rainwater', 'Surface water', 'Ice'],
        correctAnswer: 'Groundwater',
        explanation: 'Groundwater is stored in porous rocks called aquifers.',
        rewardType: 'engine'
      }
    ]
  },
  'History': {
    'Primary': [
      {
        id: 'his-p-1',
        text: 'Who is the famous gentleman that runs the North Western Railway?',
        options: ['Sir Topham Hatt', 'Captain Hook', 'Santa Claus', 'The Mayor'],
        correctAnswer: 'Sir Topham Hatt',
        explanation: 'Sir Topham Hatt directs railway operations.',
        rewardType: 'video'
      },
      {
        id: 'his-p-2',
        text: 'Which engine was the very first one to arrive on Sodor?',
        options: ['Thomas', 'Edward', 'Gordon', 'James'],
        correctAnswer: 'Edward',
        explanation: 'Edward preceded Thomas on the island.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-3',
        text: 'Who is known as the "Father of the Railways"?',
        options: ['George Stephenson', 'Sir Isaac Newton', 'James Watt', 'Henry Ford'],
        correctAnswer: 'George Stephenson',
        explanation: 'George Stephenson built the famous Rocket and helped pioneer railways.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-4',
        text: 'The first steam locomotives ran on public railways in which country?',
        options: ['England', 'France', 'America', 'Japan'],
        correctAnswer: 'England',
        explanation: 'The first public steam railways opened in England in the 1820s.',
        rewardType: 'coin'
      },
      {
        id: 'his-p-5',
        text: 'Which famous locomotive won the Rainhill Trials in 1829?',
        options: ['The Rocket', 'The Flying Scotsman', 'Mallard', 'The Iron Duke'],
        correctAnswer: 'The Rocket',
        explanation: 'George Stephenson\'s Rocket won the Rainhill Trials of 1829.',
        rewardType: 'engine'
      },
      {
        id: 'his-p-6',
        text: 'Before trains were invented, which animal pulled carts and carriages?',
        options: ['Horses', 'Dogs', 'Elephants', 'Camels'],
        correctAnswer: 'Horses',
        explanation: 'Horses pulled carts and stagecoaches before steam trains arrived.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-7',
        text: 'Which inventor greatly improved the steam engine and helped power the Industrial Revolution?',
        options: ['James Watt', 'William Shakespeare', 'Christopher Columbus', 'Thomas Edison'],
        correctAnswer: 'James Watt',
        explanation: 'James Watt improved the steam engine, making it far more efficient.',
        rewardType: 'coin'
      },
      {
        id: 'his-p-8',
        text: 'In which century did steam engines start working in mines and factories?',
        options: ['18th century', '21st century', '15th century', '10th century'],
        correctAnswer: '18th century',
        explanation: 'Thomas Newcomen\'s engine began pumping water out of mines in 1712, and James Watt improved it in the 1760s and 1770s: the 18th century.',
        rewardType: 'engine'
      },
      {
        id: 'his-p-9',
        text: 'Who works every day to make Thomas run?',
        options: ['A driver and a fireman', 'A pilot', 'A captain', 'No one'],
        correctAnswer: 'A driver and a fireman',
        explanation: 'Every steam engine needs a driver and a fireman to run.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-10',
        text: 'In the early days of railways, what did trains mostly carry to help towns grow?',
        options: ['Coal and goods', 'Songs', 'Flowers', 'Souvenirs'],
        correctAnswer: 'Coal and goods',
        explanation: 'Railways carried coal, food and goods, which helped towns grow.',
        rewardType: 'coin'
      },
      {
        id: 'his-p-11',
        text: 'Which of these inventions came before the car?',
        options: ['The steam train', 'The aeroplane', 'The computer', 'The mobile phone'],
        correctAnswer: 'The steam train',
        explanation: 'Steam trains came first; cars, planes and computers came later.',
        rewardType: 'engine'
      },
      {
        id: 'his-p-12',
        text: 'Which queen ruled Britain for over 60 years in the 1800s, while railways grew fast?',
        options: ['Queen Victoria', 'Queen Elizabeth II', 'Cleopatra', 'Boudicca'],
        correctAnswer: 'Queen Victoria',
        explanation: 'Railways grew enormously during Queen Victoria\'s reign.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-13',
        text: 'How do we find out what life was like long ago?',
        options: ['Photos, diaries and old objects', 'Only guesses', 'Stories from television', 'Dreams'],
        correctAnswer: 'Photos, diaries and old objects',
        explanation: 'Historians study evidence such as photos, writing and artefacts.',
        rewardType: 'coin'
      },
      {
        id: 'his-p-14',
        text: 'What is a timeline used for?',
        options: ['Putting events in order', 'Measuring weight', 'Drawing maps', 'Counting money'],
        correctAnswer: 'Putting events in order',
        explanation: 'A timeline shows events in the order they happened.',
        rewardType: 'engine'
      },
      {
        id: 'his-p-15',
        text: 'Before electric lights, which of these was used to signal trains at night?',
        options: ['A hand-held lamp or semaphore arm', 'A mobile phone', 'A satellite', 'A traffic camera'],
        correctAnswer: 'A hand-held lamp or semaphore arm',
        explanation: 'Early railways used hand lamps and wooden signal arms.',
        rewardType: 'badge'
      },
      {
        id: 'his-p-16',
        text: 'Very old railway wagons were made of wood before they were made of...',
        options: ['Metal', 'Plastic', 'Cardboard', 'Glass'],
        correctAnswer: 'Metal',
        explanation: 'Wooden wagons were replaced by stronger metal ones.',
        rewardType: 'coin'
      },
      {
        id: 'his-p-17',
        text: 'The first books about Thomas the Tank Engine were written in which country?',
        options: ['England', 'America', 'Canada', 'Australia'],
        correctAnswer: 'England',
        explanation: 'Wilbert Awdry wrote the first Thomas books in England in the 1940s.',
        rewardType: 'engine'
      }
    ],
    'Secondary': [
      {
        id: 'his-s-1',
        text: 'Which engine is known as the "Emerald Engine" and is very old?',
        options: ['Thomas', 'Emily', 'Edward', 'Henry'],
        correctAnswer: 'Emily',
        explanation: 'Emily is modeled on the Stirling Single locomotive class.',
        rewardType: 'engine'
      },
      {
        id: 'his-s-2',
        text: 'Who was the author of the original "Railway Series" books?',
        options: ['Rev. W. Awdry', 'Roald Dahl', 'J.K. Rowling', 'Enid Blyton'],
        correctAnswer: 'Rev. W. Awdry',
        explanation: 'The Reverend Wilbert Awdry authored the Railway Series.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-3',
        text: 'Which locomotive holds the world speed record for steam, set in 1938?',
        options: ['Mallard', 'The Rocket', 'Flying Scotsman', 'Gordon'],
        correctAnswer: 'Mallard',
        explanation: 'Mallard reached 126 mph in 1938, still the steam record.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-4',
        text: 'In 1829, the Rainhill Trials chose a locomotive for which railway?',
        options: ['Liverpool and Manchester Railway', 'London Underground', 'Great Western Railway', 'The Caledonian Railway'],
        correctAnswer: 'Liverpool and Manchester Railway',
        explanation: 'The trials chose the engine for the new Liverpool and Manchester Railway.',
        rewardType: 'coin'
      },
      {
        id: 'his-s-5',
        text: 'Which engineer built the Rocket together with his son Robert?',
        options: ['George Stephenson', 'Isambard Kingdom Brunel', 'James Watt', 'Richard Trevithick'],
        correctAnswer: 'George Stephenson',
        explanation: 'George Stephenson built the Rocket with his son Robert.',
        rewardType: 'engine'
      },
      {
        id: 'his-s-6',
        text: 'What is a "primary source" in history?',
        options: ['An original document from the time', 'A modern textbook', 'A museum tour guide', 'A newspaper from today'],
        correctAnswer: 'An original document from the time',
        explanation: 'Primary sources are created during the period being studied.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-7',
        text: 'The change from making goods by hand to making them in factories is called...',
        options: ['The Industrial Revolution', 'The Digital Age', 'The Iron Age', 'The Space Age'],
        correctAnswer: 'The Industrial Revolution',
        explanation: 'The Industrial Revolution transformed manufacturing with machines.',
        rewardType: 'coin'
      },
      {
        id: 'his-s-8',
        text: 'Who famously improved the stationary steam engine in the 1760s?',
        options: ['James Watt', 'George Stephenson', 'Isambard Kingdom Brunel', 'Thomas Edison'],
        correctAnswer: 'James Watt',
        explanation: 'James Watt\'s improvements made steam engines efficient enough for factories.',
        rewardType: 'engine'
      },
      {
        id: 'his-s-9',
        text: 'In 1948, Britain\'s railways were brought together under what single name?',
        options: ['British Railways', 'National Express', 'Great Western', 'London Midland'],
        correctAnswer: 'British Railways',
        explanation: 'In 1948 the railways of Britain were nationalised as British Railways.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-10',
        text: 'Which Victorian engineer designed the Great Western Railway and famous bridges?',
        options: ['Isambard Kingdom Brunel', 'George Stephenson', 'James Watt', 'Marc Brunel'],
        correctAnswer: 'Isambard Kingdom Brunel',
        explanation: 'Brunel designed the Great Western Railway, Box Tunnel and Clifton Suspension Bridge.',
        rewardType: 'coin'
      },
      {
        id: 'his-s-11',
        text: 'The Flying Scotsman became famous in 1934 for being the first steam locomotive...',
        options: ['Authenticated at 100 mph', 'To cross the Atlantic', 'To go under London', 'To use diesel power'],
        correctAnswer: 'Authenticated at 100 mph',
        explanation: 'Flying Scotsman was the first steam engine officially recorded at 100 mph.',
        rewardType: 'engine'
      },
      {
        id: 'his-s-12',
        text: 'Which source would a historian trust most about a steam engine\'s top speed?',
        options: ['Official works records', 'A folk song', 'A rumour', 'A children\'s story'],
        correctAnswer: 'Official works records',
        explanation: 'Official records made at the time are reliable primary evidence.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-13',
        text: 'On the real island Sodor lore, which small railway ran before the North Western?',
        options: ['The Mid Sodor Railway', 'The Great Western', 'The London Underground', 'The Dutch lines'],
        correctAnswer: 'The Mid Sodor Railway',
        explanation: 'In the stories, the fictional Mid Sodor Railway was an early line on Sodor.',
        rewardType: 'coin'
      },
      {
        id: 'his-s-14',
        text: 'The study of events arranged in time order is called...',
        options: ['Chronology', 'Geography', 'Astronomy', 'Ecology'],
        correctAnswer: 'Chronology',
        explanation: 'Chronology arranges events by the order in which they happened.',
        rewardType: 'engine'
      },
      {
        id: 'his-s-15',
        text: 'Britain\'s railways reached their great "age of steam" during which period?',
        options: ['The Victorian era', 'The Iron Age', 'The Roman era', 'The Space Age'],
        correctAnswer: 'The Victorian era',
        explanation: 'Steam railways flourished across the Victorian era.',
        rewardType: 'badge'
      },
      {
        id: 'his-s-16',
        text: 'The Reverend Awdry\'s Railway Series books began publication in which decade?',
        options: ['1940s', '1890s', '1960s', '2000s'],
        correctAnswer: '1940s',
        explanation: 'The first Railway Series book appeared in 1945.',
        rewardType: 'coin'
      },
      {
        id: 'his-s-17',
        text: 'Why did factories grow so quickly near railways and canals?',
        options: ['Goods could be moved quickly', 'They could grow crops', 'People wanted fresh air', 'They were quieter'],
        correctAnswer: 'Goods could be moved quickly',
        explanation: 'Good transport let factories bring in materials and ship goods out.',
        rewardType: 'engine'
      }
    ]
  },
  'Music': {
    'Primary': [
      {
        id: 'mus-p-1',
        text: 'What sound does Thomas make to say hello?',
        options: ['Moo!', 'Peep Peep!', 'Roar!', 'Quack!'],
        correctAnswer: 'Peep Peep!',
        explanation: 'Thomas signals using his whistle.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-2',
        text: 'How many beats are in a "Peep Peep" sound?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '2',
        explanation: 'The signal consists of two acoustic units.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-3',
        text: 'Which of these makes the loudest sound?',
        options: ['A whistle', 'A whisper', 'A mouse', 'A leaf'],
        correctAnswer: 'A whistle',
        explanation: 'A whistle is loud, while a whisper is very quiet.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-4',
        text: 'What do we call the pattern of sounds and silences in music?',
        options: ['Rhythm', 'Colour', 'Smell', 'Taste'],
        correctAnswer: 'Rhythm',
        explanation: 'Rhythm is the pattern of beats and rests in music.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-5',
        text: 'Which word means making the music quieter?',
        options: ['Softer', 'Louder', 'Faster', 'Higher'],
        correctAnswer: 'Softer',
        explanation: 'Softer music is quieter music.',
        rewardType: 'engine'
      },
      {
        id: 'mus-p-6',
        text: 'When Percy puffs "puff-puff-puff" in a steady beat, we can tap along to the...',
        options: ['Beat', 'Colour', 'Heat', 'Water'],
        correctAnswer: 'Beat',
        explanation: 'The beat is the steady pulse in music.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-7',
        text: 'Which instrument do you hit with sticks or your hands?',
        options: ['Drum', 'Violin', 'Flute', 'Trumpet'],
        correctAnswer: 'Drum',
        explanation: 'Drums are played by striking them.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-8',
        text: 'When the music is fast, we say it has a quick...',
        options: ['Tempo', 'Colour', 'Shape', 'Smell'],
        correctAnswer: 'Tempo',
        explanation: 'Tempo tells us how fast or slow the music is.',
        rewardType: 'engine'
      },
      {
        id: 'mus-p-9',
        text: 'Which sound has the highest pitch?',
        options: ['A mouse squeak', 'An elephant trumpet', 'A drum boom', 'A lion roar'],
        correctAnswer: 'A mouse squeak',
        explanation: 'A squeak has a high pitch, while a roar is low.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-10',
        text: 'Marching music usually counts in which rhythm: 1-2, 1-2?',
        options: ['2 beats per bar', '7 beats per bar', '10 beats per bar', '0 beats per bar'],
        correctAnswer: '2 beats per bar',
        explanation: 'Marching music is often written in 2-beat time.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-11',
        text: 'What do we call the words of a song?',
        options: ['Lyrics', 'Notes', 'Tempo', 'Rhythm'],
        correctAnswer: 'Lyrics',
        explanation: 'Lyrics are the words that are sung.',
        rewardType: 'engine'
      },
      {
        id: 'mus-p-12',
        text: 'A whistle that goes "peep peep" with a short pause between the peeps is an example of...',
        options: ['Rhythm', 'Volume', 'Colour', 'Size'],
        correctAnswer: 'Rhythm',
        explanation: 'The pattern of sounds and pauses is rhythm.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-13',
        text: 'Which of these can you pluck or strum with your fingers?',
        options: ['Guitar', 'Oboe', 'Trombone', 'Cymbals'],
        correctAnswer: 'Guitar',
        explanation: 'You pluck or strum the strings of a guitar.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-14',
        text: 'When music gradually gets louder, it is called...',
        options: ['Getting louder (crescendo)', 'Turning blue', 'Going backwards', 'Sleeping'],
        correctAnswer: 'Getting louder (crescendo)',
        explanation: 'A crescendo means the music gradually gets louder.',
        rewardType: 'engine'
      },
      {
        id: 'mus-p-15',
        text: 'Which of these is a percussion instrument?',
        options: ['Tambourine', 'Violin', 'Flute', 'Horn'],
        correctAnswer: 'Tambourine',
        explanation: 'You shake or tap a tambourine, so it is percussion.',
        rewardType: 'badge'
      },
      {
        id: 'mus-p-16',
        text: 'How do the engines on Sodor make music-like sounds?',
        options: ['With their whistles and wheels', 'With pianos', 'With radios', 'With doorbells only'],
        correctAnswer: 'With their whistles and wheels',
        explanation: 'Engine whistles and the rhythm of wheels make music-like sounds.',
        rewardType: 'coin'
      },
      {
        id: 'mus-p-17',
        text: 'What is it called when voices or instruments play different notes together, making a pleasing sound?',
        options: ['Harmony', 'Silence', 'Echo', 'Noise'],
        correctAnswer: 'Harmony',
        explanation: 'Harmony means different notes sounding together pleasantly.',
        rewardType: 'engine'
      }
    ],
    'Secondary': [
      {
        id: 'mus-s-1',
        text: 'If the engines whistle in a rhythm: Peep, Peep-Peep, Peep... how many whistles were there?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '4',
        explanation: '1 + 2 + 1 = 4.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-2',
        text: 'Which of these instruments sounds most like an engine\'s whistle?',
        options: ['Drum', 'Flute', 'Piano', 'Guitar'],
        correctAnswer: 'Flute',
        explanation: 'A flute and a steam whistle are both wind instruments.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-3',
        text: 'How many beats does a semibreve (whole note) last in 4/4 time?',
        options: ['4', '2', '1', 'Half a beat'],
        correctAnswer: '4',
        explanation: 'A semibreve lasts a full four beats.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-4',
        text: 'What do we call a tempo that gradually gets slower?',
        options: ['Rallentando', 'Accelerando', 'Crescendo', 'Staccato'],
        correctAnswer: 'Rallentando',
        explanation: 'Rallentando means gradually getting slower.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-5',
        text: 'In 4/4 (common) time, how many beats does a crotchet (quarter note) receive?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '1',
        explanation: 'Each crotchet lasts one beat in 4/4 time.',
        rewardType: 'engine'
      },
      {
        id: 'mus-s-6',
        text: 'What does the marking "forte" (f) mean in music?',
        options: ['Loud', 'Soft', 'Fast', 'Slow'],
        correctAnswer: 'Loud',
        explanation: 'Forte means to play loudly.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-7',
        text: 'What does the marking "piano" (p) mean in music?',
        options: ['Soft', 'Loud', 'Very fast', 'Percussion'],
        correctAnswer: 'Soft',
        explanation: 'Piano means to play softly.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-8',
        text: 'Which instrument family uses a bow to make a sound?',
        options: ['Strings', 'Percussion', 'Woodwind', 'Brass'],
        correctAnswer: 'Strings',
        explanation: 'String instruments such as the violin are played with a bow.',
        rewardType: 'engine'
      },
      {
        id: 'mus-s-9',
        text: 'Which symbol at the start of the stave fixes the range of the notes?',
        options: ['A clef', 'A note', 'A rest', 'A bar line'],
        correctAnswer: 'A clef',
        explanation: 'The treble or bass clef fixes the pitch range of the notes.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-10',
        text: 'How many quavers (eighth notes) fit into one crotchet beat?',
        options: ['2', '3', '4', '8'],
        correctAnswer: '2',
        explanation: 'Two quavers make up one crotchet beat.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-11',
        text: 'Playing notes "staccato" means playing them...',
        options: ['Short and detached', 'Long and smooth', 'Very loud', 'Very fast'],
        correctAnswer: 'Short and detached',
        explanation: 'Staccato notes are crisp and separated.',
        rewardType: 'engine'
      },
      {
        id: 'mus-s-12',
        text: 'Playing notes "legato" means playing them...',
        options: ['Smooth and connected', 'Short and sharp', 'In random order', 'In silence'],
        correctAnswer: 'Smooth and connected',
        explanation: 'Legato means smooth and flowing.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-13',
        text: 'Which note value lasts the longest in 4/4 time?',
        options: ['Semibreve', 'Quaver', 'Crotchet', 'Minim'],
        correctAnswer: 'Semibreve',
        explanation: 'A semibreve lasts a full four beats, the longest common note value.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-14',
        text: 'What do bar lines separate in written music?',
        options: ['Measures of music', 'Letters of lyrics', 'Chords only', 'Different clefs'],
        correctAnswer: 'Measures of music',
        explanation: 'Bar lines split music into equal measures.',
        rewardType: 'engine'
      },
      {
        id: 'mus-s-15',
        text: 'If Thomas\'s "peep" is on the beat and Gordon\'s is on the offbeat, the pattern they create is called...',
        options: ['Syncopation', 'Monotone', 'Silence', 'Thunder'],
        correctAnswer: 'Syncopation',
        explanation: 'Syncopation accents the weak beats or offbeats.',
        rewardType: 'badge'
      },
      {
        id: 'mus-s-16',
        text: 'A metronome measures...',
        options: ['Tempo in beats per minute', 'Pitch', 'Volume', 'Melody'],
        correctAnswer: 'Tempo in beats per minute',
        explanation: 'A metronome ticks at a set number of beats per minute.',
        rewardType: 'coin'
      },
      {
        id: 'mus-s-17',
        text: 'Which term means gradually getting faster?',
        options: ['Accelerando', 'Rallentando', 'Largo', 'Adagio'],
        correctAnswer: 'Accelerando',
        explanation: 'Accelerando means gradually progressing speed.',
        rewardType: 'engine'
      }
    ]
  }
};
