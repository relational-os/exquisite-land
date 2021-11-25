import { Pixels } from '@app/hooks/use-editor';
import PALETTES from '@constants/Palettes';

type Props = {
  pixels: Pixels;
};

// TODO: get dynamically from somewhere else?
const palette = PALETTES[0];

export const ProgressTile = ({ pixels }: Props) => {
  const width = pixels.length;
  const height = pixels[0].length;

  return (
    <svg viewBox={`0 0 ${width} ${height}`}>
      {pixels.map((column, x) =>
        column.map((color, y) => (
          <rect
            key={`${x},${y}`}
            x={x}
            y={y}
            width="1"
            height="1"
            fill={palette[color]}
          />
        ))
      )}
    </svg>
  );
};
