import {
  createTile,
  getSignatureForTypedData,
  submitTx,
  TypedData
} from '@app/features/Forwarder';
import { getJsonRpcProvider } from '@app/features/getJsonRpcProvider';
import useStore, { Tool } from '@app/features/State';
import { getEthPixelData } from '@app/features/TileUtils';
import useTransactionsStore from '@app/features/useTransactionsStore';
import { useWallet } from '@gimmixorg/use-wallet';
import PALETTES from 'src/constants/Palettes';

export type Pixels = readonly (readonly number[])[];

interface SetTileProps {
  pixels: Pixels;
  x: number;
  y: number;
}

const useEditor = () => {
  const activeBrushSize = useStore((state) => state.activeBrushSize);
  const activeColor = useStore((state) => state.activeColor);
  const activeTool = useStore((state) => state.activeTool);
  const prevTool = useStore((state) => state.prevTool);

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

  const signToSubmitTile = async ({ x, y, pixels }: SetTileProps) => {
    if (!provider || !account) throw 'Not signed in.';
    const outputPixels = getEthPixelData(pixels);
    const dataToSign = await createTile(
      x,
      y,
      outputPixels,
      account,
      getJsonRpcProvider
    );
    const signature = await getSignatureForTypedData(provider, dataToSign);
    return { dataToSign, signature };
  };

  const submitTile = async ({
    x,
    y,
    pixels,
    dataToSign,
    signature
  }: {
    x: number;
    y: number;
    pixels: Pixels;
    dataToSign: TypedData;
    signature: string;
  }) => {
    const tx = await submitTx(dataToSign, signature);
    useTransactionsStore.getState().addTransaction({
      title: `Submitting tile at ${x}, ${y}`,
      hash: tx.hash,
      status: 'pending',
      date: new Date(),
      type: 'create-tile',
      x,
      y,
      pixels
    });
    return tx;
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
    signToSubmitTile,
    submitTile,
    getActiveCursor
  };
};

export default useEditor;
