import { create } from "zustand";

export interface LoopState {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  sliderValues: number[];
  setSliderValues: (values: number[]) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  videoId: string;
  setVideoId: (id: string) => void;
  userUrl: string;
  setUserUrl: (url: string) => void;
  duration: number;
  setDuration: (duration: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  trackMin: number;
  setTrackMin: (min: number) => void;
  trackMax: number;
  setTrackMax: (max: number) => void;
  isZoomed: boolean;
  setIsZoomed: (zoomed: boolean) => void;
}

export const useLooperStore = create<LoopState>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying: isPlaying }),
  sliderValues: [0, 5],
  setSliderValues: (values) => set({ sliderValues: values }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: time }),
  videoId: "D6FdFNuWmVY",
  setVideoId: (id) => set({ videoId: id }),
  userUrl: "",
  setUserUrl: (url) => set({ userUrl: url }),
  duration: 0,
  setDuration: (duration) => set({ duration: duration }),
  speed: 1,
  setSpeed: (speed) => set({ speed: speed }),
  trackMin: 0,
  setTrackMin: (min) => set({ trackMin: min }),
  trackMax: 0,
  setTrackMax: (max) => set({ trackMax: max }),
  isZoomed: false,
  setIsZoomed: (zoomed) => set({ isZoomed: zoomed }),
}));
