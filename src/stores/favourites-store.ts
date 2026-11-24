'use client';

import { create } from 'zustand';
import { CosmixShade } from '@/data/shades';

export interface SavedShade extends CosmixShade {
  savedAt: string;
}

interface FavouritesState {
  favourites: SavedShade[];
  isHydrated: boolean;
  toggleFavourite: (shade: CosmixShade) => void;
  isFavourite: (shadeId: string) => boolean;
  removeFavourite: (shadeId: string) => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'cosmix_favourite_shades';

export const useFavouritesStore = create<FavouritesState>((set, get) => ({
  favourites: [],
  isHydrated: false,

  hydrate: () => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          set({ favourites: parsed, isHydrated: true });
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to load favourites from storage:', e);
    }
    set({ isHydrated: true });
  },

  isFavourite: (shadeId: string) => {
    return get().favourites.some((s) => s.id === shadeId);
  },

  toggleFavourite: (shade: CosmixShade) => {
    const { favourites } = get();
    const exists = favourites.some((s) => s.id === shade.id);
    let updated: SavedShade[];

    if (exists) {
      updated = favourites.filter((s) => s.id !== shade.id);
    } else {
      const newSaved: SavedShade = {
        ...shade,
        savedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      updated = [newSaved, ...favourites];
    }

    set({ favourites: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save favourites to storage:', e);
      }
    }
  },

  removeFavourite: (shadeId: string) => {
    const updated = get().favourites.filter((s) => s.id !== shadeId);
    set({ favourites: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to remove favourite from storage:', e);
      }
    }
  },
}));
