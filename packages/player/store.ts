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
  showGuide: true,
  setShowGuide: (val) => set({ showGuide: val }),
  sliderValues: [36.34, 40.69],
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
  restTime: 0.5,
  setRestTime: (restTime) => set({ restTime: restTime }),
}));
