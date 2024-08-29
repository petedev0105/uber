import { create } from "zustand";

type PointsStore = {
  totalPoints: number;
  setTotalPoints: (points: number) => void;
};

export const usePointsStore = create<PointsStore>((set) => ({
  totalPoints: 0,
  setTotalPoints: (points) => set({ totalPoints: points }),
}));
