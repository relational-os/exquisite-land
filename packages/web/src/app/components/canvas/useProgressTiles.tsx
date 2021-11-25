import create from 'zustand';
import { Pixels } from '@app/hooks/use-editor';
import { socket } from '@app/realtime';

type ProgressTileKey = `${number},${number}`;
type ProgressTileStore = {
  tiles: Record<ProgressTileKey, Pixels>;
};

const useStore = create<ProgressTileStore>((set, get) => ({
  tiles: {}
}));

const getProgressTile = (x: number, y: number) =>
  useStore.getState().tiles[`${x},${y}`];

socket.on('progress', (x, y, pixels) => {
  const key: ProgressTileKey = `${x},${y}`;
  useStore.setState(({ tiles }) => ({
    tiles: {
      ...tiles,
      [key]: pixels
    }
  }));
});

export const useProgressTiles = () => {
  const progressTiles = useStore((state) => state.tiles);
  return { progressTiles, getProgressTile };
};
