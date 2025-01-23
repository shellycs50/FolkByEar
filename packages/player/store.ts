import { create } from "zustand";
type Phrase = {
  idx: number;
  startTime: number;
  endTime: number;
};

type Data = {
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
    videoId: "Xk8zy9kpVc0",
    phrases: [
      {
        idx: 0,
        startTime: 36.34,
        endTime: 40.69,
      },
      {
        idx: 1,
        startTime: 40.69,
        endTime: 45.55,
      },
      {
        idx: 2,
        startTime: 44.84,
        endTime: 49.42,
      },
      {
        idx: 3,
        startTime: 49.42,
        endTime: 53.89,
      },
    ],
  },
  setData: (data: Data) => set({ data: data, hasStarted: false }),
  restTime: 0,
  setRestTime: (restTime) => set({ restTime: restTime }),
}));
