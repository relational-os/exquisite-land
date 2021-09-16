import useStore from '@app/features/State';
import { useWallet } from '@gimmixorg/use-wallet';
import PALETTES from 'src/constants/Palettes';
import { ExquisiteLand__factory } from 'src/sdk/factories/ExquisiteLand__factory';

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
    let svg =
      '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 32 32" >';
    for (x = 0; x < pixels.length; x++) {
      console.log("x", x, "pixels[x]", pixels[x]);
      for (y = 0; y < pixels[x].length; y++) {
        svg += `<rect x="${x}" y="${y}" style="fill:${palette[y]}" width="1" height="1"/>`;
      }
    }
    svg += "</svg>";

    console.log({ svg });

    // TODO: generate SVG

    // const paletteMap = palette.reduce(
    //   (previous: Record<string, number>, hex: string, index: number) => {
    //     previous[hex] = index;
    //     return previous;
    //   },
    //   {}
    // );

    // TODO: fill array in with bg color?
    var pixelsFlat = pixels.reduce(function (prev, next) {
      return prev.concat(next);
    });

    console.log({ pixelsFlat });
    const ipfsHash = await useUploadTilePixels(svg);

    const tileContract = ExquisiteLand__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      provider.getSigner()
    );

    console.log(useStore.getState().activeCanvas, x, y, packagedPaths);

    const tx = await tileContract.createTile(
      useStore.getState().activeCanvas,
      x,
      y,
      ipfsHash
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
