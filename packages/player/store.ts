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
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
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
  currentPhraseIdxs: number[];
  setCurrentPhraseIdxs: (arr: number[]) => void;
  togglePhraseIdx: (idx: number) => void;
  data: Data;
  setData: (data: Data) => void;
  restTime: number;
  setRestTime: (restTime: number) => void;
  showGuide: boolean;
  setShowGuide: (val: boolean) => void;
}

const generateArray = (arr: number[]) => {
  const [startIdx, endIdx] = [Math.min(...arr), Math.max(...arr)];
  if (typeof startIdx === "undefined" || typeof endIdx === "undefined") return;
  const output = [];
  for (let i = startIdx; i <= endIdx; i++) {
    output.push(i);
  }
  return output;
};
export const usePlayerStore = create<PlayerState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
  showGuide: true,
  setShowGuide: (val) => set({ showGuide: val }),
  sliderValues: [16.788, 20.813],
  setSliderValues: (values) => set({ sliderValues: values }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  duration: 0,
  setDuration: (duration) => set({ duration: duration }),
  speed: 1,
  setSpeed: (speed) => set({ speed: speed }),
  currentPhraseIdxs: [0],
  setCurrentPhraseIdxs: (arr) => set({ currentPhraseIdxs: arr }),
  togglePhraseIdx: (idx) => {
    set((state) => {
      const arr = state.currentPhraseIdxs;

      if (arr.includes(idx)) {
        if (arr.length === 1) {
          return {};
        }
        const filtered = arr.filter((i) => i !== idx);
        const output = generateArray(filtered);
        return { currentPhraseIdxs: output };
      } else {
        const output = generateArray([...arr, idx]);
        if (!output?.length) return {};
        const firstEntryIndex = output[0] ?? 0;
        const lastEntryIndex = output[output.length - 1] ?? 0;
        //note data is constant / immutable
        const newSliderValues = [
          state.data.phrases[firstEntryIndex]?.startTime ?? 0,
          state.data.phrases[lastEntryIndex]?.endTime ?? 0,
        ];
        return {
          currentPhraseIdxs: output,
          sliderValues: newSliderValues,
        };
      }
    });
  },
  hasStarted: false,
  setHasStarted: (hasStarted) => set({ hasStarted: hasStarted }),
  data: {
    videoId: "qoPdu64kG84",
    phrases: [
      {
        idx: 0,
        startTime: 16.788,
        endTime: 20.813,
      },
      {
        idx: 1,
        startTime: 20.925,
        endTime: 24.93,
      },
      {
        idx: 2,
        startTime: 25.04,
        endTime: 28.975,
      },
      {
        idx: 3,
        startTime: 28.975,
        endTime: 33.11,
      },
      {
        idx: 4,
        startTime: 33.205,
        endTime: 37.155,
      },
      {
        idx: 5,
        startTime: 37.2,
        endTime: 41.15,
      },
      {
        idx: 6,
        startTime: 41.31,
        endTime: 45.195,
      },
      {
        idx: 7,
        startTime: 45.195,
        endTime: 49.19,
      },
      {
        idx: 8,
        startTime: 49.295,
        endTime: 53.305,
      },
      {
        idx: 9,
        startTime: 53.335,
        endTime: 57.26,
      },
      {
        idx: 10,
        startTime: 57.345,
        endTime: 61.245,
      },
      {
        idx: 11,
        startTime: 61.245,
        endTime: 65.27,
      },
      {
        idx: 12,
        startTime: 65.405,
        endTime: 69.3,
      },
      {
        idx: 13,
        startTime: 69.465,
        endTime: 73.315,
      },
      {
        idx: 14,
        startTime: 73.385,
        endTime: 77.31,
      },
      {
        idx: 15,
        startTime: 77.455,
        endTime: 81.385,
      },
    ],
  },
  setData: (data: Data) => set({ data: data, hasStarted: false }),
  restTime: 0.5,
  setRestTime: (restTime) => set({ restTime: restTime }),
}));
