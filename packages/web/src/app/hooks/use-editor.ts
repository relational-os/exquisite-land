import useStore from "@app/features/State";
import { useWallet } from "@gimmixorg/use-wallet";
import PALETTES from "src/constants/Palettes";
import { ExquisiteLand__factory } from "src/sdk/factories/ExquisiteLand__factory";

interface SetTileProps {
  pixels: number[][];
  x: number;
  y: number;
}

const DEFAULT_FILL = 0;
const PIXELS = 32;

const useEditor = () => {
  const activeCanvas = useStore((state) => state.activeCanvas);
  const activeColor = useStore((state) => state.activeColor);
  const { provider } = useWallet();

  const palette = PALETTES[activeCanvas];

  const setActiveColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const setTile = async ({ x, y, pixels }: SetTileProps) => {
    if (!provider) return alert("Not signed in.");

    let outputPixels: Array<number> = [];
    for (x = 0; x < PIXELS; x++) {
      if (pixels[x]) {
        outputPixels = outputPixels.concat(
          pixels[x],
          Array(PIXELS - pixels[x].length).fill(DEFAULT_FILL)
        );
      } else {
        outputPixels = outputPixels.concat(Array(PIXELS).fill(0));
      }
    }

    console.log("we have le pixels", outputPixels);
    return;

    console.log("posting to chain");
    const tileContract = ExquisiteLand__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      provider.getSigner()
    );

    console.log(useStore.getState().activeCanvas, x, y, pixels);

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
    activeColor,
    setActiveColor,
    setTile,
  };
};

export default useEditor;
