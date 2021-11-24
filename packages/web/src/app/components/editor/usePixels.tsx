import { useState } from 'react';
import { gzipSync, gunzipSync } from 'zlib';
import { Pixels } from '@app/hooks/use-editor';
import { useDebouncedCallback } from 'use-debounce';
import { useLocalStorage } from 'react-use';
import { EXQUISITE_LAND_CONTRACT_ADDRESS } from '../../features/AddressBook';

const tileSize = 32;
const tileColumns = Array.from(Array(tileSize).keys());
const tileRows = Array.from(Array(tileSize).keys());
const emptyTile: Pixels = tileColumns.map(() => tileRows.map(() => 13));

const serializer = <T,>(value: T): string =>
  gzipSync(JSON.stringify(value)).toString('base64');
const deserializer = <T,>(value: string): T =>
  JSON.parse(gunzipSync(Buffer.from(value, 'base64')).toString());

export const usePixels = (x: number, y: number) => {
  const [pixelsHistory, setPixelsHistory] = useLocalStorage<Pixels[]>(
    `pixels:v1:${EXQUISITE_LAND_CONTRACT_ADDRESS}:${x},${y}`,
    [emptyTile],
    { raw: false, serializer, deserializer }
  );

  const [pixels, setPixelsState] = useState<Pixels>(
    pixelsHistory?.[0] || emptyTile
  );

  const addPixelsToHistory = useDebouncedCallback((newPixels: Pixels) => {
    setPixelsHistory([newPixels, ...(pixelsHistory || [emptyTile])]);
  }, 500);

  const setPixels = (newPixels: Pixels) => {
    setPixelsState(newPixels);
    addPixelsToHistory(newPixels);
  };

  const undo = () => {
    const [_pixels, ...prevPixelsHistory] = pixelsHistory || [emptyTile];
    setPixelsHistory(prevPixelsHistory);
    setPixelsState(prevPixelsHistory[0] || emptyTile);
  };

  const canUndo = pixelsHistory && pixelsHistory.length > 0;

  return { pixels, setPixels, undo, canUndo };
};
