import create from "zustand";

type UniverseState = {
  activeCanvas: number;
  activeColor: number;
  activeTool: Tool;
  prevTool: Tool;
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
  BLANK = "BLANK",
  INVITE = "INVITE",
  DRAWABLE = "DRAWABLE",
  DRAWN = "DRAWN",
}

export enum TileType {
  SOLO = "SOLO",
  COMMONS = "COMMONS",
}

export enum Tool {
  BRUSH = "BRUSH",
  BUCKET = "BUCKET",
  EYEDROPPER = "EYEDROPPER",
}

const useStore = create<UniverseState>((set) => ({
  activeCanvas: 0,
  activeColor: 0,
  activeTool: Tool.BRUSH,
  prevTool: Tool.BRUSH,
}));

export default useStore;
