export interface ModerationResult {
  isAllowed: boolean;
  reason?: string;
}

const BLOCKED_WORDS = [
  // Profanity/Inappropriate
  'tanga', 'bobo', 'gago', 'puta', 'putangina', 'gaga', 'ulol', 'leche', 'peste', 'shit', 'fuck', 'bitch', 'asshole', 'dick', 'pussy',
  'walang hiya', 'hayop', 'lintik', 'tarantado', 'tae', 'punyeta', 'pakshet', 'bwisit',

  // Political/Redtagging/Slurs
  'npa', 'terrorist', 'terorista', 'komunista', 'rebelde', 'redtag', 'red-tag', 'dilawan', 'pinklawan', 'dds', 'apologist', 'marcos', 'aquino', 'lenlen', 'bbm', 'lugaw', 'magnanakaw', 'dictator', 'diktador',
  'terror-tag', 'teror-tag', 'terrorist-tag', 'kakistocracy', 'demagogue', 'troll', 'bayaran', 'bulag', 'panatiko'
];

export const moderateComment = (text: string): ModerationResult => {
  const lowerText = text.toLowerCase();
  
  for (const word of BLOCKED_WORDS) {
    // Escape special characters in the word for regex
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Using a boundary at the start, but allowing suffixes to catch "red-tagging", "red-tagged", etc.
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escapedWord}`, 'i');
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
