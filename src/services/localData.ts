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
        text: 'What provides the energy for a steam engine to create force?',
        options: ['Coal and Water', 'Batteries', 'Wind', 'Singing'],
        correctAnswer: 'Coal and Water',
        explanation: 'Burning coal boils water to make steam, which pushes the pistons!',
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
        text: 'Is friction higher on a muddy track or a shiny metal track?',
        options: ['Muddy track', 'Shiny metal track', 'Both the same', 'Neither'],
        correctAnswer: 'Muddy track',
        explanation: 'Rough or sticky surfaces like mud create more friction than smooth ones.',
        rewardType: 'badge'
      },
      {
        id: 'sci-p-20',
        text: 'What do we call the measure of gravity\'s pull on an object?',
        options: ['Mass', 'Weight', 'Speed', 'Force'],
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
        options: ['Reaction', 'Force', 'Engine', 'Sound'],
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
      }
    ]
  }
};
