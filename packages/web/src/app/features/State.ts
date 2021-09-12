import create from "zustand";
import { BrushType } from '@app/hooks/use-editor'

type UniverseState = {
  canvases: CanvasState[];
  activeCanvas: number;
  activeColor: number;
  activeBrush: BrushType;
};

type CanvasState = {
  id: number;
  name?: string; // TBD in the future
  palette: string[];
  tiles: Record<string, TileState>;
};

export enum TileStatus {
  BLANK = "BLANK",
  INVITE = "INVITE",
  DRAWABLE = "DRAWABLE",
  DRAWN = "DRAWN",
}

export enum TileType {
  SOLO = "SOLO",
  COMMONS = "COMMONS",
}

type TileState = {
  status: TileStatus;
  type: TileType;
  svg?: string;
};

const useStore = create<UniverseState>((set) => ({
  canvases: [
    {
      id: 0,
      tiles: {},
      palette: ["#000", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    },
    {
      id: 1,
      tiles: {},
      palette: ["#000", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
    },
  ],
  activeCanvas: 0,
  activeColor: 0,
  activeBrush: BrushType.PAINTBRUSH,
}));

export default useStore;
