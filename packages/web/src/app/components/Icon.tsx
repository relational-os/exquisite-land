import Check from '@app/icons/Check';
import Eraser from '@app/icons/Eraser';
import PaintBrush from '@app/icons/PaintBrush';
import Palette from '@app/icons/Palette';
import Pencil from '@app/icons/Pencil';
import Times from '@app/icons/Times';

interface IconProps {
  name: IconName;
  className?: string;
}

type IconName =
  | 'check'
  | 'eraser'
  | 'paint-brush'
  | 'palette'
  | 'pencil'
  | 'times';

const Icon = (props: IconProps) => {
  return <IconSwitch name={props.name} />;
};

export default Icon;

const IconSwitch = ({ name }: { name: IconName }) => {
  switch (name.toLowerCase()) {
    case 'check':
      return <Check />;
    case 'eraser':
      return <Eraser />;
    case 'paint-brush':
      return <PaintBrush />;
    case 'palette':
      return <Palette />;
    case 'pencil':
      return <Pencil />;
    case 'times':
      return <Times />;
    default:
      throw new Error(`Invalid icon name: ${name}`);
  }
};
