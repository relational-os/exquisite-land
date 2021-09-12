import useStore, { TileStatus, TileType } from "@app/features/State";

export enum BrushType {
  PENCIL = 0,
  PAINTBRUSH = 1,
  ERASER = 2,
}

export const BrushSize = {
  [BrushType.PENCIL]: 4,
  [BrushType.PAINTBRUSH]: 16,
  [BrushType.ERASER]: 16,
};

interface SetTileProps {
  svg: string
  x: number
  y: number
}

const useEditor = () => {
  const activeCanvas = useStore((state) => state.activeCanvas);
  const activeColor = useStore((state) => state.activeColor);
  const activeBrush = useStore((state) => state.activeBrush);
  const palette = useStore((state) => state.canvases[activeCanvas].palette);

  const setBrush = (id: number) => {
    useStore.setState({ activeBrush: id });
  };

  const setBrushColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const setTile = ({ x, y, svg }: SetTileProps) => {
    console.log("saving svg to state", { x, y, svg });
    useStore.setState((state) => {
      state.canvases[state.activeCanvas].tiles[`${x}-${y}`] = {
        svg,
        status: TileStatus.DRAWN,
        type: TileType.SOLO,
      };
      return state;
    });
    console.log(`tile(${x}, ${y}) saved!`);
  }

  return {
    palette,
    brush: activeBrush,
    brushColor: palette[activeColor],
    brushSize: BrushSize[activeBrush],
    setBrush,
    setBrushColor,
    setTile
  }
};

export default useEditor;
