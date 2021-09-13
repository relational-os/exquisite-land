import useStore from '@app/features/State';
import { useWallet } from '@gimmixorg/use-wallet';
import PALETTES from 'src/constants/Palettes';
import { Tile__factory } from 'src/sdk/factories/Tile__factory';

export enum BrushType {
  PENCIL = 0,
  PAINTBRUSH = 1,
  ERASER = 2
}

export const BrushSize = {
  [BrushType.PENCIL]: 4,
  [BrushType.PAINTBRUSH]: 16,
  [BrushType.ERASER]: 16
};

interface SetTileProps {
  svg: string;
  paths: any[];
  x: number;
  y: number;
}

const useEditor = () => {
  const activeCanvas = useStore(state => state.activeCanvas);
  const activeColor = useStore(state => state.activeColor);
  const activeBrush = useStore(state => state.activeBrush);

  const palette = PALETTES[activeCanvas];

  const { provider } = useWallet();

  const setBrush = (id: number) => {
    useStore.setState({ activeBrush: id });
  };

  const setBrushColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const setTile = async ({ x, y, svg, paths }: SetTileProps) => {
    if (!provider) return alert('Not signed in.');

    // Format for solidity
    const svgElement = new DOMParser().parseFromString(svg, 'text/xml');
    const pathStrings: string[] = [];
    const pathElements = svgElement.getElementsByTagName('path');
    for (const pathElement of pathElements) {
      let pathString = pathElement.getAttribute('d');
      if (!pathString) continue;
      pathStrings.push(pathString);
    }

    const paletteMap = palette.reduce(
      (previous: Record<string, number>, hex: string, index: number) => {
        previous[hex] = index;
        return previous;
      },
      {}
    );
    const strokeMap: Record<number, number> = { 4: 0, 16: 1 };

    let packagedPaths = paths
      .map((path, i) => {
        let strokeColor = path.strokeColor;
        let strokeWidth = path.strokeWidth;
        return {
          strokeColor: paletteMap[strokeColor],
          strokeWidth: strokeMap[strokeWidth],
          path: pathStrings[i]
        };
      })
      .filter(path => {
        return path.path != undefined;
      });

    console.log('posting to chain');
    const tileContract = Tile__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      provider.getSigner()
    );

    console.log(useStore.getState().activeCanvas, x, y, packagedPaths);

    const tx = await tileContract.createTile(
      useStore.getState().activeCanvas,
      x,
      y,
      packagedPaths
    );

    const receipt = await tx.wait(2);

    console.log(receipt);

    console.log(`tile(${x}, ${y}) saved!`);
  };

  return {
    palette,
    brush: activeBrush,
    brushColor: palette[activeColor],
    brushSize: BrushSize[activeBrush],
    setBrush,
    setBrushColor,
    setTile
  };
};

export default useEditor;
