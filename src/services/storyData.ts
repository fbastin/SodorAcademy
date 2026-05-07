import { Story } from '../types';

export const STORIES: Story[] = [
  {
    id: 'story-1',
    title: 'Thomas and the Missing Whistle',
    thumbnail: '📢',
    content: `One sunny morning at Tidmouth Sheds, Thomas the Tank Engine woke up feeling very excited. Today was the day of the Great Sodor Parade! But as Thomas prepared to leave, he realized something terrible. His whistle was gone! "Cinders and ashes!" Thomas cried. "I can't lead the parade without my whistle!" 

Thomas looked everywhere. He checked his coal bunker, he looked behind the water tower, and he even asked Percy if he had seen it. "Sorry, Thomas," Percy peeped, "I haven't seen a whistle all morning." Thomas was starting to feel very sad. Just then, he saw Sir Topham Hatt walking towards him. 

"Thomas," said Sir Topham Hatt, "it's time for the parade. Why aren't you ready?" Thomas explained about his missing whistle. Sir Topham Hatt smiled. "Don't worry, Thomas. Look over there by the workbench." Thomas looked, and there it was! The workmen had taken it to be polished so it would shine for the parade. Thomas was so happy. He puffed and huffed, and his whistle blew louder than ever before!`,
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
    content: `Harvest time had arrived on the Island of Sodor. Percy was busy delivering vegetables to all the villages. At Farmer McColl's farm, there was a pumpkin so large that it needed its own flatbed truck! "Be careful, Percy," warned Farmer McColl. "This pumpkin is very heavy and very slippery."

Percy puffed slowly, making sure to stay on the tracks. But as he climbed Gordon's Hill, the flatbed started to wobble. "Oh no!" cried Percy. The giant pumpkin began to slide. It slid right off the truck and started rolling down the hill! 

It rolled past James, who was resting at the bottom. "Look out!" whistled Percy. The pumpkin rolled through a haystack and ended up right in the middle of the village square. When Percy finally caught up, everyone was laughing. The pumpkin hadn't broken! Instead, it was perfectly placed for the Harvest Festival. Sir Topham Hatt was very pleased. "Well done, Percy," he said. "You've delivered the best decoration we've ever had!"`,
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
    content: `Gordon is the fastest engine on Sodor, and he never lets anyone forget it. One Tuesday, Sir Topham Hatt announced a special test. "Gordon, I want to see if you can break the speed record from Knapford to Vicarstown." Gordon was thrilled. "I am the fastest! I am the best!" he boasted to the other engines.

The signals were all set to green. Gordon started his cylinders and puff-puff-puffed away. He was flying! He zoomed past Wellsworth and sped through Maron. But suddenly, he heard a strange clanking sound. "Oh, my boilers!" Gordon groaned. A small part of his valve gear had come loose.

Gordon had to slow down. He didn't break the record, and he felt very embarrassed. Thomas came to help him back to the works. "It's okay, Gordon," said Thomas. "Even the fastest engines need a check-up sometimes." Gordon learned that being the fastest isn't as important as being a really useful engine.`,
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
    content: `James loves his red paint. He thinks he is the most splendid engine on the whole railway. One morning, Sir Topham Hatt gave James a special job. "James, you are to take the Mayor of Sodor to the Grand Opening of the new museum. You must look your best!"

James spent two hours getting cleaned and polished. He looked like a shiny ruby! But on the way to the station, James had to pass the coal mines. "I must be careful," James whispered. "I don't want any coal dust on my splendid paint."

Suddenly, a gust of wind blew a big cloud of black dust right over James! "Oh, no! I'm ruined!" James cried. He was covered in black spots. He arrived at the station feeling very sad. But when the Mayor saw him, he smiled. "James! You look like a dalmatian engine! How unique and wonderful!" James realized that even with spots, he was still a very special engine.`,
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
    content: `Toby is a tram engine. He is wise and very kind. One day, Toby was asked to explore a very old track that hadn't been used in many years. At the end of the track was a wooden bridge. "Be careful, Toby," said his driver. "This bridge looks very shaky."

Toby moved onto the bridge slowly. Creak! Crack! The wood made scary noises under Toby's wheels. Toby stopped. He was right in the middle, and he was afraid. "I can't go forward, and I'm scared to go back!" Toby rang his bell loudly.

Luckily, Henrietta was right behind him. She encouraged him. "You can do it, Toby! Just one small step at a time." Toby took a deep breath and slowly rolled back to safety. Later that week, the workmen came and built a strong new stone bridge. Toby was happy that he had helped them find the old bridge before anyone got hurt.`,
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
    content: `Emily is a very helpful engine with a beautiful emerald green coat. One afternoon, the regular passenger train was much busier than usual. "Emily," said Sir Topham Hatt, "we need you to take the extra passengers to the seaside resort. They are visiting from the mainland."

Emily was very proud. She loved meeting new people. She pulled four shiny coaches behind her. On the way, the passengers saw many wonderful things. They saw the windmills, the bluebells in the forest, and the tall mountains. Emily whistled a happy tune as she puffed along.

But then, Emily saw a sheep on the tracks! "Peep! Peep!" Emily whistled. The sheep didn't move. Emily stopped very gently so the passengers wouldn't bump their heads. Emily's driver helped the sheep back into its field. The passengers weren't upset about the delay; they were happy to see the sheep! They arrived at the seaside just in time for sunset.`,
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
    content: `Henry is a big green engine who loves nature. His favorite place on Sodor is the Whispering Woods. One hot summer day, it hadn't rained for a long time. The grass was dry and yellow. Henry was delivering timber when he saw a small wisp of smoke rising from the trees.

"Oh no! A fire!" Henry whistled loudly to warn everyone. The wind was blowing the smoke towards the station. Henry knew he had to act fast. He puffed to the nearest water tower and filled his tanks. Then, he used his steam and the water from his tender to help the firemen dampen the ground around the station.

Soon, the big fire engines arrived and put out the fire. "Well done, Henry," said Sir Topham Hatt. "Your quick thinking saved the station and much of the forest." Henry was very tired, but he was glad his favorite woods were safe. That night, it finally rained, and Henry slept very soundly.`,
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
    content: `It was Sir Topham Hatt's birthday, and Thomas wanted to give him the best surprise ever. "I have a plan," Thomas told Percy. "We are going to bring a giant birthday cake from the bakery all the way to Knapford Station."

The cake was huge, with blue icing and a little sugar engine on top. It was very delicate. Thomas moved as smoothly as he could. He didn't want the cake to wobble. But on the way, Thomas saw a group of children by the track. They were waving and cheering. 

Thomas wanted to whistle back, but he knew the noise might startle his driver and cause a bump. He just gave a soft "peep-peep" and kept going. When he arrived at the station, everyone was there. Sir Topham Hatt was so surprised! "Thomas, this is the most delicious-looking cake I've ever seen. Thank you for being such a thoughtful engine." Thomas felt very proud.`,
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
    content: `The troublesome trucks are always looking for ways to cause mischief. One day, Percy had to take a long line of them to the Quarry. "We're going to have some fun today!" the trucks giggled. They started to push and pull at Percy's coupling.

"Stop that!" whistled Percy. But the trucks didn't listen. When they reached the bottom of the big hill, the trucks began to sing: "On, on, on! Faster, faster, faster!" They pushed Percy harder and harder. Percy's wheels were spinning.

Suddenly, the trucks pushed too hard, and the last three trucks jumped right off the tracks! "Oh no!" cried Percy. He had to stop the rest of the train. It took a long time to get the trucks back on the line. The trucks were very quiet for the rest of the trip. They realized that their mischief had only made their journey longer. Percy was firm but fair, and he eventually got them all to the Quarry safely.`,
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
    content: `Edward is the oldest engine on Sodor, and he is very wise. One winter evening, a big snowstorm hit the island. The tracks were covered in thick, white snow. Most of the engines were tucked away in their warm sheds. But the village of Ulfstead was running out of coal for their heaters.

"I will go," said Edward. He was fitted with a large snowplow. It was cold, and the wind was howling. Edward pushed through the deep drifts. Sometimes the snow was so high he could barely see the tracks. But Edward didn't give up. "I must get the coal to the people," he whispered.

He finally reached Ulfstead. The people were so happy to see him! They cheered and rang bells. Edward felt warm inside, even though his metal was very cold. He stayed at the village until the storm passed. Sir Topham Hatt called him a "Heroic Engine." Edward just smiled. He was just happy to be useful.`,
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
  }
];
