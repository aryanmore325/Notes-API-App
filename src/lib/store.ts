import { create } from 'zustand';
import { supabase } from './supabase';

interface User {
  id: string;
  email: string;
  username: string | null;
  avatarUrl: string | null;
}

interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

interface Tag {
  id: string;
  name: string;
}

interface AppState {
  user: User | null;
  notes: Note[];
  tags: Tag[];
  darkMode: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setNotes: (notes: Note[]) => void;
  setTags: (tags: Tag[]) => void;
  toggleDarkMode: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  notes: [],
  tags: [],
  darkMode: false,
  isLoading: false,
  setUser: (user) => set({ user }),
  setNotes: (notes) => set({ notes }),
  setTags: (tags) => set({ tags }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setIsLoading: (isLoading) => set({ isLoading }),
}));