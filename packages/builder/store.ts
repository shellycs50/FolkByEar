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
      const prevStart =
        state.phrases[state.phrases.length - 1]?.startTime ?? null;
      const prevEnd = state.phrases[state.phrases.length - 1]?.endTime ?? null;

      if (prevStart === null || prevEnd === null) {
        return {
          phrases: [
            ...state.phrases,
            {
              idx: state.phrases.length,
              startTime: 0,
              endTime: 5,
            },
          ],
          selectedPhraseIdx: state.phrases.length ?? 0,
        };
      }

      const prevDuration = prevEnd - prevStart;
      const currentEnd = prevEnd + prevDuration;
      console.log({ prevDuration, currentEnd, prevStart, prevEnd });
      return {
        phrases: [
          ...state.phrases,
          {
            idx: state.phrases.length,
            startTime: prevEnd,
            endTime: currentEnd,
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
