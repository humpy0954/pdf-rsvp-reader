import { RsvpToken, PauseProfile, PAUSE_PROFILES } from "./types";

/**
 * Get the ORP letter index based on alphabetical character count.
 * length 1: index 0
 * length 2–5: index 1
 * length 6–9: index 2
 * length 10–13: index 3
 * length 14+: index 4
 */
export function getORPIndex(word: string): number {
  // Strip to only alphabetical characters for length calculation
  const alphaOnly = word.replace(/[^a-zA-Z]/g, "");
  const len = alphaOnly.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

/**
 * Map the ORP letter index (nth alphabetical char) to the actual
 * character position in the full displayed word (which may contain punctuation).
 * E.g. for `"reading."` → alpha chars are `reading` (7 letters, ORP index = 2 → 'a'),
 * the 'a' is at position 2 in the full string too. But for `"(hello)"` → alpha = `hello`
 * (5 letters, ORP index = 1 → 'e'), 'e' is at position 2 in the full string.
 */
function orpPositionInWord(word: string): number {
  const orpLetterIndex = getORPIndex(word);

  let alphaCount = 0;
  for (let i = 0; i < word.length; i++) {
    if (/[a-zA-Z]/.test(word[i])) {
      if (alphaCount === orpLetterIndex) {
        return i;
      }
      alphaCount++;
    }
  }

  // Fallback: if no alpha chars (e.g. a number like "1,000.50"),
  // use the raw positional logic on the full word
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

/**
 * Determine delay multiplier for a token based on trailing punctuation.
 */
function getDelayMultiplier(
  word: string,
  isEndOfParagraph: boolean,
  profile: PauseProfile
): number {
  const weights = PAUSE_PROFILES[profile];

  if (isEndOfParagraph) {
    return weights.paragraph;
  }

  const trimmed = word.trimEnd();
  const lastChar = trimmed[trimmed.length - 1];

  // Sentence-ending punctuation
  if (lastChar === "." || lastChar === "?" || lastChar === "!") {
    // Check for abbreviations like "e.g." "Mr." "Dr." — short words ending in period
    // that are likely abbreviations, not sentence ends
    const stripped = trimmed.replace(/[^a-zA-Z]/g, "");
    if (lastChar === "." && stripped.length <= 3 && stripped.length > 0) {
      return weights.clause; // Treat abbreviation-like as clause pause
    }
    return weights.sentence;
  }

  // Clause-level punctuation
  if (
    lastChar === "," ||
    lastChar === ";" ||
    lastChar === ":" ||
    lastChar === "—" ||
    lastChar === "–"
  ) {
    return weights.clause;
  }

  // Ellipsis
  if (trimmed.endsWith("...") || trimmed.endsWith("…")) {
    return weights.sentence;
  }

  // Long words get a slight delay boost
  if (trimmed.length > 10) {
    return 1.2;
  }

  return 1.0;
}

/**
 * Normalize extracted PDF text:
 * - Collapse multiple whitespace characters into single spaces
 * - Preserve paragraph breaks (double newlines)
 * - Handle common PDF extraction artifacts
 */
function normalizeText(text: string): string {
  return (
    text
      // Normalize various dash types
      .replace(/\u2014/g, "—")
      .replace(/\u2013/g, "–")
      // Normalize quotes
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'")
      // Normalize ellipsis
      .replace(/\u2026/g, "...")
      // Collapse whitespace within lines (but preserve newlines for paragraph detection)
      .replace(/[^\S\n]+/g, " ")
      // Normalize line breaks: treat 2+ newlines as paragraph break
      .replace(/\n{2,}/g, "\n\n")
      // Single newlines within a paragraph become spaces (common in PDF extraction)
      .replace(/(?<!\n)\n(?!\n)/g, " ")
      // Collapse any remaining multi-spaces
      .replace(/ {2,}/g, " ")
      .trim()
  );
}

/**
 * Tokenize text into RSVP tokens with delay multipliers and ORP indices.
 */
export function tokenize(
  rawText: string,
  profile: PauseProfile = "normal"
): RsvpToken[] {
  const normalized = normalizeText(rawText);
  if (!normalized) return [];

  const paragraphs = normalized.split("\n\n");
  const tokens: RsvpToken[] = [];

  for (let p = 0; p < paragraphs.length; p++) {
    const paragraph = paragraphs[p].trim();
    if (!paragraph) continue;

    const words = paragraph.split(/\s+/).filter(Boolean);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isLastWordInParagraph = i === words.length - 1 && p < paragraphs.length - 1;

      tokens.push({
        word,
        delayMultiplier: getDelayMultiplier(word, isLastWordInParagraph, profile),
        orpIndex: orpPositionInWord(word),
      });
    }
  }

  return tokens;
}

/**
 * Re-tokenize with a different pause profile without re-extracting text.
 */
export function retokenizeWithProfile(
  tokens: RsvpToken[],
  rawText: string,
  profile: PauseProfile
): RsvpToken[] {
  return tokenize(rawText, profile);
}
