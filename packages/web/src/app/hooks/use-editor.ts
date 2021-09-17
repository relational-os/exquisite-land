import useStore, { Tool } from "@app/features/State";
import { useWallet } from "@gimmixorg/use-wallet";
import PALETTES from "src/constants/Palettes";
import { ExquisiteLand__factory } from "src/sdk/factories/ExquisiteLand__factory";

interface SetTileProps {
  pixels: number[][];
  x: number;
  y: number;
}

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
  const activeTool = useStore((state) => state.activeTool);

  const { provider } = useWallet();

  const palette = PALETTES[activeCanvas];

  const setActiveTool = (tool: Tool) => {
    useStore.setState({ activeTool: tool });
  };

  const setActiveColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const getActiveCursor = () => {
    const activeTool = useStore.getState().activeTool;

    switch (activeTool) {
      case Tool.BRUSH:
        return "url(/static/px-icon-pencil.svg) 0 11, pointer";
      case Tool.BUCKET:
        return "url(/static/px-icon-bucket.svg) 0 11, pointer";
      case Tool.EYEDROPPER:
        return "url(/static/px-icon-eyedropper.svg) 4 11, pointer";
    }
  };

  const setTile = async ({ x, y, pixels }: SetTileProps) => {
    if (!provider) return alert("Not signed in.");

    let transposed = transpose(pixels);
    let flattened = transposed.flat();
    let outputPixels = "0x";

    // @ts-ignore
    let index = 0;
    for (let i = 0; i < flattened.length; i += 2) {
      let d = `${((flattened[i] << 4) | flattened[i + 1])
        .toString(16)
        .padStart(2, "0")}`;
      outputPixels += d;
      index++;
    }

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
    activeTool,
    setActiveTool,
    getActiveCursor,
  };
};

export default useEditor;
