export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
  isInformative?: boolean;
  specificityScore?: number;
}

const BLOCKED_WORDS = [
  // Profanity/Inappropriate
  'tanga', 'bobo', 'gago', 'puta', 'putangina', 'gaga', 'ulol', 'leche', 'peste', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'pussy',
  'walang hiya', 'hayop', 'lintik', 'tarantado', 'tae', 'punyeta', 'pakshet', 'bwisit',

  // Political/Redtagging/Slurs
  'npa', 'terrorist', 'terorista', 'komunista', 'rebelde', 'redtag', 'red-tag', 'dilawan', 'pinklawan', 'dds', 'apologist', 'marcos', 'aquino', 'lenlen', 'bbm', 'lugaw', 'magnanakaw', 'dictator', 'diktador',
  'terror-tag', 'teror-tag', 'terrorist-tag', 'kakistocracy', 'demagogue', 'troll', 'bayaran', 'bulag', 'panatiko'
];

export const analyzeSpecificity = (text: string): { score: number; isInformative: boolean } => {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  // Dates
  if (/\b(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(tember)?|oct(ober)?|nov(ember)?|dec(ember)?)\s+\d{1,2}\b/.test(lowerText)) score += 2;
  if (/\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b/.test(lowerText)) score += 2;
  
  // Measurements
  const measurements = ['kg', 'tons', 'meters', 'mm', 'cm', 'bags', 'grade', 'inches'];
  measurements.forEach(m => {
    if (new RegExp(`\\b\\d+\\s*${m}\\b`).test(lowerText) || new RegExp(`grade\\s*[a-z]`, 'i').test(lowerText)) score += 1;
  });

  // Industry terms
  const terms = ['contractor', 'subcontractor', 'cement', 'steel', 'foundation', 'blueprint', 'memo', 'permit', 'audit', 'budget', 'deadline', 'delayed', 'poured', 'beam', 'pillar', 'reinforcing', 'supplier', 'inspector', 'concrete', 'asphalt'];
  
  let termCount = 0;
  terms.forEach(term => {
    if (lowerText.includes(term)) termCount++;
  });
  
  score += Math.min(termCount, 5); // limit term score to 5 points
  
  // Length bonus
  if (text.length > 50) score += 1;
  if (text.length > 150) score += 1;

  score = Math.min(score, 10);
  
  return {
    score,
    // Threshold for informative might be score >= 4
    isInformative: score >= 4
  };
};

export const moderateComment = (text: string): ModerationResult => {
  const lowerText = text.toLowerCase();
  
  for (const word of BLOCKED_WORDS) {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escapedWord}($|[^a-zA-Z0-9])`, 'i');
    if (regex.test(lowerText)) {
      return {
        isAllowed: false,
        reason: `Flagged content: submission contains restricted terminology or political references.`
      };
    }
  }

  const specificityInfo = analyzeSpecificity(text);

  return { 
    isAllowed: true,
    isInformative: specificityInfo.isInformative,
    specificityScore: specificityInfo.score
  };
};
