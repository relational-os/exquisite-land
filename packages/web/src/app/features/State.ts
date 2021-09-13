import create from 'zustand';
import { BrushType } from '@app/hooks/use-editor';

type UniverseState = {
  activeCanvas: number;
  activeColor: number;
  activeBrush: BrushType;
};

// type CanvasState = {
//   id: number;
//   name?: string; // TBD in the future
//   palette: string[];
//   tiles: Record<string, TileState>;
// };

// type TileState = {
//   status: TileStatus;
//   type: TileType;
//   svg?: string;
// };

export enum TileStatus {
  BLANK = 'BLANK',
  INVITE = 'INVITE',
  DRAWABLE = 'DRAWABLE',
  DRAWN = 'DRAWN'
}

export enum TileType {
  SOLO = 'SOLO',
  COMMONS = 'COMMONS'
}

const useStore = create<UniverseState>(set => ({
  activeCanvas: 0,
  activeColor: 0,
  activeBrush: BrushType.PAINTBRUSH
}));

export default useStore;
