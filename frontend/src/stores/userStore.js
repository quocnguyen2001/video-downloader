import { create } from 'zustand';

// User store for managing user data in memory
// This store is temporary and will be cleared on page refresh
const useUserStore = create((set, get) => ({
  // State
  user: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  setUser: userData => {
    set({
      user: userData,
      isAuthenticated: !!userData,
    });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  setLoading: loading => {
    set({ isLoading: loading });
  },

  // Getters
  getUser: () => get().user,
  getIsAuthenticated: () => get().isAuthenticated,
  getIsLoading: () => get().isLoading,

  // Update user data (for profile updates)
  updateUser: updatedData => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: { ...currentUser, ...updatedData },
      });
    }
  },
}));

export default useUserStore;
