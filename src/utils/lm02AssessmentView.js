/**
 * Pure helpers for LM02 assessment presentation (shuffle / visual labels).
 * Re-exports LM08 helpers to avoid duplication — no grading authority.
 */

export {
  shuffleArray,
  buildShuffledOptionOrders,
  mapOptionsForDisplay,
  visualLetterForIndex,
  LM08_CANONICAL_OPTION_IDS as LM02_CANONICAL_OPTION_IDS,
  LM08_VISUAL_LETTERS as LM02_VISUAL_LETTERS,
} from "./lm08AssessmentView.js";
