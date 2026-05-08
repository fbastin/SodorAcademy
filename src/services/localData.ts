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
    'Primary': [],
    'Secondary': []
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
