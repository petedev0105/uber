import { create } from "zustand";

export const useAuraTasksStore = create((set) => ({
  tasks: [], // Ensure this is initialized as an empty array
  setTasks: (newTasks) => set({ tasks: newTasks }),
}));
