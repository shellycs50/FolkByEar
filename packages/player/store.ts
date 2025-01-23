import { create } from "zustand";
type Phrase = {
  idx: number;
  startTime: number;
  endTime: number;
};

type Data = {
  selectedPhraseIdx: number;
  videoId: string;
  phrases: Phrase[];
};

export interface PlayerState {
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
  data: Data;
  setData: (data: Data) => void;
  restTime: number;
  setRestTime: (restTime: number) => void;
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
      },
      {
        idx: 1,
        startTime: 3.605,
        endTime: 5.505,
      },
      {
        idx: 2,
        startTime: 4.751,
        endTime: 7.316,
      },
      {
        idx: 3,
        startTime: 21.035,
        endTime: 24.38,
      },
      {
        idx: 4,
        startTime: 24.38,
        endTime: 27.825,
      },
      {
        idx: 5,
        startTime: 27.825,
        endTime: 32.825,
      },
    ],
  },
  setData: (data: Data) => set({ data: data, hasStarted: false }),
  restTime: 0,
  setRestTime: (restTime) => set({ restTime: restTime }),
}));
