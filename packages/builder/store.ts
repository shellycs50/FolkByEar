import { create } from "zustand";

export interface phrase {
  idx: number;
  startTime: number;
  endTime: number;
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
  createPhrase: () => void;
  deletePhrase: (idx: number) => void;
  selectedPhraseIdx: number;
  setSelectedPhrase: (idx: number) => void;
}

export const useTuneBuilderStore = create<StoreState>((set) => ({
  selectedPhraseIdx: 0,
  setSelectedPhrase: (idx) => set({ selectedPhraseIdx: idx }),
  videoId: null,
  setVideoId: (id) => set({ videoId: id }),
  phrases: [{ idx: 0, startTime: 0, endTime: 5 }],
  setPhrases: (phrases) => set({ phrases: phrases }),
  createPhrase: () =>
    set((state) => {
      const start = state.phrases[state.phrases.length - 1]?.endTime ?? 0;
      return {
        phrases: [
          ...state.phrases,
          {
            idx: state.phrases.length,
            startTime: start,
            endTime: start + 5,
          },
        ],
        selectedPhraseIdx: state.phrases.length ?? 0,
      };
    }),
  deletePhrase: (idx) =>
    set((state) => ({
      phrases: state.phrases.filter((phrase) => phrase.idx !== idx),
    })),
}));
