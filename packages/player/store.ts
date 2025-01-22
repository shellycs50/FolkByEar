import { create } from "zustand";

interface PlayerState {
  sliderValues: number[];
  setSliderValues: (values: number[]) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;

  // player specific
  currentPhraseIdx: number;
  setCurrentPhraseIdx: (idx: number) => void;
  currentPhraseRepeatCount: number | null;
  setCurrentPhraseRepeatCount: (count: number | null) => void;
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
}));
