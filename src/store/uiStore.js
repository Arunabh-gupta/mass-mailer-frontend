import { create } from 'zustand';

export const useUiStore = create((set) => ({
  activeRequests: 0,
  loading: false,
  error: null,

  startLoading: () =>
    set((state) => {
      const activeRequests = state.activeRequests + 1;
      return { activeRequests, loading: activeRequests > 0 };
    }),

  stopLoading: () =>
    set((state) => {
      const activeRequests = Math.max(0, state.activeRequests - 1);
      return { activeRequests, loading: activeRequests > 0 };
    }),

  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
