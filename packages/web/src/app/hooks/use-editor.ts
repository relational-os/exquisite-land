import { createTile, getSignatureForTypedData } from '@app/features/Forwarder';
import getJsonRpcProvider from '@app/features/getJsonRpcProvider';
import useStore, { Tool } from '@app/features/State';
import { useWallet } from '@gimmixorg/use-wallet';
import PALETTES from 'src/constants/Palettes';

interface SetTileProps {
  pixels: number[][];
  x: number;
  y: number;
}

const CHAIN_ID = 80001;

function transpose(matrix: any) {
  return matrix.reduce(
    (prev: any, next: any) =>
      next.map((item: any, i: number) => (prev[i] || []).concat(next[i])),
    []
  );
}

const useEditor = () => {
  const activeBrushSize = useStore(state => state.activeBrushSize);
  const activeColor = useStore(state => state.activeColor);
  const activeTool = useStore(state => state.activeTool);
  const prevTool = useStore(state => state.prevTool);

  const { account, provider } = useWallet();

  const palette = PALETTES[0];

  const setActiveTool = (tool: Tool) => {
    useStore.setState({ activeTool: tool, prevTool: activeTool });
  };

  const setActiveColor = (hex: string) => {
    useStore.setState({ activeColor: palette.indexOf(hex) });
  };

  const setActiveBrushSize = (size: number) => {
    if (size < 1) size = 1;
    else if (size > 8) size = 8;
    useStore.setState({ activeBrushSize: size });
  };

  const getActiveCursor = () => {
    const activeTool = useStore.getState().activeTool;

    switch (activeTool) {
      case Tool.BRUSH:
        return 'url(/static/px-icon-pencil.svg) 0 11, pointer';
      case Tool.BUCKET:
        return 'url(/static/px-icon-bucket.svg) 0 11, pointer';
      case Tool.EYEDROPPER:
        return 'url(/static/px-icon-eyedropper.svg) 4 11, pointer';
    }
  };

  const setTile = async ({ x, y, pixels }: SetTileProps) => {
    if (!provider || !account) return alert('Not signed in.');

    let transposed = transpose(pixels);
    let flattened = transposed.flat();
    let outputPixels = '0x';

    // @ts-ignore
    let index = 0;
    for (let i = 0; i < flattened.length; i += 2) {
      let d = `${((flattened[i] << 4) | flattened[i + 1])
        .toString(16)
        .padStart(2, '0')}`;
      outputPixels += d;
      index++;
    }

    // const tileContract = ExquisiteLand__factory.connect(
    //   process.env.NEXT_PUBLIC_TILE_CONTRACT_ADDRESS as string,
    //   provider.getSigner()
    // );

    console.log(x, y, pixels);

    const dataToSign = await createTile(
      x,
      y,
      outputPixels,
      account,
      CHAIN_ID,
      getJsonRpcProvider()
    );
    const signature = await getSignatureForTypedData(provider, dataToSign);

    const response = await fetch('/api/forwarder/forward', {
      method: 'POST',
      body: JSON.stringify({ data: dataToSign, signature }),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json());

    console.log({ response });

    // const tx = await tileContract.createTile(x, y, outputPixels);

    // const receipt = await tx.wait(2);

    // console.log(receipt);

    // console.log(`tile(${x}, ${y}) saved!`);
  };

  return {
    palette,
    prevTool,
    activeTool,
    activeColor,
    activeBrushSize,
    setActiveBrushSize,
    setActiveColor,
    setActiveTool,
    setTile,
    getActiveCursor
  };
};

export default useEditor;
