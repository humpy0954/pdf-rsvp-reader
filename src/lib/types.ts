export interface RsvpToken {
  word: string;
  delayMultiplier: number;
  orpIndex: number;
}

export type PauseProfile = "light" | "normal" | "heavy";

export interface PauseWeights {
  sentence: number;    // after . ? !
  clause: number;      // after , ; :
  paragraph: number;   // after paragraph breaks
}

export const PAUSE_PROFILES: Record<PauseProfile, PauseWeights> = {
  light: {
    sentence: 1.5,
    clause: 1.2,
    paragraph: 2.0,
  },
  normal: {
    sentence: 2.5,
    clause: 1.5,
    paragraph: 3.5,
  },
  heavy: {
    sentence: 4.0,
    clause: 2.0,
    paragraph: 5.0,
  },
};

export interface ExtractionProgress {
  currentPage: number;
  totalPages: number;
  percentage: number;
}

export interface PdfInfo {
  fileName: string;
  pageCount: number;
}

export type ExtractionState =
  | { status: "idle" }
  | { status: "loading"; progress: ExtractionProgress }
  | { status: "done"; text: string; info: PdfInfo }
  | { status: "error"; message: string };
