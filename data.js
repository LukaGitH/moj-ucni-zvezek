// Podatkovna zbirka za aplikacijo "Moj učni zvezek"

const SLOVENSCINA_DATA = {
  // Besede za črkovanje, vstavljanje črk in zlogovanje
  words: [
    { word: "AVTO", emoji: "🚗", missingIndex: 1, missingChar: "V", choices: ["V", "A", "U"], syllables: 2 }, // av-to
    { word: "MACA", emoji: "🐱", missingIndex: 2, missingChar: "C", choices: ["C", "S", "Z"], syllables: 2 }, // ma-ca
    { word: "PES", emoji: "🐶", missingIndex: 1, missingChar: "E", choices: ["E", "A", "I"], syllables: 1 },  // pes
    { word: "HIŠA", emoji: "🏠", missingIndex: 2, missingChar: "Š", choices: ["Š", "S", "Ž"], syllables: 2 }, // hi-ša
    { word: "ŽOGA", emoji: "⚽", missingIndex: 0, missingChar: "Ž", choices: ["Ž", "Š", "Z"], syllables: 2 }, // žo-ga
    { word: "SONCE", emoji: "☀️", missingIndex: 3, missingChar: "C", choices: ["C", "Č", "S"], syllables: 2 }, // son-ce
    { word: "LUNA", emoji: "🌙", missingIndex: 1, missingChar: "U", choices: ["U", "O", "A"], syllables: 2 }, // lu-na
    { word: "URA", emoji: "⏰", missingIndex: 0, missingChar: "U", choices: ["U", "O", "V"], syllables: 2 },  // u-ra
    { word: "UHO", emoji: "👂", missingIndex: 1, missingChar: "H", choices: ["H", "N", "M"], syllables: 2 }, // u-ho
    { word: "ZAJEC", emoji: "🐰", missingIndex: 3, missingChar: "E", choices: ["E", "A", "I"], syllables: 2 }, // za-jec
    { word: "ROŽA", emoji: "🌹", missingIndex: 1, missingChar: "O", choices: ["O", "U", "A"], syllables: 2 }, // ro-ža
    { word: "RIBA", emoji: "🐟", missingIndex: 3, missingChar: "A", choices: ["A", "E", "O"], syllables: 2 }, // ri-ba
    { word: "BANANA", emoji: "🍌", missingIndex: 2, missingChar: "N", choices: ["N", "M", "L"], syllables: 3 }, // ba-na-na
    { word: "DINOZAVER", emoji: "🦖", missingIndex: 5, missingChar: "A", choices: ["A", "E", "O"], syllables: 4 }, // di-no-za-ver
    { word: "METULJ", emoji: "🦋", missingIndex: 3, missingChar: "U", choices: ["U", "O", "I"], syllables: 2 }, // me-tulj
    { word: "STOL", emoji: "🪑", missingIndex: 1, missingChar: "T", choices: ["T", "D", "P"], syllables: 1 }, // stol
    { word: "KAPA", emoji: "🧢", missingIndex: 2, missingChar: "P", choices: ["P", "B", "T"], syllables: 2 }, // ka-pa
    { word: "KNJIGA", emoji: "📘", missingIndex: 1, missingChar: "N", choices: ["N", "M", "L"], syllables: 2 }, // knji-ga
    { word: "JABOLKO", emoji: "🍎", missingIndex: 2, missingChar: "B", choices: ["B", "P", "D"], syllables: 3 }, // ja-bol-ko
    { word: "ČEBELA", emoji: "🐝", missingIndex: 0, missingChar: "Č", choices: ["Č", "C", "Š"], syllables: 3 }, // če-be-la
    { word: "DREVO", emoji: "🌳", missingIndex: 3, missingChar: "V", choices: ["V", "U", "R"], syllables: 2 }, // dre-vo
    { word: "KLOBUK", emoji: "👒", missingIndex: 1, missingChar: "L", choices: ["L", "R", "J"], syllables: 2 } // klo-buk
  ],

  // Pari za povezovanje sopomenk
  synonyms: [
    { word1: "PREPROGA", word2: "TEPIH" },
    { word1: "AVTO", word2: "AVTOMOBIL" },
    { word1: "DEKLICA", word2: "PUNČKA" },
    { word1: "FANT", word2: "DEČEK" },
    { word1: "HIŠA", word2: "DOM" },
    { word1: "VELIK", word2: "OGROMEN" },
    { word1: "MAJHEN", word2: "DROBEN" },
    { word1: "HITER", word2: "BRZ" },
    { word1: "VESEL", word2: "RADOSTEN" },
    { word1: "LEP", word2: "ČEDEN" }
  ],

  // Pari slika-beseda po vzoru vaj "Kaj je na sliki? Poveži jih z besedami."
  pictureWords: [
    { word: "URA", emoji: "⌚" },
    { word: "PERO", emoji: "🪶" },
    { word: "KANU", emoji: "🛶" },
    { word: "MAČKA", emoji: "🐈‍⬛" },
    { word: "RACA", emoji: "🦆" },
    { word: "OVCA", emoji: "🐑" },
    { word: "VEVERICA", emoji: "🐿️" },
    { word: "NOČ", emoji: "🌙" },
    { word: "ČRV", emoji: "🪱" },
    { word: "VRČ", emoji: "🏺" },
    { word: "MEČA", emoji: "⚔️" },
    { word: "SIR", emoji: "🧀" },
    { word: "SOL", emoji: "🧂" },
    { word: "NOS", emoji: "👃" },
    { word: "SONCE", emoji: "☀️" },
    { word: "SRCE", emoji: "❤️" },
    { word: "JELEN", emoji: "🦌" },
    { word: "JABOLKO", emoji: "🍎" },
    { word: "ČEBELA", emoji: "🐝" },
    { word: "DREVO", emoji: "🌳" },
    { word: "KAPA", emoji: "🧢" },
    { word: "KNJIGA", emoji: "📘" },
    { word: "KLOBUK", emoji: "👒" }
  ],

  // Zlogi in povezovanje črk po vzoru "Poveži črke. Napiši zloge."
  syllablePairs: [
    { letters: "N U", syllable: "NU" },
    { letters: "M U", syllable: "MU" },
    { letters: "U M", syllable: "UM" },
    { letters: "R U", syllable: "RU" },
    { letters: "V U", syllable: "VU" },
    { letters: "C A", syllable: "CA" },
    { letters: "C U", syllable: "CU" },
    { letters: "C O", syllable: "CO" },
    { letters: "C E", syllable: "CE" },
    { letters: "Č E", syllable: "ČE" },
    { letters: "Č A", syllable: "ČA" },
    { letters: "Č O", syllable: "ČO" },
    { letters: "Č R", syllable: "ČR" },
    { letters: "B A", syllable: "BA" },
    { letters: "B E", syllable: "BE" },
    { letters: "L A", syllable: "LA" },
    { letters: "R I", syllable: "RI" },
    { letters: "S O", syllable: "SO" },
    { letters: "Š A", syllable: "ŠA" }
  ],

  // Naloge "Kaj je na sliki? Pravo besedo označi."
  wordChoices: [
    { emoji: "🌙", answer: "NOČ", choices: ["NOČ", "NIČ"] },
    { emoji: "🪱", answer: "ČRV", choices: ["ČRV", "ČAR"] },
    { emoji: "🏺", answer: "VRČ", choices: ["VREČA", "VRČ"] },
    { emoji: "⚔️", answer: "MEČA", choices: ["MEČ", "MEČA"] },
    { emoji: "👃", answer: "NOS", choices: ["NOS", "SOL"] },
    { emoji: "🧀", answer: "SIR", choices: ["SIR", "MIR"] },
    { emoji: "🦆", answer: "RACA", choices: ["RACA", "RAMA"] },
    { emoji: "🐑", answer: "OVCA", choices: ["OVCA", "OČI"] },
    { emoji: "🍎", answer: "JABOLKO", choices: ["JABOLKO", "JAGODA"] },
    { emoji: "🐝", answer: "ČEBELA", choices: ["ČEBELA", "ČEVELJ"] },
    { emoji: "🌳", answer: "DREVO", choices: ["DREVO", "DRVA"] },
    { emoji: "🧢", answer: "KAPA", choices: ["KAPA", "KAVA"] },
    { emoji: "📘", answer: "KNJIGA", choices: ["KNJIGA", "KLETKA"] }
  ],

  // Naloge "V besedah poišči in pobarvaj/označi črko."
  letterSearches: [
    { letter: "U", words: ["URA", "LUNA", "RUMENA", "UHAN", "UHO", "MIZA"], answers: ["URA", "LUNA", "RUMENA", "UHAN", "UHO"] },
    { letter: "C", words: ["CESTA", "CIRKUS", "PINGVIN", "JAJCE", "MIZA", "COPATI"], answers: ["CESTA", "CIRKUS", "JAJCE", "COPATI"] },
    { letter: "Č", words: ["ČAROVNICA", "NOČI", "KOTLU", "ČRNI", "METLO", "POT"], answers: ["ČAROVNICA", "NOČI", "ČRNI"] },
    { letter: "S", words: ["SLON", "ŠEL", "SMUČANJE", "SLALOM", "VSE", "SRNA", "SKRIJ", "SMUK"], answers: ["SLON", "SMUČANJE", "SLALOM", "VSE", "SRNA", "SKRIJ", "SMUK"] },
    { letter: "Ž", words: ["ŽOGA", "ROŽA", "ZIMA", "ŽABA", "MIZA", "NOŽ"], answers: ["ŽOGA", "ROŽA", "ŽABA", "NOŽ"] },
    { letter: "Š", words: ["ŠOLA", "MIŠ", "SOK", "KOŠ", "SONCE", "ŠAL"], answers: ["ŠOLA", "MIŠ", "KOŠ", "ŠAL"] },
    { letter: "R", words: ["RIBA", "URA", "MIZA", "ROKA", "LUNA", "DREVO"], answers: ["RIBA", "URA", "ROKA", "DREVO"] }
  ],

  // Naloge "Uredi besede v smiselno poved."
  sentenceOrders: [
    { sentence: ["MAMA", "KUHA", "JUHO"], image: "🥣" },
    { sentence: ["PES", "LOVI", "ŽOGO"], image: "⚽" },
    { sentence: ["DEKLICA", "BERE", "KNJIGO"], image: "📖" },
    { sentence: ["DEČEK", "PIJE", "SOK"], image: "🧃" },
    { sentence: ["MAČKA", "SPI", "NA", "PREPROGI"], image: "🐱" },
    { sentence: ["ČEBELA", "LETI", "NA", "CVET"], image: "🐝" },
    { sentence: ["OČE", "VOZI", "AVTO"], image: "🚗" },
    { sentence: ["PTICA", "SEDI", "NA", "DREVESU"], image: "🐦" },
    { sentence: ["OTROK", "NOSI", "KAPO"], image: "🧢" }
  ],

  // Pari po vzoru "Poveži začetek in konec povedi."
  sentencePairs: [
    { start: "Ko dežuje,", end: "vzamem dežnik." },
    { start: "Ko sem lačen,", end: "pojem malico." },
    { start: "Pred spanjem", end: "si umijem zobe." },
    { start: "Pozimi", end: "nosim kapo." },
    { start: "V šoli", end: "poslušam učiteljico." },
    { start: "Ko je noč,", end: "na nebu sveti luna." },
    { start: "Ko me zebe,", end: "oblečem jakno." },
    { start: "Pred kosilom", end: "si umijem roke." },
    { start: "Ko vidim prijatelja,", end: "ga pozdravim." }
  ],

  // Naloge "Kje slišiš glas?"
  sounds: [
    { word: "ZAJEC", letter: "C", emoji: "🐰", length: 5, targetIndex: 4 }, // Z-A-J-E-C
    { word: "CESTA", letter: "C", emoji: "🛣️", length: 5, targetIndex: 0 }, // C-E-S-T-A
    { word: "KOCKA", letter: "C", emoji: "🎲", length: 5, targetIndex: 2 }, // K-O-C-K-A
    { word: "ŽLICA", letter: "C", emoji: "🥄", length: 5, targetIndex: 3 }, // Ž-L-I-C-A
    { word: "COPATI", letter: "C", emoji: "🥿", length: 6, targetIndex: 0 }, // C-O-P-A-T-I
    { word: "LUNA", letter: "U", emoji: "🌙", length: 4, targetIndex: 1 },  // L-U-N-A
    { word: "URA", letter: "U", emoji: "⏰", length: 3, targetIndex: 0 },   // U-R-A
    { word: "UHO", letter: "U", emoji: "👂", length: 3, targetIndex: 0 },   // U-H-O
    { word: "RIBA", letter: "R", emoji: "🐟", length: 4, targetIndex: 0 },  // R-I-B-A
    { word: "ROŽA", letter: "Ž", emoji: "🌹", length: 4, targetIndex: 2 },  // R-O-Ž-A
    { word: "MIŠ", letter: "Š", emoji: "🐭", length: 3, targetIndex: 2 },   // M-I-Š
    { word: "KAPA", letter: "P", emoji: "🧢", length: 4, targetIndex: 2 }   // K-A-P-A
  ]
};

const MATEMATIKA_DATA = {
  // Naloge za računanje
  calculations: [
    { item1: 3, item2: 2, operation: "+", emoji: "🍎", answer: 5 },
    { item1: 5, item2: 4, operation: "+", emoji: "🍓", answer: 9 },
    { item1: 6, item2: 2, operation: "-", emoji: "🍌", answer: 4 },
    { item1: 7, item2: 3, operation: "-", emoji: "🥕", answer: 4 },
    { item1: 4, item2: 4, operation: "+", emoji: "🍒", answer: 8 },
    { item1: 8, item2: 5, operation: "-", emoji: "🍊", answer: 3 },
    { item1: 2, item2: 6, operation: "+", emoji: "🍇", answer: 8 },
    { item1: 10, item2: 4, operation: "-", emoji: "🍏", answer: 6 },
    { item1: 9, item2: 6, operation: "+", emoji: "🧱", answer: 15 },
    { item1: 12, item2: 3, operation: "+", emoji: "⭐", answer: 15 },
    { item1: 14, item2: 5, operation: "-", emoji: "🎈", answer: 9 },
    { item1: 16, item2: 4, operation: "-", emoji: "🍬", answer: 12 },
    { item1: 10, item2: 8, operation: "+", emoji: "🖍️", answer: 18 },
    { item1: 18, item2: 7, operation: "-", emoji: "🐝", answer: 11 }
  ],

  // Naloge za primerjanje količin
  comparisons: [
    { left: 6, right: 3, emoji: "🎈" },
    { left: 2, right: 5, emoji: "⭐" },
    { left: 4, right: 4, emoji: "🍭" },
    { left: 8, right: 9, emoji: "🦖" },
    { left: 7, right: 7, emoji: "🍩" },
    { left: 5, right: 1, emoji: "🍦" },
    { left: 3, right: 8, emoji: "🦋" },
    { left: 10, right: 6, emoji: "🍪" },
    { left: 12, right: 15, emoji: "🧱" },
    { left: 18, right: 13, emoji: "🖍️" },
    { left: 11, right: 11, emoji: "🍬" },
    { left: 16, right: 19, emoji: "⭐" }
  ],

  // Naloge za nadaljevanje vzorcev na gosenici
  patterns: [
    {
      sequence: ["🔴", "🔵", "🔴", "🔵"],
      choices: ["🔴", "🔵", "🟡"],
      answer: "🔴",
      description: "Izmenjavanje rdeče in modre."
    },
    {
      sequence: ["🟡", "🟡", "🟢", "🟡", "🟡"],
      choices: ["🟡", "🟢", "🟠"],
      answer: "🟢",
      description: "Dve rumeni, ena zelena."
    },
    {
      sequence: ["🍎", "🍐", "🍇", "🍎", "🍐"],
      choices: ["🍎", "🍐", "🍇"],
      answer: "🍇",
      description: "Jabolko, hruška, grozdje."
    },
    {
      sequence: ["1", "2", "3", "1", "2"],
      choices: ["1", "2", "3"],
      answer: "3",
      description: "Številke 1, 2, 3 se ponavljajo."
    },
    {
      sequence: ["2", "4", "6", "8"],
      choices: ["9", "10", "12"],
      answer: "10",
      description: "Štetje po 2."
    },
    {
      sequence: ["🔺", "🟦", "🔺", "🟦"],
      choices: ["🔺", "🟦", "🟡"],
      answer: "🔺",
      description: "Izmenjavanje trikotnika in kvadrata."
    },
    {
      sequence: ["🟢", "🟢", "🔴", "🟢", "🟢"],
      choices: ["🔴", "🟢", "🔵"],
      answer: "🔴",
      description: "Dve zeleni, ena rdeča."
    },
    {
      sequence: ["5", "6", "7", "8"],
      choices: ["7", "9", "10"],
      answer: "9",
      description: "Štetje naprej."
    },
    {
      sequence: ["10", "9", "8", "7"],
      choices: ["5", "6", "8"],
      answer: "6",
      description: "Štetje nazaj."
    },
    {
      sequence: ["🍓", "🍌", "🍌", "🍓", "🍌"],
      choices: ["🍌", "🍓", "🍎"],
      answer: "🍌",
      description: "Jagoda, dve banani."
    }
  ],

  // Zaporedja števil, predhodnik in naslednik po vzoru številskih trakov.
  numberSequences: [
    { sequence: [11, 12, null, 14, 15], answer: 13 },
    { sequence: [15, 16, 17, null, 19, 20], answer: 18 },
    { sequence: [20, 19, null, 17, 16], answer: 18 },
    { sequence: [2, 4, 6, null, 10], answer: 8 },
    { sequence: [10, 12, 14, null, 18], answer: 16 },
    { sequence: [13, null, 15, 16, 17], answer: 14 },
    { sequence: [16, 17, null, 19, 20], answer: 18 },
    { sequence: [19, 18, 17, null, 15], answer: 16 },
    { sequence: [1, 3, 5, null, 9], answer: 7 },
    { sequence: [20, 18, null, 14, 12], answer: 16 },
    { sequence: [10, 11, 12, null, 14], answer: 13 }
  ],

  // Pari števil s seštevkom 10.
  tenPairs: [
    { known: 0, answer: 10 },
    { known: 1, answer: 9 },
    { known: 2, answer: 8 },
    { known: 3, answer: 7 },
    { known: 4, answer: 6 },
    { known: 5, answer: 5 },
    { known: 6, answer: 4 },
    { known: 7, answer: 3 },
    { known: 8, answer: 2 },
    { known: 9, answer: 1 },
    { known: 10, answer: 0 }
  ],

  // Kratke računske zgodbe s preverljivim odgovorom.
  storyProblems: [
    { text: "Na drevesu je bilo 18 ptic. Odletelo je 5 ptic. Koliko ptic je ostalo?", equation: "18 - 5", answer: 13, emoji: "🐦" },
    { text: "Nejc ima 14 balonov. Marko mu da še 2 balona. Koliko balonov ima Nejc?", equation: "14 + 2", answer: 16, emoji: "🎈" },
    { text: "V škatli je 12 kock. Dodamo še 4 kocke. Koliko kock je skupaj?", equation: "12 + 4", answer: 16, emoji: "🧱" },
    { text: "Ajda ima 19 bonbonov. Pojedla je 6 bonbonov. Koliko bonbonov ji ostane?", equation: "19 - 6", answer: 13, emoji: "🍬" },
    { text: "Na mizi je 10 barvic. Dodamo še 8 barvic. Koliko barvic je vseh?", equation: "10 + 8", answer: 18, emoji: "🖍️" },
    { text: "V košari je 11 jabolk. Dodamo še 4 jabolka. Koliko jabolk je v košari?", equation: "11 + 4", answer: 15, emoji: "🍎" },
    { text: "Luka ima na mizi 17 kock. V škatlo pospravi 6 kock. Koliko kock ostane na mizi?", equation: "17 - 6", answer: 11, emoji: "🧱" },
    { text: "Na travniku je 12 metuljev. Priletijo še 3 metulji. Koliko metuljev je skupaj?", equation: "12 + 3", answer: 15, emoji: "🦋" },
    { text: "V škatli je 20 bonbonov. Otroci pojedo 8 bonbonov. Koliko bonbonov ostane?", equation: "20 - 8", answer: 12, emoji: "🍬" },
    { text: "Na polici je 13 knjig. Dodamo še 5 knjig. Koliko knjig je na polici?", equation: "13 + 5", answer: 18, emoji: "📘" }
  ],

  // Merjenje in primerjanje po vzoru zadnjih strani zvezka.
  measurements: [
    {
      prompt: "Katera pot je najdaljša?",
      mode: "longest",
      display: "bars",
      items: [
        { label: "zelena", color: "#4caf50" },
        { label: "modra", color: "#2196f3" },
        { label: "rdeča", color: "#e53935" }
      ]
    },
    {
      prompt: "Katera pot je najkrajša?",
      mode: "shortest",
      display: "bars",
      items: [
        { label: "rumena", color: "#fbc02d" },
        { label: "rdeča", color: "#e53935" },
        { label: "zelena", color: "#4caf50" }
      ]
    },
    {
      prompt: "Katera škatla je najtežja?",
      mode: "heaviest",
      display: "weights",
      items: [
        { label: "rdeča", icon: "🟥" },
        { label: "modra", icon: "🟦" },
        { label: "zelena", icon: "🟩" }
      ]
    }
  ]
};

// Izvoz za brskalnik
window.SLOVENSCINA_DATA = SLOVENSCINA_DATA;
window.MATEMATIKA_DATA = MATEMATIKA_DATA;
