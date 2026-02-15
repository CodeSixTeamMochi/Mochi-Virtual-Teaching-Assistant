export type WordCategory = 
  | 'ANIMALS' | 'FRUIT' | 'VEGETABLES' | 'COLORS' 
  | 'NUMBERS' | 'OBJECTS' | 'ACTIONS' | 'BODY' | 'NATURE';

export interface WordData {
  word: string;
  phonemes: string[];
  targetSound: string; // The critical sound Mochi monitors
  difficulty: 1 | 2 | 3;
  category: WordCategory;
}

export const PHONETIC_DICTIONARY: Record<string, WordData> = {

    // THE "V" vs "W" CONFUSION //

    "van": { word: "van", phonemes: ["v", "ae", "n"], targetSound: "v", difficulty: 1, category: "OBJECTS" },
    "vase": { word: "vase", phonemes: ["v", "aa", "z"], targetSound: "v", difficulty: 2, category: "OBJECTS" },
    "violin": { word: "violin", phonemes: ["v", "ie", "u", "l", "i", "n"], targetSound: "v", difficulty: 3, category: "OBJECTS" },
    "vest": { word: "vest", phonemes: ["v", "eh", "s", "t"], targetSound: "v", difficulty: 1, category: "OBJECTS" },
    "vegetable": { word: "vegetable", phonemes: ["v", "eh", "j", "t", "u", "b", "l"], targetSound: "v", difficulty: 3, category: "VEGETABLES" },
    "volcano": { word: "volcano", phonemes: ["v", "o", "l", "k", "ae", "n", "oe"], targetSound: "v", difficulty: 3, category: "NATURE" },
    "vacuum": { word: "vacuum", phonemes: ["v", "ae", "k", "y", "oo", "m"], targetSound: "v", difficulty: 3, category: "OBJECTS" },
    "village": { word: "village", phonemes: ["v", "i", "l", "i", "j"], targetSound: "v", difficulty: 2, category: "NATURE" },
    "voice": { word: "voice", phonemes: ["v", "oy", "s"], targetSound: "v", difficulty: 2, category: "BODY" },

    "water": { word: "water", phonemes: ["w", "aw", "t", "er"], targetSound: "w", difficulty: 1, category: "NATURE" },
    "window": { word: "window", phonemes: ["w", "i", "n", "d", "oe"], targetSound: "w", difficulty: 1, category: "OBJECTS" },
    "whale": { word: "whale", phonemes: ["w", "ae", "l"], targetSound: "w", difficulty: 2, category: "ANIMALS" },
    "wolf": { word: "wolf", phonemes: ["w", "uu", "l", "f"], targetSound: "w", difficulty: 2, category: "ANIMALS" },
    "worm": { word: "worm", phonemes: ["w", "er", "m"], targetSound: "w", difficulty: 1, category: "ANIMALS" },
    "watch": { word: "watch", phonemes: ["w", "o", "ch"], targetSound: "w", difficulty: 2, category: "OBJECTS" },
    "web": { word: "web", phonemes: ["w", "eh", "b"], targetSound: "w", difficulty: 1, category: "NATURE" },
    "wet": { word: "wet", phonemes: ["w", "eh", "t"], targetSound: "w", difficulty: 1, category: "ACTIONS" },
    "wagon": { word: "wagon", phonemes: ["w", "ae", "g", "u", "n"], targetSound: "w", difficulty: 2, category: "OBJECTS" },

    // THE "TH" SOUND //

    "three": { word: "three", phonemes: ["th", "r", "ee"], targetSound: "th", difficulty: 2, category: "NUMBERS" },
    "thirteen": { word: "thirteen", phonemes: ["th", "er", "t", "ee", "n"], targetSound: "th", difficulty: 3, category: "NUMBERS" },
    "thirty": { word: "thirty", phonemes: ["th", "er", "t", "ee"], targetSound: "th", difficulty: 3, category: "NUMBERS" },
    "thumb": { word: "thumb", phonemes: ["th", "u", "m"], targetSound: "th", difficulty: 2, category: "BODY" },
    "teeth": { word: "teeth", phonemes: ["t", "ee", "th"], targetSound: "th", difficulty: 2, category: "BODY" },
    "mouth": { word: "mouth", phonemes: ["m", "ow", "th"], targetSound: "th", difficulty: 2, category: "BODY" },
    "thank": { word: "thank", phonemes: ["th", "ae", "ng", "k"], targetSound: "th", difficulty: 1, category: "ACTIONS" },
    "thin": { word: "thin", phonemes: ["th", "i", "n"], targetSound: "th", difficulty: 2, category: "ACTIONS" },
    "bath": { word: "bath", phonemes: ["b", "ae", "th"], targetSound: "th", difficulty: 1, category: "OBJECTS" },
    "moth": { word: "moth", phonemes: ["m", "aw", "th"], targetSound: "th", difficulty: 2, category: "ANIMALS" },
    "earth": { word: "earth", phonemes: ["er", "th"], targetSound: "th", difficulty: 2, category: "NATURE" },
    "north": { word: "north", phonemes: ["n", "or", "th"], targetSound: "th", difficulty: 2, category: "NATURE" },

    // "S" BLENDS & EPENTHESIS //

    "school": { word: "school", phonemes: ["s", "k", "oo", "l"], targetSound: "sc", difficulty: 2, category: "OBJECTS" },
    "star": { word: "star", phonemes: ["s", "t", "ar"], targetSound: "st", difficulty: 1, category: "NATURE" },
    "spoon": { word: "spoon", phonemes: ["s", "p", "oo", "n"], targetSound: "sp", difficulty: 1, category: "OBJECTS" },
    "spider": { word: "spider", phonemes: ["s", "p", "ie", "d", "er"], targetSound: "sp", difficulty: 2, category: "ANIMALS" },
    "snake": { word: "snake", phonemes: ["s", "n", "ae", "k"], targetSound: "sn", difficulty: 1, category: "ANIMALS" },
    "snail": { word: "snail", phonemes: ["s", "n", "ae", "l"], targetSound: "sn", difficulty: 2, category: "ANIMALS" },
    "slide": { word: "slide", phonemes: ["s", "l", "ie", "d"], targetSound: "sl", difficulty: 2, category: "OBJECTS" },
    "sleep": { word: "sleep", phonemes: ["s", "l", "ee", "p"], targetSound: "sl", difficulty: 1, category: "ACTIONS" },
    "sky": { word: "sky", phonemes: ["s", "k", "ie"], targetSound: "sk", difficulty: 1, category: "NATURE" },
    "skirt": { word: "skirt", phonemes: ["s", "k", "er", "t"], targetSound: "sk", difficulty: 2, category: "OBJECTS" },
    "smile": { word: "smile", phonemes: ["s", "m", "ie", "l"], targetSound: "sm", difficulty: 1, category: "ACTIONS" },
    "smoke": { word: "smoke", phonemes: ["s", "m", "oe", "k"], targetSound: "sm", difficulty: 2, category: "NATURE" },
    "stop": { word: "stop", phonemes: ["s", "t", "o", "p"], targetSound: "st", difficulty: 1, category: "ACTIONS" },
    "stone": { word: "stone", phonemes: ["s", "t", "oe", "n"], targetSound: "st", difficulty: 2, category: "NATURE" },
    "swim": { word: "swim", phonemes: ["s", "w", "i", "m"], targetSound: "sw", difficulty: 1, category: "ACTIONS" },
    "sweet": { word: "sweet", phonemes: ["s", "w", "ee", "t"], targetSound: "sw", difficulty: 2, category: "FRUIT" },

    // "SH" vs "S" // 

    "sheep": { word: "sheep", phonemes: ["sh", "ee", "p"], targetSound: "sh", difficulty: 2, category: "ANIMALS" },
    "ship": { word: "ship", phonemes: ["sh", "i", "p"], targetSound: "sh", difficulty: 2, category: "OBJECTS" },
    "shoe": { word: "shoe", phonemes: ["sh", "oo"], targetSound: "sh", difficulty: 1, category: "OBJECTS" },
    "shirt": { word: "shirt", phonemes: ["sh", "er", "t"], targetSound: "sh", difficulty: 2, category: "OBJECTS" },
    "shark": { word: "shark", phonemes: ["sh", "ar", "k"], targetSound: "sh", difficulty: 2, category: "ANIMALS" },
    "shell": { word: "shell", phonemes: ["sh", "eh", "l"], targetSound: "sh", difficulty: 2, category: "NATURE" },
    "fish": { word: "fish", phonemes: ["f", "i", "sh"], targetSound: "sh", difficulty: 1, category: "ANIMALS" },
    "dish": { word: "dish", phonemes: ["d", "i", "sh"], targetSound: "sh", difficulty: 1, category: "OBJECTS" },
    "brush": { word: "brush", phonemes: ["b", "r", "u", "sh"], targetSound: "sh", difficulty: 2, category: "OBJECTS" },
    "wash": { word: "wash", phonemes: ["w", "o", "sh"], targetSound: "sh", difficulty: 1, category: "ACTIONS" },

    // THE "F" SOUND (Sometimes 'P') //

    "fan": { word: "fan", phonemes: ["f", "ae", "n"], targetSound: "f", difficulty: 1, category: "OBJECTS" },
    "face": { word: "face", phonemes: ["f", "ae", "s"], targetSound: "f", difficulty: 1, category: "BODY" },
    "five": { word: "five", phonemes: ["f", "ie", "v"], targetSound: "f", difficulty: 1, category: "NUMBERS" },
    "four": { word: "four", phonemes: ["f", "or"], targetSound: "f", difficulty: 1, category: "NUMBERS" },
    "flower": { word: "flower", phonemes: ["f", "l", "ow", "er"], targetSound: "fl", difficulty: 2, category: "NATURE" },
    "fly": { word: "fly", phonemes: ["f", "l", "ie"], targetSound: "fl", difficulty: 1, category: "ACTIONS" },
    "fox": { word: "fox", phonemes: ["f", "o", "k", "s"], targetSound: "f", difficulty: 1, category: "ANIMALS" },
    "fruit": { word: "fruit", phonemes: ["f", "r", "oo", "t"], targetSound: "fr", difficulty: 2, category: "FRUIT" },
    "frog": { word: "frog", phonemes: ["f", "r", "o", "g"], targetSound: "fr", difficulty: 2, category: "ANIMALS" },

    // "L" vs "R" //

    "rabbit": { word: "rabbit", phonemes: ["r", "ae", "b", "i", "t"], targetSound: "r", difficulty: 2, category: "ANIMALS" },
    "red": { word: "red", phonemes: ["r", "eh", "d"], targetSound: "r", difficulty: 1, category: "COLORS" },
    "run": { word: "run", phonemes: ["r", "u", "n"], targetSound: "r", difficulty: 1, category: "ACTIONS" },
    "rain": { word: "rain", phonemes: ["r", "ae", "n"], targetSound: "r", difficulty: 1, category: "NATURE" },
    "robot": { word: "robot", phonemes: ["r", "oe", "b", "o", "t"], targetSound: "r", difficulty: 2, category: "OBJECTS" },
    "rocket": { word: "rocket", phonemes: ["r", "o", "k", "i", "t"], targetSound: "r", difficulty: 2, category: "OBJECTS" },
    "lion": { word: "lion", phonemes: ["l", "ie", "u", "n"], targetSound: "l", difficulty: 2, category: "ANIMALS" },
    "leaf": { word: "leaf", phonemes: ["l", "ee", "f"], targetSound: "l", difficulty: 1, category: "NATURE" },
    "leg": { word: "leg", phonemes: ["l", "eh", "g"], targetSound: "l", difficulty: 1, category: "BODY" },
    "lemon": { word: "lemon", phonemes: ["l", "eh", "m", "u", "n"], targetSound: "l", difficulty: 2, category: "FRUIT" },
    "lamp": { word: "lamp", phonemes: ["l", "ae", "m", "p"], targetSound: "l", difficulty: 1, category: "OBJECTS" },

    // CONSONANT CLUSTERS (Bl, Cl, Gr, Tr) //

    "blue": { word: "blue", phonemes: ["b", "l", "ue"], targetSound: "bl", difficulty: 2, category: "COLORS" },
    "black": { word: "black", phonemes: ["b", "l", "ae", "k"], targetSound: "bl", difficulty: 2, category: "COLORS" },
    "block": { word: "block", phonemes: ["b", "l", "o", "k"], targetSound: "bl", difficulty: 2, category: "OBJECTS" },
    "clock": { word: "clock", phonemes: ["k", "l", "o", "k"], targetSound: "cl", difficulty: 2, category: "OBJECTS" },
    "clean": { word: "clean", phonemes: ["k", "l", "ee", "n"], targetSound: "cl", difficulty: 2, category: "ACTIONS" },
    "cloud": { word: "cloud", phonemes: ["k", "l", "ow", "d"], targetSound: "cl", difficulty: 2, category: "NATURE" },
    "green": { word: "green", phonemes: ["g", "r", "ee", "n"], targetSound: "gr", difficulty: 2, category: "COLORS" },
    "grass": { word: "grass", phonemes: ["g", "r", "ae", "s"], targetSound: "gr", difficulty: 2, category: "NATURE" },
    "grape": { word: "grape", phonemes: ["g", "r", "ae", "p"], targetSound: "gr", difficulty: 2, category: "FRUIT" },
    "tree": { word: "tree", phonemes: ["t", "r", "ee"], targetSound: "tr", difficulty: 2, category: "NATURE" },
    "truck": { word: "truck", phonemes: ["t", "r", "u", "k"], targetSound: "tr", difficulty: 2, category: "OBJECTS" },
    "train": { word: "train", phonemes: ["t", "r", "ae", "n"], targetSound: "tr", difficulty: 2, category: "OBJECTS" },

    // FINAL CONSONANTS (Ending Sounds) //

    "cat": { word: "cat", phonemes: ["k", "ae", "t"], targetSound: "t", difficulty: 1, category: "ANIMALS" },
    "bat": { word: "bat", phonemes: ["b", "ae", "t"], targetSound: "t", difficulty: 1, category: "ANIMALS" },
    "hat": { word: "hat", phonemes: ["h", "ae", "t"], targetSound: "t", difficulty: 1, category: "OBJECTS" },
    "dog": { word: "dog", phonemes: ["d", "o", "g"], targetSound: "g", difficulty: 1, category: "ANIMALS" },
    "pig": { word: "pig", phonemes: ["p", "i", "g"], targetSound: "g", difficulty: 1, category: "ANIMALS" },
    "egg": { word: "egg", phonemes: ["eh", "g"], targetSound: "g", difficulty: 1, category: "FRUIT" },
    "book": { word: "book", phonemes: ["b", "uu", "k"], targetSound: "k", difficulty: 1, category: "OBJECTS" },
    "duck": { word: "duck", phonemes: ["d", "u", "k"], targetSound: "k", difficulty: 1, category: "ANIMALS" },
    "cake": { word: "cake", phonemes: ["k", "ae", "k"], targetSound: "k", difficulty: 1, category: "FRUIT" },

    // BASIC VOCABULARY (Fillers) // 

    "apple": { word: "apple", phonemes: ["ae", "p", "l"], targetSound: "ae", difficulty: 1, category: "FRUIT" },
    "banana": { word: "banana", phonemes: ["b", "uh", "n", "ae", "n", "uh"], targetSound: "b", difficulty: 2, category: "FRUIT" },
    "orange": { word: "orange", phonemes: ["o", "r", "i", "n", "j"], targetSound: "j", difficulty: 3, category: "FRUIT" },
    "ball": { word: "ball", phonemes: ["b", "aw", "l"], targetSound: "l", difficulty: 1, category: "OBJECTS" },
    "car": { word: "car", phonemes: ["k", "ar"], targetSound: "k", difficulty: 1, category: "OBJECTS" },
    "sun": { word: "sun", phonemes: ["s", "u", "n"], targetSound: "s", difficulty: 1, category: "NATURE" },
    "moon": { word: "moon", phonemes: ["m", "oo", "n"], targetSound: "m", difficulty: 1, category: "NATURE" },
    "nose": { word: "nose", phonemes: ["n", "oe", "z"], targetSound: "z", difficulty: 1, category: "BODY" },
    "hand": { word: "hand", phonemes: ["h", "ae", "n", "d"], targetSound: "d", difficulty: 1, category: "BODY" },


};

export const getPhoneticBreakdown = (word: string): WordData | null => {
    const normalized = word.toLowerCase().trim();

    if (PHONETIC_DICTIONARY[normalized]) return PHONETIC_DICTIONARY[normalized];

    if (normalized.endsWith('s')) {
     const singular = normalized.slice(0, -1);
     if (PHONETIC_DICTIONARY[singular]) return PHONETIC_DICTIONARY[singular];
  }

  return null;

};