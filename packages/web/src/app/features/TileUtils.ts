import { Pixels } from '@app/hooks/use-editor';
import PALETTES from '@constants/Palettes';

export const generateTokenID = (x: number, y: number): number => (x << 8) | y;
export const getCoordinates = (tokenId: number): [number, number] => [
  (tokenId & 0x0000ff00) >> 8,
  tokenId & 0x000000ff
];

const SVG_OPENER =
  '<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 32 32">';
const SVG_CLOSER = '</svg>';

export const getSVGFromPixels = (pixels: Pixels) => {
  var output = SVG_OPENER;
  for (var y = 0; y < pixels.length; y++) {
    for (var x = 0; x < pixels[y].length; x++) {
      output += `<rect fill="${
        PALETTES[0][pixels[x][y]]
      }" x="${x}" y="${y}" width="1.5" height="1.5" />`;
    }
  }

  output += SVG_CLOSER;
  return output;
};
