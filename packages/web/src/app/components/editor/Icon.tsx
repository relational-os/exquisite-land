import { forwardRef } from 'react';
import Bucket from '@static/px-icon-bucket.svg';
import Brush from '@static/px-icon-pencil.svg';
import Eyedropper from '@static/px-icon-eyedropper.svg';
import Undo from '@static/px-icon-undo.svg';

interface IconProps {
  name: IconName;
  className?: string;
}

export type IconName = 'undo' | 'eyedropper' | 'bucket' | 'brush';

const Icon = forwardRef(function Icon(
  props: React.ComponentPropsWithoutRef<'svg'> & IconProps,
  ref: React.Ref<HTMLOrSVGElement>
) {
  const Component = iconSwitch(props.name);
  return <Component ref={ref} {...props} />;
});

export default Icon;

const iconSwitch = (name: IconName) => {
  switch (name.toLowerCase()) {
    case 'eyedropper':
      return Eyedropper;
    case 'undo':
      return Undo;
    case 'bucket':
      return Bucket;
    case 'brush':
      return Brush;
    default:
      throw new Error(`Invalid icon name: ${name}`);
  }
};
