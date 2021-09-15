import { forwardRef, useState } from "react";
import Icon, { IconName } from "@app/components/Icon";

const Swatch = forwardRef(function Swatch(
  props: React.ComponentPropsWithoutRef<"svg">,
  ref: React.Ref<HTMLOrSVGElement>
) {
  // hold random id in state so it doesn't change on re-render
  const [id] = useState(randomIntFromInterval(1, 5));
  const name = `swatch-${id}` as IconName;

  return <Icon ref={ref} {...props} name={name} />;
});

// min and max included
function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default Swatch;
