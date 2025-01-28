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
type createPhraseArg = [number, number];

export interface BuilderStoreState {
  videoId: string | null;
  setVideoId: (id: string) => void;
  phrases: phrase[];
  setPhrases: (phrases: phrase[]) => void;
  createPhrase: (vals: createPhraseArg) => void;
  deletePhrase: (idx: number) => void;
  selectedPhraseIdx: number;
  setSelectedPhrase: (idx: number) => void;
  reset: () => void;
}

export const useTuneBuilderStore = create<BuilderStoreState>((set) => ({
  selectedPhraseIdx: 0,
  setSelectedPhrase: (idx) => set({ selectedPhraseIdx: idx }),
  videoId: null,
  setVideoId: (id) => set({ videoId: id }),
  phrases: [{ idx: 0, startTime: 0, endTime: 5 }],
  setPhrases: (phrases) => set({ phrases: phrases }),
  createPhrase: (vals) =>
    set((state) => {
      return {
        phrases: [
          ...state.phrases,
          {
            idx: state.phrases.length,
            startTime: vals[0],
            endTime: vals[1],
          },
        ],
        selectedPhraseIdx: state.phrases.length ?? 0,
      };
    }),
  deletePhrase: (idx) =>
    set((state) => ({
      phrases: state.phrases.filter((phrase) => phrase.idx !== idx),
    })),
  reset: () =>
    set({
      videoId: null,
      phrases: [{ idx: 0, startTime: 0, endTime: 5 }],
      selectedPhraseIdx: 0,
    }),
}));
