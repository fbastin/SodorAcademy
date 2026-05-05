import { Question, Grade } from '../types';

export const LOCAL_QUESTIONS: Record<string, Record<Grade, Question[]>> = {
  'Mathematics': {
    'Primary': [
      {
        id: 'math-p-1',
        text: 'Thomas needs to deliver 5 trucks of coal to Knapford and 3 trucks to Wellsworth. How many trucks is he pulling in total?',
        options: ['7', '8', '9', '10'],
        correctAnswer: '8',
        explanation: '5 + 3 = 8 trucks in total!',
        rewardType: 'engine'
      },
      {
        id: 'math-p-2',
        text: 'Percy started with 10 mail bags. He dropped off 4 at Ffarquhar. How many mail bags does he have left?',
        options: ['4', '5', '6', '7'],
        correctAnswer: '6',
        explanation: '10 - 4 = 6 mail bags left for Percy!',
        rewardType: 'badge'
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
      }
    ]
  },
  'English': {
    'Primary': [
      {
        id: 'eng-p-1',
        text: 'Which station comes first alphabetically?',
        options: ['Wellsworth', 'Knapford', 'Tidmouth', 'Ffarquhar'],
        correctAnswer: 'Ffarquhar',
        explanation: 'F comes before K, T, and W in the alphabet!',
        rewardType: 'coin'
      }
    ],
    'Secondary': [
      {
        id: 'eng-s-1',
        text: 'Choose the correctly spelled station name:',
        options: ['Tidmuth', 'Tidmouth', 'Tidmowth', 'Tidmoth'],
        correctAnswer: 'Tidmouth',
        explanation: 'T-I-D-M-O-U-T-H is the correct spelling for Tidmouth Sheds.',
        rewardType: 'badge'
      }
    ]
  },
  'Science': {
    'Primary': [
      {
        id: 'sci-p-1',
        text: 'What do steam engines like Thomas need to make steam?',
        options: ['Juice and Cookies', 'Coal and Water', 'Gasoline', 'Electricity'],
        correctAnswer: 'Coal and Water',
        explanation: 'Coal heats the water to make the steam that moves the pistons!',
        rewardType: 'engine'
      }
    ],
    'Secondary': [
      {
        id: 'sci-s-1',
        text: 'In a steam engine, what part is responsible for turning the heat from fire into mechanical motion?',
        options: ['The Whistle', 'The Funnel', 'The Pistons', 'The Coal Bunker'],
        correctAnswer: 'The Pistons',
        explanation: 'Steam pressure pushes the pistons, which turn the wheels!',
        rewardType: 'engine'
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
        explanation: 'Tidmouth Sheds is the famous home where Thomas and his friends rest.',
        rewardType: 'badge'
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
        explanation: 'Sir Topham Hatt (The Fat Controller) has run the railway for many years.',
        rewardType: 'video'
      }
    ],
    'Secondary': [
      {
        id: 'his-s-1',
        text: 'Which engine is known as the "Emerald Engine" and is very old?',
        options: ['Thomas', 'Emily', 'Edward', 'Henry'],
        correctAnswer: 'Emily',
        explanation: 'Emily is based on a Stirling Single locomotive, a very elegant and historic design.',
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
        explanation: 'Thomas uses his whistle to go "Peep Peep!"',
        rewardType: 'coin'
      }
    ],
    'Secondary': [
      {
        id: 'mus-s-1',
        text: 'If the engines whistle in a rhythm: Peep, Peep-Peep, Peep... how many whistles were there?',
        options: ['2', '3', '4', '5'],
        correctAnswer: '4',
        explanation: '1 (Peep) + 2 (Peep-Peep) + 1 (Peep) = 4 whistles.',
        rewardType: 'badge'
      }
    ]
  }
};
