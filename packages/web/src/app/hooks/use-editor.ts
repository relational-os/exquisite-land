import useStore from "@app/features/State";
import { useWallet } from "@gimmixorg/use-wallet";
import PALETTES from "src/constants/Palettes";
import { ExquisiteLand__factory } from "src/sdk/factories/ExquisiteLand__factory";

interface SetTileProps {
  pixels: number[][];
  x: number;
  y: number;
}

const DEFAULT_FILL = 13;
const PIXELS = 32;

function transpose(matrix: any) {
  return matrix.reduce(
    (prev: any, next: any) =>
      next.map((item: any, i: number) => (prev[i] || []).concat(next[i])),
    []
  );
}

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

    let transposed = transpose(pixels);
    console.log(
      "transposed",
      // transposed,
      "transposed.length",
      transposed.length
    );

    transposed.map((row) => {
      console.log("--", row.length);
    });

    let flattened = transposed.flat();
    console.log("flattened.length", flattened.length);
    let outputPixels = "0x";

    let index = 0;
    for (let i = 0; i < flattened.length; i += 2) {
      let d = `${((flattened[i] << 4) | flattened[i + 1])
        .toString(16)
        .padStart(2, "0")}`;
      console.log("string", d);
      outputPixels += d;
      index++;
    }

    console.log("outputPixels", outputPixels);

    // console.log("we have le pixels", outputPixels);

    const tileContract = ExquisiteLand__factory.connect(
      process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
      provider.getSigner()
    );

    console.log(useStore.getState().activeCanvas, x, y, pixels);

    const tx = await tileContract.createTile(x, y, outputPixels);

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
