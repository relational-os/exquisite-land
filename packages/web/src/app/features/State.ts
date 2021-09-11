import create from "zustand";

type CanvasState = {
  id: number;
  name?: string; // TBD in the future
  pallete: string[];
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

const useStore = create<CanvasState>((set) => ({
  id: 0,
  tiles: {},
  pallete: ["#000", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
}));

export default useStore;
