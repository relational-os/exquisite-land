export const generateTokenID = (x: number, y: number): number => (x << 8) | y;
export const getCoordinates = (tokenId: number): [number, number] => [
  (tokenId & 0x0000ff00) >> 8,
  tokenId & 0x000000ff
];
