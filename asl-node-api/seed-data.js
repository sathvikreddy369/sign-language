require('dotenv').config();
const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');
const Sign = require('./models/Sign');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/signlang';

// Comprehensive ASL Signs Data
const signsData = [
  // Alphabet
  { word: 'A', letter: 'A', category: 'Alphabet', difficulty: 'Easy', description: 'Letter A in ASL', instructions: 'Make a fist with thumb on the side', hand_shape: 'Fist', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 95 },
  { word: 'B', letter: 'B', category: 'Alphabet', difficulty: 'Easy', description: 'Letter B in ASL', instructions: 'Flat hand with thumb tucked in', hand_shape: 'Flat', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 90 },
  { word: 'C', letter: 'C', category: 'Alphabet', difficulty: 'Easy', description: 'Letter C in ASL', instructions: 'Curved hand like holding a cup', hand_shape: 'C-Shape', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 85 },
  { word: 'D', letter: 'D', category: 'Alphabet', difficulty: 'Easy', description: 'Letter D in ASL', instructions: 'Point finger up, other fingers touch thumb', hand_shape: 'Point', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 80 },
  { word: 'E', letter: 'E', category: 'Alphabet', difficulty: 'Easy', description: 'Letter E in ASL', instructions: 'Curved fingers touching thumb', hand_shape: 'Curved', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 88 },
  
  // Numbers
  { word: 'One', letter: '1', category: 'Numbers', difficulty: 'Easy', description: 'Number 1 in ASL', instructions: 'Point index finger up', hand_shape: 'Point', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 95, synonyms: ['1'], tags: ['counting', 'basic'] },
  { word: 'Two', letter: '2', category: 'Numbers', difficulty: 'Easy', description: 'Number 2 in ASL', instructions: 'Index and middle finger up', hand_shape: 'Open', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 90, synonyms: ['2'], tags: ['counting', 'basic'] },
  { word: 'Three', letter: '3', category: 'Numbers', difficulty: 'Easy', description: 'Number 3 in ASL', instructions: 'Thumb, index, and middle finger up', hand_shape: 'Open', movement: 'Static', location: 'Neutral Space', two_handed: false, frequency_score: 85, synonyms: ['3'], tags: ['counting', 'basic'] },
  
  // Greetings
  { word: 'Hello', category: 'Greetings', difficulty: 'Easy', description: 'Common greeting', instructions: 'Wave hand or salute motion from forehead', hand_shape: 'Open', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 100, synonyms: ['Hi', 'Hey'], tags: ['greeting', 'common'], usage_examples: ['Hello, nice to meet you', 'Hello everyone'] },
  { word: 'Goodbye', category: 'Greetings', difficulty: 'Easy', description: 'Farewell gesture', instructions: 'Wave hand back and forth', hand_shape: 'Open', movement: 'Left-Right', location: 'Neutral Space', two_handed: false, frequency_score: 95, synonyms: ['Bye', 'See you later'], tags: ['greeting', 'farewell'], usage_examples: ['Goodbye, see you tomorrow', 'Bye everyone'] },
  { word: 'Thank you', category: 'Greetings', difficulty: 'Easy', description: 'Expression of gratitude', instructions: 'Touch chin with fingertips, move hand forward', hand_shape: 'Flat', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 98, synonyms: ['Thanks'], tags: ['gratitude', 'polite'], usage_examples: ['Thank you for your help', 'Thanks a lot'] },
  { word: 'Please', category: 'Greetings', difficulty: 'Easy', description: 'Polite request', instructions: 'Circular motion on chest with flat hand', hand_shape: 'Flat', movement: 'Circular', location: 'Chest', two_handed: false, frequency_score: 90, tags: ['polite', 'request'], usage_examples: ['Please help me', 'Can you please repeat that'] },
  { word: 'Sorry', category: 'Greetings', difficulty: 'Easy', description: 'Apology', instructions: 'Circular motion on chest with fist', hand_shape: 'Fist', movement: 'Circular', location: 'Chest', two_handed: false, frequency_score: 85, synonyms: ['Apologize'], tags: ['apology', 'polite'], usage_examples: ['Sorry for being late', 'I apologize'] },
  
  // Family
  { word: 'Mother', category: 'Family', difficulty: 'Easy', description: 'Female parent', instructions: 'Touch thumb to chin', hand_shape: 'Open', movement: 'Static', location: 'Face', two_handed: false, frequency_score: 80, synonyms: ['Mom', 'Mama'], tags: ['family', 'parent'], usage_examples: ['My mother is kind', 'Mom is cooking'] },
  { word: 'Father', category: 'Family', difficulty: 'Easy', description: 'Male parent', instructions: 'Touch thumb to forehead', hand_shape: 'Open', movement: 'Static', location: 'Face', two_handed: false, frequency_score: 80, synonyms: ['Dad', 'Papa'], tags: ['family', 'parent'], usage_examples: ['My father works hard', 'Dad is reading'] },
  { word: 'Sister', category: 'Family', difficulty: 'Medium', description: 'Female sibling', instructions: 'L-shape at chin, then point down', hand_shape: 'L-Shape', movement: 'Up-Down', location: 'Face', two_handed: false, frequency_score: 70, tags: ['family', 'sibling'], usage_examples: ['My sister is older', 'She is my sister'] },
  { word: 'Brother', category: 'Family', difficulty: 'Medium', description: 'Male sibling', instructions: 'L-shape at forehead, then point down', hand_shape: 'L-Shape', movement: 'Up-Down', location: 'Face', two_handed: false, frequency_score: 70, tags: ['family', 'sibling'], usage_examples: ['My brother plays sports', 'He is my brother'] },
  
  // Colors
  { word: 'Red', category: 'Colors', difficulty: 'Easy', description: 'Color red', instructions: 'Point to lips and move down', hand_shape: 'Point', movement: 'Up-Down', location: 'Face', two_handed: false, frequency_score: 75, tags: ['color', 'basic'], usage_examples: ['The apple is red', 'I like red flowers'] },
  { word: 'Blue', category: 'Colors', difficulty: 'Easy', description: 'Color blue', instructions: 'B-shape, shake side to side', hand_shape: 'Flat', movement: 'Shake', location: 'Neutral Space', two_handed: false, frequency_score: 75, tags: ['color', 'basic'], usage_examples: ['The sky is blue', 'Blue is my favorite color'] },
  { word: 'Green', category: 'Colors', difficulty: 'Easy', description: 'Color green', instructions: 'G-shape, shake side to side', hand_shape: 'Point', movement: 'Shake', location: 'Neutral Space', two_handed: false, frequency_score: 70, tags: ['color', 'basic'], usage_examples: ['Grass is green', 'Green vegetables are healthy'] },
  
  // Animals
  { word: 'Cat', category: 'Animals', difficulty: 'Easy', description: 'Feline pet', instructions: 'Pinch fingers at mouth corners, pull out (whiskers)', hand_shape: 'Pinch', movement: 'Left-Right', location: 'Face', two_handed: false, frequency_score: 65, tags: ['animal', 'pet'], usage_examples: ['The cat is sleeping', 'I have a pet cat'] },
  { word: 'Dog', category: 'Animals', difficulty: 'Easy', description: 'Canine pet', instructions: 'Pat leg and snap fingers', hand_shape: 'Flat', movement: 'Tap', location: 'Side', two_handed: false, frequency_score: 70, tags: ['animal', 'pet'], usage_examples: ['The dog is barking', 'Dogs are loyal'] },
  { word: 'Bird', category: 'Animals', difficulty: 'Medium', description: 'Flying animal', instructions: 'Pinch fingers at mouth, open and close (beak)', hand_shape: 'Pinch', movement: 'Complex', location: 'Face', two_handed: false, frequency_score: 55, tags: ['animal', 'flying'], usage_examples: ['Birds can fly', 'The bird is singing'] },
  
  // Actions
  { word: 'Eat', category: 'Actions', difficulty: 'Easy', description: 'Consuming food', instructions: 'Bring fingertips to mouth repeatedly', hand_shape: 'Pinch', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 85, tags: ['action', 'daily'], usage_examples: ['Time to eat dinner', 'I eat breakfast every day'] },
  { word: 'Drink', category: 'Actions', difficulty: 'Easy', description: 'Consuming liquid', instructions: 'C-shape to mouth, tilt back', hand_shape: 'C-Shape', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 80, tags: ['action', 'daily'], usage_examples: ['Drink water regularly', 'I drink coffee in the morning'] },
  { word: 'Sleep', category: 'Actions', difficulty: 'Easy', description: 'Resting/sleeping', instructions: 'Flat hand slides down face', hand_shape: 'Flat', movement: 'Up-Down', location: 'Face', two_handed: false, frequency_score: 75, tags: ['action', 'daily'], usage_examples: ['Time to sleep', 'I sleep eight hours'] },
  { word: 'Walk', category: 'Actions', difficulty: 'Easy', description: 'Moving on foot', instructions: 'Two flat hands alternate forward motion', hand_shape: 'Flat', movement: 'Forward-Back', location: 'Neutral Space', two_handed: true, frequency_score: 70, tags: ['action', 'movement'], usage_examples: ['Let\'s walk to the park', 'I walk every morning'] },
  
  // Emotions
  { word: 'Happy', category: 'Emotions', difficulty: 'Easy', description: 'Feeling joy', instructions: 'Flat hands brush up chest repeatedly', hand_shape: 'Flat', movement: 'Up-Down', location: 'Chest', two_handed: true, frequency_score: 85, synonyms: ['Joy', 'Glad'], tags: ['emotion', 'positive'], usage_examples: ['I am happy today', 'This makes me happy'] },
  { word: 'Sad', category: 'Emotions', difficulty: 'Easy', description: 'Feeling sorrow', instructions: 'Both hands slide down face', hand_shape: 'Flat', movement: 'Up-Down', location: 'Face', two_handed: true, frequency_score: 75, synonyms: ['Unhappy'], tags: ['emotion', 'negative'], usage_examples: ['I feel sad', 'The movie was sad'] },
  { word: 'Angry', category: 'Emotions', difficulty: 'Medium', description: 'Feeling anger', instructions: 'Curved fingers at face, pull back sharply', hand_shape: 'Curved', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 65, synonyms: ['Mad'], tags: ['emotion', 'negative'], usage_examples: ['Don\'t make me angry', 'He looks angry'] },
  
  // Time
  { word: 'Today', category: 'Time', difficulty: 'Medium', description: 'Current day', instructions: 'NOW + DAY signs combined', hand_shape: 'Flat', movement: 'Complex', location: 'Neutral Space', two_handed: true, frequency_score: 80, tags: ['time', 'day'], usage_examples: ['Today is sunny', 'What are you doing today?'] },
  { word: 'Tomorrow', category: 'Time', difficulty: 'Medium', description: 'Next day', instructions: 'A-shape thumb touches cheek, moves forward', hand_shape: 'Fist', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 75, tags: ['time', 'future'], usage_examples: ['See you tomorrow', 'Tomorrow is Monday'] },
  { word: 'Yesterday', category: 'Time', difficulty: 'Medium', description: 'Previous day', instructions: 'A-shape thumb touches cheek, moves back', hand_shape: 'Fist', movement: 'Forward-Back', location: 'Face', two_handed: false, frequency_score: 70, tags: ['time', 'past'], usage_examples: ['Yesterday was fun', 'I went shopping yesterday'] },
  
  // Common Phrases
  { word: 'How are you', category: 'Common Phrases', difficulty: 'Medium', description: 'Asking about wellbeing', instructions: 'HOW + YOU signs combined', hand_shape: 'Open', movement: 'Complex', location: 'Neutral Space', two_handed: true, frequency_score: 90, tags: ['phrase', 'greeting'], usage_examples: ['How are you today?', 'How are you feeling?'] },
  { word: 'What is your name', category: 'Common Phrases', difficulty: 'Hard', description: 'Asking for someone\'s name', instructions: 'WHAT + YOUR + NAME signs combined', hand_shape: 'Open', movement: 'Complex', location: 'Neutral Space', two_handed: true, frequency_score: 85, tags: ['phrase', 'introduction'], usage_examples: ['What is your name?', 'May I ask your name?'] },
  { word: 'Nice to meet you', category: 'Common Phrases', difficulty: 'Hard', description: 'Polite introduction response', instructions: 'NICE + MEET + YOU signs combined', hand_shape: 'Open', movement: 'Complex', location: 'Neutral Space', two_handed: true, frequency_score: 80, tags: ['phrase', 'polite'], usage_examples: ['Nice to meet you too', 'It was nice to meet you'] }
];

// Lessons Data
const lessonsData = [
  {
    title: 'ASL Alphabet (A-Z)',
    slug: 'asl-alphabet',
    description: 'Learn all 26 letters of the American Sign Language alphabet with proper hand shapes and positioning.',
    level: 'Beginner',
    category: 'Alphabet',
    duration_minutes: 20,
    order: 1,
    learning_objectives: [
      'Master all 26 ASL alphabet letters',
      'Understand proper hand positioning',
      'Practice letter recognition',
      'Build muscle memory for fingerspelling'
    ],
    practice_exercises: [
      {
        type: 'recognition',
        instruction: 'Identify the letter being shown',
        data: { letters: ['A', 'B', 'C', 'D', 'E'] }
      },
      {
        type: 'production',
        instruction: 'Form the letter with your hand',
        data: { letters: ['A', 'B', 'C', 'D', 'E'] }
      }
    ]
  },
  {
    title: 'Numbers 1-20',
    slug: 'numbers-1-20',
    description: 'Learn to sign numbers from 1 to 20, essential for daily communication.',
    level: 'Beginner',
    category: 'Numbers',
    duration_minutes: 15,
    order: 2,
    learning_objectives: [
      'Sign numbers 1-10 accurately',
      'Sign numbers 11-20 accurately',
      'Understand number formation rules',
      'Practice counting in ASL'
    ],
    practice_exercises: [
      {
        type: 'sequence',
        instruction: 'Count from 1 to 10',
        data: { range: [1, 10] }
      }
    ]
  },
  {
    title: 'Basic Greetings',
    slug: 'basic-greetings',
    description: 'Essential greetings and polite expressions for everyday interactions.',
    level: 'Beginner',
    category: 'Greetings',
    duration_minutes: 18,
    order: 3,
    learning_objectives: [
      'Master common greetings',
      'Learn polite expressions',
      'Practice conversation starters',
      'Understand cultural context'
    ],
    practice_exercises: [
      {
        type: 'matching',
        instruction: 'Match the sign with its meaning',
        data: { pairs: [['Hello', 'Greeting'], ['Thank you', 'Gratitude']] }
      }
    ]
  },
  {
    title: 'Family Members',
    slug: 'family-members',
    description: 'Learn signs for family relationships and how to talk about your family.',
    level: 'Beginner',
    category: 'Family',
    duration_minutes: 22,
    order: 4,
    learning_objectives: [
      'Sign immediate family members',
      'Learn extended family signs',
      'Practice family introductions',
      'Understand relationship concepts'
    ]
  },
  {
    title: 'Colors and Descriptions',
    slug: 'colors-descriptions',
    description: 'Basic colors and how to describe objects using color signs.',
    level: 'Beginner',
    category: 'Colors',
    duration_minutes: 16,
    order: 5,
    learning_objectives: [
      'Master primary colors',
      'Learn secondary colors',
      'Practice color descriptions',
      'Combine colors with objects'
    ]
  },
  {
    title: 'Common Animals',
    slug: 'common-animals',
    description: 'Signs for pets, farm animals, and wild animals you might encounter.',
    level: 'Intermediate',
    category: 'Animals',
    duration_minutes: 25,
    order: 6,
    learning_objectives: [
      'Sign common pets',
      'Learn farm animal signs',
      'Practice wild animal signs',
      'Understand animal characteristics'
    ]
  },
  {
    title: 'Daily Actions',
    slug: 'daily-actions',
    description: 'Verbs and actions for describing daily activities and routines.',
    level: 'Intermediate',
    category: 'Actions',
    duration_minutes: 28,
    order: 7,
    learning_objectives: [
      'Master daily routine verbs',
      'Learn action descriptions',
      'Practice verb tenses',
      'Combine actions in sentences'
    ]
  },
  {
    title: 'Emotions and Feelings',
    slug: 'emotions-feelings',
    description: 'Express emotions and feelings through ASL signs and facial expressions.',
    level: 'Intermediate',
    category: 'Emotions',
    duration_minutes: 20,
    order: 8,
    learning_objectives: [
      'Sign basic emotions',
      'Use facial expressions',
      'Practice emotional intensity',
      'Understand non-manual markers'
    ]
  },
  {
    title: 'Time and Calendar',
    slug: 'time-calendar',
    description: 'Time-related signs including days, months, and time expressions.',
    level: 'Intermediate',
    category: 'Time',
    duration_minutes: 30,
    order: 9,
    learning_objectives: [
      'Sign days of the week',
      'Learn months of the year',
      'Practice time expressions',
      'Understand temporal concepts'
    ]
  },
  {
    title: 'Essential Phrases',
    slug: 'essential-phrases',
    description: 'Common phrases and expressions for everyday conversations.',
    level: 'Advanced',
    category: 'Common Phrases',
    duration_minutes: 35,
    order: 10,
    learning_objectives: [
      'Master conversation starters',
      'Learn question formations',
      'Practice polite expressions',
      'Combine signs into phrases'
    ]
  }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Promise.all([
            Sign.deleteMany({}),
            Lesson.deleteMany({})
        ]);
        console.log('Cleared existing data');

        // Insert signs
        const signs = await Sign.insertMany(signsData);
        console.log(`Inserted ${signs.length} signs`);

        // Create lessons with sign references
        const lessonsWithSigns = lessonsData.map(lesson => {
            const lessonSigns = signs.filter(sign => {
                if (lesson.category === 'Alphabet') return sign.category === 'Alphabet';
                if (lesson.category === 'Numbers') return sign.category === 'Numbers';
                if (lesson.category === 'Greetings') return sign.category === 'Greetings';
                if (lesson.category === 'Family') return sign.category === 'Family';
                if (lesson.category === 'Colors') return sign.category === 'Colors';
                if (lesson.category === 'Animals') return sign.category === 'Animals';
                if (lesson.category === 'Actions') return sign.category === 'Actions';
                if (lesson.category === 'Emotions') return sign.category === 'Emotions';
                if (lesson.category === 'Time') return sign.category === 'Time';
                if (lesson.category === 'Common Phrases') return sign.category === 'Common Phrases';
                return false;
            });

            return {
                ...lesson,
                signs: lessonSigns.map(sign => ({
                    letter_or_word: sign.word,
                    description: sign.description,
                    image_url: sign.image_url,
                    video_url: sign.video_url,
                    difficulty: sign.difficulty,
                    tips: sign.tips || [],
                    common_mistakes: sign.common_mistakes || []
                }))
            };
        });

        const lessons = await Lesson.insertMany(lessonsWithSigns);
        console.log(`Inserted ${lessons.length} lessons`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
}

seedDatabase();