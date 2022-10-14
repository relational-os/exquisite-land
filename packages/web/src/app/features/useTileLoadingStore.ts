import { useEffect } from 'react';
import create from 'zustand';
import { persist } from 'zustand/middleware';

type TileLoadingStore = {
  tileTimers: any;
  addTileTimer: (x: number, y: number, timeout?: number) => void;
  clearTileTimer: (x: number, y: number) => void;
  clearAll: () => void;
};

const tileLoadingStore = create<TileLoadingStore>(
  persist(
    (set, get) => ({
      tileTimers: {},
      addTileTimer: (x, y, timeout) => {
      // default 1 minute timeout
      const tileLoadingExpiration = new Date().getTime() + 30 * 1000;
        set((state) => ({
          tileTimers: {
            ...state.tileTimers,
            [`${x}-${y}`]: timeout || tileLoadingExpiration
          }
        }));
      },
      clearAll: () => set({ tileTimers: {} }),
      clearTileTimer: (x, y) => {
        set((state) => ({
          tileTimers: {
            ...state.tileTimers,
            [`${x}-${y}`]: null
          }
        }));
      }
    }),
    {
      name: `exquisite-land-tile-timers`
    }
  )
);

const useTileLoadingStore = (x?: number, y?: number, expirationCallback?: (x: number, y: number) => void) => {
  const state = tileLoadingStore();
  const tileTimer = x && y ? state.tileTimers[`${x}-${y}`] : null;

  useEffect(() =>{
    if (!tileTimer) return;

    const tickInterval = setInterval(
      () => {
        if (tileTimer < new Date().getTime()) {
          state.clearTileTimer(x as number, y as number);
          expirationCallback?.(x as number, y as number);
        }
      }, 3000
    )
    return () => {
      clearInterval(tickInterval);
    }
  }, [tileTimer, expirationCallback])

  return {
    tileTimer,
    ...state
  }

}

export default useTileLoadingStore;
