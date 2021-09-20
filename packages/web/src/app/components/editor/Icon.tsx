import { forwardRef } from "react";
import PaintBucket from "@static/px-icon-bucket.svg";
import Pencil from "@static/px-icon-pencil.svg";
import Eyedropper from "@static/px-icon-eyedropper.svg";
import Undo from "@app/graphics/px-icon-undo.svg";
import Eraser from "@app/graphics/icon-eraser.svg";
import Swatch1 from "@app/graphics/palette-blob-1.svg";
import Swatch2 from "@app/graphics/palette-blob-2.svg";
import Swatch3 from "@app/graphics/palette-blob-3.svg";
import Swatch4 from "@app/graphics/palette-blob-4.svg";
import Swatch5 from "@app/graphics/palette-blob-5.svg";

interface IconProps {
  name: IconName;
  className?: string;
}

export type IconName =
  | "undo"
  | "eyedropper"
  | "eraser"
  | "paint-bucket"
  | "pencil"
  | "swatch-1"
  | "swatch-2"
  | "swatch-3"
  | "swatch-4"
  | "swatch-5";

const Icon = forwardRef(function Icon(
  props: React.ComponentPropsWithoutRef<"svg"> & IconProps,
  ref: React.Ref<HTMLOrSVGElement>
) {
  const Component = iconSwitch(props.name);
  return <Component ref={ref} {...props} />;
});

export default Icon;

const iconSwitch = (name: IconName) => {
  switch (name.toLowerCase()) {
    case "eyedropper":
      return Eyedropper;
    case "undo":
      return Undo;
    case "eraser":
      return Eraser;
    case "paint-bucket":
      return PaintBucket;
    case "pencil":
      return Pencil;
    case "swatch-1":
      return Swatch1;
    case "swatch-2":
      return Swatch2;
    case "swatch-3":
      return Swatch3;
    case "swatch-4":
      return Swatch4;
    case "swatch-5":
      return Swatch5;
    default:
      throw new Error(`Invalid icon name: ${name}`);
  }
};
