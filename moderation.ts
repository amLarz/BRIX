export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
}

const BLOCKED_WORDS = [
  // Profanity/Inappropriate
  'tanga', 'bobo', 'gago', 'puta', 'putangina', 'gaga', 'ulol', 'leche', 'peste', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'pussy',

  // Political/Redtagging/Slurs
  'npa', 'terrorist', 'terorista', 'komunista', 'rebelde', 'redtag', 'red-tag', 'dilawan', 'pinklawan', 'dds', 'apologist', 'marcos', 'aquino', 'lenlen', 'bbm', 'lugaw', 'magnanakaw', 'dictator', 'diktador'
];

export const moderateComment = (text: string): ModerationResult => {
  const lowerText = text.toLowerCase();
  
  for (const word of BLOCKED_WORDS) {
    // Check for exact word matches using word boundaries to avoid false positives
    // \b doesn't work well with hyphens in JS regex sometimes, but fine for mostly alphanumeric words
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    if (regex.test(lowerText)) {
      return {
        isAllowed: false,
        reason: `Flagged content: submission contains restricted terminology or political references.`
      };
    }
  }

  // Also check for general substrings for stronger matching (optional, might cause false positives like 'npa' in 'unpaid')
  // We'll stick to word boundaries (\b) primarily for safety, but we can do substring for specific toxic patterns if needed.

  return { isAllowed: true };
};
