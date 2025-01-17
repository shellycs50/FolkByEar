import { create } from "zustand";

export interface phrase {
  idx: number;
  startTime: number;
  endTime: number;
  repeatCount: number;
  speed: number;
}

// const defaultPhrase = {
//   idx: builder.phraseCount,
//   startTime: 0,
//   endTime: duration,
//   repeatCount: 3,
//   speed: 1,
// } as phrase;

interface StoreState {
  videoId: string | null;
  setVideoId: (id: string) => void;
  phrases: phrase[];
  setPhrases: (phrases: phrase[]) => void;
  createPhrase: (sliderValues: number[], duration: number) => void;
  deletePhrase: (idx: number) => void;
  restTime: number;
  setRestTime: (time: number) => void;
  selectedPhraseIdx: number;
  setSelectedPhrase: (idx: number) => void;
  setRepeatCount: (idx: number, count: number) => void;
  setSpeed: (idx: number, speed: number) => void;
}

export const useTuneBuilderStore = create<StoreState>((set) => ({
  selectedPhraseIdx: 0,
  setSelectedPhrase: (idx) => set({ selectedPhraseIdx: idx }),
  videoId: null,
  setVideoId: (id) => set({ videoId: id }),
  phrases: [],
  setPhrases: (phrases) => set({ phrases: phrases }),
  createPhrase: (sliderValues, duration) =>
    set((state) => ({
      phrases: [
        ...state.phrases,
        {
          idx: state.phrases.length,
          startTime: sliderValues[0] ?? 0,
          endTime: sliderValues[1] ?? duration,
          repeatCount: 3,
          speed: 1,
        },
      ],
      selectedPhraseIdx: state.phrases.length,
    })),
  deletePhrase: (idx) =>
    set((state) => ({
      phrases: state.phrases.filter((phrase) => phrase.idx !== idx),
    })),
  restTime: 1,
  setRestTime: (time) => set({ restTime: time }),
  setRepeatCount: (idx, count) => {
    set((state) => {
      const newPhrases = [...state.phrases];
      if (!newPhrases[idx]) return state;
      newPhrases[idx].repeatCount = count;
      return { phrases: newPhrases };
    });
  },
  setSpeed: (idx: number, speed: number) => {
    set((state) => {
      const newPhrases = [...state.phrases];
      if (!newPhrases[idx]) return state;
      newPhrases[idx].speed = speed;
      return { phrases: newPhrases };
    });
  },
}));
