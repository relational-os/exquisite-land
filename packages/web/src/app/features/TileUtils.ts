export const generateTokenID = (
  canvasId: number,
  x: number,
  y: number
): number => (canvasId << 16) | (x << 8) | y;
