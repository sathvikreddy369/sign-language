/**
 * Mock ASL Data Service
 * Provides comprehensive lesson and sign data for development and demonstration
 */

import { Lesson, Sign } from './aslApi';

// Mock image URLs - using placeholder images that represent ASL signs
const getSignImageUrl = (word: string, letter?: string) => {
  if (letter) {
    return `https://www.signingsavvy.com/images/words/alphabet/${letter.toLowerCase()}.jpg`;
  }
  return `https://www.signingsavvy.com/images/words/${word.toLowerCase().replace(/\s+/g, '_')}.jpg`;
};

// Comprehensive mock lessons data
export const mockLessons: Lesson[] = [
  // Alphabet Lessons
  {
    id: 'alphabet-basics',
    title: 'ASL Alphabet Basics',
    slug: 'alphabet-basics',
    description: 'Master the 26 letters of the ASL alphabet with proper hand shapes and positioning.',
    level: 'Beginner',
    category: 'Alphabet',
    duration_minutes: 30,
    signs_count: 26,
    learning_objectives: [
      'Form all 26 letters of the ASL alphabet correctly',
      'Understand proper hand positioning and orientation',
      'Practice fingerspelling common words',
      'Develop muscle memory for quick letter transitions'
    ],
    signs: [
      {
        letter_or_word: 'A',
        description: 'Make a fist with your thumb resting against the side of your index finger.',
        difficulty: 'Easy',
        tips: ['Keep your thumb pressed firmly against your fingers', 'Hold your hand steady'],
        common_mistakes: ['Thumb sticking out too far', 'Fingers not fully closed']
      },
      {
        letter_or_word: 'B',
        description: 'Hold your four fingers straight up together, with your thumb folded across your palm.',
        difficulty: 'Easy',
        tips: ['Keep fingers straight and together', 'Thumb should be hidden behind fingers'],
        common_mistakes: ['Fingers spread apart', 'Thumb visible from the front']
      },
      {
        letter_or_word: 'C',
        description: 'Curve your fingers and thumb to form the shape of the letter C.',
        difficulty: 'Easy',
        tips: ['Make a clear C shape', 'Keep consistent curve in all fingers'],
        common_mistakes: ['Making the C too closed or too open', 'Fingers not aligned']
      }
    ]
  },
  {
    id: 'numbers-1-10',
    title: 'Numbers 1-10',
    slug: 'numbers-1-10',
    description: 'Learn to sign numbers 1 through 10 with correct hand shapes and palm orientation.',
    level: 'Beginner',
    category: 'Numbers',
    duration_minutes: 20,
    signs_count: 10,
    learning_objectives: [
      'Sign numbers 1-10 accurately',
      'Understand palm orientation for numbers',
      'Practice counting in ASL',
      'Learn number incorporation in basic sentences'
    ],
    signs: [
      {
        letter_or_word: '1',
        description: 'Hold up your index finger with palm facing forward.',
        difficulty: 'Easy',
        tips: ['Keep other fingers closed', 'Palm faces the person you\'re signing to'],
        common_mistakes: ['Using thumb instead of index finger', 'Wrong palm orientation']
      },
      {
        letter_or_word: '2',
        description: 'Hold up your index and middle fingers in a V shape, palm facing forward.',
        difficulty: 'Easy',
        tips: ['Make a clear V shape', 'Keep fingers straight'],
        common_mistakes: ['Fingers too close together', 'Palm facing wrong direction']
      }
    ]
  },
  // Greetings Lessons
  {
    id: 'basic-greetings',
    title: 'Basic Greetings & Politeness',
    slug: 'basic-greetings',
    description: 'Essential greetings and polite expressions for everyday ASL conversations.',
    level: 'Beginner',
    category: 'Greetings',
    duration_minutes: 25,
    signs_count: 8,
    learning_objectives: [
      'Greet people appropriately in ASL',
      'Use polite expressions like please and thank you',
      'Understand cultural context of ASL greetings',
      'Practice basic conversational openings'
    ],
    signs: [
      {
        letter_or_word: 'Hello',
        description: 'Start with your hand near your forehead and move it forward in a small wave motion.',
        difficulty: 'Easy',
        tips: ['Start near your temple area', 'Use a gentle forward motion', 'Maintain eye contact'],
        common_mistakes: ['Starting too high on forehead', 'Motion too exaggerated']
      },
      {
        letter_or_word: 'Thank You',
        description: 'Touch your chin with your fingertips and move your hand forward toward the person.',
        difficulty: 'Easy',
        tips: ['Start at your chin', 'Move hand toward the person you\'re thanking', 'Show genuine expression'],
        common_mistakes: ['Starting at wrong location', 'Not directing toward person']
      }
    ]
  },
  // Family Lessons
  {
    id: 'family-members',
    title: 'Family Members',
    slug: 'family-members',
    description: 'Learn to sign immediate and extended family members.',
    level: 'Beginner',
    category: 'Family',
    duration_minutes: 35,
    signs_count: 12,
    learning_objectives: [
      'Sign immediate family members (mother, father, sister, brother)',
      'Learn extended family signs (grandparents, aunt, uncle)',
      'Understand family relationship concepts in Deaf culture',
      'Practice describing your family'
    ],
    signs: [
      {
        letter_or_word: 'Mother',
        description: 'Touch your thumb to your chin with fingers spread, then move slightly forward.',
        difficulty: 'Easy',
        tips: ['Use your dominant hand', 'Touch chin gently', 'Fingers naturally spread'],
        common_mistakes: ['Using wrong part of hand', 'Too much movement']
      },
      {
        letter_or_word: 'Father',
        description: 'Touch your thumb to your forehead with fingers spread, then move slightly forward.',
        difficulty: 'Easy',
        tips: ['Similar to mother but at forehead', 'Use thumb, not fingertips'],
        common_mistakes: ['Confusing with mother sign', 'Wrong hand position']
      }
    ]
  },
  // Colors Lesson
  {
    id: 'colors-basics',
    title: 'Basic Colors',
    slug: 'colors-basics',
    description: 'Master the signs for common colors used in everyday conversation.',
    level: 'Beginner',
    category: 'Colors',
    duration_minutes: 30,
    signs_count: 10,
    learning_objectives: [
      'Sign 10 basic colors accurately',
      'Understand color incorporation in descriptions',
      'Practice color-related vocabulary',
      'Learn to describe objects using colors'
    ],
    signs: [
      {
        letter_or_word: 'Red',
        description: 'Touch your lips with your index finger and pull down slightly.',
        difficulty: 'Easy',
        tips: ['Use just the tip of your index finger', 'Light touch on lips', 'Small downward motion'],
        common_mistakes: ['Using whole hand', 'Too much pressure on lips']
      },
      {
        letter_or_word: 'Blue',
        description: 'Make the letter B and shake it slightly from side to side.',
        difficulty: 'Easy',
        tips: ['Form clear B handshape', 'Small side-to-side motion', 'Keep wrist stable'],
        common_mistakes: ['Wrong handshape', 'Too much movement']
      }
    ]
  },
  // Animals Lesson
  {
    id: 'common-animals',
    title: 'Common Animals',
    slug: 'common-animals',
    description: 'Learn signs for pets and common animals you encounter daily.',
    level: 'Beginner',
    category: 'Animals',
    duration_minutes: 40,
    signs_count: 15,
    learning_objectives: [
      'Sign common pets (dog, cat, bird, fish)',
      'Learn farm animals (cow, pig, horse, chicken)',
      'Practice wild animals (bear, lion, elephant)',
      'Understand animal-related expressions'
    ],
    signs: [
      {
        letter_or_word: 'Dog',
        description: 'Pat your leg twice, as if calling a dog.',
        difficulty: 'Easy',
        tips: ['Use flat hand', 'Pat your thigh area', 'Two clear pats'],
        common_mistakes: ['Patting too high or low', 'Using wrong hand shape']
      },
      {
        letter_or_word: 'Cat',
        description: 'Pinch your cheek and pull outward twice, representing whiskers.',
        difficulty: 'Easy',
        tips: ['Use thumb and index finger', 'Gentle pinching motion', 'Pull outward from cheek'],
        common_mistakes: ['Pinching too hard', 'Wrong location on face']
      }
    ]
  },
  // Actions Lesson
  {
    id: 'daily-actions',
    title: 'Daily Actions',
    slug: 'daily-actions',
    description: 'Essential action verbs for describing daily activities and routines.',
    level: 'Intermediate',
    category: 'Actions',
    duration_minutes: 45,
    signs_count: 20,
    learning_objectives: [
      'Sign common daily actions (eat, drink, sleep, work)',
      'Learn movement verbs (walk, run, sit, stand)',
      'Practice action sequences',
      'Understand verb tenses in ASL'
    ],
    signs: [
      {
        letter_or_word: 'Eat',
        description: 'Bring your fingertips to your mouth as if putting food in.',
        difficulty: 'Easy',
        tips: ['Use all fingertips together', 'Move toward mouth', 'Natural eating motion'],
        common_mistakes: ['Using wrong fingers', 'Exaggerated motion']
      },
      {
        letter_or_word: 'Sleep',
        description: 'Place your hand near your face and close your eyes, moving hand down slightly.',
        difficulty: 'Easy',
        tips: ['Start near your face', 'Close eyes naturally', 'Gentle downward motion'],
        common_mistakes: ['Hand too far from face', 'Not closing eyes']
      }
    ]
  },
  // Emotions Lesson
  {
    id: 'emotions-feelings',
    title: 'Emotions & Feelings',
    slug: 'emotions-feelings',
    description: 'Express emotions and feelings clearly in ASL conversations.',
    level: 'Intermediate',
    category: 'Emotions',
    duration_minutes: 35,
    signs_count: 12,
    learning_objectives: [
      'Sign basic emotions (happy, sad, angry, excited)',
      'Express complex feelings (frustrated, confused, proud)',
      'Understand facial expressions in ASL',
      'Practice emotional storytelling'
    ],
    signs: [
      {
        letter_or_word: 'Happy',
        description: 'Brush your chest upward with both hands alternately, showing joy.',
        difficulty: 'Easy',
        tips: ['Use both hands', 'Upward brushing motion', 'Show happy facial expression'],
        common_mistakes: ['Using only one hand', 'Wrong direction of movement']
      },
      {
        letter_or_word: 'Sad',
        description: 'Draw your hands down your face as if tears are falling.',
        difficulty: 'Easy',
        tips: ['Start at eyes', 'Move hands downward', 'Show sad facial expression'],
        common_mistakes: ['Starting too high', 'Not showing appropriate expression']
      }
    ]
  },
  // Time Lesson
  {
    id: 'time-concepts',
    title: 'Time & Scheduling',
    slug: 'time-concepts',
    description: 'Master time-related signs for scheduling and temporal concepts.',
    level: 'Intermediate',
    category: 'Time',
    duration_minutes: 50,
    signs_count: 18,
    learning_objectives: [
      'Sign days of the week',
      'Express time concepts (now, later, before, after)',
      'Learn clock time and scheduling',
      'Practice time-related conversations'
    ],
    signs: [
      {
        letter_or_word: 'Today',
        description: 'Sign NOW and DAY together in a compound sign.',
        difficulty: 'Medium',
        tips: ['Combine two separate signs', 'Smooth transition between signs'],
        common_mistakes: ['Pausing too long between signs', 'Wrong order']
      },
      {
        letter_or_word: 'Tomorrow',
        description: 'Touch your cheek with your thumb and move forward.',
        difficulty: 'Medium',
        tips: ['Use thumb on cheek', 'Forward motion indicates future'],
        common_mistakes: ['Using wrong finger', 'Backward motion']
      }
    ]
  },
  // Common Phrases Lesson
  {
    id: 'common-phrases',
    title: 'Common Phrases',
    slug: 'common-phrases',
    description: 'Essential phrases for everyday ASL communication and conversation.',
    level: 'Advanced',
    category: 'Common Phrases',
    duration_minutes: 60,
    signs_count: 25,
    learning_objectives: [
      'Master essential conversational phrases',
      'Learn question formation in ASL',
      'Practice polite expressions and social phrases',
      'Understand ASL grammar in phrases'
    ],
    signs: [
      {
        letter_or_word: 'How are you?',
        description: 'Combine HOW and YOU with appropriate facial expression.',
        difficulty: 'Medium',
        tips: ['Raise eyebrows for question', 'Clear transition between signs'],
        common_mistakes: ['Wrong facial expression', 'Signs too separated']
      },
      {
        letter_or_word: 'Nice to meet you',
        description: 'Combine NICE, MEET, and YOU in sequence.',
        difficulty: 'Hard',
        tips: ['Smooth flow between all three signs', 'Appropriate facial expression'],
        common_mistakes: ['Choppy transitions', 'Wrong sign order']
      }
    ]
  }
];

// Comprehensive mock signs data
export const mockSigns: Sign[] = [
  // Alphabet Signs
  {
    id: 'sign-a',
    word: 'A',
    letter: 'A',
    category: 'Alphabet',
    difficulty: 'Easy',
    description: 'The first letter of the ASL alphabet, formed with a closed fist and thumb to the side.',
    instructions: 'Make a fist with your dominant hand. Place your thumb against the side of your index finger, not on top. Keep your hand steady and at chest level.',
    image_url: getSignImageUrl('A', 'A'),
    hand_shape: 'Closed fist with thumb to side',
    movement: 'Static',
    location: 'Neutral space',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['alphabet', 'fingerspelling', 'basic'],
    synonyms: [],
    tips: [
      'Keep your thumb pressed firmly against your fingers',
      'Don\'t let your thumb stick out too far',
      'Hold your hand steady and clear'
    ],
    common_mistakes: [
      'Thumb sticking out too far from the fist',
      'Fingers not fully closed',
      'Hand position too high or too low'
    ],
    usage_examples: [
      'Spelling out names that start with A',
      'Used in fingerspelling practice',
      'Part of the ASL alphabet song'
    ],
    frequency_score: 95
  },
  {
    id: 'sign-hello',
    word: 'Hello',
    category: 'Greetings',
    difficulty: 'Easy',
    description: 'A friendly greeting sign used to say hello or hi to someone.',
    instructions: 'Start with your hand near your forehead, fingers together. Move your hand forward in a small wave motion while maintaining eye contact.',
    image_url: getSignImageUrl('hello'),
    hand_shape: 'Flat hand',
    movement: 'Forward wave',
    location: 'Forehead area',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['greeting', 'polite', 'social'],
    synonyms: ['Hi', 'Hey'],
    tips: [
      'Start near your temple area',
      'Use a gentle forward motion',
      'Maintain eye contact while signing',
      'Show a friendly facial expression'
    ],
    common_mistakes: [
      'Starting too high on the forehead',
      'Making the motion too exaggerated',
      'Not maintaining eye contact'
    ],
    usage_examples: [
      'Greeting someone when you first see them',
      'Starting a conversation',
      'Acknowledging someone from a distance'
    ],
    frequency_score: 98
  },
  {
    id: 'sign-thank-you',
    word: 'Thank You',
    category: 'Greetings',
    difficulty: 'Easy',
    description: 'An essential polite expression to show gratitude and appreciation.',
    instructions: 'Touch your chin with your fingertips, then move your hand forward toward the person you\'re thanking. Show genuine appreciation in your facial expression.',
    image_url: getSignImageUrl('thank_you'),
    hand_shape: 'Flat hand',
    movement: 'Forward from chin',
    location: 'Chin to forward',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['polite', 'gratitude', 'social'],
    synonyms: ['Thanks'],
    tips: [
      'Start at your chin with fingertips',
      'Move hand toward the person you\'re thanking',
      'Show genuine appreciation in your expression',
      'Can be done with both hands for emphasis'
    ],
    common_mistakes: [
      'Starting at the wrong location on face',
      'Not directing the sign toward the person',
      'Lack of appropriate facial expression'
    ],
    usage_examples: [
      'After someone helps you',
      'When receiving a gift',
      'Showing appreciation for someone\'s time'
    ],
    frequency_score: 96
  },
  {
    id: 'sign-mother',
    word: 'Mother',
    category: 'Family',
    difficulty: 'Easy',
    description: 'The sign for mother, an important family relationship term.',
    instructions: 'Touch your thumb to your chin with your fingers spread naturally. Move your hand slightly forward. This sign can also mean "mom" or "mama".',
    image_url: getSignImageUrl('mother'),
    hand_shape: 'Open hand, thumb extended',
    movement: 'Slight forward motion',
    location: 'Chin',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['family', 'parent', 'relationship'],
    synonyms: ['Mom', 'Mama'],
    tips: [
      'Use your dominant hand',
      'Touch chin gently with thumb',
      'Let fingers spread naturally',
      'Small forward movement'
    ],
    common_mistakes: [
      'Using fingertips instead of thumb',
      'Too much movement',
      'Confusing with father sign'
    ],
    usage_examples: [
      'Talking about your mother',
      'Introducing family members',
      'Discussing family relationships'
    ],
    frequency_score: 88
  },
  {
    id: 'sign-father',
    word: 'Father',
    category: 'Family',
    difficulty: 'Easy',
    description: 'The sign for father, complementing the mother sign for family discussions.',
    instructions: 'Touch your thumb to your forehead with your fingers spread naturally. Move your hand slightly forward. Similar to mother but at the forehead.',
    image_url: getSignImageUrl('father'),
    hand_shape: 'Open hand, thumb extended',
    movement: 'Slight forward motion',
    location: 'Forehead',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['family', 'parent', 'relationship'],
    synonyms: ['Dad', 'Papa'],
    tips: [
      'Similar to mother sign but at forehead',
      'Use thumb, not fingertips',
      'Natural finger spread',
      'Gentle forward motion'
    ],
    common_mistakes: [
      'Confusing location with mother sign',
      'Using wrong part of hand',
      'Too exaggerated movement'
    ],
    usage_examples: [
      'Talking about your father',
      'Family introductions',
      'Describing family structure'
    ],
    frequency_score: 87
  },
  {
    id: 'sign-dog',
    word: 'Dog',
    category: 'Animals',
    difficulty: 'Easy',
    description: 'The sign for dog, representing man\'s best friend.',
    instructions: 'Pat your leg twice with a flat hand, as if you\'re calling a dog to come to you. This mimics the natural gesture of calling a pet.',
    image_url: getSignImageUrl('dog'),
    hand_shape: 'Flat hand',
    movement: 'Patting motion',
    location: 'Thigh/leg',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['animal', 'pet', 'domestic'],
    synonyms: ['Puppy', 'Canine'],
    tips: [
      'Use flat hand for patting',
      'Pat your thigh area',
      'Two clear, distinct pats',
      'Natural calling motion'
    ],
    common_mistakes: [
      'Patting too high or too low on leg',
      'Using wrong hand shape',
      'Only one pat instead of two'
    ],
    usage_examples: [
      'Talking about pets',
      'Describing animals you see',
      'Discussing pet care'
    ],
    frequency_score: 82
  },
  {
    id: 'sign-cat',
    word: 'Cat',
    category: 'Animals',
    difficulty: 'Easy',
    description: 'The sign for cat, representing our feline friends.',
    instructions: 'Pinch your cheek gently with your thumb and index finger, then pull outward twice. This represents a cat\'s whiskers.',
    image_url: getSignImageUrl('cat'),
    hand_shape: 'Pinching fingers',
    movement: 'Outward pulling',
    location: 'Cheek',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['animal', 'pet', 'domestic'],
    synonyms: ['Kitten', 'Feline'],
    tips: [
      'Use thumb and index finger',
      'Gentle pinching motion',
      'Pull outward from cheek',
      'Represents whiskers'
    ],
    common_mistakes: [
      'Pinching too hard',
      'Wrong location on face',
      'Not pulling outward'
    ],
    usage_examples: [
      'Describing pets',
      'Talking about animals',
      'Pet-related conversations'
    ],
    frequency_score: 79
  },
  {
    id: 'sign-red',
    word: 'Red',
    category: 'Colors',
    difficulty: 'Easy',
    description: 'The sign for the color red, one of the primary colors.',
    instructions: 'Touch your lips lightly with the tip of your index finger, then pull down slightly. The red color is associated with lips.',
    image_url: getSignImageUrl('red'),
    hand_shape: 'Index finger extended',
    movement: 'Downward from lips',
    location: 'Lips',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['color', 'primary', 'description'],
    synonyms: ['Crimson', 'Scarlet'],
    tips: [
      'Use just the tip of index finger',
      'Light touch on lips',
      'Small downward motion',
      'Think of red lips'
    ],
    common_mistakes: [
      'Using whole hand instead of finger',
      'Too much pressure on lips',
      'Wrong direction of movement'
    ],
    usage_examples: [
      'Describing object colors',
      'Talking about clothing',
      'Color identification games'
    ],
    frequency_score: 75
  },
  {
    id: 'sign-blue',
    word: 'Blue',
    category: 'Colors',
    difficulty: 'Easy',
    description: 'The sign for the color blue, a primary color.',
    instructions: 'Make the letter B handshape and shake it slightly from side to side. The B represents the first letter of blue.',
    image_url: getSignImageUrl('blue'),
    hand_shape: 'B handshape',
    movement: 'Side to side shake',
    location: 'Neutral space',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['color', 'primary', 'description'],
    synonyms: ['Navy', 'Azure'],
    tips: [
      'Form clear B handshape',
      'Small side-to-side motion',
      'Keep wrist stable',
      'Don\'t over-shake'
    ],
    common_mistakes: [
      'Wrong handshape formation',
      'Too much movement',
      'Shaking entire arm instead of hand'
    ],
    usage_examples: [
      'Describing sky or water',
      'Talking about favorite colors',
      'Color-based descriptions'
    ],
    frequency_score: 73
  },
  {
    id: 'sign-eat',
    word: 'Eat',
    category: 'Actions',
    difficulty: 'Easy',
    description: 'The sign for eating, a basic daily action.',
    instructions: 'Bring your fingertips together and move them toward your mouth, as if you\'re putting food in your mouth. This mimics the natural eating motion.',
    image_url: getSignImageUrl('eat'),
    hand_shape: 'Fingertips together',
    movement: 'Toward mouth',
    location: 'Mouth area',
    two_handed: false,
    dominant_hand: 'Right',
    tags: ['action', 'daily', 'food'],
    synonyms: ['Consume', 'Dine'],
    tips: [
      'Use all fingertips together',
      'Natural eating motion',
      'Move toward mouth',
      'Can repeat for emphasis'
    ],
    common_mistakes: [
      'Using wrong fingers',
      'Exaggerated motion',
      'Not directing toward mouth'
    ],
    usage_examples: [
      'Talking about meals',
      'Describing daily routines',
      'Food-related conversations'
    ],
    frequency_score: 91
  },
  {
    id: 'sign-happy',
    word: 'Happy',
    category: 'Emotions',
    difficulty: 'Easy',
    description: 'The sign for happiness, expressing joy and positive emotions.',
    instructions: 'Brush your chest upward with both hands alternately, showing the feeling of joy rising up. Your facial expression should match the emotion.',
    image_url: getSignImageUrl('happy'),
    hand_shape: 'Flat hands',
    movement: 'Upward brushing',
    location: 'Chest',
    two_handed: true,
    dominant_hand: 'Both',
    tags: ['emotion', 'positive', 'feeling'],
    synonyms: ['Joyful', 'Glad', 'Cheerful'],
    tips: [
      'Use both hands alternately',
      'Upward brushing motion',
      'Show happy facial expression',
      'Feel the emotion while signing'
    ],
    common_mistakes: [
      'Using only one hand',
      'Wrong direction of movement',
      'Not showing appropriate expression'
    ],
    usage_examples: [
      'Expressing your feelings',
      'Describing emotional states',
      'Responding to good news'
    ],
    frequency_score: 89
  },
  {
    id: 'sign-today',
    word: 'Today',
    category: 'Time',
    difficulty: 'Medium',
    description: 'The sign for today, combining the concepts of now and day.',
    instructions: 'This is a compound sign combining NOW and DAY. Sign NOW (hands down with slight bounce) then DAY (sun arc motion).',
    image_url: getSignImageUrl('today'),
    hand_shape: 'Various for compound',
    movement: 'Compound motion',
    location: 'Multiple positions',
    two_handed: true,
    dominant_hand: 'Both',
    tags: ['time', 'present', 'day'],
    synonyms: ['This day'],
    tips: [
      'Combine two separate signs smoothly',
      'NOW first, then DAY',
      'Practice each part separately first',
      'Smooth transition between signs'
    ],
    common_mistakes: [
      'Pausing too long between signs',
      'Wrong order of signs',
      'Not forming compound properly'
    ],
    usage_examples: [
      'Talking about current day',
      'Making plans for today',
      'Time-related discussions'
    ],
    frequency_score: 94
  }
];

// Mock API functions that simulate the real API
export const getMockLessons = async (params?: {
  level?: string;
  category?: string;
  page?: number;
  page_size?: number;
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredLessons = [...mockLessons];
  
  if (params?.level && params.level !== 'all') {
    filteredLessons = filteredLessons.filter(lesson => lesson.level === params.level);
  }
  
  if (params?.category && params.category !== 'all') {
    filteredLessons = filteredLessons.filter(lesson => lesson.category === params.category);
  }
  
  return {
    success: true,
    lessons: filteredLessons,
    total: filteredLessons.length,
    page: params?.page || 1,
    page_size: params?.page_size || 50
  };
};

export const getMockLesson = async (slug: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lesson = mockLessons.find(l => l.slug === slug);
  
  if (lesson) {
    return {
      success: true,
      lesson
    };
  } else {
    return {
      success: false,
      error: 'Lesson not found'
    };
  }
};

export const searchMockSigns = async (params?: {
  q?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  page_size?: number;
}) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let filteredSigns = [...mockSigns];
  
  if (params?.q) {
    const query = params.q.toLowerCase();
    filteredSigns = filteredSigns.filter(sign => 
      sign.word.toLowerCase().includes(query) ||
      sign.description.toLowerCase().includes(query) ||
      sign.tags.some(tag => tag.toLowerCase().includes(query)) ||
      sign.synonyms.some(synonym => synonym.toLowerCase().includes(query))
    );
  }
  
  if (params?.category && params.category !== 'all') {
    filteredSigns = filteredSigns.filter(sign => sign.category === params.category);
  }
  
  if (params?.difficulty && params.difficulty !== 'all') {
    filteredSigns = filteredSigns.filter(sign => sign.difficulty === params.difficulty);
  }
  
  return {
    success: true,
    signs: filteredSigns,
    total: filteredSigns.length,
    page: params?.page || 1,
    page_size: params?.page_size || 20
  };
};

export const getMockSign = async (id: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sign = mockSigns.find(s => s.id === id);
  
  if (sign) {
    return {
      success: true,
      sign
    };
  } else {
    return {
      success: false,
      error: 'Sign not found'
    };
  }
};