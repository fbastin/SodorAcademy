import { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Thomas and the Missing Whistle',
    thumbnail: '📢',
    content: `During preparations for the Great Sodor Parade at Tidmouth Sheds, Thomas discovered his whistle was missing. He expressed frustration, invoking the exclamation 'Cinders and ashes!' He searched the water tower and consulted Percy without success. Sir Topham Hatt subsequently directed Thomas to a workbench, where the whistle had been sent for polishing. Thomas retrieved it and happily led the parade.`,
    questions: [
      { question: "Where did Thomas wake up?", options: ["Knapford Station", "Tidmouth Sheds", "The Docks", "Vicarstown"], correctAnswer: "Tidmouth Sheds" },
      { question: "What special event was happening today?", options: ["A Birthday Party", "The Great Sodor Parade", "A Race", "A Football Match"], correctAnswer: "The Great Sodor Parade" },
      { question: "What did Thomas lose?", options: ["His Coal", "His Whistle", "His Driver", "His Wheels"], correctAnswer: "His Whistle" },
      { question: "What did Thomas say when he was upset?", options: ["Oh no!", "Cinders and ashes!", "Peep peep!", "Bust my buffers!"], correctAnswer: "Cinders and ashes!" },
      { question: "Who did Thomas ask for help?", options: ["Gordon", "Percy", "James", "Henry"], correctAnswer: "Percy" },
      { question: "Where did Thomas look for his whistle?", options: ["The Library", "The Water Tower", "The Beach", "The Mountain"], correctAnswer: "The Water Tower" },
      { question: "Who walked towards Thomas?", options: ["The Mayor", "Sir Topham Hatt", "A Passenger", "A Guard"], correctAnswer: "Sir Topham Hatt" },
      { question: "Why was the whistle at the workbench?", options: ["It was broken", "To be polished", "To be painted", "To be hidden"], correctAnswer: "To be polished" },
      { question: "How did Thomas feel when he found it?", options: ["Angry", "Sad", "Happy", "Tired"], correctAnswer: "Happy" },
      { question: "Did Thomas lead the parade?", options: ["Yes", "No", "Maybe", "He stayed home"], correctAnswer: "Yes" }
    ]
  },
  {
    id: 'story-2',
    title: 'Percy and the Giant Pumpkin',
    thumbnail: '🎃',
    content: `During the harvest season on Sodor, Percy was tasked with transporting an exceptionally large, heavy pumpkin from Farmer McColl's farm on a flatbed truck. While ascending Gordon's Hill, the cargo slipped off, rolled down the incline passing James, rolled through a haystack, and stopped in the village square intact. The pumpkin was utilized as a Harvest Festival decoration, satisfying Sir Topham Hatt.`,
    questions: [
      { question: "What time of year was it?", options: ["Winter", "Harvest time", "Spring", "Christmas"], correctAnswer: "Harvest time" },
      { question: "Where did Percy get the pumpkin?", options: ["The Market", "Farmer McColl's farm", "Tidmouth Sheds", "The Docks"], correctAnswer: "Farmer McColl's farm" },
      { question: "How heavy was the pumpkin?", options: ["Light", "Very heavy", "Normal", "Tiny"], correctAnswer: "Very heavy" },
      { question: "What hill did Percy have to climb?", options: ["Thomas's Hill", "Gordon's Hill", "Percy's Hill", "The Big Hill"], correctAnswer: "Gordon's Hill" },
      { question: "What happened to the pumpkin on the hill?", options: ["It broke", "It started rolling", "It disappeared", "It flew away"], correctAnswer: "It started rolling" },
      { question: "Who was resting at the bottom of the hill?", options: ["Thomas", "James", "Gordon", "Edward"], correctAnswer: "James" },
      { question: "What did the pumpkin roll through?", options: ["A river", "A haystack", "A tunnel", "A bridge"], correctAnswer: "A haystack" },
      { question: "Where did the pumpkin stop?", options: ["The Docks", "The village square", "The sheds", "The station"], correctAnswer: "The village square" },
      { question: "Did the pumpkin break?", options: ["Yes", "No", "Into two pieces", "Into many pieces"], correctAnswer: "No" },
      { question: "What was the pumpkin used for?", options: ["Pie", "Soup", "Harvest Festival decoration", "A game"], correctAnswer: "Harvest Festival decoration" }
    ]
  },
  {
    id: 'story-3',
    title: 'Gordon and the High-Speed Record',
    thumbnail: '🚅',
    content: `Gordon, the fastest engine on Sodor, was assigned by Sir Topham Hatt on Tuesday to break the speed record from Knapford to Vicarstown. Operating under green signals, he bypassed Wellsworth and Maron before experiencing loose valve gear accompanied by a clanking sound. Thomas towed Gordon back to the maintenance works, where Gordon acknowledged that being useful is more important than being fast.`,
    questions: [
      { question: "Who is the fastest engine on Sodor?", options: ["Thomas", "Gordon", "James", "Percy"], correctAnswer: "Gordon" },
      { question: "What day was the special test?", options: ["Monday", "Tuesday", "Friday", "Sunday"], correctAnswer: "Tuesday" },
      { question: "From where to where was the speed record?", options: ["Tidmouth to Knapford", "Knapford to Vicarstown", "Sodor to London", "The Docks to the Farm"], correctAnswer: "Knapford to Vicarstown" },
      { question: "What were the signals set to?", options: ["Red", "Green", "Yellow", "Off"], correctAnswer: "Green" },
      { question: "Which station did Gordon zoom past first?", options: ["Wellsworth", "Maron", "Vicarstown", "Tidmouth"], correctAnswer: "Wellsworth" },
      { question: "What sound did Gordon hear?", options: ["A whistle", "A clanking sound", "A bang", "A bird"], correctAnswer: "A clanking sound" },
      { question: "What part of Gordon came loose?", options: ["His funnel", "His valve gear", "His whistle", "His buffer"], correctAnswer: "His valve gear" },
      { question: "Did Gordon break the record?", options: ["Yes", "No", "He broke two records", "Maybe"], correctAnswer: "No" },
      { question: "Who helped Gordon back to the works?", options: ["Percy", "Thomas", "Henry", "James"], correctAnswer: "Thomas" },
      { question: "What did Gordon learn?", options: ["Speed is everything", "Being useful is more important than being fast", "He should never race", "Thomas is faster"], correctAnswer: "Being useful is more important than being fast" }
    ]
  },
  {
    id: 'story-4',
    title: 'James and the Splendid New Coat',
    thumbnail: '🎨',
    content: `James polished his red paint for two hours until it resembled a shiny ruby to transport the Mayor of Sodor. While passing the coal mines, wind-blown black coal dust coated him in spots, making him feel ruined. The Mayor commended the unique Dalmation-like aesthetic, and James realized he is special even with spots.`,
    questions: [
      { question: "What color is James?", options: ["Blue", "Red", "Green", "Black"], correctAnswer: "Red" },
      { question: "Who was James taking to the museum?", options: ["Sir Topham Hatt", "The Mayor", "Percy", "The Queen"], correctAnswer: "The Mayor" },
      { question: "How long did James spend getting polished?", options: ["30 minutes", "One hour", "Two hours", "All day"], correctAnswer: "Two hours" },
      { question: "What did James look like after being polished?", options: ["A diamond", "A shiny ruby", "A sapphire", "An emerald"], correctAnswer: "A shiny ruby" },
      { question: "What did James have to pass on his way?", options: ["The beach", "The coal mines", "The forest", "The mountain"], correctAnswer: "The coal mines" },
      { question: "What blew over James?", options: ["Rain", "Black coal dust", "Snow", "Leaves"], correctAnswer: "Black coal dust" },
      { question: "What did James think of his spots at first?", options: ["He liked them", "He was ruined", "He didn't notice", "He thought they were funny"], correctAnswer: "He was ruined" },
      { question: "What did the Mayor compare James to?", options: ["A tiger", "A dalmatian", "A zebra", "A ladybug"], correctAnswer: "A dalmatian" },
      { question: "Was the Mayor happy?", options: ["Yes", "No", "He was angry", "He was scared"], correctAnswer: "Yes" },
      { question: "What did James realize?", options: ["He needs more paint", "He is special even with spots", "He hates coal", "He should be blue"], correctAnswer: "He is special even with spots" }
    ]
  },
  {
    id: 'story-5',
    title: 'Toby and the Old Bridge',
    thumbnail: '🌉',
    content: `Toby, a tram engine, was ordered to inspect an unused track terminating at a shaky wooden bridge. Upon reaching the midpoint, the bridge emitted a creak and crack sound, prompting the afraid Toby to stop. Henrietta, positioned behind Toby, offered encouragement, allowing Toby to reverse safely. A replacement stone bridge was subsequently constructed. Toby was happy with the outcome.`,
    questions: [
      { question: "What kind of engine is Toby?", options: ["Steam engine", "Tram engine", "Diesel engine", "Electric engine"], correctAnswer: "Tram engine" },
      { question: "What was Toby exploring?", options: ["A new station", "An old track", "A tunnel", "A coal mine"], correctAnswer: "An old track" },
      { question: "What was at the end of the track?", options: ["A castle", "A wooden bridge", "A lake", "A mountain"], correctAnswer: "A wooden bridge" },
      { question: "How did the bridge look?", options: ["New and strong", "Shaky", "Beautiful", "Very long"], correctAnswer: "Shaky" },
      { question: "What noise did the bridge make?", options: ["Whistle", "Creak and Crack", "Bang", "Pop"], correctAnswer: "Creak and Crack" },
      { question: "Where did Toby stop?", options: ["At the start", "In the middle", "At the end", "He didn't stop"], correctAnswer: "In the middle" },
      { question: "How did Toby feel?", options: ["Excited", "Afraid", "Angry", "Sleepy"], correctAnswer: "Afraid" },
      { question: "Who was behind Toby?", options: ["Thomas", "Henrietta", "Percy", "James"], correctAnswer: "Henrietta" },
      { question: "What was the new bridge made of?", options: ["Wood", "Stone", "Metal", "Plastic"], correctAnswer: "Stone" },
      { question: "Was Toby happy at the end?", options: ["Yes", "No", "He was still scared", "He was tired"], correctAnswer: "Yes" }
    ]
  },
  {
    id: 'story-6',
    title: 'Emily and the New Passengers',
    thumbnail: '👒',
    content: `Emily, a helpful locomotive with an emerald green coat, was assigned by Sir Topham Hatt to pull four coaches to the seaside resort. During the transit, Emily stopped gently to prevent passengers from bumping their heads when she encountered a sheep on the tracks. Emily whistled a happy tune during the journey, and the passengers were not upset by the delay. They reached the destination at sunset.`,
    questions: [
      { question: "What color is Emily?", options: ["Blue", "Emerald green", "Red", "Green"], correctAnswer: "Emerald green" },
      { question: "Where were the extra passengers going?", options: ["The mountains", "The seaside resort", "The docks", "The farm"], correctAnswer: "The seaside resort" },
      { question: "How many coaches did Emily pull?", options: ["Two", "Four", "Six", "Ten"], correctAnswer: "Four" },
      { question: "What was one thing the passengers saw?", options: ["An airport", "Windmills", "A skyscraper", "A desert"], correctAnswer: "Windmills" },
      { question: "What did Emily do as she puffed along?", options: ["She cried", "She whistled a happy tune", "She slept", "She complained"], correctAnswer: "She whistled a happy tune" },
      { question: "What did Emily see on the tracks?", options: ["A cow", "A sheep", "A dog", "A cat"], correctAnswer: "A sheep" },
      { question: "How did Emily stop?", options: ["Fast", "Gently", "With a big bang", "She didn't stop"], correctAnswer: "Gently" },
      { question: "Why did she stop gently?", options: ["She was tired", "So passengers wouldn't bump their heads", "The brakes were old", "It was a game"], correctAnswer: "So passengers wouldn't bump their heads" },
      { question: "Were the passengers upset?", options: ["Yes", "No", "They were very angry", "They wanted to leave"], correctAnswer: "No" },
      { question: "When did they arrive at the seaside?", options: ["Morning", "Noon", "Sunset", "Midnight"], correctAnswer: "Sunset" }
    ]
  },
  {
    id: 'story-7',
    title: 'Henry and the Forest Fire',
    thumbnail: '🌲',
    content: `Henry, a green engine, observed a wisp of smoke in the Whispering Woods during a hot and dry period while delivering timber. He signaled an alarm, collected water from a water tower, and damp-treated the station perimeter to limit fire spread. Fire engines completed the containment, receiving commendations of 'Well done' from Sir Topham Hatt. Subsequent rain that night secured the area.`,
    questions: [
      { question: "What color is Henry?", options: ["Blue", "Green", "Red", "Brown"], correctAnswer: "Green" },
      { question: "What is Henry's favorite place?", options: ["The Docks", "Whispering Woods", "The Station", "Gordon's Hill"], correctAnswer: "Whispering Woods" },
      { question: "What was the weather like?", options: ["Raining", "Hot and dry", "Snowing", "Windy and cold"], correctAnswer: "Hot and dry" },
      { question: "What did Henry see in the trees?", options: ["A bird", "A wisp of smoke", "A cat", "A ghost"], correctAnswer: "A wisp of smoke" },
      { question: "What was Henry delivering?", options: ["Coal", "Timber", "Mail", "Passengers"], correctAnswer: "Timber" },
      { question: "Where was the smoke blowing?", options: ["The beach", "The station", "The docks", "The mountain"], correctAnswer: "The station" },
      { question: "Where did Henry get water?", options: ["The river", "The water tower", "The ocean", "A puddle"], correctAnswer: "The water tower" },
      { question: "Who arrived to put out the fire?", options: ["Police", "Fire engines", "Doctors", "Other trains"], correctAnswer: "Fire engines" },
      { question: "What did Sir Topham Hatt say to Henry?", options: ["Bad job", "Well done", "Go home", "Be faster"], correctAnswer: "Well done" },
      { question: "What happened that night?", options: ["It snowed", "It finally rained", "The fire started again", "Henry went to a party"], correctAnswer: "It finally rained" }
    ]
  },
  {
    id: 'story-8',
    title: 'Thomas and the Birthday Surprise',
    thumbnail: '🎂',
    content: `To celebrate Sir Topham Hatt's birthday, Thomas transported a giant birthday cake decorated with blue icing and a sugar engine from the bakery to Knapford Station. To avoid potential disturbances that might cause a bump, Thomas operated at low speed and avoided loud whistles when passing a group of children, who were waving and cheering. Sir Topham Hatt expressed surprise and appreciation, leaving Thomas proud.`,
    questions: [
      { question: "Whose birthday was it?", options: ["Thomas's", "Sir Topham Hatt's", "Percy's", "The Mayor's"], correctAnswer: "Sir Topham Hatt's" },
      { question: "What was the surprise?", options: ["A new engine", "A giant birthday cake", "A party", "A vacation"], correctAnswer: "A giant birthday cake" },
      { question: "Where was the cake from?", options: ["The grocery store", "The bakery", "The sheds", "The docks"], correctAnswer: "The bakery" },
      { question: "Where was the cake being taken?", options: ["Tidmouth Sheds", "Knapford Station", "Vicarstown", "Wellsworth"], correctAnswer: "Knapford Station" },
      { question: "What color was the icing?", options: ["Red", "Blue", "Green", "Yellow"], correctAnswer: "Blue" },
      { question: "What was on top of the cake?", options: ["A candle", "A little sugar engine", "A flower", "A star"], correctAnswer: "A little sugar engine" },
      { question: "Who did Thomas see by the track?", options: ["Gordon", "A group of children", "A sheep", "Farmer McColl"], correctAnswer: "A group of children" },
      { question: "Why didn't Thomas whistle loudly?", options: ["He forgot", "It might cause a bump", "He was tired", "He was shy"], correctAnswer: "It might cause a bump" },
      { question: "Was Sir Topham Hatt surprised?", options: ["Yes", "No", "He was angry", "He already knew"], correctAnswer: "Yes" },
      { question: "How did Thomas feel at the end?", options: ["Sad", "Proud", "Angry", "Tired"], correctAnswer: "Proud" }
    ]
  },
  {
    id: 'story-9',
    title: 'Percy and the Troublesome Trucks',
    thumbnail: '🚛',
    content: `Percy was tasked with hauling troublesome trucks to the Quarry. The trucks, prone to mischief, manipulated Percy's coupling and pushed him down a hill while singing 'On, on, on! Faster, faster, faster!'. The excessive force resulted in three trucks derailing, forcing Percy to stop the train. The remaining trucks remained quiet for the remainder of the journey, realizing mischief made the journey longer.`,
    questions: [
      { question: "Who was Percy taking to the Quarry?", options: ["Coaches", "Troublesome trucks", "Timber", "Coal"], correctAnswer: "Troublesome trucks" },
      { question: "What do the trucks like to cause?", options: ["Happiness", "Mischief", "Sleep", "Speed"], correctAnswer: "Mischief" },
      { question: "What did the trucks do to Percy's coupling?", options: ["Broke it", "Pushed and pulled it", "Painted it", "Cleaned it"], correctAnswer: "Pushed and pulled it" },
      { question: "Where did the trucks start to sing?", options: ["The top of the hill", "The bottom of the hill", "The station", "The tunnel"], correctAnswer: "The bottom of the hill" },
      { question: "What did the trucks sing?", options: ["Slow down", "On, on, on! Faster!", "Happy birthday", "Go home"], correctAnswer: "On, on, on! Faster!" },
      { question: "How many trucks jumped off the tracks?", options: ["One", "Three", "Five", "All of them"], correctAnswer: "Three" },
      { question: "What did Percy have to do?", options: ["Keep going", "Stop the train", "Fly", "Call Gordon"], correctAnswer: "Stop the train" },
      { question: "Were the trucks loud after the accident?", options: ["Yes", "No, they were quiet", "They sang louder", "They cried"], correctAnswer: "No, they were quiet" },
      { question: "What did the trucks realize?", options: ["Mischief is good", "Mischief made the journey longer", "Percy is slow", "They like the quarry"], correctAnswer: "Mischief made the journey longer" },
      { question: "Did they get to the Quarry safely?", options: ["Yes", "No", "They went to the docks instead", "Only Percy did"], correctAnswer: "Yes" }
    ]
  },
  {
    id: 'story-10',
    title: 'Edward and the Winter Snow',
    thumbnail: '❄️',
    content: `During a winter snowstorm, Edward, Sodor's oldest engine, was equipped with a large snowplow to transport coal to Ulfstead. Despite howling winds and deep drifts that compromised visibility, Edward did not give up. The residents cheered and rang bells upon his arrival, and Sir Topham Hatt designated him a 'Heroic Engine'. Edward was happy to be useful.`,
    questions: [
      { question: "Who is the oldest engine on Sodor?", options: ["Thomas", "Edward", "Gordon", "Henry"], correctAnswer: "Edward" },
      { question: "What happened one winter evening?", options: ["A rainstorm", "A snowstorm", "A heatwave", "A hurricane"], correctAnswer: "A snowstorm" },
      { question: "What was the village of Ulfstead running out of?", options: ["Food", "Coal", "Water", "Toys"], correctAnswer: "Coal" },
      { question: "What was Edward fitted with?", options: ["A new whistle", "A large snowplow", "New wheels", "A bell"], correctAnswer: "A large snowplow" },
      { question: "How did the wind sound?", options: ["Singing", "Howling", "Quiet", "Whispering"], correctAnswer: "Howling" },
      { question: "Was the snow deep?", options: ["No", "Yes, in deep drifts", "It was only a little", "It was melting"], correctAnswer: "Yes, in deep drifts" },
      { question: "Did Edward give up?", options: ["Yes", "No", "He went back", "He fell asleep"], correctAnswer: "No" },
      { question: "How did the people of Ulfstead react?", options: ["They were angry", "They cheered and rang bells", "They were scared", "They didn't notice"], correctAnswer: "They cheered and rang bells" },
      { question: "What did Sir Topham Hatt call Edward?", options: ["An old engine", "A Heroic Engine", "A slow engine", "A blue engine"], correctAnswer: "A Heroic Engine" },
      { question: "Why was Edward happy?", options: ["He got a medal", "He was useful", "He liked the snow", "He was the oldest"], correctAnswer: "He was useful" }
    ]
  },
  {
    id: 'story-11',
    title: 'Thomas and the Fog',
    thumbnail: '🌫️',
    content: `Dense fog restricted visibility on Sodor, forcing Thomas to travel slowly. Hearing a detonator make a 'Bang' sound warning of danger ahead, Thomas stopped, avoiding a collision with a fallen tree. Sir Topham Hatt was pleased, calling Thomas a really useful engine.`,
    questions: [
      { question: "What covered the island one morning?", options: ["Snow", "Rain", "Fog", "Dust"], correctAnswer: "Fog" },
      { question: "Could Thomas see well?", options: ["Yes", "No", "Only a little", "He used a flashlight"], correctAnswer: "No" },
      { question: "How did Thomas have to travel?", options: ["Fast", "Slowly", "By flying", "Backward"], correctAnswer: "Slowly" },
      { question: "What did Thomas listen for?", options: ["Birds", "Music", "Detonators", "Other engines"], correctAnswer: "Detonators" },
      { question: "What sound did the detonator make?", options: ["Pop", "Bang", "Whistle", "Ding"], correctAnswer: "Bang" },
      { question: "What did the 'Bang' mean?", options: ["Lunch time", "Danger ahead", "Go faster", "End of the line"], correctAnswer: "Danger ahead" },
      { question: "What was on the track?", options: ["A cow", "A fallen tree", "A big rock", "A snowman"], correctAnswer: "A fallen tree" },
      { question: "What would have happened if Thomas didn't stop?", options: ["He would be late", "He might have crashed", "He would find gold", "Nothing"], correctAnswer: "He might have crashed" },
      { question: "Was Sir Topham Hatt pleased?", options: ["Yes", "No", "He was angry", "He didn't care"], correctAnswer: "Yes" },
      { question: "What kind of engine was Thomas called?", options: ["Fast engine", "Really useful engine", "Blue engine", "Careful engine"], correctAnswer: "Really useful engine" }
    ]
  },
  {
    id: 'story-12',
    title: "Percy's New Friend",
    thumbnail: '🤝',
    content: `Percy was working at the Docks when he met Kevin, a yellow mobile crane unit. Despite Kevin's clumsy handling of oranges, Percy bravely demonstrated dockside stabilization protocols. Kevin acquired the skills rapidly, moving crates perfectly by end of day. Kevin liked Sodor and Percy was happy with the new friendship.`,
    questions: [
      { question: "Where was Percy working?", options: ["The Quarry", "The Docks", "The Farm", "The Station"], correctAnswer: "The Docks" },
      { question: "What color was the new engine?", options: ["Red", "Blue", "Yellow", "Green"], correctAnswer: "Yellow" },
      { question: "What was the name of the new friend?", options: ["Thomas", "Kevin", "Cranky", "Edward"], correctAnswer: "Kevin" },
      { question: "Was Kevin a normal engine?", options: ["Yes", "No, he was a crane", "No, he was a car", "No, he was a boat"], correctAnswer: "No, he was a crane" },
      { question: "How did Percy feel when he said hello?", options: ["Scared", "Brave", "Angry", "Sad"], correctAnswer: "Brave" },
      { question: "What did Kevin nearly drop?", options: ["Coal", "Oranges", "Apples", "Tools"], correctAnswer: "Oranges" },
      { question: "What did Percy show Kevin?", options: ["The beach", "The Docks", "His shed", "The mountains"], correctAnswer: "The Docks" },
      { question: "What did Kevin learn to do?", options: ["Fly", "Stay steady", "Whistle loudly", "Paint himself red"], correctAnswer: "Stay steady" },
      { question: "How was Kevin moving crates at the end of the day?", options: ["Badly", "Perfectly", "Slowly", "He wasn't"], correctAnswer: "Perfectly" },
      { question: "Did Kevin like Sodor?", options: ["Yes", "No", "He wanted to leave", "He didn't say"], correctAnswer: "Yes" }
    ]
  }
];
