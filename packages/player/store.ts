import { create } from "zustand";
type Phrase = {
  idx: number; // Must be a non-negative integer
  startTime: number; // Must be a non-negative number
  endTime: number; // Must be a non-negative number
  repeatCount: number; // Must be a positive integer
  speed: number; // Must be a positive number
};

// Type for the overall structure
type Data = {
  selectedPhraseIdx: number; // Must be a non-negative integer
  videoId: string; // Must be a non-empty string
  phrases: Phrase[]; // Must be an array of phrases (at least one entry)
};

interface PlayerState {
  sliderValues: number[];
  setSliderValues: (values: number[]) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  hasStarted: boolean;
  setHasStarted: (hasStarted: boolean) => void;
  // player specific
  currentPhraseIdx: number;
  setCurrentPhraseIdx: (idx: number) => void;
  currentPhraseRepeatCount: number | null;
  setCurrentPhraseRepeatCount: (count: number | null) => void;
  decrementRepeatCount: () => void;
  data: Data;
  setData: (data: Data) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  sliderValues: [0, 0],
  setSliderValues: (values) => set({ sliderValues: values }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  duration: 0,
  setDuration: (duration) => set({ duration: duration }),
  speed: 1,
  setSpeed: (speed) => set({ speed: speed }),

  currentPhraseIdx: 0,
  setCurrentPhraseIdx: (idx) => set({ currentPhraseIdx: idx }),
  currentPhraseRepeatCount: null,
  setCurrentPhraseRepeatCount: (count) =>
    set({ currentPhraseRepeatCount: count }),
  decrementRepeatCount: () =>
    set((state) => ({
      currentPhraseRepeatCount: state.currentPhraseRepeatCount
        ? state.currentPhraseRepeatCount - 1
        : null,
    })),
  hasStarted: false,
  setHasStarted: (hasStarted) => set({ hasStarted: hasStarted }),
  data: {
    selectedPhraseIdx: 0,
    videoId: "aMphDvniH7w",
    phrases: [
      {
        idx: 0,
        startTime: 0,
        endTime: 3.58,
        repeatCount: 3,
        speed: 0.5,
      },
      {
        idx: 1,
        startTime: 3.605,
        endTime: 5.505,
        repeatCount: 3,
        speed: 0.5,
      },
      {
        idx: 2,
        startTime: 4.751,
        endTime: 7.316,
        repeatCount: 3,
        speed: 0.5,
      },
      {
        idx: 3,
        startTime: 21.035,
        endTime: 24.38,
        repeatCount: 3,
        speed: 0.5,
      },
      {
        idx: 4,
        startTime: 24.38,
        endTime: 27.825,
        repeatCount: 3,
        speed: 0.5,
      },
      {
        idx: 5,
        startTime: 27.825,
        endTime: 32.825,
        repeatCount: 3,
        speed: 0.5,
      },
    ],
  },
  setData: (data: Data) => set({ data: data, hasStarted: false }),
}));
