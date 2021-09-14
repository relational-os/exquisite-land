import useStore from "@app/features/State";
import { useWallet } from "@gimmixorg/use-wallet";
import PALETTES from "src/constants/Palettes";
import { Tile__factory } from "src/sdk/factories/Tile__factory";

import pako from "pako";

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
  svg: string;
  paths: any[];
  x: number;
  y: number;
}

const useEditor = () => {
  const activeCanvas = useStore((state) => state.activeCanvas);
  const activeColor = useStore((state) => state.activeColor);
  const activeBrush = useStore((state) => state.activeBrush);

  const palette = PALETTES[activeCanvas];

  const { provider } = useWallet();

  const setBrush = (id: number) => {
    useStore.setState({ activeBrush: id });
  };

  const setBrushColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const setTile = async ({ x, y, svg, paths }: SetTileProps) => {
    if (!provider) return alert("Not signed in.");

    // Format for solidity
    const svgElement = new DOMParser().parseFromString(svg, "text/xml");
    const pathStrings: string[] = [];
    const pathElements = svgElement.getElementsByTagName("path");
    for (const pathElement of pathElements) {
      let pathString = pathElement.getAttribute("d");
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

    let packagedPathsOpt = paths
      .map((path, i) => {
        // TODO: wrap this in an if statement to make sure we skip things with 0 length
        const strokeColor = path.strokeColor;
        const strokeWidth = path.strokeWidth;

        const encodedPath = new Uint8Array(
          // might be good to switch to btoa() if we want to base64 encode instead of utf8
          new TextEncoder().encode(pathStrings[i])
        );

        console.log("inflated path length", encodedPath.length);

        const deflatedPath = pako.deflate(encodedPath);

        console.log("deflated path length", deflatedPath.length);

        return {
          strokeColor: paletteMap[strokeColor],
          strokeWidth: strokeMap[strokeWidth],
          path: deflatedPath,
          pathLenBytes: encodedPath.length,
        };
      })
      .filter((path) => {
        return path.path != undefined;
      });
    let packagedPaths = paths
      .map((path, i) => {
        let strokeColor = path.strokeColor;
        let strokeWidth = path.strokeWidth;
        return {
          strokeColor: paletteMap[strokeColor],
          strokeWidth: strokeMap[strokeWidth],
          path: pathStrings[i],
        };
      })
      .filter((path) => {
        return path.path != undefined;
      });

    var len = 0;
    packagedPaths.map((path) => (len += path.path.length));
    console.log("packaged non-opt length", len);

    var len = 0;
    packagedPathsOpt.map((path) => (len += path.path.length));
    console.log("packaged opt length", len);

    console.log("posting to chain");
    const tileContract = Tile__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      provider.getSigner()
    );

    console.log(useStore.getState().activeCanvas, x, y, packagedPaths);

    const tx = await tileContract.createTile(
      useStore.getState().activeCanvas,
      x,
      y,
      packagedPathsOpt
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
    setTile,
  };
};

export default useEditor;
